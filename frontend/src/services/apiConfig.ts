/**
 * API Configuration
 */

// API Base URL - 根据环境自动切换
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  ROOT: '/',
  SUGGEST_DISH: '/api/suggest-dish',
  ANALYZE_DISH: '/api/analyze-dish',
} as const;

// HTTP Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Request timeout (milliseconds)
export const REQUEST_TIMEOUT = 30000; // 30 seconds

