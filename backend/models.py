from pydantic import BaseModel
from typing import List, Optional


class DishSuggestionRequest(BaseModel):
    description: str
    user_id: Optional[str] = None
    location: Optional[str] = None 


class RestaurantRecommendation(BaseModel):
    name: str
    address: Optional[str] = None
    description: Optional[str] = None
    distance: Optional[str] = None


class DishSuggestionResponse(BaseModel):
    dish_name: str
    dish_description: Optional[str] = None
    restaurants: List[RestaurantRecommendation]
    confidence: Optional[float] = None


# Models for Wolty AI Assistant (Feature 1)
class DishAnalysisRequest(BaseModel):
    # Required fields
    title: str  # Dish title/name
    description: str  # Dish description
    # Image: either image_url or image_base64 must be provided
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    # Optional fields
    user_preferences: Optional[List[str]] = None  # e.g., ["vegan", "no-spicy", "gluten-free"]
    known_dishes: Optional[List[str]] = None  # dishes the user knows/familiar with


class SimilarDish(BaseModel):
    dish_name: str
    similarity_score: float
    similarity_reason: str


class DishAnalysisResponse(BaseModel):
    dish_name: str
    dish_description: str
    taste_profile: str
    ingredients: List[str]
    allergens: List[str]
    dietary_tags: List[str]  # e.g., ["vegan", "gluten-free", "vegetarian"]
    similar_dishes: List[SimilarDish]
    historical_background: Optional[str] = None
    fun_facts: Optional[List[str]] = None
    ingredient_origins: Optional[str] = None
    warnings: Optional[List[str]] = None  # warnings based on user preferences
    processing_time_seconds: Optional[float] = None  # time taken to process the request