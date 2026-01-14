// src/services/collect.ts
// Collect 模块 API 服务 - 严格按照 docs/api/schemas/collect.md

import { request } from './http'
import type {
  DraftDTO,
  DraftListQuery,
  DraftListResponse,
  CreateDraftPayload,
  UpdateDraftPayload,
  IngestJobDTO,
  CollectIssueDTO,
  CreateJobPayload,
} from '@/types/dto.collect'

// ============================================================================
// API 路径常量
// ============================================================================

const BASE_PATH = '/api/collect'

// ============================================================================
// Collect API Service
// ============================================================================

export const collectApi = {
  // --------------------------------------------------------------------------
  // Draft (草稿) CRUD
  // --------------------------------------------------------------------------

  /**
   * 获取草稿列表
   */
  getDrafts(query: DraftListQuery): Promise<DraftListResponse> {
    return request.get<DraftListResponse>(`${BASE_PATH}/drafts`, query as unknown as Record<string, unknown>)
  },

  /**
   * 获取草稿详情
   */
  getDraft(id: string): Promise<DraftDTO> {
    return request.get<DraftDTO>(`${BASE_PATH}/drafts/${id}`)
  },

  /**
   * 创建草稿
   */
  createDraft(data: CreateDraftPayload): Promise<DraftDTO> {
    return request.post<DraftDTO>(`${BASE_PATH}/drafts`, data as unknown as Record<string, unknown>)
  },

  /**
   * 更新草稿
   */
  updateDraft(id: string, data: UpdateDraftPayload): Promise<DraftDTO> {
    return request.put<DraftDTO>(`${BASE_PATH}/drafts/${id}`, data as unknown as Record<string, unknown>)
  },

  /**
   * 删除草稿
   */
  deleteDraft(id: string): Promise<{ ok: true }> {
    return request.delete<{ ok: true }>(`${BASE_PATH}/drafts/${id}`)
  },

  // --------------------------------------------------------------------------
  // Ingest Job (采集任务)
  // --------------------------------------------------------------------------

  /**
   * 获取草稿的采集任务列表
   */
  getDraftJobs(draftId: string): Promise<IngestJobDTO[]> {
    return request.get<IngestJobDTO[]>(`${BASE_PATH}/drafts/${draftId}/jobs`)
  },

  /**
   * 创建采集任务（触发解析/标准化/校验）
   */
  createJob(draftId: string, data: CreateJobPayload): Promise<IngestJobDTO> {
    return request.post<IngestJobDTO>(`${BASE_PATH}/drafts/${draftId}/jobs`, data as unknown as Record<string, unknown>)
  },

  // --------------------------------------------------------------------------
  // Issue (采集阶段问题)
  // --------------------------------------------------------------------------

  /**
   * 获取草稿的问题列表
   */
  getDraftIssues(draftId: string): Promise<CollectIssueDTO[]> {
    return request.get<CollectIssueDTO[]>(`${BASE_PATH}/drafts/${draftId}/issues`)
  },
}

export default collectApi
