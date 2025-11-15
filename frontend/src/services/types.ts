/**
 * API Types - 匹配后端 models.py 的数据结构
 */

// ============= Dish Suggestion API =============

export interface DishSuggestionRequest {
  description: string;
  user_id?: string;
  location?: string;
}

export interface RestaurantRecommendation {
  name: string;
  address?: string;
  description?: string;
  distance?: string;
}

export interface DishSuggestionResponse {
  dish_name: string;
  dish_description?: string;
  restaurants: RestaurantRecommendation[];
  confidence?: number;
}

// ============= Dish Analysis API =============

export interface DishAnalysisRequest {
  // Required fields
  title: string;
  description: string;
  // Image: either image_url or image_base64 must be provided
  image_url?: string;
  image_base64?: string;
  // Optional fields
  user_preferences?: string[];  // e.g., ["vegan", "no-spicy", "gluten-free"]
  known_dishes?: string[];  // dishes the user knows/familiar with
}

export interface SimilarDish {
  dish_name: string;
  similarity_score: number;
  similarity_reason: string;
}

export interface DishAnalysisResponse {
  dish_name: string;
  dish_description: string;
  taste_profile: string;
  ingredients: string[];
  allergens: string[];
  dietary_tags: string[];  // e.g., ["vegan", "gluten-free", "vegetarian"]
  similar_dishes: SimilarDish[];
  historical_background?: string;
  fun_facts?: string[];
  ingredient_origins?: string;
  warnings?: string[];  // warnings based on user preferences
  processing_time_seconds?: number;  // time taken to process the request
}

// ============= API Error Response =============

export interface ApiErrorResponse {
  detail: string;
}

