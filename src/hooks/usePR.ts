// src/hooks/usePR.ts
// PR (Pull Request) 模块数据获取 Hooks

import { useCallback } from 'react'
import { useList, useDetail, useRequest } from './useRequest'
import { prApi } from '@/services/pr'
import type {
  PullRequestDTO,
  PRListQuery,
  CreatePRPayload,
  UpdatePRPayload,
  PRReviewRecordDTO,
  ReviewPayload,
  PRCommentDTO,
  CreateCommentPayload,
  ValidationResult,
} from '@/types/dto.pr'

// ============================================================================
// usePRList - PR 列表
// ============================================================================

export interface UsePRListOptions {
  defaultQuery?: Partial<PRListQuery>
  onSuccess?: (data: { items: PullRequestDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * PR 列表 Hook
 * 
 * @example
 * ```tsx
 * const { list, total, loading, query, setQuery, refresh } = usePRList({
 *   defaultQuery: { status: 'pending' }
 * })
 * ```
 */
export function usePRList(options: UsePRListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<PullRequestDTO, PRListQuery>(prApi.getPRs, {
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
// usePRDetail - PR 详情
// ============================================================================

/**
 * PR 详情 Hook
 * 
 * @example
 * ```tsx
 * const { detail, loading, load } = usePRDetail()
 * 
 * useEffect(() => {
 *   if (id) load(id)
 * }, [id, load])
 * ```
 */
export function usePRDetail(options: {
  onSuccess?: (data: PullRequestDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<PullRequestDTO>(prApi.getPR, options)
}

// ============================================================================
// usePRMutation - PR 增删改
// ============================================================================

/**
 * PR 增删改 Hook
 * 
 * @example
 * ```tsx
 * const { create, update, remove, loading } = usePRMutation({
 *   onSuccess: () => refresh()
 * })
 * ```
 */
export function usePRMutation(options: {
  onSuccess?: () => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const createRequest = useRequest(prApi.createPR, { onSuccess, onError })
  const updateRequest = useRequest(prApi.updatePR, { onSuccess, onError })
  const deleteRequest = useRequest(prApi.deletePR, { onSuccess, onError })

  const create = useCallback(
    (data: CreatePRPayload) => createRequest.run(data),
    [createRequest]
  )

  const update = useCallback(
    (id: string, data: UpdatePRPayload) => updateRequest.run(id, data),
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
// usePRActions - PR 流程操作
// ============================================================================

/**
 * PR 流程操作 Hook
 * 
 * @example
 * ```tsx
 * const { submit, review, merge, withdraw, validate, loading } = usePRActions({
 *   onSuccess: () => loadDetail(id)
 * })
 * 
 * // 提交审核
 * await submit(id)
 * 
 * // 审批
 * await review(id, { action: 'approve', comment: '通过' })
 * 
 * // 入库
 * await merge(id)
 * ```
 */
export function usePRActions(options: {
  onSuccess?: () => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const submitRequest = useRequest(prApi.submitPR, { onSuccess, onError })
  const reviewRequest = useRequest(prApi.reviewPR, { onSuccess, onError })
  const mergeRequest = useRequest(prApi.mergePR, { onSuccess, onError })
  const withdrawRequest = useRequest(prApi.withdrawPR, { onSuccess, onError })
  const validateRequest = useRequest(prApi.validatePR, { onError })

  const submit = useCallback(
    (id: string) => submitRequest.run(id),
    [submitRequest]
  )

  const review = useCallback(
    (id: string, data: ReviewPayload) => reviewRequest.run(id, data),
    [reviewRequest]
  )

  const merge = useCallback(
    (id: string) => mergeRequest.run(id),
    [mergeRequest]
  )

  const withdraw = useCallback(
    (id: string) => withdrawRequest.run(id),
    [withdrawRequest]
  )

  const validate = useCallback(
    (id: string) => validateRequest.run(id),
    [validateRequest]
  )

  return {
    submit,
    review,
    merge,
    withdraw,
    validate,
    loading:
      submitRequest.loading ||
      reviewRequest.loading ||
      mergeRequest.loading ||
      withdrawRequest.loading ||
      validateRequest.loading,
    submitLoading: submitRequest.loading,
    reviewLoading: reviewRequest.loading,
    mergeLoading: mergeRequest.loading,
    withdrawLoading: withdrawRequest.loading,
    validateLoading: validateRequest.loading,
    validationResult: validateRequest.data as ValidationResult | undefined,
  }
}

// ============================================================================
// usePRReviews - PR 审批记录
// ============================================================================

/**
 * PR 审批记录 Hook
 * 
 * @example
 * ```tsx
 * const { reviews, loading, load } = usePRReviews()
 * 
 * useEffect(() => {
 *   if (prId) load(prId)
 * }, [prId, load])
 * ```
 */
export function usePRReviews(options: {
  onSuccess?: (data: PRReviewRecordDTO[]) => void
  onError?: (error: unknown) => void
} = {}) {
  const { data: reviews, loading, run: load, reset } = useRequest(prApi.getReviews, {
    defaultData: [],
    ...options,
  })

  return {
    reviews: reviews ?? [],
    loading,
    load,
    reset,
  }
}

// ============================================================================
// usePRComments - PR 评论
// ============================================================================

/**
 * PR 评论 Hook
 * 
 * @example
 * ```tsx
 * const { comments, loading, load, addComment } = usePRComments()
 * 
 * useEffect(() => {
 *   if (prId) load(prId)
 * }, [prId, load])
 * 
 * // 添加评论
 * await addComment(prId, { content: '评论内容' })
 * ```
 */
export function usePRComments(options: {
  onSuccess?: (data: PRCommentDTO[]) => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const { data: comments, loading, run: load, reset } = useRequest(prApi.getComments, {
    defaultData: [],
    onSuccess,
    onError,
  })

  const addCommentRequest = useRequest(prApi.addComment)

  const addComment = useCallback(
    async (prId: string, data: CreateCommentPayload) => {
      const result = await addCommentRequest.run(prId, data)
      // 添加后刷新列表
      if (result) {
        load(prId)
      }
      return result
    },
    [addCommentRequest, load]
  )

  return {
    comments: comments ?? [],
    loading,
    load,
    reset,
    addComment,
    addCommentLoading: addCommentRequest.loading,
  }
}

// ============================================================================
// usePRDiff - PR 数据差异
// ============================================================================

/**
 * PR 数据差异 Hook
 * 
 * @example
 * ```tsx
 * const { diff, loading, load } = usePRDiff()
 * 
 * useEffect(() => {
 *   if (prId) load(prId)
 * }, [prId, load])
 * ```
 */
export function usePRDiff(options: {
  onSuccess?: (data: Record<string, unknown>) => void
  onError?: (error: unknown) => void
} = {}) {
  const { data: diff, loading, run: load, reset } = useRequest(prApi.getDiff, options)

  return {
    diff,
    loading,
    load,
    reset,
  }
}
