import os
import json
from typing import List, Optional
from google.cloud import vision
from google.oauth2 import service_account
import google.generativeai as genai
from dotenv import load_dotenv
from models import RestaurantRecommendation

# Load environment variables
load_dotenv()


class DishSuggestionService:
    def __init__(self):
        # get credentials path from environment or use default
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
                
        # initialize credentials if file exists
        credentials = None
        if credentials_path and os.path.exists(credentials_path):
            try:
                credentials = service_account.Credentials.from_service_account_file(
                    credentials_path
                )
                # set as default for all Google Cloud clients
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
            except Exception as e:
                print(f"Warning: Failed to load credentials from {credentials_path}: {e}")
        
        # initialize Vision API client
        try:
            if credentials:
                self.vision_client = vision.ImageAnnotatorClient(credentials=credentials)
            else:
                self.vision_client = vision.ImageAnnotatorClient()
        except Exception as e:
            print(f"Warning: Vision API client initialization failed: {e}")
            self.vision_client = None
        
        # initialize Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        elif credentials:
            # use service account credentials for Gemini
            try:
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                print(f"Warning: Gemini initialization with credentials failed: {e}")
                self.gemini_model = None
        else:
            # try default credentials (for Cloud Run)
            try:
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                print(f"Warning: Gemini initialization failed: {e}")
                self.gemini_model = None
    
    # use Gemini Flash to identify dish name from description
    async def identify_dish_from_description(self, description: str):
        if not self.gemini_model:
            raise Exception("Gemini model not initialized. Please set GEMINI_API_KEY or configure Google Cloud credentials.")
        
        prompt = f"""
            Based on this food description, identify the most likely dish name and provide a brief description.

            User description: "{description}"

            Respond in the following JSON format:
            {{
                "dish_name": "exact dish name",
                "dish_description": "brief description of the dish",
                "confidence": 0.0-1.0
            }}

            Examples:
            - "cheesy baked eggplant dish" → {{"dish_name": "Melanzane alla Parmigiana", "dish_description": "Italian baked eggplant dish with tomato sauce and cheese", "confidence": 0.95}}
            - "spicy noodle soup with beef" → {{"dish_name": "Pho", "dish_description": "Vietnamese noodle soup with beef and herbs", "confidence": 0.9}}

            Only respond with valid JSON, no additional text.
        """

        response_text = ""
        try:
            response = self.gemini_model.generate_content(prompt)

            # parse response
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            result = json.loads(response_text)
            return result
        except json.JSONDecodeError as e:
            # extract dish name
            print(f"JSON parsing error: {e}, response: {response_text}")
            return {
                "dish_name": description.title(),
                "dish_description": f"A dish matching: {description}",
                "confidence": 0.5
            }
        except Exception as e:
            print(f"Error identifying dish: {e}")
            return {
                "dish_name": description.title(),
                "dish_description": f"A dish matching: {description}",
                "confidence": 0.5
            }
    
    # generate restaurant recommendations (Gemini Flash)
    async def get_restaurant_recommendations(
        self, 
        dish_name: str, 
        location: Optional[str] = None
    ):
        if not self.gemini_model:
            raise Exception("Gemini model not initialized. Please set GEMINI_API_KEY or configure Google Cloud credentials.")
        
        location_context = f" near {location}" if location else " nearby"
        
        prompt = f"""
            Based on the dish "{dish_name}", suggest 3-5 restaurants where this dish can be found{location_context}.

            Respond in the following JSON format:
            {{
                "restaurants": [
                    {{
                        "name": "Restaurant Name",
                        "address": "Street Address, City",
                        "description": "Why this restaurant is good for this dish",
                        "distance": "e.g., '2.5 km away' or '15 min walk'"
                    }}
                ]
            }}

            Only respond with valid JSON, no additional text.'
        """

        response_text = ""
        try:
            response = self.gemini_model.generate_content(prompt)
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            result = json.loads(response_text)
            restaurants = result.get("restaurants", [])
            
            return [
                RestaurantRecommendation(**rest) for rest in restaurants
            ]
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}, response: {response_text}")
            
            return [
                RestaurantRecommendation(
                    name=f"Local Restaurant {i+1}",
                    address="Address not available",
                    description=f"May serve {dish_name}",
                    distance="Unknown"
                )
                for i in range(3)
            ]
        except Exception as e:
            print(f"Error getting restaurant recommendations: {e}")
            
            return [
                RestaurantRecommendation(
                    name=f"Local Restaurant {i+1}",
                    address="Address not available",
                    description=f"May serve {dish_name}",
                    distance="Unknown"
                )
                for i in range(3)
            ]
