// src/pages/standardize/StandardizationPage/index.tsx
// 标准化分析页面主组件

import React, { useEffect, useMemo, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Tabs, message } from 'antd'
import { useStandardizePageStore } from '@/stores/standardizePageStore'
import { usePermission } from '@/hooks/usePermission'
import { TAB_CONFIGS, DIMENSION_OPTIONS, PERMISSION_KEYS } from '@/constants/standardize'
import { getColumnsByTab } from './config'
import { ProjectTreePanel, Toolbar, TabContent } from './components'
import type { TabKey } from '@/types/dto.standardize'
import styles from './StandardizationPage.module.css'

// ============================================================================
// Component
// ============================================================================

export const StandardizationPage: React.FC = () => {
  // 路由参数
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') || 'original') as TabKey

  // 权限
  const canWrite = usePermission(PERMISSION_KEYS.WRITE)
  const canExport = usePermission(PERMISSION_KEYS.EXPORT)

  // Store
  const {
    fileInfo,
    projectTree,
    checkedUnitIds,
    setCheckedUnitIds,
    leftPanelCollapsed,
    toggleLeftPanel,
    treeLoading,
    searchValue,
    setSearchValue,
    expandLevel,
    setExpandLevel,
    dimensions,
    setDimension,
    originalData,
    economicData,
    quantityData,
    materialData,
    loading,
    analyzing,
    analyzeProgress,
    error,
    init,
    setActiveTab,
    startAnalyze,
    exportExcel,
    loadTabData,
  } = useStandardizePageStore()

  // 初始化
  useEffect(() => {
    if (id) {
      init(id)
    }
  }, [id, init])

  // Tab 切换
  const handleTabChange = useCallback(
    (key: string) => {
      setSearchParams({ tab: key })
      setActiveTab(key as TabKey)
    },
    [setSearchParams, setActiveTab]
  )

  // 维度切换
  const handleDimensionChange = useCallback(
    (value: string) => {
      setDimension(activeTab, value)
    },
    [activeTab, setDimension]
  )

  // 导出
  const handleExport = useCallback(async () => {
    try {
      await exportExcel()
      message.success('导出成功')
    } catch {
      message.error('导出失败')
    }
  }, [exportExcel])

  // 开始分析
  const handleStartAnalyze = useCallback(async () => {
    try {
      await startAnalyze()
      message.success('分析任务已提交')
    } catch {
      message.error('分析失败')
    }
  }, [startAnalyze])

  // 获取当前 Tab 的数据
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'original':
        return originalData
      case 'economic':
        return economicData
      case 'quantity':
        return quantityData
      case 'material':
        return materialData
      default:
        return []
    }
  }, [activeTab, originalData, economicData, quantityData, materialData])

  // 获取当前 Tab 的列配置
  const currentColumns = useMemo(() => getColumnsByTab(activeTab), [activeTab])

  // 获取当前 Tab 的维度选项
  const currentDimensionOptions = useMemo(
    () => DIMENSION_OPTIONS[activeTab] || [],
    [activeTab]
  )

  // Tab items
  const tabItems = useMemo(
    () =>
      TAB_CONFIGS.map((config) => ({
        key: config.key,
        label: config.label,
      })),
    []
  )

  return (
    <div className={styles.page}>
      {/* 左侧工程列表面板 */}
      <ProjectTreePanel
        data={projectTree}
        checkedKeys={checkedUnitIds}
        onCheck={setCheckedUnitIds}
        collapsed={leftPanelCollapsed}
        onToggle={toggleLeftPanel}
        loading={treeLoading}
        analyzing={analyzing}
        analyzeProgress={analyzeProgress}
        onStartAnalyze={handleStartAnalyze}
        canAnalyze={canWrite}
      />

      {/* 右侧主内容区 */}
      <div className={styles.mainContent}>
        {/* Tabs */}
        <div className={styles.tabsWrapper}>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
          />
        </div>

        {/* 工具栏 */}
        <Toolbar
          fileName={fileInfo?.name}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          expandLevel={expandLevel}
          onExpandLevelChange={setExpandLevel}
          dimensionOptions={currentDimensionOptions}
          dimensionValue={dimensions[activeTab]}
          onDimensionChange={handleDimensionChange}
          onExport={handleExport}
          canExport={canExport}
        />

        {/* Tab 内容 */}
        <TabContent
          loading={loading}
          isEmpty={currentData.length === 0 && checkedUnitIds.length === 0}
          emptyText="请在左侧勾选需要分析的单位工程"
          error={error}
          onRetry={loadTabData}
        >
          <div className={styles.tableContainer}>
            {/* 
              这里应该放置 WebixTreeTable 组件
              由于 Webix 是第三方库，需要单独封装
              暂时用占位符表示
            */}
            <div style={{ 
              height: '100%', 
              border: '1px dashed #d9d9d9', 
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0,0,0,0.45)',
              fontSize: 14,
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: 8 }}>WebixTreeTable 组件占位</p>
                <p style={{ fontSize: 12 }}>
                  数据行数: {currentData.length} | 
                  列数: {currentColumns.length} | 
                  展开层次: {expandLevel}
                </p>
              </div>
            </div>
          </div>
        </TabContent>

        {/* 附加信息 */}
        <div className={styles.footer}>
          📎 附加信息
        </div>
      </div>
    </div>
  )
}

export default StandardizationPage
