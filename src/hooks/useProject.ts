// src/hooks/useProject.ts
// Project 模块数据获取 Hooks
// 工程层级：项目 → 单项工程 → 单位工程 → 造价文件 → 材料/清单/指标

import { useCallback } from 'react'
import { useList, useDetail, useRequest } from './useRequest'
import { projectApi } from '@/services/project'
import type {
  // Project
  ProjectDTO,
  ProjectListQuery,
  CreateProjectPayload,
  UpdateProjectPayload,
  // SubProject
  SubProjectDTO,
  SubProjectListQuery,
  CreateSubProjectPayload,
  UpdateSubProjectPayload,
  // Unit
  UnitDTO,
  UnitListQuery,
  CreateUnitPayload,
  UpdateUnitPayload,
  // PricingFile
  PricingFileDTO,
  PricingFileListQuery,
  // Material
  MaterialDTO,
  MaterialListQuery,
  // BOQItem
  BOQItemDTO,
  BOQItemListQuery,
  // Index
  IndexDTO,
  IndexListQuery,
} from '@/types/dto.project'

// ============================================================================
// useProjectList - 项目列表
// ============================================================================

export interface UseProjectListOptions {
  defaultQuery?: Partial<ProjectListQuery>
  onSuccess?: (data: { items: ProjectDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 项目列表 Hook
 */
export function useProjectList(options: UseProjectListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<ProjectDTO, ProjectListQuery>(projectApi.getProjects, {
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
// useProjectDetail - 项目详情
// ============================================================================

/**
 * 项目详情 Hook
 */
export function useProjectDetail(options: {
  onSuccess?: (data: ProjectDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<ProjectDTO>(projectApi.getProject, options)
}

// ============================================================================
// useProjectMutation - 项目增删改
// ============================================================================

/**
 * 项目增删改 Hook
 */
export function useProjectMutation(options: {
  onSuccess?: () => void
  onError?: (error: unknown) => void
} = {}) {
  const { onSuccess, onError } = options

  const createRequest = useRequest(projectApi.createProject, { onSuccess, onError })
  const updateRequest = useRequest(projectApi.updateProject, { onSuccess, onError })
  const deleteRequest = useRequest(projectApi.deleteProject, { onSuccess, onError })

  const create = useCallback(
    (data: CreateProjectPayload) => createRequest.run(data),
    [createRequest]
  )

  const update = useCallback(
    (id: string, data: UpdateProjectPayload) => updateRequest.run(id, data),
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
// useSubProjectList - 单项工程列表
// ============================================================================

export interface UseSubProjectListOptions {
  projectId: string
  defaultQuery?: Partial<Omit<SubProjectListQuery, 'projectId'>>
  onSuccess?: (data: { items: SubProjectDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 单项工程列表 Hook
 */
export function useSubProjectList(options: UseSubProjectListOptions) {
  const { projectId, defaultQuery = {}, onSuccess, onError } = options

  const fetchFn = useCallback(
    (query: SubProjectListQuery) => projectApi.getSubProjects(projectId, query),
    [projectId]
  )

  return useList<SubProjectDTO, SubProjectListQuery>(fetchFn, {
    defaultQuery: {
      projectId,
      page: 1,
      pageSize: 50,
      ...defaultQuery,
    },
    onSuccess,
    onError,
  })
}

// ============================================================================
// useSubProjectDetail - 单项工程详情
// ============================================================================

/**
 * 单项工程详情 Hook
 */
export function useSubProjectDetail(options: {
  onSuccess?: (data: SubProjectDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<SubProjectDTO>(projectApi.getSubProject, options)
}

// ============================================================================
// useSubProjectMutation - 单项工程增删改
// ============================================================================

/**
 * 单项工程增删改 Hook
 */
export function useSubProjectMutation(options: {
  projectId: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
}) {
  const { projectId, onSuccess, onError } = options

  const createFn = useCallback(
    (data: CreateSubProjectPayload) => projectApi.createSubProject(projectId, data),
    [projectId]
  )

  const createRequest = useRequest(createFn, { onSuccess, onError })
  const updateRequest = useRequest(projectApi.updateSubProject, { onSuccess, onError })
  const deleteRequest = useRequest(projectApi.deleteSubProject, { onSuccess, onError })

  const create = useCallback(
    (data: CreateSubProjectPayload) => createRequest.run(data),
    [createRequest]
  )

  const update = useCallback(
    (id: string, data: UpdateSubProjectPayload) => updateRequest.run(id, data),
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
  }
}

// ============================================================================
// useUnitList - 单位工程列表
// ============================================================================

export interface UseUnitListOptions {
  subProjectId: string
  defaultQuery?: Partial<Omit<UnitListQuery, 'subProjectId'>>
  onSuccess?: (data: { items: UnitDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 单位工程列表 Hook
 */
export function useUnitList(options: UseUnitListOptions) {
  const { subProjectId, defaultQuery = {}, onSuccess, onError } = options

  const fetchFn = useCallback(
    (query: UnitListQuery) => projectApi.getUnits(subProjectId, query),
    [subProjectId]
  )

  return useList<UnitDTO, UnitListQuery>(fetchFn, {
    defaultQuery: {
      subProjectId,
      page: 1,
      pageSize: 50,
      ...defaultQuery,
    },
    onSuccess,
    onError,
  })
}

// ============================================================================
// useUnitDetail - 单位工程详情
// ============================================================================

/**
 * 单位工程详情 Hook
 */
export function useUnitDetail(options: {
  onSuccess?: (data: UnitDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<UnitDTO>(projectApi.getUnit, options)
}

// ============================================================================
// useUnitMutation - 单位工程增删改
// ============================================================================

/**
 * 单位工程增删改 Hook
 */
export function useUnitMutation(options: {
  subProjectId: string
  onSuccess?: () => void
  onError?: (error: unknown) => void
}) {
  const { subProjectId, onSuccess, onError } = options

  const createFn = useCallback(
    (data: CreateUnitPayload) => projectApi.createUnit(subProjectId, data),
    [subProjectId]
  )

  const createRequest = useRequest(createFn, { onSuccess, onError })
  const updateRequest = useRequest(projectApi.updateUnit, { onSuccess, onError })
  const deleteRequest = useRequest(projectApi.deleteUnit, { onSuccess, onError })

  const create = useCallback(
    (data: CreateUnitPayload) => createRequest.run(data),
    [createRequest]
  )

  const update = useCallback(
    (id: string, data: UpdateUnitPayload) => updateRequest.run(id, data),
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
  }
}

// ============================================================================
// usePricingFileList - 造价文件列表
// ============================================================================

export interface UsePricingFileListOptions {
  defaultQuery?: Partial<PricingFileListQuery>
  onSuccess?: (data: { items: PricingFileDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 造价文件列表 Hook
 */
export function usePricingFileList(options: UsePricingFileListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<PricingFileDTO, PricingFileListQuery>(projectApi.getPricingFiles, {
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
// usePricingFileDetail - 造价文件详情
// ============================================================================

/**
 * 造价文件详情 Hook
 */
export function usePricingFileDetail(options: {
  onSuccess?: (data: PricingFileDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<PricingFileDTO>(projectApi.getPricingFile, options)
}

// ============================================================================
// useMaterialList - 材料列表
// ============================================================================

export interface UseMaterialListOptions {
  defaultQuery?: Partial<MaterialListQuery>
  onSuccess?: (data: { items: MaterialDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 材料列表 Hook
 */
export function useMaterialList(options: UseMaterialListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<MaterialDTO, MaterialListQuery>(projectApi.getMaterials, {
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
// useMaterialDetail - 材料详情
// ============================================================================

/**
 * 材料详情 Hook
 */
export function useMaterialDetail(options: {
  onSuccess?: (data: MaterialDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<MaterialDTO>(projectApi.getMaterial, options)
}

// ============================================================================
// useBOQItemList - 清单列表
// ============================================================================

export interface UseBOQItemListOptions {
  defaultQuery?: Partial<BOQItemListQuery>
  onSuccess?: (data: { items: BOQItemDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 清单列表 Hook
 */
export function useBOQItemList(options: UseBOQItemListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<BOQItemDTO, BOQItemListQuery>(projectApi.getBOQItems, {
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
// useBOQItemDetail - 清单详情
// ============================================================================

/**
 * 清单详情 Hook
 */
export function useBOQItemDetail(options: {
  onSuccess?: (data: BOQItemDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<BOQItemDTO>(projectApi.getBOQItem, options)
}

// ============================================================================
// useIndexList - 指标列表
// ============================================================================

export interface UseIndexListOptions {
  defaultQuery?: Partial<IndexListQuery>
  onSuccess?: (data: { items: IndexDTO[]; total: number }) => void
  onError?: (error: unknown) => void
}

/**
 * 指标列表 Hook
 */
export function useIndexList(options: UseIndexListOptions = {}) {
  const { defaultQuery = {}, onSuccess, onError } = options

  return useList<IndexDTO, IndexListQuery>(projectApi.getIndices, {
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
// useIndexDetail - 指标详情
// ============================================================================

/**
 * 指标详情 Hook
 */
export function useIndexDetail(options: {
  onSuccess?: (data: IndexDTO) => void
  onError?: (error: unknown) => void
} = {}) {
  return useDetail<IndexDTO>(projectApi.getIndex, options)
}
