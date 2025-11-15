# API 集成说明

## ✅ 已完成的集成

### 1. Dish Recognition API 集成

当用户在聊天框中提问包含 **"remember"** 或 **"help"** 关键词时，系统会自动调用后端的 `/api/recognize-dish` 接口。

#### 使用示例

**使用 "remember" 触发：**
```
Do you remember that oval-shaped Finnish pastry with rice filling?
```

**使用 "help" 触发：**
```
Can you help me find that Finnish dish with rice?
Help! I forgot the name of that Finnish pastry!
```

#### 功能流程

1. 用户输入包含 "remember" 或 "help" 的消息
2. 前端检测到关键词，调用 `apiService.recognizeDish()`
3. 发送请求到 `POST /api/recognize-dish`
4. 后端返回菜品名称、描述、推荐餐厅等信息
5. 前端根据触发词选择合适的开场白：
   - "remember" → "I remember! You're thinking of..."
   - "help" → "I can help! That sounds like..."
6. 格式化显示结果：
   - 菜品名称（粗体）
   - 菜品描述
   - 置信度
   - 推荐餐厅列表（最多显示 3 个）

#### 代码位置

- **服务层**: `frontend/src/services/apiService.ts`
  - `recognizeDish()` 方法
  
- **UI 层**: `frontend/src/pages/ChatPage.tsx`
  - `getAIResponse()` 函数中的 "remember" 检测逻辑

#### 错误处理

系统会优雅地处理以下错误，并根据触发词调整错误消息：
- **400 错误**: 提示用户提供更详细的描述
- **500 错误**: 提示系统正在经历问题
- **408 错误**: 请求超时提示
- **网络错误**: 显示连接问题提示

错误消息示例：
- "remember" 触发: "I'm trying to remember, but I'm having trouble..."
- "help" 触发: "I'd love to help, but I'm having trouble accessing..."

## 📋 API 列表

### 已集成的 API

| API 端点 | 方法 | 功能 | 触发条件 |
|---------|------|------|---------|
| `/api/recognize-dish` | POST | 识别菜品 | 消息包含 "remember" 或 "help" |
| `/api/analyze-dish` | GET | 分析菜品 (Demo) | 可通过 `apiService.analyzeDish()` 调用 |

### API 服务使用

```typescript
import { apiService } from '@/services';

// 1. 识别菜品
const result = await apiService.recognizeDish({
  description: "oval-shaped Finnish pastry",
  location: "Helsinki"
});

// 2. 分析菜品 (Demo 模式)
const analysis = await apiService.analyzeDish();
```

## 🔧 配置

### 环境变量

在 `frontend/.env` 中配置：

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### 开发环境

1. 启动后端服务：
```bash
cd backend
fastapi dev main.py
```

2. 启动前端服务：
```bash
cd frontend
npm run dev
```

## 🧪 测试

### 测试 Dish Recognition

#### 测试 "remember" 关键词
1. 打开聊天页面
2. 输入: "Do you remember that Finnish pastry with rice?"
3. 观察控制台日志：
   - 🔍 Calling dish recognition API...
   - ✅ Dish recognition result: {...}
4. 检查聊天框中的回复（应该以 "I remember!" 开头）

#### 测试 "help" 关键词
1. 输入: "Can you help me find that oval-shaped Finnish dish?"
2. 观察控制台日志（同上）
3. 检查聊天框中的回复（应该以 "I can help!" 开头）

#### 测试多种表达
- "Help! What's that Finnish pastry?"
- "I need help identifying this dish"
- "Remember that food from Finland?"
- "Do you remember the name?"

### 测试错误处理

1. 停止后端服务
2. 输入包含 "remember" 的消息
3. 应该看到友好的错误提示

## 📝 扩展指南

### 添加新的关键词触发

在 `ChatPage.tsx` 的 `getAIResponse` 函数中添加：

```typescript
// 新的关键词检测
if (lowerMessage.includes('your-keyword')) {
  try {
    const result = await apiService.yourNewMethod({...});
    // 处理结果
  } catch (error) {
    // 错误处理
  }
}
```

### 添加新的 API 方法

在 `frontend/src/services/apiService.ts` 中添加：

```typescript
async yourNewMethod(request: YourRequest): Promise<YourResponse> {
  const url = `${this.baseUrl}/api/your-endpoint`;
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return handleApiResponse<YourResponse>(response);
}
```

## 🎯 后续计划

- [ ] 添加菜品图片上传功能
- [ ] 集成用户位置获取
- [ ] 添加餐厅详情展示
- [ ] 支持多语言菜品识别
- [ ] 添加用户偏好设置

## 📞 问题排查

### API 调用失败

1. 检查后端是否运行: `http://localhost:8000/`
2. 检查环境变量: `console.log(import.meta.env.VITE_API_BASE_URL)`
3. 查看浏览器控制台的错误日志
4. 检查网络面板 (Network tab) 查看请求详情

### CORS 错误

确保后端已配置 CORS：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📚 相关文档

- [API Service README](./src/services/README.md)
- [API Examples](./src/services/examples.tsx)
- [Backend API Documentation](../backend/README.md)

