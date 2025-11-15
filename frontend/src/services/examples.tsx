/**
 * API Service 使用示例
 * 这个文件展示了如何在 React 组件中使用 API Service
 */

import { useState } from 'react';
import { apiService, ApiError, DishSuggestionRequest, DishAnalysisRequest } from './index';

/**
 * 示例 1: 健康检查
 */
export function HealthCheckExample() {
  const [status, setStatus] = useState<string>('');

  const checkHealth = async () => {
    try {
      const result = await apiService.healthCheck();
      setStatus(`API Status: ${result.status}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setStatus(`Error: ${error.detail}`);
      }
    }
  };

  return (
    <div>
      <button onClick={checkHealth}>Check API Health</button>
      <p>{status}</p>
    </div>
  );
}

/**
 * 示例 2: 菜品建议
 */
export function DishSuggestionExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSuggest = async () => {
    const request: DishSuggestionRequest = {
      description: "I'm looking for an oval-shaped Finnish pastry with rice filling",
      location: "Helsinki",
    };

    setLoading(true);
    setError('');

    try {
      const response = await apiService.suggestDish(request);
      setResult(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail || err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSuggest} disabled={loading}>
        {loading ? 'Searching...' : 'Suggest Dish'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <div>
          <h3>{result.dish_name}</h3>
          <p>{result.dish_description}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(0)}%</p>
          
          <h4>Recommended Restaurants:</h4>
          <ul>
            {result.restaurants.map((restaurant: any, index: number) => (
              <li key={index}>
                <strong>{restaurant.name}</strong> - {restaurant.distance}
                <br />
                {restaurant.address}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * 示例 3: 菜品分析（使用图片 URL）
 */
export function DishAnalysisUrlExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    const request: DishAnalysisRequest = {
      title: "Karjalanpiirakka",
      description: "Traditional Finnish pastry with rice filling",
      image_url: "https://example.com/karjalanpiirakka.jpg",
      user_preferences: ["vegetarian"],
      known_dishes: ["Croissant", "Empanada"]
    };

    setLoading(true);
    try {
      const response = await apiService.analyzeDish(request);
      setResult(response);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Dish'}
      </button>

      {result && (
        <div>
          <h3>{result.dish_name}</h3>
          <p>{result.dish_description}</p>
          <p><strong>Taste Profile:</strong> {result.taste_profile}</p>
          
          <h4>Ingredients:</h4>
          <ul>
            {result.ingredients.map((ingredient: string, index: number) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h4>Allergens:</h4>
          <p>{result.allergens.join(', ') || 'None'}</p>

          <h4>Dietary Tags:</h4>
          <p>{result.dietary_tags.join(', ')}</p>

          {result.similar_dishes.length > 0 && (
            <>
              <h4>Similar Dishes:</h4>
              <ul>
                {result.similar_dishes.map((dish: any, index: number) => (
                  <li key={index}>
                    {dish.dish_name} ({(dish.similarity_score * 100).toFixed(0)}% similar)
                    <br />
                    <em>{dish.similarity_reason}</em>
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.processing_time_seconds && (
            <p><em>Processed in {result.processing_time_seconds}s</em></p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 示例 4: 菜品分析（使用图片文件上传）
 */
export function DishAnalysisFileUploadExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // 验证文件大小（例如：最大 5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 转换为 base64
      const base64Image = await apiService.imageToBase64(file);

      // 分析菜品
      const request: DishAnalysisRequest = {
        title: "Uploaded Dish",
        description: "Please analyze this dish",
        image_base64: base64Image,
        user_preferences: ["vegan", "gluten-free"]
      };

      const response = await apiService.analyzeDish(request);
      setResult(response);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail || err.message);
      } else {
        setError('Failed to analyze image');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Dish Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {loading && <p>Analyzing image...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <div>
          <h4>Analysis Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

/**
 * 示例 5: 自定义 Hook - 更加优雅的使用方式
 */
export function useDishAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const analyzeDish = async (request: DishAnalysisRequest) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiService.analyzeDish(request);
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof ApiError 
        ? err.detail || err.message 
        : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return { analyzeDish, loading, error, data, reset };
}

/**
 * 示例 6: 使用自定义 Hook 的组件
 */
export function DishAnalysisWithHook() {
  const { analyzeDish, loading, error, data } = useDishAnalysis();

  const handleAnalyze = () => {
    analyzeDish({
      title: "My Favorite Dish",
      description: "A delicious meal",
      image_url: "https://example.com/dish.jpg"
    });
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={loading}>
        Analyze
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h3>{data.dish_name}</h3>
          <p>{data.dish_description}</p>
        </div>
      )}
    </div>
  );
}

