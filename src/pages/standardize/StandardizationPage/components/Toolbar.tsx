// src/pages/standardize/StandardizationPage/components/Toolbar.tsx
// 工具栏组件

import React from 'react'
import { Input, InputNumber, Select, Button, Space } from 'antd'
import { DownloadOutlined, FolderOutlined } from '@ant-design/icons'
import type { DimensionOption } from '@/types/dto.standardize'
import { EXPAND_LEVEL_MIN, EXPAND_LEVEL_MAX } from '@/constants/standardize'
import styles from '../StandardizationPage.module.css'

// ============================================================================
// Types
// ============================================================================

export interface ToolbarProps {
  /** 文件名称 */
  fileName?: string
  /** 搜索值 */
  searchValue: string
  /** 搜索变化回调 */
  onSearchChange: (value: string) => void
  /** 展开层次 */
  expandLevel: number
  /** 展开层次变化回调 */
  onExpandLevelChange: (level: number) => void
  /** 维度选项 */
  dimensionOptions?: DimensionOption[]
  /** 当前维度值 */
  dimensionValue?: string
  /** 维度变化回调 */
  onDimensionChange?: (value: string) => void
  /** 导出回调 */
  onExport?: () => void
  /** 是否可以导出 */
  canExport?: boolean
  /** 导出加载中 */
  exportLoading?: boolean
}

// ============================================================================
// Component
// ============================================================================

export const Toolbar: React.FC<ToolbarProps> = ({
  fileName,
  searchValue,
  onSearchChange,
  expandLevel,
  onExpandLevelChange,
  dimensionOptions = [],
  dimensionValue,
  onDimensionChange,
  onExport,
  canExport = true,
  exportLoading = false,
}) => {
  return (
    <div className={styles.toolbar}>
      {/* 面包屑/文件名 */}
      {fileName && (
        <span className={styles.breadcrumb}>
          <FolderOutlined style={{ marginRight: 6 }} />
          {fileName}
        </span>
      )}

      <Space size="middle" className={styles.toolbarControls}>
        {/* 搜索 */}
        <Input.Search
          placeholder="输入查找关键字"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ width: 180 }}
        />

        {/* 展开层次 */}
        <Space size="small">
          <span className={styles.toolbarLabel}>展开层次</span>
          <InputNumber
            min={EXPAND_LEVEL_MIN}
            max={EXPAND_LEVEL_MAX}
            value={expandLevel}
            onChange={(value) => onExpandLevelChange(value ?? EXPAND_LEVEL_MIN)}
            style={{ width: 60 }}
          />
        </Space>

        {/* 维度切换 */}
        {dimensionOptions.length > 0 && onDimensionChange && (
          <Space size="small">
            <span className={styles.toolbarLabel}>维度</span>
            <Select
              value={dimensionValue}
              onChange={onDimensionChange}
              options={dimensionOptions}
              style={{ width: 120 }}
            />
          </Space>
        )}
      </Space>

      {/* 右侧工具按钮 */}
      <div className={styles.spacer} />

      {/* 导出按钮 */}
      {canExport && (
        <Button
          icon={<DownloadOutlined />}
          onClick={onExport}
          loading={exportLoading}
        >
          EXCEL
        </Button>
      )}
    </div>
  )
}

export default Toolbar
