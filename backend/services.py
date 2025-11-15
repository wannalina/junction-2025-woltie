import os
import json
import base64
import requests
from typing import List, Optional
from google.cloud import vision
from google.oauth2 import service_account
import google.generativeai as genai
from dotenv import load_dotenv
from models import RestaurantRecommendation, SimilarDish

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
        # Note: google-generativeai requires GEMINI_API_KEY, not service account credentials
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            # Use gemini-2.5-flash-lite for faster image analysis (supports multimodal input)
            try:
                self.gemini_model = genai.GenerativeModel('gemini-2.5-flash-lite')
                print(f"✅ Successfully initialized Gemini model: gemini-2.5-flash-lite")
            except Exception as e:
                # Fallback to other models if 2.5-flash-lite is not available
                print(f"⚠️  Failed to initialize gemini-2.5-flash-lite: {str(e)}")
                print("⚠️  Trying fallback models...")
                model_names = ['gemini-2.5-pro', 'gemini-1.5-pro', 'gemini-pro-vision', 'gemini-pro']
                self.gemini_model = None
                for model_name in model_names:
                    try:
                        self.gemini_model = genai.GenerativeModel(model_name)
                        print(f"✅ Successfully initialized Gemini model: {model_name}")
                        break
                    except Exception as fallback_error:
                        print(f"⚠️  Failed to initialize {model_name}: {str(fallback_error)}")
                        continue
        else:
            # Gemini API requires API key, not service account credentials
            print("Warning: GEMINI_API_KEY not found in environment variables.")
            print("Please set GEMINI_API_KEY in your .env file or environment.")
            print("You can get an API key from: https://makersuite.google.com/app/apikey")
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
                "establishments": [
                    {{
                        "name": "Actual Restaurant / Cafe Name",
                        "address": "Street Address, {location if location else 'City'}, Country",
                        "description": "Why this establishments is good for {dish_name}",
                        "distance": "e.g., 'In city center' or '2.5 km from city center'"
                    }}
                ]
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


class DishAnalysisService(InitializeGoogleCloudServices):
    """Service for analyzing dishes from photos and descriptions (Wolty AI Assistant - Feature 1)"""
    
    def __init__(self):
        # call parent class to init google cloud services
        super().__init__()
    
    async def _analyze_image_with_vision(self, image_url: Optional[str] = None, image_base64: Optional[str] = None) -> str:
        """Analyze image using Google Cloud Vision API and return description"""
        if not self.vision_client:
            return ""
        
        try:
            image = None
            if image_url:
                # download image from URL
                response = requests.get(image_url, timeout=10)
                if response.status_code == 200:
                    image = vision.Image(content=response.content)
            elif image_base64:
                # decode base64 image
                image_data = base64.b64decode(image_base64)
                image = vision.Image(content=image_data)
            
            if not image:
                return ""
            
            # perform label detection
            label_response = self.vision_client.label_detection(image=image)
            labels = [label.description for label in label_response.label_annotations[:10]]
            
            # perform text detection
            text_response = self.vision_client.text_detection(image=image)
            texts = [text.description for text in text_response.text_annotations[:5]] if text_response.text_annotations else []
            
            vision_description = f"Detected labels: {', '.join(labels)}"
            if texts:
                vision_description += f". Text found: {' '.join(texts[:3])}"
            
            return vision_description
        except Exception as e:
            print(f"Error analyzing image with Vision API: {e}")
            return ""
    
    async def analyze_dish(
        self,
        title: str = "",
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
        description: str = "",
        user_preferences: Optional[List[str]] = None,
        known_dishes: Optional[List[str]] = None
    ):
        """Analyze dish from image and description using Gemini
        
        Args:
            title: Dish title/name (required)
            image_url: URL of the dish image (required if image_base64 not provided)
            image_base64: Base64 encoded image (required if image_url not provided)
            description: Text description of the dish (required)
            user_preferences: List of user preferences/allergies
            known_dishes: List of dishes user is familiar with
        """
        if not self.gemini_model:
            raise Exception("Gemini model not initialized. Please set GEMINI_API_KEY or configure Google Cloud credentials.")
        
        if not title or not title.strip():
            raise Exception("Title is required for dish analysis")
        
        if not description or not description.strip():
            raise Exception("Description is required for dish analysis")
        
        if not image_url and not image_base64:
            raise Exception("Either image_url or image_base64 must be provided")
        
        # analyze image with Vision API
        vision_analysis = ""
        if image_url or image_base64:
            vision_analysis = await self._analyze_image_with_vision(image_url, image_base64)
        
        # prepare image for Gemini
        image_parts = []
        if image_url:
            try:
                response = requests.get(image_url, timeout=10)
                # check HTTP status code
                if response.status_code != 200:
                    raise Exception(
                        f"Failed to fetch image from URL: HTTP {response.status_code} - {response.reason}. "
                        f"URL: {image_url}"
                    )
                
                # try to open and validate the image
                import PIL.Image
                import io
                try:
                    img = PIL.Image.open(io.BytesIO(response.content))
                    image_parts.append(img)
                except Exception as img_error:
                    raise Exception(
                        f"Failed to parse image from URL. The URL returned data but it's not a valid image format. "
                        f"Error: {str(img_error)}. URL: {image_url}"
                    )
            except requests.exceptions.RequestException as e:
                raise Exception(f"Failed to load image from URL: {str(e)}. URL: {image_url}")
            except Exception as e:
                # re-raise if it's already our formatted exception
                if "Failed to fetch image from URL" in str(e) or "Failed to parse image from URL" in str(e):
                    raise
                raise Exception(f"Failed to load image from URL: {str(e)}. URL: {image_url}")
        elif image_base64:
            try:
                import PIL.Image
                import io
                # decode base64
                try:
                    image_data = base64.b64decode(image_base64)
                except Exception as decode_error:
                    raise Exception(
                        f"Failed to decode base64 image: Invalid base64 format. Error: {str(decode_error)}"
                    )
                
                # try to open and validate the image
                try:
                    img = PIL.Image.open(io.BytesIO(image_data))
                    image_parts.append(img)
                except Exception as img_error:
                    raise Exception(
                        f"Failed to parse base64 image: The data is not a valid image format. "
                        f"Error: {str(img_error)}"
                    )
            except Exception as e:
                # re-raise if it's already our formatted exception
                if "Failed to decode base64 image" in str(e) or "Failed to parse base64 image" in str(e):
                    raise
                raise Exception(f"Failed to process base64 image: {str(e)}")
        
        if not image_parts:
            raise Exception("Failed to load image for analysis: No image was successfully loaded")
        
        # build prompt
        preferences_text = ""
        if user_preferences:
            preferences_text = f"\nUser preferences/allergies: {', '.join(user_preferences)}"
        
        known_dishes_text = ""
        if known_dishes:
            known_dishes_text = f"\nDishes user is familiar with: {', '.join(known_dishes)}"
        
        title_text = title.strip()
        description_text = description.strip()
        vision_text = f"\nVision API analysis: {vision_analysis}" if vision_analysis else ""
        
        prompt = f"""You are Wolty, an AI food assistant. Analyze the provided food image and description to provide comprehensive information about the dish.

Dish Title: {title_text}
Description: {description_text}{vision_text}{preferences_text}{known_dishes_text}

Provide a detailed analysis in the following JSON format:
{{
    "dish_name": "exact name of the dish",
    "dish_description": "detailed description of what the dish is",
    "taste_profile": "description of taste, texture, and flavor profile (e.g., 'sweet and savory with a creamy texture')",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "allergens": ["common allergens present", "e.g., gluten", "dairy"],
    "dietary_tags": ["vegan", "vegetarian", "gluten-free", etc.],
    "similar_dishes": [
        {{
            "dish_name": "name of similar dish",
            "similarity_score": 0.0-1.0,
            "similarity_reason": "why it's similar"
        }}
    ],
    "historical_background": "brief historical or cultural background of the dish",
    "fun_facts": ["interesting fact 1", "interesting fact 2"],
    "ingredient_origins": "brief description of where key ingredients come from",
    "warnings": ["any warnings based on user preferences/allergies"]
}}

Important:
- If user preferences are provided, check for conflicts and add warnings
- Compare with known_dishes to find similarities
- Provide at least 3 similar dishes if possible
- Be accurate and informative
- Only respond with valid JSON, no additional text.
"""
        
        try:
            # generate content with or without image
            if image_parts:
                response = self.gemini_model.generate_content([prompt] + image_parts)
            else:
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
            
            # convert similar_dishes to SimilarDish objects
            similar_dishes = []
            for sd in result.get("similar_dishes", []):
                similar_dishes.append(SimilarDish(
                    dish_name=sd.get("dish_name", ""),
                    similarity_score=float(sd.get("similarity_score", 0.0)),
                    similarity_reason=sd.get("similarity_reason", "")
                ))
            
            return {
                "dish_name": result.get("dish_name", "Unknown Dish"),
                "dish_description": result.get("dish_description", ""),
                "taste_profile": result.get("taste_profile", ""),
                "ingredients": result.get("ingredients", []),
                "allergens": result.get("allergens", []),
                "dietary_tags": result.get("dietary_tags", []),
                "similar_dishes": similar_dishes,
                "historical_background": result.get("historical_background"),
                "fun_facts": result.get("fun_facts", []),
                "ingredient_origins": result.get("ingredient_origins"),
                "warnings": result.get("warnings", [])
            }
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}, response: {response_text}")
            # return default response
            return {
                "dish_name": description or "Unknown Dish",
                "dish_description": "Unable to analyze dish details",
                "taste_profile": "Unknown",
                "ingredients": [],
                "allergens": [],
                "dietary_tags": [],
                "similar_dishes": [],
                "historical_background": None,
                "fun_facts": [],
                "ingredient_origins": None,
                "warnings": []
            }
        except Exception as e:
            print(f"Error analyzing dish: {e}")
            raise Exception(f"Failed to analyze dish: {str(e)}")
