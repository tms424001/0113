// src/hooks/usePricing.ts
// Pricing 模块数据获取 Hooks

import { useCallback } from 'react'
import { useList, useDetail, useRequest } from './useRequest'
import { pricingApi } from '@/services/pricing'
import type {
  PricingTaskDTO,
  PricingTaskListQuery,
  MappingRecordDTO,
  MappingRecordListQuery,
  UpdateMappingPayload,
  PricingIssueDTO,
  PricingIssueListQuery,
  PushRecordDTO,
  PushRecordListQuery,
  CreatePushPayload,
} from '@/types/dto.pricing'

// ============================================================================
// usePricingTaskList - 套定额任务列表
// ============================================================================

export interface UsePricingTaskListOptions {
  defaultQuery?: Partial<PricingTaskListQuery>
  onSuccess?: (data: { items: PricingTaskDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 套定额任务列表 Hook
 */
export function usePricingTaskList(options: UsePricingTaskListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<PricingTaskDTO, PricingTaskListQuery>(pricingApi.getTasks, {
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
// usePricingTaskDetail - 任务详情
// ============================================================================

/**
 * 套定额任务详情 Hook
 */
export function usePricingTaskDetail(options: {
  onSuccess?: (data: PricingTaskDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<PricingTaskDTO>(pricingApi.getTask, options)
}

// ============================================================================
// useMappingRecordList - 映射记录列表
// ============================================================================

export interface UseMappingRecordListOptions {
  taskId: string
  defaultQuery?: Partial<Omit<MappingRecordListQuery, 'taskId'>>
  onSuccess?: (data: { items: MappingRecordDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 映射记录列表 Hook
 */
export function useMappingRecordList(options: UseMappingRecordListOptions) {
  const { taskId, defaultQuery = {}, onSuccess, onError } = options

  return useList<MappingRecordDTO, MappingRecordListQuery>(pricingApi.getRecords, {
    defaultQuery: {
      taskId,
      page: 1,
      pageSize: 20,
      ...defaultQuery,
    },
    onSuccess,
    onError,
  })
}

// ============================================================================
// useMappingRecordMutation - 映射记录更新
// ============================================================================

/**
 * 映射记录更新 Hook
 */
export function useMappingRecordMutation(options: {
  onSuccess?: () => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const updateRequest = useRequest(pricingApi.updateRecord, { onSuccess, onError })

  const update = useCallback(
    (recordId: string, data: UpdateMappingPayload) => updateRequest.run(recordId, data),
    [updateRequest]
  )

  return {
    update,
    loading: updateRequest.loading,
  }
}

// ============================================================================
// usePricingIssueList - 计价问题列表
// ============================================================================

export interface UsePricingIssueListOptions {
  defaultQuery?: Partial<PricingIssueListQuery>
  onSuccess?: (data: { items: PricingIssueDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 计价问题列表 Hook
 */
export function usePricingIssueList(options: UsePricingIssueListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<PricingIssueDTO, PricingIssueListQuery>(pricingApi.getIssues, {
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
// usePricingIssueMutation - 问题处理
// ============================================================================

/**
 * 计价问题处理 Hook
 */
export function usePricingIssueMutation(options: {
  onSuccess?: () => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const resolveRequest = useRequest(pricingApi.resolveIssue, { onSuccess, onError })
  const ignoreRequest = useRequest(pricingApi.ignoreIssue, { onSuccess, onError })

  const resolve = useCallback(
    (issueId: string) => resolveRequest.run(issueId),
    [resolveRequest]
  )

  const ignore = useCallback(
    (issueId: string) => ignoreRequest.run(issueId),
    [ignoreRequest]
  )

  return {
    resolve,
    ignore,
    loading: resolveRequest.loading || ignoreRequest.loading,
    resolveLoading: resolveRequest.loading,
    ignoreLoading: ignoreRequest.loading,
  }
}

// ============================================================================
// usePushRecordList - 推送记录列表
// ============================================================================

export interface UsePushRecordListOptions {
  defaultQuery?: Partial<PushRecordListQuery>
  onSuccess?: (data: { items: PushRecordDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 推送记录列表 Hook
 */
export function usePushRecordList(options: UsePushRecordListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<PushRecordDTO, PushRecordListQuery>(pricingApi.getPushRecords, {
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
// usePushTask - 推送任务
// ============================================================================

/**
 * 推送任务 Hook
 */
export function usePushTask(options: {
  onSuccess?: (data: PushRecordDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const pushRequest = useRequest(pricingApi.pushTask, { onSuccess, onError })

  const push = useCallback(
    (taskId: string, data: CreatePushPayload) => pushRequest.run(taskId, data),
    [pushRequest]
  )

  return {
    push,
    loading: pushRequest.loading,
    error: pushRequest.error,
  }
}
