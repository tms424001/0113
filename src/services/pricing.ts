// src/services/pricing.ts
// Pricing 模块 API 服务 - 严格按照 docs/api/schemas/pricing.md

import { request } from './http'
import type {
  PricingTaskDTO,
  PricingTaskListQuery,
  PricingTaskListResponse,
  MappingRecordDTO,
  MappingRecordListQuery,
  MappingRecordListResponse,
  UpdateMappingPayload,
  PricingIssueDTO,
  PricingIssueListQuery,
  PricingIssueListResponse,
  PushRecordDTO,
  PushRecordListQuery,
  PushRecordListResponse,
  CreatePushPayload,
} from '@/types/dto.pricing'

// ============================================================================
// API 路径常量
// ============================================================================

const BASE_PATH = '/api/pricing'

// ============================================================================
// Pricing API Service
// ============================================================================

export const pricingApi = {
  // --------------------------------------------------------------------------
  // Pricing Task (套定额任务)
  // --------------------------------------------------------------------------

  /**
   * 获取套定额任务列表
   */
  getTasks(query: PricingTaskListQuery): Promise<PricingTaskListResponse> {
    return request.get<PricingTaskListResponse>(`${BASE_PATH}/tasks`, query as unknown as Record<string, unknown>)
  },

  /**
   * 获取任务详情
   */
  getTask(id: string): Promise<PricingTaskDTO> {
    return request.get<PricingTaskDTO>(`${BASE_PATH}/tasks/${id}`)
  },

  /**
   * 删除任务
   */
  deleteTask(id: string): Promise<{ ok: true }> {
    return request.delete<{ ok: true }>(`${BASE_PATH}/tasks/${id}`)
  },

  // --------------------------------------------------------------------------
  // Mapping Record (映射记录)
  // --------------------------------------------------------------------------

  /**
   * 获取任务的映射记录列表
   */
  getRecords(query: MappingRecordListQuery): Promise<MappingRecordListResponse> {
    return request.get<MappingRecordListResponse>(
      `${BASE_PATH}/tasks/${query.taskId}/records`,
      query as unknown as Record<string, unknown>
    )
  },

  /**
   * 更新映射记录
   */
  updateRecord(recordId: string, data: UpdateMappingPayload): Promise<MappingRecordDTO> {
    return request.put<MappingRecordDTO>(`${BASE_PATH}/records/${recordId}`, data as unknown as Record<string, unknown>)
  },

  // --------------------------------------------------------------------------
  // Pricing Issue (计价问题)
  // --------------------------------------------------------------------------

  /**
   * 获取计价问题列表
   */
  getIssues(query: PricingIssueListQuery): Promise<PricingIssueListResponse> {
    return request.get<PricingIssueListResponse>(`${BASE_PATH}/issues`, query as unknown as Record<string, unknown>)
  },

  /**
   * 解决问题
   */
  resolveIssue(issueId: string): Promise<PricingIssueDTO> {
    return request.put<PricingIssueDTO>(`${BASE_PATH}/issues/${issueId}/resolve`)
  },

  /**
   * 忽略问题
   */
  ignoreIssue(issueId: string): Promise<PricingIssueDTO> {
    return request.put<PricingIssueDTO>(`${BASE_PATH}/issues/${issueId}/ignore`)
  },

  // --------------------------------------------------------------------------
  // Push Record (推送记录)
  // --------------------------------------------------------------------------

  /**
   * 获取推送记录列表
   */
  getPushRecords(query: PushRecordListQuery): Promise<PushRecordListResponse> {
    return request.get<PushRecordListResponse>(`${BASE_PATH}/push-records`, query as unknown as Record<string, unknown>)
  },

  /**
   * 推送任务到目标系统
   */
  pushTask(taskId: string, data: CreatePushPayload): Promise<PushRecordDTO> {
    return request.post<PushRecordDTO>(`${BASE_PATH}/tasks/${taskId}/push`, data as unknown as Record<string, unknown>)
  },
}

export default pricingApi
