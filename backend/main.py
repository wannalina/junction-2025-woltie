from fastapi import FastAPI, HTTPException
import uvicorn
import time
import os
from models import DishSuggestionRequest, DishSuggestionResponse, DishAnalysisRequest, DishAnalysisResponse
from services import DishSuggestionService, DishAnalysisService
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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


@app.get("/api/analyze-dish", response_model=DishAnalysisResponse)
async def analyze_dish():
    """
    Wolty AI Assistant - Feature 1 (Demo Mode)
    Analyzes photos and descriptions provided by restaurants and outputs comprehensive information about the dish.
    
    Note: This is a demo endpoint with fixed test data. No parameters required.
    """
    start_time = time.time()
    
    try:
        # Fixed demo test data
        DEMO_TITLE = "Zhong Quan -kanaa"
        DEMO_DESCRIPTION = "kana, suola, sokeri, sambal chili, soja kastike, inkivaari, Perunajauhe. Chicken, Salt, Sugar, Sambal Chili, soya sauce, Ginger, Potato flour"
        
        # Try to get image URL from GCS or environment variable
        DEMO_IMAGE_URL = None
        
        # First, check if there's a fixed URL in environment variable
        demo_image_url_env = os.getenv("DEMO_IMAGE_URL")
        if demo_image_url_env:
            DEMO_IMAGE_URL = demo_image_url_env
            print(f"✅ Using demo image URL from environment variable")
        else:
            # Try to generate signed URL from GCS
            try:
                from pathlib import Path
                from google.cloud import storage
                from google.oauth2 import service_account
                from datetime import timedelta
                
                credentials_path = Path("credentials.json")
                if credentials_path.exists():
                    credentials = service_account.Credentials.from_service_account_file(
                        str(credentials_path)
                    )
                    client = storage.Client(credentials=credentials)
                    bucket = client.bucket("junction-2025-woltie")
                    blob = bucket.blob("Zhong Quan -kanaa.jpeg")
                    DEMO_IMAGE_URL = blob.generate_signed_url(
                        expiration=timedelta(hours=1),
                        method="GET"
                    )
                    print(f"✅ Generated signed URL for demo image")
            except Exception as e:
                print(f"⚠️  Could not generate signed URL: {str(e)}")
                DEMO_IMAGE_URL = None
        
        # If no image URL available, raise an error
        if not DEMO_IMAGE_URL:
            raise HTTPException(
                status_code=500,
                detail="Demo image URL not available. Please either:\n"
                       "1. Set DEMO_IMAGE_URL in .env file, or\n"
                       "2. Ensure credentials.json is configured for GCS access."
            )
        
        # analyze the dish with fixed demo data
        analysis_result = await dish_analysis_service.analyze_dish(
            title=DEMO_TITLE,
            image_url=DEMO_IMAGE_URL,
            image_base64=None,
            description=DEMO_DESCRIPTION,
            user_preferences=None,
            known_dishes=None
        )
        
        # calculate processing time
        processing_time = time.time() - start_time
        analysis_result["processing_time_seconds"] = round(processing_time, 2)
        
        print(f"⏱️  Demo request processed in {processing_time:.2f} seconds")
        
        # return response
        return DishAnalysisResponse(**analysis_result)
        
    except HTTPException:
        raise
    except Exception as e:
        processing_time = time.time() - start_time
        print(f"❌ Demo request failed after {processing_time:.2f} seconds: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing dish: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)