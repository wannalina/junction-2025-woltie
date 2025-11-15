# Woltie API Service

前端 API 服务层，统一管理所有后端 API 调用。

## 📁 文件结构

```
services/
├── index.ts          # 统一入口，导出所有服务
├── types.ts          # TypeScript 类型定义
├── apiConfig.ts      # API 配置（URL、endpoints 等）
├── apiService.ts     # API 服务实现
└── README.md         # 本文件
```

## 🚀 快速开始

### 1. 环境配置

在项目根目录创建 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### 2. 基础使用

```typescript
import { apiService } from '@/services';

// 健康检查
const health = await apiService.healthCheck();
console.log(health); // { message: "Woltie API", status: "running" }
```

## 📚 API 方法

### 1. healthCheck()

检查 API 是否正常运行

```typescript
try {
  const result = await apiService.healthCheck();
  console.log('API Status:', result.status);
} catch (error) {
  console.error('API is down:', error);
}
```

### 2. suggestDish()

基于用户描述建议菜品

```typescript
import { apiService, DishSuggestionRequest } from '@/services';

const request: DishSuggestionRequest = {
  description: "I'm looking for an oval-shaped Finnish pastry with rice filling",
  location: "Helsinki",
  user_id: "user_123"
};

try {
  const result = await apiService.suggestDish(request);
  console.log('Dish:', result.dish_name);
  console.log('Restaurants:', result.restaurants);
  console.log('Confidence:', result.confidence);
} catch (error) {
  console.error('Error:', error);
}
```

**响应示例：**
```json
{
  "dish_name": "Karjalanpiirakka",
  "dish_description": "Traditional Finnish pastry...",
  "restaurants": [
    {
      "name": "Helsinki Bakery",
      "address": "Mannerheimintie 1",
      "distance": "0.5 km"
    }
  ],
  "confidence": 0.95
}
```

### 3. analyzeDish()

分析菜品的详细信息（Wolty AI Assistant）

#### 使用图片 URL

```typescript
import { apiService, DishAnalysisRequest } from '@/services';

const request: DishAnalysisRequest = {
  title: "Grilled Salmon",
  description: "Fresh salmon with herbs",
  image_url: "https://example.com/salmon.jpg",
  user_preferences: ["no-dairy", "low-carb"],
  known_dishes: ["Teriyaki Salmon", "Sushi"]
};

try {
  const result = await apiService.analyzeDish(request);
  console.log('Analysis:', result);
} catch (error) {
  console.error('Error:', error);
}
```

#### 使用图片文件

```typescript
// 在文件上传时
const handleFileUpload = async (file: File) => {
  try {
    // 转换为 base64
    const base64Image = await apiService.imageToBase64(file);
    
    // 分析菜品
    const result = await apiService.analyzeDish({
      title: "My Dish",
      description: "Delicious dish",
      image_base64: base64Image,
      user_preferences: ["vegan"]
    });
    
    console.log('Ingredients:', result.ingredients);
    console.log('Allergens:', result.allergens);
    console.log('Similar dishes:', result.similar_dishes);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**响应示例：**
```json
{
  "dish_name": "Grilled Salmon",
  "dish_description": "Fresh Atlantic salmon...",
  "taste_profile": "Savory with a hint of smokiness",
  "ingredients": ["Salmon", "Olive oil", "Herbs", "Lemon"],
  "allergens": ["Fish"],
  "dietary_tags": ["gluten-free", "low-carb", "keto-friendly"],
  "similar_dishes": [
    {
      "dish_name": "Teriyaki Salmon",
      "similarity_score": 0.85,
      "similarity_reason": "Both are grilled salmon dishes"
    }
  ],
  "historical_background": "Salmon has been a staple...",
  "fun_facts": ["Salmon swim upstream to spawn"],
  "warnings": ["Contains fish, avoid if allergic"],
  "processing_time_seconds": 2.34
}
```

## 🛠️ 错误处理

API Service 使用自定义的 `ApiError` 类：

```typescript
import { apiService, ApiError } from '@/services';

try {
  const result = await apiService.suggestDish({
    description: "Delicious food"
  });
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.statusCode);
    console.error('Message:', error.message);
    console.error('Detail:', error.detail);
    
    // 根据状态码处理
    if (error.statusCode === 400) {
      // 处理验证错误
    } else if (error.statusCode === 500) {
      // 处理服务器错误
    } else if (error.statusCode === 408) {
      // 处理超时
    }
  }
}
```

## ⚙️ 高级配置

### 动态切换 API URL

```typescript
// 切换到生产环境
apiService.setBaseUrl('https://api.production.com');

// 获取当前 URL
const currentUrl = apiService.getBaseUrl();
```

### 自定义超时时间

修改 `apiConfig.ts` 中的 `REQUEST_TIMEOUT` 值（默认 30 秒）

## 📝 类型安全

所有 API 方法都有完整的 TypeScript 类型定义：

```typescript
import type {
  DishSuggestionRequest,
  DishSuggestionResponse,
  DishAnalysisRequest,
  DishAnalysisResponse,
  RestaurantRecommendation,
  SimilarDish
} from '@/services';
```

## 🧪 React Hook 示例

创建自定义 Hook 使用 API：

```typescript
import { useState } from 'react';
import { apiService, DishSuggestionRequest, DishSuggestionResponse } from '@/services';

function useDishSuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DishSuggestionResponse | null>(null);

  const suggestDish = async (request: DishSuggestionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.suggestDish(request);
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { suggestDish, loading, error, data };
}

export default useDishSuggestion;
```

## 🔐 注意事项

1. **环境变量**：确保在部署前设置正确的 `VITE_API_BASE_URL`
2. **CORS**：后端需要配置 CORS 允许前端域名
3. **超时**：大文件上传时可能需要增加超时时间
4. **错误处理**：始终使用 try-catch 包裹 API 调用
5. **Base64 大小**：注意 base64 图片的大小限制

## 📮 联系方式

如有问题或建议，请联系开发团队。

