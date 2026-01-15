// src/hooks/useCollectPage.ts
// 数据采集页面通用 Hook

import { useState, useEffect, useCallback } from 'react'

/**
 * 采集文件基础接口
 */
export interface BaseCollectFile {
  id: string
  fileName: string
  sourceChannel: string
  status: string
  uploadTime: string
  uploadBy: string
}

/**
 * 采集统计数据
 */
export interface CollectStats {
  totalFiles: number
  pendingFiles: number
  completedFiles: number
}

/**
 * 筛选参数
 */
export interface CollectFilterParams {
  keyword: string
  sourceChannel: string
  region: string
  priceMin?: number
  priceMax?: number
}

/**
 * useCollectPage 配置
 */
export interface UseCollectPageConfig<TFile extends BaseCollectFile> {
  /** 获取文件列表函数 */
  fetchFilesFn: (params: {
    keyword?: string
    sourceChannel?: string
    page: number
    pageSize: number
  }) => { items: TFile[]; total: number }
  /** 获取统计数据函数 */
  fetchStatsFn: () => CollectStats
  /** 模拟延迟（毫秒） */
  mockDelay?: number
}

/**
 * useCollectPage 返回值
 */
export interface UseCollectPageReturn<TFile extends BaseCollectFile> {
  // 文件列表
  files: TFile[]
  loading: boolean
  selectedFile: TFile | null
  setSelectedFile: (file: TFile | null) => void

  // 统计数据
  stats: CollectStats

  // 筛选
  filters: CollectFilterParams
  setKeyword: (value: string) => void
  setSourceChannel: (value: string) => void
  setRegion: (value: string) => void
  setPriceRange: (min?: number, max?: number) => void
  resetFilters: () => void

  // 弹窗控制
  importModalOpen: boolean
  setImportModalOpen: (open: boolean) => void

  // 操作
  refresh: () => Promise<void>
  handleSearch: () => void
  handleImportSuccess: () => void
}

/**
 * 数据采集页面通用 Hook
 *
 * 统一管理文件列表、筛选条件、统计数据等状态
 *
 * @example
 * ```tsx
 * const {
 *   files, loading, selectedFile, setSelectedFile,
 *   stats, filters, setKeyword, setSourceChannel,
 *   importModalOpen, setImportModalOpen,
 *   refresh, handleSearch, handleImportSuccess
 * } = useCollectPage({
 *   fetchFilesFn: getMockBOQFiles,
 *   fetchStatsFn: getMockBOQCollectStats,
 * })
 * ```
 */
export function useCollectPage<TFile extends BaseCollectFile>(
  config: UseCollectPageConfig<TFile>
): UseCollectPageReturn<TFile> {
  const { fetchFilesFn, fetchStatsFn, mockDelay = 300 } = config

  // 文件列表状态
  const [files, setFiles] = useState<TFile[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<TFile | null>(null)

  // 统计数据
  const [stats, setStats] = useState<CollectStats>({
    totalFiles: 0,
    pendingFiles: 0,
    completedFiles: 0,
  })

  // 筛选条件
  const [filters, setFilters] = useState<CollectFilterParams>({
    keyword: '',
    sourceChannel: '',
    region: '',
    priceMin: undefined,
    priceMax: undefined,
  })

  // 弹窗控制
  const [importModalOpen, setImportModalOpen] = useState(false)

  // 加载数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // 模拟网络延迟
      if (mockDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, mockDelay))
      }

      // 获取文件列表
      const result = fetchFilesFn({
        keyword: filters.keyword,
        sourceChannel: filters.sourceChannel,
        page: 1,
        pageSize: 100,
      })
      setFiles(result.items)

      // 获取统计数据
      const statsData = fetchStatsFn()
      setStats(statsData)
    } finally {
      setLoading(false)
    }
  }, [fetchFilesFn, fetchStatsFn, filters.keyword, filters.sourceChannel, mockDelay])

  // 初始化加载
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 筛选设置函数
  const setKeyword = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, keyword: value }))
  }, [])

  const setSourceChannel = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, sourceChannel: value }))
  }, [])

  const setRegion = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, region: value }))
  }, [])

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      keyword: '',
      sourceChannel: '',
      region: '',
      priceMin: undefined,
      priceMax: undefined,
    })
  }, [])

  // 搜索
  const handleSearch = useCallback(() => {
    fetchData()
  }, [fetchData])

  // 导入成功
  const handleImportSuccess = useCallback(() => {
    setImportModalOpen(false)
    fetchData()
  }, [fetchData])

  return {
    // 文件列表
    files,
    loading,
    selectedFile,
    setSelectedFile,

    // 统计数据
    stats,

    // 筛选
    filters,
    setKeyword,
    setSourceChannel,
    setRegion,
    setPriceRange,
    resetFilters,

    // 弹窗控制
    importModalOpen,
    setImportModalOpen,

    // 操作
    refresh: fetchData,
    handleSearch,
    handleImportSuccess,
  }
}

export default useCollectPage
