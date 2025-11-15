# CORS 跨域问题修复

## 🔧 问题描述

错误信息：
```
127.0.0.1:55236 - "OPTIONS /api/recognize-dish HTTP/1.1" 405 Method Not Allowed
```

这是一个典型的 CORS（跨域资源共享）问题。浏览器在发送 POST 请求前会先发送 OPTIONS 预检请求，但后端没有配置 CORS 中间件来处理。

## ✅ 已修复

在 `backend/main.py` 中添加了 CORS 中间件配置：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 默认端口
        "http://localhost:3000",  # React 常用端口
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"],  # 允许所有请求头
)
```

## 🚀 应用修复

### 1. 重启后端服务

**停止当前后端服务** (按 Ctrl+C)，然后重新启动：

```bash
cd backend
fastapi dev main.py
```

或者：

```bash
cd backend
python main.py
```

### 2. 验证修复

启动后端后，你应该看到：
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 3. 测试 API

在浏览器中打开前端，尝试发送包含 "remember" 或 "help" 的消息：

```
Do you remember that Finnish pastry with rice?
```

### 4. 检查控制台

**浏览器控制台应该显示：**
```
🔍 Calling dish recognition API...
✅ Dish recognition result: {...}
```

**后端控制台应该显示：**
```
INFO:     127.0.0.1:xxxxx - "OPTIONS /api/recognize-dish HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /api/recognize-dish HTTP/1.1" 200 OK
```

## 📋 CORS 配置说明

### 允许的源 (Origins)
- `http://localhost:5173` - Vite 开发服务器
- `http://localhost:3000` - React 开发服务器
- `http://127.0.0.1:5173` - 127.0.0.1 变体
- `http://127.0.0.1:3000` - 127.0.0.1 变体

### 允许的方法 (Methods)
- `*` - 所有 HTTP 方法 (GET, POST, PUT, DELETE, OPTIONS, etc.)

### 允许的请求头 (Headers)
- `*` - 所有请求头

### 允许凭证 (Credentials)
- `True` - 允许发送 cookies 和认证信息

## 🔍 问题排查

### 如果 CORS 错误仍然存在：

1. **确认后端已重启**
   ```bash
   # 检查是否有旧进程
   ps aux | grep python
   # 如果有，杀掉旧进程
   kill -9 <进程ID>
   ```

2. **清除浏览器缓存**
   - Chrome: Ctrl+Shift+Delete
   - 选择 "Cached images and files"
   - 点击 "Clear data"

3. **检查前端端口**
   ```bash
   # 确认前端运行在哪个端口
   npm run dev
   ```
   
   如果不是 5173，需要更新 `backend/main.py` 中的 `allow_origins`：
   ```python
   allow_origins=[
       "http://localhost:你的端口号",
       "http://127.0.0.1:你的端口号",
   ],
   ```

4. **检查网络请求**
   - 打开浏览器开发者工具 (F12)
   - 切换到 "Network" 标签
   - 发送请求
   - 查看 OPTIONS 和 POST 请求的详细信息

### 如果看到其他 CORS 错误：

**错误:** `Access-Control-Allow-Origin header is missing`
- **原因:** 后端未返回正确的 CORS 头
- **解决:** 确认 CORS 中间件已添加且后端已重启

**错误:** `CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*'`
- **原因:** 使用 `allow_credentials=True` 时不能用 `*`
- **解决:** 已配置具体的域名列表，无需修改

**错误:** `Method ... is not allowed by Access-Control-Allow-Methods`
- **原因:** 某些 HTTP 方法未被允许
- **解决:** 已配置 `allow_methods=["*"]`，允许所有方法

## 📚 相关资源

- [FastAPI CORS 文档](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN CORS 指南](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)

## ✅ 验证清单

- [ ] 后端已重启
- [ ] 浏览器缓存已清除
- [ ] 前端可以成功调用 API
- [ ] 控制台无 CORS 错误
- [ ] OPTIONS 请求返回 200
- [ ] POST 请求返回 200

## 🎯 下一步

如果 CORS 问题已解决，你可以：
1. 测试 "remember" 关键词触发
2. 测试 "help" 关键词触发
3. 验证错误处理
4. 测试不同的菜品描述

