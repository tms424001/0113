// src/stores/prListPageStore.ts
// PR 列表页面状态管理

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PRDTO, PRStatus, PRListParams } from '@/types/pr'
import { getMockPRList, withdrawMockPR, deleteMockPR, reviewMockPR } from '@/mocks/prs'

/**
 * Tab 类型
 */
type TabType = 'my' | 'pending'

/**
 * 筛选状态
 */
interface FilterState {
  keyword: string
  status: PRStatus | ''
  timeRange: [string, string] | null
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
 * PR 列表页面状态
 */
interface PRListPageState {
  // ===== Tab =====
  /** 当前 Tab */
  activeTab: TabType

  // ===== 数据 =====
  /** PR 列表 */
  prs: PRDTO[]
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

  // ===== Actions =====
  /** 切换 Tab */
  setActiveTab: (tab: TabType) => void
  /** 加载 PR 列表 */
  fetchPRs: () => Promise<void>
  /** 设置筛选条件 */
  setFilter: (filter: Partial<FilterState>) => void
  /** 重置筛选条件 */
  resetFilter: () => void
  /** 设置分页 */
  setPagination: (pagination: Partial<PaginationState>) => void
  /** 设置选中行 */
  setSelectedIds: (ids: string[]) => void
  /** 撤回 PR */
  withdrawPR: (id: string) => Promise<boolean>
  /** 删除 PR */
  deletePR: (id: string) => Promise<boolean>
  /** 审批 PR */
  reviewPR: (id: string, action: 'approve' | 'reject' | 'return', comment?: string) => Promise<boolean>
}

/**
 * 初始筛选状态
 */
const initialFilter: FilterState = {
  keyword: '',
  status: '',
  timeRange: null,
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
 * PR 列表页面 Store
 */
export const usePRListPageStore = create<PRListPageState>()(
  devtools(
    (set, get) => ({
      // ===== 初始状态 =====
      activeTab: 'my',
      prs: [],
      loading: false,
      error: null,
      filter: { ...initialFilter },
      pagination: { ...initialPagination },
      selectedIds: [],

      // ===== Actions =====

      /**
       * 切换 Tab
       */
      setActiveTab: (tab) => {
        set({
          activeTab: tab,
          filter: { ...initialFilter },
          pagination: { ...initialPagination },
          selectedIds: [],
        })
        get().fetchPRs()
      },

      /**
       * 加载 PR 列表
       */
      fetchPRs: async () => {
        const { activeTab, filter, pagination } = get()

        set({ loading: true, error: null })

        try {
          // 模拟网络延迟
          await new Promise((resolve) => setTimeout(resolve, 300))

          const params: PRListParams = {
            tab: activeTab,
            keyword: filter.keyword || undefined,
            status: filter.status || undefined,
            timeRange: filter.timeRange || undefined,
            page: pagination.page,
            pageSize: pagination.pageSize,
          }

          const result = getMockPRList(params)

          set({
            prs: result.items,
            pagination: {
              ...pagination,
              total: result.total,
            },
            loading: false,
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
          pagination: { ...state.pagination, page: 1 },
        }))
        get().fetchPRs()
      },

      /**
       * 重置筛选条件
       */
      resetFilter: () => {
        set({
          filter: { ...initialFilter },
          pagination: { ...initialPagination },
        })
        get().fetchPRs()
      },

      /**
       * 设置分页
       */
      setPagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }))
        get().fetchPRs()
      },

      /**
       * 设置选中行
       */
      setSelectedIds: (ids) => {
        set({ selectedIds: ids })
      },

      /**
       * 撤回 PR
       */
      withdrawPR: async (id) => {
        try {
          const success = withdrawMockPR(id)
          if (success) {
            await get().fetchPRs()
          }
          return success
        } catch {
          return false
        }
      },

      /**
       * 删除 PR
       */
      deletePR: async (id) => {
        try {
          const success = deleteMockPR(id)
          if (success) {
            await get().fetchPRs()
          }
          return success
        } catch {
          return false
        }
      },

      /**
       * 审批 PR
       */
      reviewPR: async (id, action, comment) => {
        try {
          const success = reviewMockPR(id, action, comment)
          if (success) {
            await get().fetchPRs()
          }
          return success
        } catch {
          return false
        }
      },
    }),
    { name: 'prListPageStore' }
  )
)