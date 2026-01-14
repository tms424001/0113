// src/types/api.ts

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface PagedQuery {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiError {
  code: number | 'network'
  message: string
  details?: Record<string, unknown>
}
