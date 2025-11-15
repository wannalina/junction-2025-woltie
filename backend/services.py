import os
import json
from typing import Optional
from google.cloud import vision
from google.oauth2 import service_account
import google.generativeai as genai
from dotenv import load_dotenv
from models import RestaurantRecommendation

# Load environment variables
load_dotenv()


class InitializeGoogleCloudServices:
    def __init__(self):
        # get credentials path from env
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        # initialize credentials
        credentials = None
        if credentials_path and os.path.exists(credentials_path):
            try:
                credentials = service_account.Credentials.from_service_account_file(
                    credentials_path
                )
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
            self.gemini_model = genai.GenerativeModel('gemini-2.5-flash-lite')
        elif credentials:
            try:
                self.gemini_model = genai.GenerativeModel('gemini-2.5-flash-lite')
            except Exception as e:
                print(f"Warning: Gemini initialization with credentials failed: {e}")
                self.gemini_model = None
        else:
            try:
                self.gemini_model = genai.GenerativeModel('gemini-2.5-flash-lite')
            except Exception as e:
                print(f"Warning: Gemini initialization failed: {e}")
                self.gemini_model = None


# service to name dish and suggest nearby restaurants based on user description
class DishSuggestionService(InitializeGoogleCloudServices):    
    def __init__(self):
        # call parent class to init google cloud services
        super().__init__()    

    # use Gemini Flash to identify dish name from description
    async def identify_dish_from_description(self, description: str):
        if not self.gemini_model:
            raise Exception("Gemini model not initialized. Please set GEMINI_API_KEY or configure Google Cloud credentials.")
        
        prompt = f"""
            You are a food expert. Identify the exact dish name from the user's description.

            User description: "{description}"

            Your task: Find the actual, traditional name of this dish. Do NOT just capitalize the description - find the real dish name.

            Examples:
            - Input: "cheesy baked eggplant dish"
            Output: {{"dish_name": "Melanzane alla Parmigiana", "dish_description": "Italian baked eggplant dish with tomato sauce and cheese", "confidence": 0.95}}

            - Input: "spicy noodle soup with beef"
            Output: {{"dish_name": "Pho", "dish_description": "Vietnamese noodle soup with beef and herbs", "confidence": 0.9}}

            - Input: "fried rice with egg and vegetables"
            Output: {{"dish_name": "Yangzhou Fried Rice", "dish_description": "Chinese fried rice with eggs, vegetables, and sometimes meat", "confidence": 0.85}}

            IMPORTANT: Return ONLY valid JSON in this exact format (no markdown, no code blocks, no explanations):
            {{
                "dish_name": "actual dish name",
                "dish_description": "brief description",
                "confidence": 0.95
            }}
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
        location: Optional[str] = "Helsinki"
    ):
        if not self.gemini_model:
            raise Exception("Gemini model not initialized. Please set GEMINI_API_KEY or configure Google Cloud credentials.")
        
        prompt = f"""
            You are a restaurant recommendation expert. Find two REAL establishments (restaurants or cafes) in {location if location else "the local area"} where the dish "{dish_name}" can be found.

            IMPORTANT REQUIREMENTS:
            - Focus on establishments in the city: {location if location else "the local area"}
            - Provide ACTUAL establishments names that exist in this city
            - Include real street addresses in location: {location}
            - Explain, in one sentence, why each establishment is good for this specific dish
            - If you don't know specific establishments in this city, suggest well-known establishment types or chains that typically serve this dish in that city. 
            - Do NOT give any fake data.

            City: {location if location else "Not specified"}

            Respond in the following JSON format (no markdown, no code blocks):
            {{
                "establishments":
                    {{
                        "name": "Actual Restaurant / Cafe Name",
                        "address": "Street Address, {location if location else 'City'}, Country",
                        "description": "Why this establishments is good for {dish_name}",
                        "distance": "e.g., 'In city center' or '2.5 km from city center'"
                    }}
            }}

            Return ONLY valid JSON, no additional text.
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
            
            # extract JSON if extra text
            if "{" in response_text and "}" in response_text:
                start = response_text.find("{")
                end = response_text.rfind("}") + 1
                response_text = response_text[start:end]
            
            result = json.loads(response_text)
            restaurants = result.get("establishments", [])
            
            return [
                RestaurantRecommendation(**rest) for rest in restaurants
            ]
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}, response: {response_text}")
            
            return [
                RestaurantRecommendation(
                    name=f"Local Establishment {i+1}",
                    address="Address not available",
                    description=f"May serve {dish_name}",
                    distance="Unknown"
                )
                for i in range(3)
            ]
        except Exception as e:
            print(f"Error getting recommendations: {e}")
            
            return [
                RestaurantRecommendation(
                    name=f"Local Establishment {i+1}",
                    address="Address not available",
                    description=f"May serve {dish_name}",
                    distance="Unknown"
                )
                for i in range(3)
            ]
