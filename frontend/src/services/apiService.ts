/**
 * API Service - 统一管理所有后端 API 调用
 */

/**
 * API Service - 统一管理所有后端 API 调用
 */
import type {
    DishSuggestionRequest,
    DishSuggestionResponse,
    DishAnalysisResponse,
    ApiErrorResponse,
} from './types';
import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './apiConfig';

/**
 * API 错误类
 */
export class ApiError extends Error {
  statusCode: number;
  detail?: string;
  constructor(statusCode: number, message: string, detail?: string) {
    super(message);
    this.statusCode = statusCode;
    this.detail = detail;
    this.name = 'ApiError';
  }
}

/**
 * 通用的 fetch 封装，带超时和错误处理
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout', 'The request took too long to complete');
    }
    throw error;
  }
}

/**
 * 处理 API 响应
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorData: ApiErrorResponse = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // 如果无法解析错误响应，使用默认错误信息
      errorDetail = response.statusText || errorDetail;
    }

    throw new ApiError(response.status, `HTTP ${response.status}`, errorDetail);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError(500, 'Failed to parse response', 'Invalid JSON response from server');
  }
}

/**
 * API Service 类
 */
class WoltieApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 设置 API Base URL（用于动态切换环境）
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * 获取当前 API Base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * 健康检查 - 检查 API 是否正常运行
   * GET /
   */
  async healthCheck(): Promise<{ message: string; status: string }> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ROOT}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
    });

    return handleApiResponse(response);
  }

  /**
   * 基于用户描述识别菜品
   * POST /api/recognize-dish
   * 
   * @param request - 包含用户描述、位置等信息
   * @returns 菜品名称、描述、推荐餐厅列表
   */
  async recognizeDish(request: DishSuggestionRequest): Promise<DishRecognitionResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.RECOGNIZE_DISH}`;
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return handleApiResponse<DishRecognitionResponse>(response);
  }

  /**
   * 分析菜品 - Wolty AI Assistant Feature 1
   * POST /api/analyze-dish
   * 
   * 分析餐厅提供的照片和描述，输出关于菜品的全面信息
   * 注意：这是演示模式，使用固定的测试数据，不需要传递参数
   * 
   * @param request - 包含菜品标题、描述、图片等信息
   * @returns 详细的菜品分析结果
   */
  async analyzeDish(): Promise<DishAnalysisResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.ANALYZE_DISH}`;
    const response = await fetchWithTimeout(url, {
      method: 'GET',
    });

    return handleApiResponse<DishAnalysisResponse>(response);
  }

  /**
   * 上传图片并转换为 base64（辅助方法）
   * 
   * @param file - 图片文件
   * @returns base64 编码的图片字符串
   */
  async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // 移除 data:image/xxx;base64, 前缀
        const base64Data = base64.split(',')[1] || base64;
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// 创建并导出单例
export const apiService = new WoltieApiService();

// 默认导出
export default apiService;

