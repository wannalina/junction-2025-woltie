from fastapi import FastAPI, HTTPException
import uvicorn
import time
from models import DishSuggestionRequest, DishSuggestionResponse, DishAnalysisRequest, DishAnalysisResponse
from services import DishSuggestionService, DishAnalysisService

# run FastAPI backend using command: fastapi dev main.py
app = FastAPI()

# initialize services
dish_service = DishSuggestionService()
dish_analysis_service = DishAnalysisService()


@app.get("/")
async def root():
    return {"message": "Woltie API", "status": "running"}

# endpoint for getting dish suggestion based on user description
@app.post("/api/suggest-dish", response_model=DishSuggestionResponse)
async def suggest_dish(request: DishSuggestionRequest):
    try:
        if not request.description or not request.description.strip():
            raise HTTPException(status_code=400, detail="Description is required")

        # identify the dish from description
        dish_info = await dish_service.identify_dish_from_description(
            request.description
        )

        # get restaurant recommendations with user's location
        restaurants = await dish_service.get_restaurant_recommendations(
            dish_info.get("dish_name", ""),
            request.location,
        )

        # return dish name, description, nearby restaurants, and confidence score
        return DishSuggestionResponse(
            dish_name=dish_info.get("dish_name", "Unknown Dish"),
            dish_description=dish_info.get("dish_description"),
            restaurants=restaurants,
            confidence=dish_info.get("confidence")
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing request: {str(e)}"
        )


@app.post("/api/analyze-dish", response_model=DishAnalysisResponse)
async def analyze_dish(request: DishAnalysisRequest):
    """
    Wolty AI Assistant - Feature 1
    Analyzes photos and descriptions provided by restaurants and outputs comprehensive information about the dish.
    
    Required fields:
    - title: Dish title/name (required)
    - description: Text description of the dish (required)
    - image_url OR image_base64: Image of the dish (required, one of them)
    """
    start_time = time.time()
    
    try:
        # validate that title is provided
        if not request.title or not request.title.strip():
            raise HTTPException(
                status_code=400, 
                detail="Title is required"
            )
        
        # validate that description is provided
        if not request.description or not request.description.strip():
            raise HTTPException(
                status_code=400, 
                detail="Description is required"
            )
        
        # validate that exactly one image format is provided
        if request.image_url and request.image_base64:
            raise HTTPException(
                status_code=400, 
                detail="Please provide either image_url or image_base64, not both"
            )
        
        if not request.image_url and not request.image_base64:
            raise HTTPException(
                status_code=400, 
                detail="Either image_url or image_base64 must be provided"
            )
        
        # analyze the dish
        analysis_result = await dish_analysis_service.analyze_dish(
            title=request.title,
            image_url=request.image_url,
            image_base64=request.image_base64,
            description=request.description,
            user_preferences=request.user_preferences,
            known_dishes=request.known_dishes
        )
        
        # calculate processing time
        processing_time = time.time() - start_time
        analysis_result["processing_time_seconds"] = round(processing_time, 2)
        
        print(f"⏱️  Request processed in {processing_time:.2f} seconds")
        
        # return response
        return DishAnalysisResponse(**analysis_result)
        
    except HTTPException:
        raise
    except Exception as e:
        processing_time = time.time() - start_time
        print(f"❌ Request failed after {processing_time:.2f} seconds: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing dish: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)