// src/services/project.ts
// Project 模块 API 服务 - 严格按照 docs/api/schemas/Project.md
// 工程层级：项目 → 单项工程 → 单位工程 → 造价文件 → 材料/清单/指标

import { request } from './http'
import type {
  // Project
  ProjectDTO,
  ProjectListQuery,
  ProjectListResponse,
  CreateProjectPayload,
  UpdateProjectPayload,
  // SubProject
  SubProjectDTO,
  SubProjectListQuery,
  SubProjectListResponse,
  CreateSubProjectPayload,
  UpdateSubProjectPayload,
  // Unit
  UnitDTO,
  UnitListQuery,
  UnitListResponse,
  CreateUnitPayload,
  UpdateUnitPayload,
  // PricingFile
  PricingFileDTO,
  PricingFileListQuery,
  PricingFileListResponse,
  // Material
  MaterialDTO,
  MaterialListQuery,
  MaterialListResponse,
  // BOQItem
  BOQItemDTO,
  BOQItemListQuery,
  BOQItemListResponse,
  // Index
  IndexDTO,
  IndexListQuery,
  IndexListResponse,
} from '@/types/dto.project'

// ============================================================================
// Project API Service
// ============================================================================

export const projectApi = {
  // --------------------------------------------------------------------------
  // Project (项目)
  // --------------------------------------------------------------------------

  /**
   * 获取项目列表
   */
  getProjects(query: ProjectListQuery): Promise<ProjectListResponse> {
    return request.get<ProjectListResponse>('/api/projects', query as unknown as Record<string, unknown>)
  },

  /**
   * 获取项目详情
   */
  getProject(id: string): Promise<ProjectDTO> {
    return request.get<ProjectDTO>(`/api/projects/${id}`)
  },

  /**
   * 创建项目
   */
  createProject(data: CreateProjectPayload): Promise<ProjectDTO> {
    return request.post<ProjectDTO>('/api/projects', data as unknown as Record<string, unknown>)
  },

  /**
   * 更新项目
   */
  updateProject(id: string, data: UpdateProjectPayload): Promise<ProjectDTO> {
    return request.put<ProjectDTO>(`/api/projects/${id}`, data as unknown as Record<string, unknown>)
  },

  /**
   * 删除项目
   */
  deleteProject(id: string): Promise<{ ok: true }> {
    return request.delete<{ ok: true }>(`/api/projects/${id}`)
  },

  // --------------------------------------------------------------------------
  // SubProject (单项工程)
  // --------------------------------------------------------------------------

  /**
   * 获取单项工程列表
   */
  getSubProjects(projectId: string, query?: Omit<SubProjectListQuery, 'projectId'>): Promise<SubProjectListResponse> {
    return request.get<SubProjectListResponse>(
      `/api/projects/${projectId}/sub-projects`,
      { ...query, projectId } as unknown as Record<string, unknown>
    )
  },

  /**
   * 获取单项工程详情
   */
  getSubProject(id: string): Promise<SubProjectDTO> {
    return request.get<SubProjectDTO>(`/api/sub-projects/${id}`)
  },

  /**
   * 创建单项工程
   */
  createSubProject(projectId: string, data: CreateSubProjectPayload): Promise<SubProjectDTO> {
    return request.post<SubProjectDTO>(
      `/api/projects/${projectId}/sub-projects`,
      data as unknown as Record<string, unknown>
    )
  },

  /**
   * 更新单项工程
   */
  updateSubProject(id: string, data: UpdateSubProjectPayload): Promise<SubProjectDTO> {
    return request.put<SubProjectDTO>(`/api/sub-projects/${id}`, data as unknown as Record<string, unknown>)
  },

  /**
   * 删除单项工程
   */
  deleteSubProject(id: string): Promise<{ ok: true }> {
    return request.delete<{ ok: true }>(`/api/sub-projects/${id}`)
  },

  // --------------------------------------------------------------------------
  // Unit (单位工程)
  // --------------------------------------------------------------------------

  /**
   * 获取单位工程列表
   */
  getUnits(subProjectId: string, query?: Omit<UnitListQuery, 'subProjectId'>): Promise<UnitListResponse> {
    return request.get<UnitListResponse>(
      `/api/sub-projects/${subProjectId}/units`,
      { ...query, subProjectId } as unknown as Record<string, unknown>
    )
  },

  /**
   * 获取单位工程详情
   */
  getUnit(id: string): Promise<UnitDTO> {
    return request.get<UnitDTO>(`/api/units/${id}`)
  },

  /**
   * 创建单位工程
   */
  createUnit(subProjectId: string, data: CreateUnitPayload): Promise<UnitDTO> {
    return request.post<UnitDTO>(
      `/api/sub-projects/${subProjectId}/units`,
      data as unknown as Record<string, unknown>
    )
  },

  /**
   * 更新单位工程
   */
  updateUnit(id: string, data: UpdateUnitPayload): Promise<UnitDTO> {
    return request.put<UnitDTO>(`/api/units/${id}`, data as unknown as Record<string, unknown>)
  },

  /**
   * 删除单位工程
   */
  deleteUnit(id: string): Promise<{ ok: true }> {
    return request.delete<{ ok: true }>(`/api/units/${id}`)
  },

  // --------------------------------------------------------------------------
  // PricingFile (造价文件)
  // --------------------------------------------------------------------------

  /**
   * 获取造价文件列表
   */
  getPricingFiles(query: PricingFileListQuery): Promise<PricingFileListResponse> {
    return request.get<PricingFileListResponse>('/api/pricing-files', query as unknown as Record<string, unknown>)
  },

  /**
   * 获取造价文件详情
   */
  getPricingFile(id: string): Promise<PricingFileDTO> {
    return request.get<PricingFileDTO>(`/api/pricing-files/${id}`)
  },

  /**
   * 上传造价文件到单位工程
   */
  uploadPricingFile(unitId: string, file: File): Promise<PricingFileDTO> {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<PricingFileDTO>(`/api/units/${unitId}/pricing-files`, formData as unknown as Record<string, unknown>)
  },

  /**
   * 触发造价文件标准化分析
   */
  standardizePricingFile(id: string): Promise<PricingFileDTO> {
    return request.post<PricingFileDTO>(`/api/pricing-files/${id}/standardize`)
  },

  // --------------------------------------------------------------------------
  // Material (材料)
  // --------------------------------------------------------------------------

  /**
   * 获取材料列表
   */
  getMaterials(query: MaterialListQuery): Promise<MaterialListResponse> {
    return request.get<MaterialListResponse>('/api/materials', query as unknown as Record<string, unknown>)
  },

  /**
   * 获取材料详情
   */
  getMaterial(id: string): Promise<MaterialDTO> {
    return request.get<MaterialDTO>(`/api/materials/${id}`)
  },

  // --------------------------------------------------------------------------
  // BOQItem (清单项)
  // --------------------------------------------------------------------------

  /**
   * 获取清单列表
   */
  getBOQItems(query: BOQItemListQuery): Promise<BOQItemListResponse> {
    return request.get<BOQItemListResponse>('/api/boq-items', query as unknown as Record<string, unknown>)
  },

  /**
   * 获取清单详情
   */
  getBOQItem(id: string): Promise<BOQItemDTO> {
    return request.get<BOQItemDTO>(`/api/boq-items/${id}`)
  },

  // --------------------------------------------------------------------------
  // Index (指标)
  // --------------------------------------------------------------------------

  /**
   * 获取指标列表
   */
  getIndices(query: IndexListQuery): Promise<IndexListResponse> {
    return request.get<IndexListResponse>('/api/indices', query as unknown as Record<string, unknown>)
  },

  /**
   * 获取指标详情
   */
  getIndex(id: string): Promise<IndexDTO> {
    return request.get<IndexDTO>(`/api/indices/${id}`)
  },
}

export default projectApi
