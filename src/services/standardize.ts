// src/services/standardize.ts
// 标准化分析模块 API 服务

import { request } from './http'
import type {
  ProjectTreeResponse,
  TabDataQuery,
  OriginalDataResponse,
  EconomicIndexResponse,
  QuantityIndexResponse,
  MaterialIndexResponse,
  StartAnalyzePayload,
  StartAnalyzeResponse,
  AnalyzeStatusResponse,
} from '@/types/dto.standardize'

const BASE_URL = '/api/pricing-files'

// ============================================================================
// 工程列表树
// ============================================================================

/**
 * 获取工程列表树（左侧）
 */
export function getProjectTree(fileId: string): Promise<ProjectTreeResponse> {
  return request.get<ProjectTreeResponse>(`${BASE_URL}/${fileId}/project-tree`)
}

// ============================================================================
// Tab 数据
// ============================================================================

/**
 * 获取原样预览数据
 */
export function getOriginalData(
  fileId: string,
  query?: TabDataQuery
): Promise<OriginalDataResponse> {
  return request.get<OriginalDataResponse>(`${BASE_URL}/${fileId}/original`, query as Record<string, unknown>)
}

/**
 * 获取工程经济指标数据
 */
export function getEconomicIndices(
  fileId: string,
  query?: TabDataQuery
): Promise<EconomicIndexResponse> {
  return request.get<EconomicIndexResponse>(`${BASE_URL}/${fileId}/economic-indices`, query as Record<string, unknown>)
}

/**
 * 获取主要工程量指标数据
 */
export function getQuantityIndices(
  fileId: string,
  query?: TabDataQuery
): Promise<QuantityIndexResponse> {
  return request.get<QuantityIndexResponse>(`${BASE_URL}/${fileId}/quantity-indices`, query as Record<string, unknown>)
}

/**
 * 获取工料机指标数据
 */
export function getMaterialIndices(
  fileId: string,
  query?: TabDataQuery
): Promise<MaterialIndexResponse> {
  return request.get<MaterialIndexResponse>(`${BASE_URL}/${fileId}/material-indices`, query as Record<string, unknown>)
}

// ============================================================================
// 分析任务
// ============================================================================

/**
 * 开始分析
 */
export function startAnalyze(
  fileId: string,
  payload: StartAnalyzePayload
): Promise<StartAnalyzeResponse> {
  return request.post<StartAnalyzeResponse>(`${BASE_URL}/${fileId}/analyze`, payload as unknown as Record<string, unknown>)
}

/**
 * 查询分析状态
 */
export function getAnalyzeStatus(fileId: string): Promise<AnalyzeStatusResponse> {
  return request.get<AnalyzeStatusResponse>(`${BASE_URL}/${fileId}/analyze-status`)
}

// ============================================================================
// 导出
// ============================================================================

/**
 * 导出 Excel
 */
export function exportExcel(
  fileId: string,
  tabKey: string,
  query?: TabDataQuery
): Promise<Blob> {
  // 返回 Blob 用于下载
  return request.get<Blob>(`${BASE_URL}/${fileId}/export/${tabKey}`, {
    ...query,
    responseType: 'blob',
  } as Record<string, unknown>)
}

// ============================================================================
// 统一导出
// ============================================================================

export const standardizeApi = {
  getProjectTree,
  getOriginalData,
  getEconomicIndices,
  getQuantityIndices,
  getMaterialIndices,
  startAnalyze,
  getAnalyzeStatus,
  exportExcel,
}

export default standardizeApi
