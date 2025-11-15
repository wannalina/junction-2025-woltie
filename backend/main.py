from fastapi import FastAPI, HTTPException
import uvicorn
from models import DishSuggestionRequest, DishSuggestionResponse
from services import DishSuggestionService

# run FastAPI backend using command: fastapi dev main.py
app = FastAPI()

# initialize dish suggestion service
dish_service = DishSuggestionService()


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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)