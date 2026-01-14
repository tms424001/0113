// src/hooks/useRequest.ts
// 通用请求 Hook - 封装异步请求状态管理

import { useState, useCallback, useRef } from 'react'
import type { ApiError } from '@/services/http'

// ============================================================================
// Types
// ============================================================================

export interface UseRequestResult<T, P extends unknown[]> {
  /** 响应数据 */
  data: T | undefined
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: ApiError | undefined
  /** 手动触发请求 */
  run: (...args: P) => Promise<T | undefined>
  /** 重置状态 */
  reset: () => void
  /** 手动设置数据 */
  mutate: (data: T | undefined | ((prev: T | undefined) => T | undefined)) => void
}

export interface UseRequestOptions<T> {
  /** 是否手动触发，默认 false */
  manual?: boolean
  /** 默认数据 */
  defaultData?: T
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 失败回调 */
  onError?: (error: ApiError) => void
}

// ============================================================================
// useRequest Hook
// ============================================================================

/**
 * 通用请求 Hook
 * @param requestFn 请求函数
 * @param options 配置选项
 * @returns { data, loading, error, run, reset, mutate }
 * 
 * @example
 * ```ts
 * const { data, loading, run } = useRequest(collectApi.getDrafts)
 * 
 * // 手动触发
 * const result = await run({ page: 1, pageSize: 20 })
 * ```
 */
export function useRequest<T, P extends unknown[]>(
  requestFn: (...args: P) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestResult<T, P> {
  const { defaultData, onSuccess, onError } = options

  const [data, setData] = useState<T | undefined>(defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | undefined>(undefined)

  // 用于取消过期请求
  const requestIdRef = useRef(0)

  const run = useCallback(
    async (...args: P): Promise<T | undefined> => {
      const currentRequestId = ++requestIdRef.current

      setLoading(true)
      setError(undefined)

      try {
        const result = await requestFn(...args)

        // 检查是否是最新请求
        if (currentRequestId === requestIdRef.current) {
          setData(result)
          onSuccess?.(result)
          return result
        }
      } catch (err) {
        // 检查是否是最新请求
        if (currentRequestId === requestIdRef.current) {
          const apiError = err as ApiError
          setError(apiError)
          onError?.(apiError)
        }
      } finally {
        // 检查是否是最新请求
        if (currentRequestId === requestIdRef.current) {
          setLoading(false)
        }
      }

      return undefined
    },
    [requestFn, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setData(defaultData)
    setLoading(false)
    setError(undefined)
  }, [defaultData])

  const mutate = useCallback(
    (newData: T | undefined | ((prev: T | undefined) => T | undefined)) => {
      if (typeof newData === 'function') {
        setData((prev) => (newData as (prev: T | undefined) => T | undefined)(prev))
      } else {
        setData(newData)
      }
    },
    []
  )

  return { data, loading, error, run, reset, mutate }
}

// ============================================================================
// useList Hook - 列表数据专用
// ============================================================================

export interface UseListResult<T, Q> extends Omit<UseRequestResult<{ items: T[]; total: number }, [Q]>, 'data'> {
  /** 列表数据 */
  list: T[]
  /** 总数 */
  total: number
  /** 当前查询参数 */
  query: Q
  /** 更新查询参数并刷新 */
  setQuery: (query: Partial<Q>) => void
  /** 刷新当前列表 */
  refresh: () => Promise<void>
}

export interface UseListOptions<T, Q> extends UseRequestOptions<{ items: T[]; total: number }> {
  /** 默认查询参数 */
  defaultQuery: Q
}

/**
 * 列表数据 Hook
 * @param requestFn 请求函数，接收查询参数，返回 { items, total }
 * @param options 配置选项
 * 
 * @example
 * ```ts
 * const { list, total, loading, query, setQuery, refresh } = useList(
 *   collectApi.getDrafts,
 *   { defaultQuery: { page: 1, pageSize: 20 } }
 * )
 * 
 * // 翻页
 * setQuery({ page: 2 })
 * 
 * // 搜索
 * setQuery({ keyword: 'test', page: 1 })
 * ```
 */
export function useList<T, Q extends { page: number; pageSize: number }>(
  requestFn: (query: Q) => Promise<{ items: T[]; page: number; pageSize: number; total: number }>,
  options: UseListOptions<T, Q>
): UseListResult<T, Q> {
  const { defaultQuery, ...restOptions } = options

  const [query, setQueryState] = useState<Q>(defaultQuery)

  const { data, loading, error, run, reset, mutate } = useRequest(requestFn, {
    ...restOptions,
    defaultData: { items: [], total: 0 },
  })

  const setQuery = useCallback(
    (partialQuery: Partial<Q>) => {
      setQueryState((prev) => {
        const newQuery = { ...prev, ...partialQuery }
        // 自动触发请求
        run(newQuery)
        return newQuery
      })
    },
    [run]
  )

  const refresh = useCallback(async () => {
    await run(query)
  }, [run, query])

  return {
    list: data?.items ?? [],
    total: data?.total ?? 0,
    loading,
    error,
    query,
    setQuery,
    refresh,
    run,
    reset,
    mutate,
  }
}

// ============================================================================
// useDetail Hook - 详情数据专用
// ============================================================================

export interface UseDetailResult<T> extends UseRequestResult<T, [string]> {
  /** 详情数据 */
  detail: T | undefined
  /** 加载详情 */
  load: (id: string) => Promise<T | undefined>
}

/**
 * 详情数据 Hook
 * @param requestFn 请求函数，接收 ID，返回详情数据
 * @param options 配置选项
 * 
 * @example
 * ```ts
 * const { detail, loading, load } = useDetail(collectApi.getDraft)
 * 
 * // 加载详情
 * useEffect(() => {
 *   load(id)
 * }, [id])
 * ```
 */
export function useDetail<T>(
  requestFn: (id: string) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseDetailResult<T> {
  const { data, loading, error, run, reset, mutate } = useRequest(requestFn, options)

  return {
    detail: data,
    data,
    loading,
    error,
    load: run,
    run,
    reset,
    mutate,
  }
}

export default useRequest
