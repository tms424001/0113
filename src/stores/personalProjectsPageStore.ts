// src/stores/personalProjectsPageStore.ts
// 我的项目页面状态管理

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProjectDTO, ProjectListParams, ProjectSource, ProjectStatus } from '@/types/project'
import { getMockProjectList, deleteMockProject, deleteMockProjects } from '@/mocks/projects'

/**
 * 筛选状态
 */
interface FilterState {
  keyword: string
  source: ProjectSource | ''
  status: ProjectStatus | ''
  uploadTimeRange: [string, string] | null
}

/**
 * 分页状态
 */
interface PaginationState {
  page: number
  pageSize: number
  total: number
}

/**
 * 我的项目页面状态
 */
interface PersonalProjectsPageState {
  // ===== 数据 =====
  /** 项目列表 */
  projects: ProjectDTO[]
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null

  // ===== 筛选 =====
  filter: FilterState

  // ===== 分页 =====
  pagination: PaginationState

  // ===== 选中 =====
  /** 选中的行 ID */
  selectedIds: string[]

  // ===== 抽屉 =====
  /** 抽屉是否打开 */
  drawerOpen: boolean
  /** 当前查看的项目 */
  currentProject: ProjectDTO | null

  // ===== Actions =====
  /** 加载项目列表 */
  fetchProjects: () => Promise<void>
  /** 设置筛选条件 */
  setFilter: (filter: Partial<FilterState>) => void
  /** 重置筛选条件 */
  resetFilter: () => void
  /** 设置分页 */
  setPagination: (pagination: Partial<PaginationState>) => void
  /** 设置选中行 */
  setSelectedIds: (ids: string[]) => void
  /** 打开抽屉 */
  openDrawer: (project: ProjectDTO) => void
  /** 关闭抽屉 */
  closeDrawer: () => void
  /** 删除单个项目 */
  deleteProject: (id: string) => Promise<boolean>
  /** 批量删除项目 */
  deleteSelectedProjects: () => Promise<number>
}

/**
 * 初始筛选状态
 */
const initialFilter: FilterState = {
  keyword: '',
  source: '',
  status: '',
  uploadTimeRange: null,
}

/**
 * 初始分页状态
 */
const initialPagination: PaginationState = {
  page: 1,
  pageSize: 20,
  total: 0,
}

/**
 * 我的项目页面 Store
 */
export const usePersonalProjectsPageStore = create<PersonalProjectsPageState>()(
  devtools(
    (set, get) => ({
      // ===== 初始状态 =====
      projects: [],
      loading: false,
      error: null,
      filter: { ...initialFilter },
      pagination: { ...initialPagination },
      selectedIds: [],
      drawerOpen: false,
      currentProject: null,

      // ===== Actions =====

      /**
       * 加载项目列表
       */
      fetchProjects: async () => {
        const { filter, pagination } = get()

        set({ loading: true, error: null })

        try {
          // 模拟网络延迟
          await new Promise((resolve) => setTimeout(resolve, 300))

          const params: ProjectListParams = {
            keyword: filter.keyword || undefined,
            source: filter.source || undefined,
            status: filter.status || undefined,
            uploadTimeRange: filter.uploadTimeRange || undefined,
            page: pagination.page,
            pageSize: pagination.pageSize,
          }

          const result = getMockProjectList(params)

          set({
            projects: result.items,
            pagination: {
              ...pagination,
              total: result.total,
            },
            loading: false,
            // 清空选中（分页后选中无效）
            selectedIds: [],
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '加载失败',
            loading: false,
          })
        }
      },

      /**
       * 设置筛选条件
       */
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
          // 筛选变化时重置到第一页
          pagination: { ...state.pagination, page: 1 },
        }))
        // 自动重新加载
        get().fetchProjects()
      },

      /**
       * 重置筛选条件
       */
      resetFilter: () => {
        set({
          filter: { ...initialFilter },
          pagination: { ...initialPagination },
        })
        get().fetchProjects()
      },

      /**
       * 设置分页
       */
      setPagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }))
        get().fetchProjects()
      },

      /**
       * 设置选中行
       */
      setSelectedIds: (ids) => {
        set({ selectedIds: ids })
      },

      /**
       * 打开抽屉
       */
      openDrawer: (project) => {
        set({ drawerOpen: true, currentProject: project })
      },

      /**
       * 关闭抽屉
       */
      closeDrawer: () => {
        set({ drawerOpen: false, currentProject: null })
      },

      /**
       * 删除单个项目
       */
      deleteProject: async (id) => {
        try {
          const success = deleteMockProject(id)
          if (success) {
            // 重新加载列表
            await get().fetchProjects()
          }
          return success
        } catch {
          return false
        }
      },

      /**
       * 批量删除项目
       */
      deleteSelectedProjects: async () => {
        const { selectedIds } = get()
        if (selectedIds.length === 0) return 0

        try {
          const deleted = deleteMockProjects(selectedIds)
          if (deleted > 0) {
            // 重新加载列表
            await get().fetchProjects()
          }
          return deleted
        } catch {
          return 0
        }
      },
    }),
    { name: 'personalProjectsPageStore' }
  )
)