// src/services/pr.ts
// PR (Pull Request) 模块 API 服务 - 严格按照 docs/api/schemas/pr.md
// 个人数据 → PR流程 → 企业数据库

import { request } from './http'
import type {
  PullRequestDTO,
  PRListQuery,
  PRListResponse,
  CreatePRPayload,
  UpdatePRPayload,
  PRReviewRecordDTO,
  ReviewPayload,
  PRCommentDTO,
  CreateCommentPayload,
  ValidationResult,
} from '@/types/dto.pr'

// ============================================================================
// API 路径常量
// ============================================================================

const BASE_PATH = '/api/prs'

// ============================================================================
// PR API Service
// ============================================================================

export const prApi = {
  // --------------------------------------------------------------------------
  // PR CRUD
  // --------------------------------------------------------------------------

  /**
   * 获取 PR 列表
   */
  getPRs(query: PRListQuery): Promise<PRListResponse> {
    return request.get<PRListResponse>(BASE_PATH, query as unknown as Record<string, unknown>)
  },

  /**
   * 获取 PR 详情
   */
  getPR(id: string): Promise<PullRequestDTO> {
    return request.get<PullRequestDTO>(`${BASE_PATH}/${id}`)
  },

  /**
   * 创建 PR（草稿）
   */
  createPR(data: CreatePRPayload): Promise<PullRequestDTO> {
    return request.post<PullRequestDTO>(BASE_PATH, data as unknown as Record<string, unknown>)
  },

  /**
   * 更新 PR
   */
  updatePR(id: string, data: UpdatePRPayload): Promise<PullRequestDTO> {
    return request.put<PullRequestDTO>(`${BASE_PATH}/${id}`, data as unknown as Record<string, unknown>)
  },

  /**
   * 删除 PR（仅草稿可删）
   */
  deletePR(id: string): Promise<{ ok: true }> {
    return request.delete<{ ok: true }>(`${BASE_PATH}/${id}`)
  },

  // --------------------------------------------------------------------------
  // PR Actions
  // --------------------------------------------------------------------------

  /**
   * 提交审核
   */
  submitPR(id: string): Promise<PullRequestDTO> {
    return request.post<PullRequestDTO>(`${BASE_PATH}/${id}/submit`)
  },

  /**
   * 审批（通过/驳回/要求修改）
   */
  reviewPR(id: string, data: ReviewPayload): Promise<PullRequestDTO> {
    return request.post<PullRequestDTO>(`${BASE_PATH}/${id}/review`, data as unknown as Record<string, unknown>)
  },

  /**
   * 入库（审批通过后）
   */
  mergePR(id: string): Promise<PullRequestDTO> {
    return request.post<PullRequestDTO>(`${BASE_PATH}/${id}/merge`)
  },

  /**
   * 撤回（仅待审核可撤）
   */
  withdrawPR(id: string): Promise<PullRequestDTO> {
    return request.post<PullRequestDTO>(`${BASE_PATH}/${id}/withdraw`)
  },

  /**
   * 触发校核
   */
  validatePR(id: string): Promise<ValidationResult> {
    return request.post<ValidationResult>(`${BASE_PATH}/${id}/validate`)
  },

  // --------------------------------------------------------------------------
  // PR Related
  // --------------------------------------------------------------------------

  /**
   * 获取审批记录列表
   */
  getReviews(prId: string): Promise<PRReviewRecordDTO[]> {
    return request.get<PRReviewRecordDTO[]>(`${BASE_PATH}/${prId}/reviews`)
  },

  /**
   * 获取评论列表
   */
  getComments(prId: string): Promise<PRCommentDTO[]> {
    return request.get<PRCommentDTO[]>(`${BASE_PATH}/${prId}/comments`)
  },

  /**
   * 添加评论
   */
  addComment(prId: string, data: CreateCommentPayload): Promise<PRCommentDTO> {
    return request.post<PRCommentDTO>(`${BASE_PATH}/${prId}/comments`, data as unknown as Record<string, unknown>)
  },

  /**
   * 获取数据差异对比
   */
  getDiff(prId: string): Promise<Record<string, unknown>> {
    return request.get<Record<string, unknown>>(`${BASE_PATH}/${prId}/diff`)
  },
}

export default prApi
