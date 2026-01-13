# http.ts — Axios 请求实例模板

> 用途：统一的 HTTP 请求层，包含拦截器、错误标准化、401/403 处理。
> 位置：`src/services/http.ts`

---

## 完整代码

```ts
// src/services/http.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { ENV } from '@/constants/env'

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
  baseURL: ENV.API_BASE_URL,
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
    // 从 localStorage 或 store 获取 token
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(normalizeError(error))
  }
)

// ============================================
// 4. 响应拦截器
// ============================================

http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    
    // 业务层错误（code !== 0）
    if (data.code !== 0) {
      const error: ApiError = {
        code: data.code,
        message: data.message || '请求失败',
      }
      return Promise.reject(error)
    }
    
    return response
  },
  (error: AxiosError) => {
    const apiError = normalizeError(error)
    
    // 401: 跳转登录
    if (apiError.code === 401) {
      handleUnauthorized()
    }
    
    // 403: 仅提示，不跳转（由页面决定如何处理）
    if (apiError.code === 403) {
      message.error('无权限访问')
    }
    
    return Promise.reject(apiError)
  }
)

// ============================================
// 5. 错误标准化函数
// ============================================

function normalizeError(error: AxiosError<ApiResponse>): ApiError {
  // 网络错误（无响应）
  if (!error.response) {
    return {
      code: 'network',
      message: '网络连接异常，请检查网络后重试',
    }
  }

  const { status, data } = error.response

  // HTTP 状态码映射
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
    message: data?.message || errorMessages[status] || `请求失败 (${status})`,
    details: data as Record<string, unknown>,
  }
}

// ============================================
// 6. 401 处理：跳转登录
// ============================================

function handleUnauthorized(): void {
  // 清除本地存储
  localStorage.removeItem('access_token')
  localStorage.removeItem('user_info')
  
  // 保存当前路径，登录后跳回
  const currentPath = window.location.pathname + window.location.search
  if (currentPath !== '/login') {
    sessionStorage.setItem('redirect_after_login', currentPath)
  }
  
  // 跳转登录页
  window.location.href = '/login'
}

// ============================================
// 7. 导出封装方法
// ============================================

export const request = {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.get<ApiResponse<T>>(url, { params }).then(res => res.data.data)
  },

  post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    return http.post<ApiResponse<T>>(url, data).then(res => res.data.data)
  },

  put<T>(url: string, data?: Record<string, unknown>): Promise<T> {
    return http.put<ApiResponse<T>>(url, data).then(res => res.data.data)
  },

  delete<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return http.delete<ApiResponse<T>>(url, { params }).then(res => res.data.data)
  },
}

export default http
```

---

## 使用示例

### Service 层

```ts
// src/services/collect.ts
import { request } from './http'
import type { DraftDTO, DraftListQuery, DraftListResponse } from '@/types/dto.collect'

export const collectApi = {
  // 获取草稿列表
  getDrafts: (query: DraftListQuery) => 
    request.get<DraftListResponse>('/api/collect/drafts', query as Record<string, unknown>),

  // 获取草稿详情
  getDraft: (id: string) => 
    request.get<DraftDTO>(`/api/collect/drafts/${id}`),

  // 创建草稿
  createDraft: (data: Partial<DraftDTO>) => 
    request.post<DraftDTO>('/api/collect/drafts', data as Record<string, unknown>),

  // 更新草稿
  updateDraft: (id: string, data: Partial<DraftDTO>) => 
    request.put<DraftDTO>(`/api/collect/drafts/${id}`, data as Record<string, unknown>),

  // 删除草稿
  deleteDraft: (id: string) => 
    request.delete<{ ok: boolean }>(`/api/collect/drafts/${id}`),
}
```

### Hook 层

```ts
// src/hooks/useRequest.ts
import { useState, useCallback } from 'react'
import type { ApiError } from '@/services/http'

interface UseRequestState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export function useRequest<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>
) {
  const [state, setState] = useState<UseRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const run = useCallback(async (...args: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const data = await requestFn(...args)
      setState({ data, loading: false, error: null })
      return data
    } catch (err) {
      const error = err as ApiError
      setState(prev => ({ ...prev, loading: false, error }))
      throw error
    }
  }, [requestFn])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, run, reset }
}
```

### 页面层

```tsx
// 页面中使用
import { useRequest } from '@/hooks/useRequest'
import { collectApi } from '@/services/collect'

const { data, loading, error, run: fetchDrafts } = useRequest(collectApi.getDrafts)

// 在组件中
if (loading) return <PageStateLoading type="table" />
if (error) return <PageStateError code={error.code} message={error.message} onRetry={() => fetchDrafts(filters)} />
```

---

## 错误码与 UI 状态映射

| Error Code | UI State | 处理方式 |
|------------|----------|----------|
| 401 | 跳转登录 | 自动处理（拦截器） |
| 403 | NoPermission | 渲染无权限页面 |
| 404 | NotFound | 渲染资源不存在 |
| 500/502/503/504 | ServerError | 渲染服务错误 + 重试 |
| 'network' | NetworkError | 渲染网络错误 + 重试 |

---

## 注意事项

1. **不要在页面写 try/catch**：使用 `useRequest` hook 或类似封装
2. **Token 存储**：示例用 localStorage，生产环境考虑更安全的方案
3. **错误提示**：全局 message 仅用于 403，其他错误由页面组件渲染
4. **超时设置**：默认 30s，大文件上传需单独配置