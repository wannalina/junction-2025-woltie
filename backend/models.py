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

