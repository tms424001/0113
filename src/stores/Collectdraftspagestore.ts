// src/stores/collectDraftsPageStore.ts
// 草稿库页面状态管理

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DraftDTO, DraftListParams, DraftSource, DraftStatus } from '@/types/draft'
import { getMockDraftList, deleteMockDraft, deleteMockDrafts } from '@/mocks/Drafts'

/**
 * 筛选状态
 */
interface FilterState {
  keyword: string
  source: DraftSource | ''
  status: DraftStatus | ''
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
 * 草稿库页面状态
 */
interface CollectDraftsPageState {
  // ===== 数据 =====
  /** 草稿列表 */
  drafts: DraftDTO[]
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
  /** 当前查看的草稿 */
  currentDraft: DraftDTO | null

  // ===== Actions =====
  /** 加载草稿列表 */
  fetchDrafts: () => Promise<void>
  /** 设置筛选条件 */
  setFilter: (filter: Partial<FilterState>) => void
  /** 重置筛选条件 */
  resetFilter: () => void
  /** 设置分页 */
  setPagination: (pagination: Partial<PaginationState>) => void
  /** 设置选中行 */
  setSelectedIds: (ids: string[]) => void
  /** 打开抽屉 */
  openDrawer: (draft: DraftDTO) => void
  /** 关闭抽屉 */
  closeDrawer: () => void
  /** 删除单个草稿 */
  deleteDraft: (id: string) => Promise<boolean>
  /** 批量删除草稿 */
  deleteSelectedDrafts: () => Promise<number>
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
 * 草稿库页面 Store
 */
export const useCollectDraftsPageStore = create<CollectDraftsPageState>()(
  devtools(
    (set, get) => ({
      // ===== 初始状态 =====
      drafts: [],
      loading: false,
      error: null,
      filter: { ...initialFilter },
      pagination: { ...initialPagination },
      selectedIds: [],
      drawerOpen: false,
      currentDraft: null,

      // ===== Actions =====

      /**
       * 加载草稿列表
       */
      fetchDrafts: async () => {
        const { filter, pagination } = get()

        set({ loading: true, error: null })

        try {
          // 模拟网络延迟
          await new Promise((resolve) => setTimeout(resolve, 300))

          const params: DraftListParams = {
            keyword: filter.keyword || undefined,
            source: filter.source || undefined,
            status: filter.status || undefined,
            uploadTimeRange: filter.uploadTimeRange || undefined,
            page: pagination.page,
            pageSize: pagination.pageSize,
          }

          const result = getMockDraftList(params)

          set({
            drafts: result.items,
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
        get().fetchDrafts()
      },

      /**
       * 重置筛选条件
       */
      resetFilter: () => {
        set({
          filter: { ...initialFilter },
          pagination: { ...initialPagination },
        })
        get().fetchDrafts()
      },

      /**
       * 设置分页
       */
      setPagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }))
        get().fetchDrafts()
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
      openDrawer: (draft) => {
        set({ drawerOpen: true, currentDraft: draft })
      },

      /**
       * 关闭抽屉
       */
      closeDrawer: () => {
        set({ drawerOpen: false, currentDraft: null })
      },

      /**
       * 删除单个草稿
       */
      deleteDraft: async (id) => {
        try {
          const success = deleteMockDraft(id)
          if (success) {
            // 重新加载列表
            await get().fetchDrafts()
          }
          return success
        } catch {
          return false
        }
      },

      /**
       * 批量删除草稿
       */
      deleteSelectedDrafts: async () => {
        const { selectedIds } = get()
        if (selectedIds.length === 0) return 0

        try {
          const deleted = deleteMockDrafts(selectedIds)
          if (deleted > 0) {
            // 重新加载列表
            await get().fetchDrafts()
          }
          return deleted
        } catch {
          return 0
        }
      },
    }),
    { name: 'collectDraftsPageStore' }
  )
)