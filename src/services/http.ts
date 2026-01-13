// src/services/http.ts
import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { ENV } from '../constants/env'

// ============================================
// 1. 标准化错误类型
// ============================================

export interface ApiError {
  code: number | 'network'
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ============================================
// 2. 创建 Axios 实例
// ============================================

const http: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================
// 3. 请求拦截器
// ============================================

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(normalizeError(error as AxiosError))
  }
)

// ============================================
// 4. 响应拦截器
// ============================================

http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response

    if (data.code !== 0) {
      const error: ApiError = {
        code: data.code,
        message: data.message || '请求失败',
      }
      return Promise.reject(error)
    }

    return response
  },
  (error) => {
    const apiError = normalizeError(error as AxiosError)

    if (apiError.code === 401) {
      handleUnauthorized()
    }

    if (apiError.code === 403) {
      message.error('无权限访问')
    }

    return Promise.reject(apiError)
  }
)

// ============================================
// 5. 错误标准化函数
// ============================================

function normalizeError(error: AxiosError): ApiError {
  if (!error.response) {
    return {
      code: 'network',
      message: '网络连接异常，请检查网络后重试',
    }
  }

  const { status, data } = error.response
  const responseData = data as ApiResponse | undefined

  const errorMessages: Record<number, string> = {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '无权限访问',
    404: '请求的资源不存在',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',
  }

  return {
    code: status,
    message: responseData?.message || errorMessages[status] || `请求失败 (${status})`,
    details: responseData as unknown as Record<string, unknown>,
  }
}

// ============================================
// 6. 401 处理：跳转登录
// ============================================

function handleUnauthorized(): void {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user_info')

  const currentPath = window.location.pathname + window.location.search
  if (currentPath !== '/login') {
    sessionStorage.setItem('redirect_after_login', currentPath)
  }

  window.location.href = '/login'
}

// ============================================
// 7. 导出封装方法
// ============================================

export const request = {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.get<ApiResponse<T>>(url, { params }).then((res) => res.data.data)
  },

  post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    return http.post<ApiResponse<T>>(url, data).then((res) => res.data.data)
  },

  put<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    return http.put<ApiResponse<T>>(url, data).then((res) => res.data.data)
  },

  delete<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.delete<ApiResponse<T>>(url, { params }).then((res) => res.data.data)
  },
}

export default http
