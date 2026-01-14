// src/hooks/useCollect.ts
// Collect 模块数据获取 Hooks

import { useCallback } from 'react'
import { useList, useDetail, useRequest } from './useRequest'
import { collectApi } from '@/services/collect'
import type {
  DraftDTO,
  DraftListQuery,
  IngestJobDTO,
  CollectIssueDTO,
  CreateDraftPayload,
  UpdateDraftPayload,
  CreateJobPayload,
} from '@/types/dto.collect'

// ============================================================================
// useDraftList - 草稿列表
// ============================================================================

export interface UseDraftListOptions {
  /** 默认查询参数 */
  defaultQuery?: Partial<DraftListQuery>
  /** 成功回调 */
  onSuccess?: (data: { items: DraftDTO[]; total: number }) => void
  /** 失败回调 */
  onError?: (error: unknown) => void
}

/**
 * 草稿列表 Hook
 * 
 * @example
 * ```tsx
 * const { list, total, loading, query, setQuery, refresh } = useDraftList()
 * 
 * // 翻页
 * setQuery({ page: 2 })
 * 
 * // 筛选
 * setQuery({ status: 'draft', page: 1 })
 * ```
 */
export function useDraftList(options: UseDraftListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<DraftDTO, DraftListQuery>(collectApi.getDrafts, {
    defaultQuery: {
      page: 1,
      pageSize: 20,
      ...defaultQuery,
    },
    onSuccess,
    onError,
  })
}

// ============================================================================
// useDraftDetail - 草稿详情
// ============================================================================

export interface UseDraftDetailOptions {
  /** 成功回调 */
  onSuccess?: (data: DraftDTO) => void
  /** 失败回调 */
  onError?: (error: unknown) => void
}

/**
 * 草稿详情 Hook
 * 
 * @example
 * ```tsx
 * const { detail, loading, load } = useDraftDetail()
 * 
 * useEffect(() => {
 *   if (id) load(id)
 * }, [id, load])
 * ```
 */
export function useDraftDetail(options: UseDraftDetailOptions = {}) {
  return useDetail<DraftDTO>(collectApi.getDraft, options)
}

// ============================================================================
// useDraftMutation - 草稿增删改
// ============================================================================

/**
 * 草稿增删改 Hook
 * 
 * @example
 * ```tsx
 * const { create, update, remove, loading } = useDraftMutation({
 *   onSuccess: () => refresh()
 * })
 * 
 * await create({ name: '新草稿', type: 'pricing_file' })
 * await update(id, { name: '更新名称' })
 * await remove(id)
 * ```
 */
export function useDraftMutation(options: {
  onSuccess?: () => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const createRequest = useRequest(collectApi.createDraft, { onSuccess, onError })
  const updateRequest = useRequest(collectApi.updateDraft, { onSuccess, onError })
  const deleteRequest = useRequest(collectApi.deleteDraft, { onSuccess, onError })

  const create = useCallback(
    (data: CreateDraftPayload) => createRequest.run(data),
    [createRequest]
  )

  const update = useCallback(
    (id: string, data: UpdateDraftPayload) => updateRequest.run(id, data),
    [updateRequest]
  )

  const remove = useCallback(
    (id: string) => deleteRequest.run(id),
    [deleteRequest]
  )

  return {
    create,
    update,
    remove,
    loading: createRequest.loading || updateRequest.loading || deleteRequest.loading,
    createLoading: createRequest.loading,
    updateLoading: updateRequest.loading,
    deleteLoading: deleteRequest.loading,
  }
}

// ============================================================================
// useDraftJobs - 草稿采集任务
// ============================================================================

/**
 * 草稿采集任务列表 Hook
 * 
 * @example
 * ```tsx
 * const { jobs, loading, load, createJob } = useDraftJobs()
 * 
 * useEffect(() => {
 *   if (draftId) load(draftId)
 * }, [draftId, load])
 * 
 * // 创建任务
 * await createJob(draftId, { jobType: 'parse' })
 * ```
 */
export function useDraftJobs(options: {
  onSuccess?: (data: IngestJobDTO[]) => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const { data: jobs, loading, run: load, reset } = useRequest(collectApi.getDraftJobs, {
    defaultData: [],
    onSuccess,
    onError,
  })

  const createJobRequest = useRequest(collectApi.createJob)

  const createJob = useCallback(
    async (draftId: string, data: CreateJobPayload) => {
      const result = await createJobRequest.run(draftId, data)
      // 创建后刷新列表
      if (result) {
        load(draftId)
      }
      return result
    },
    [createJobRequest, load]
  )

  return {
    jobs: jobs ?? [],
    loading,
    load,
    reset,
    createJob,
    createJobLoading: createJobRequest.loading,
  }
}

// ============================================================================
// useDraftIssues - 草稿问题列表
// ============================================================================

/**
 * 草稿问题列表 Hook
 * 
 * @example
 * ```tsx
 * const { issues, loading, load } = useDraftIssues()
 * 
 * useEffect(() => {
 *   if (draftId) load(draftId)
 * }, [draftId, load])
 * ```
 */
export function useDraftIssues(options: {
  onSuccess?: (data: CollectIssueDTO[]) => void
  onError?: (error: unknown) => void
} = {}) {
  const { data: issues, loading, run: load, reset } = useRequest(collectApi.getDraftIssues, {
    defaultData: [],
    ...options,
  })

  return {
    issues: issues ?? [],
    loading,
    load,
    reset,
  }
}
