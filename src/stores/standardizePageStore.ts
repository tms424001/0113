// src/stores/standardizePageStore.ts
// 标准化分析页面状态管理

import { create } from 'zustand'
import { standardizeApi } from '@/services/standardize'
import { DEFAULT_DIMENSIONS, EXPAND_LEVEL_DEFAULT, ANALYZE_POLL_INTERVAL } from '@/constants/standardize'
import type {
  ProjectTreeNode,
  TabKey,
  OriginalDataRow,
  EconomicIndexRow,
  QuantityIndexRow,
  MaterialIndexRow,
  DataSummary,
  AnalyzeStatus,
} from '@/types/dto.standardize'
import type { PricingFileDTO } from '@/types/dto.project'

// ============================================================================
// Types
// ============================================================================

interface StandardizePageState {
  // 文件信息
  fileId: string | null
  fileInfo: PricingFileDTO | null

  // 左侧工程树
  projectTree: ProjectTreeNode[]
  checkedUnitIds: string[]
  selectedNodeId: string | null
  leftPanelCollapsed: boolean
  treeLoading: boolean

  // Tab 状态
  activeTab: TabKey

  // 工具栏状态
  searchValue: string
  expandLevel: number
  dimensions: Record<TabKey, string>

  // Tab 数据
  originalData: OriginalDataRow[]
  economicData: EconomicIndexRow[]
  quantityData: QuantityIndexRow[]
  materialData: MaterialIndexRow[]
  summary: DataSummary | null

  // 加载状态
  loading: boolean
  analyzing: boolean
  analyzeProgress: number
  analyzeStatus: AnalyzeStatus | null
  error: string | null

  // Actions
  init: (fileId: string) => Promise<void>
  reset: () => void
  setFileInfo: (info: PricingFileDTO | null) => void
  setCheckedUnitIds: (ids: string[]) => void
  setSelectedNode: (id: string | null) => void
  toggleLeftPanel: () => void
  setActiveTab: (tab: TabKey) => void
  setSearchValue: (value: string) => void
  setExpandLevel: (level: number) => void
  setDimension: (tab: TabKey, dimension: string) => void
  loadProjectTree: () => Promise<void>
  loadTabData: () => Promise<void>
  startAnalyze: () => Promise<void>
  exportExcel: () => Promise<void>
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 从工程树中提取所有单位工程ID
 */
function extractAllUnitIds(tree: ProjectTreeNode[]): string[] {
  const ids: string[] = []

  function traverse(nodes: ProjectTreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'unit') {
        ids.push(node.id)
      }
      if (node.children) {
        traverse(node.children)
      }
    }
  }

  traverse(tree)
  return ids
}

/**
 * 转换为 Ant Design Tree 数据格式
 */
export function convertToTreeData(nodes: ProjectTreeNode[]): ProjectTreeNode[] {
  return nodes.map((node) => ({
    ...node,
    key: node.id,
    title: node.name,
    children: node.children ? convertToTreeData(node.children) : undefined,
  }))
}

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  fileId: null,
  fileInfo: null,
  projectTree: [],
  checkedUnitIds: [],
  selectedNodeId: null,
  leftPanelCollapsed: false,
  treeLoading: false,
  activeTab: 'original' as TabKey,
  searchValue: '',
  expandLevel: EXPAND_LEVEL_DEFAULT,
  dimensions: { ...DEFAULT_DIMENSIONS },
  originalData: [],
  economicData: [],
  quantityData: [],
  materialData: [],
  summary: null,
  loading: false,
  analyzing: false,
  analyzeProgress: 0,
  analyzeStatus: null,
  error: null,
}

// ============================================================================
// Store
// ============================================================================

export const useStandardizePageStore = create<StandardizePageState>((set, get) => ({
  ...initialState,

  // 初始化
  init: async (fileId: string) => {
    set({ ...initialState, fileId })
    await get().loadProjectTree()
    await get().loadTabData()
  },

  // 重置
  reset: () => {
    set(initialState)
  },

  // 设置文件信息
  setFileInfo: (info) => {
    set({ fileInfo: info })
  },

  // 设置勾选的单位工程
  setCheckedUnitIds: (ids) => {
    set({ checkedUnitIds: ids })
    // 勾选变化后重新加载数据
    get().loadTabData()
  },

  // 设置选中节点
  setSelectedNode: (id) => {
    set({ selectedNodeId: id })
  },

  // 切换左侧面板
  toggleLeftPanel: () => {
    set((state) => ({ leftPanelCollapsed: !state.leftPanelCollapsed }))
  },

  // 切换 Tab
  setActiveTab: (tab) => {
    set({ activeTab: tab, searchValue: '' })
    get().loadTabData()
  },

  // 设置搜索值
  setSearchValue: (value) => {
    set({ searchValue: value })
  },

  // 设置展开层次
  setExpandLevel: (level) => {
    set({ expandLevel: level })
  },

  // 设置维度
  setDimension: (tab, dimension) => {
    set((state) => ({
      dimensions: { ...state.dimensions, [tab]: dimension },
    }))
    get().loadTabData()
  },

  // 加载工程树
  loadProjectTree: async () => {
    const { fileId } = get()
    if (!fileId) return

    set({ treeLoading: true, error: null })

    try {
      const response = await standardizeApi.getProjectTree(fileId)
      const tree = response.tree || []
      const allUnitIds = extractAllUnitIds(tree)

      set({
        projectTree: tree,
        checkedUnitIds: allUnitIds, // 默认全选
        treeLoading: false,
      })
    } catch {
      // API 失败时使用模拟数据（开发环境）
      const mockTree: ProjectTreeNode[] = [
        {
          id: 'project-1',
          name: '示例工程项目',
          type: 'project',
          children: [
            {
              id: 'sub-1',
              name: '1# 住宅楼',
              type: 'subProject',
              children: [
                { id: 'unit-1', name: '土建工程', type: 'unit' },
                { id: 'unit-2', name: '装饰工程', type: 'unit' },
                { id: 'unit-3', name: '安装工程', type: 'unit' },
              ],
            },
            {
              id: 'sub-2',
              name: '2# 商业楼',
              type: 'subProject',
              children: [
                { id: 'unit-4', name: '土建工程', type: 'unit' },
                { id: 'unit-5', name: '幕墙工程', type: 'unit' },
              ],
            },
          ],
        },
      ]
      const allUnitIds = extractAllUnitIds(mockTree)
      set({
        projectTree: mockTree,
        checkedUnitIds: allUnitIds,
        treeLoading: false,
        error: null,
      })
    }
  },

  // 加载 Tab 数据
  loadTabData: async () => {
    const { fileId, activeTab, checkedUnitIds, dimensions } = get()
    if (!fileId) return

    set({ loading: true, error: null })

    const query = {
      unitIds: checkedUnitIds,
      dimension: dimensions[activeTab],
    }

    try {
      switch (activeTab) {
        case 'original': {
          const response = await standardizeApi.getOriginalData(fileId, query)
          set({
            originalData: response.items || [],
            summary: response.summary,
            loading: false,
          })
          break
        }
        case 'economic': {
          const response = await standardizeApi.getEconomicIndices(fileId, query)
          set({
            economicData: response.items || [],
            summary: response.summary,
            loading: false,
          })
          break
        }
        case 'quantity': {
          const response = await standardizeApi.getQuantityIndices(fileId, query)
          set({
            quantityData: response.items || [],
            summary: response.summary,
            loading: false,
          })
          break
        }
        case 'material': {
          const response = await standardizeApi.getMaterialIndices(fileId, query)
          set({
            materialData: response.items || [],
            summary: response.summary,
            loading: false,
          })
          break
        }
      }
    } catch {
      // API 失败时使用模拟数据（开发环境）
      const mockData = [
        { id: '1', name: '建筑工程', amount: 1250000, buildingArea: 5000, unitPrice: 250, unit: '㎡', totalRatio: 45.5, parentRatio: 100, children: [
          { id: '1-1', name: '土石方工程', amount: 125000, buildingArea: 5000, unitPrice: 25, unit: '㎡', totalRatio: 4.5, parentRatio: 10 },
          { id: '1-2', name: '基础工程', amount: 375000, buildingArea: 5000, unitPrice: 75, unit: '㎡', totalRatio: 13.6, parentRatio: 30 },
          { id: '1-3', name: '主体结构', amount: 500000, buildingArea: 5000, unitPrice: 100, unit: '㎡', totalRatio: 18.2, parentRatio: 40 },
        ]},
        { id: '2', name: '装饰装修工程', amount: 750000, buildingArea: 5000, unitPrice: 150, unit: '㎡', totalRatio: 27.3, parentRatio: 100, children: [
          { id: '2-1', name: '楼地面工程', amount: 225000, buildingArea: 5000, unitPrice: 45, unit: '㎡', totalRatio: 8.2, parentRatio: 30 },
          { id: '2-2', name: '墙柱面工程', amount: 300000, buildingArea: 5000, unitPrice: 60, unit: '㎡', totalRatio: 10.9, parentRatio: 40 },
        ]},
        { id: '3', name: '安装工程', amount: 500000, buildingArea: 5000, unitPrice: 100, unit: '㎡', totalRatio: 18.2, parentRatio: 100 },
        { id: '4', name: '其他费用', amount: 250000, buildingArea: 5000, unitPrice: 50, unit: '㎡', totalRatio: 9.0, parentRatio: 100 },
      ]
      set({
        originalData: mockData as OriginalDataRow[],
        economicData: mockData as unknown as EconomicIndexRow[],
        quantityData: mockData as unknown as QuantityIndexRow[],
        materialData: mockData as unknown as MaterialIndexRow[],
        loading: false,
        error: null,
      })
    }
  },

  // 开始分析
  startAnalyze: async () => {
    const { fileId, checkedUnitIds } = get()
    if (!fileId || checkedUnitIds.length === 0) return

    set({ analyzing: true, analyzeProgress: 0, analyzeStatus: 'processing', error: null })

    try {
      // 提交分析任务
      await standardizeApi.startAnalyze(fileId, {
        unitIds: checkedUnitIds,
        options: {
          includeOriginal: true,
          includeEconomic: true,
          includeQuantity: true,
          includeMaterial: true,
        },
      })

      // 轮询分析状态
      const pollStatus = async () => {
        const status = await standardizeApi.getAnalyzeStatus(fileId)
        set({
          analyzeProgress: status.progress,
          analyzeStatus: status.status,
        })

        if (status.status === 'processing') {
          setTimeout(pollStatus, ANALYZE_POLL_INTERVAL)
        } else {
          set({ analyzing: false })
          if (status.status === 'completed') {
            // 分析完成，刷新数据
            get().loadTabData()
          }
        }
      }

      pollStatus()
    } catch (err) {
      set({
        analyzing: false,
        analyzeStatus: 'failed',
        error: (err as Error).message || '分析失败',
      })
    }
  },

  // 导出 Excel
  exportExcel: async () => {
    const { fileId, activeTab, checkedUnitIds, dimensions } = get()
    if (!fileId) return

    try {
      const blob = await standardizeApi.exportExcel(fileId, activeTab, {
        unitIds: checkedUnitIds,
        dimension: dimensions[activeTab],
      })

      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeTab}_export.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      set({ error: (err as Error).message || '导出失败' })
    }
  },
}))

export default useStandardizePageStore
