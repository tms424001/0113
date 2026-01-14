// src/constants/standardize.ts
// 标准化分析模块常量定义

import type { TabKey, DimensionOption, TabConfig } from '@/types/dto.standardize'

// ============================================================================
// Tab 配置
// ============================================================================

export const TAB_CONFIGS: TabConfig[] = [
  {
    key: 'original',
    label: '原样预览',
    dimensions: [],
  },
  {
    key: 'economic',
    label: '工程经济指标',
    dimensions: [
      { value: 'aggregated', label: '归集后' },
      { value: 'original', label: '原始' },
    ],
    defaultDimension: 'aggregated',
  },
  {
    key: 'quantity',
    label: '主要工程量指标',
    dimensions: [
      { value: 'quantity_tree', label: '工程量树' },
      { value: 'boq_tree', label: '清单树' },
    ],
    defaultDimension: 'quantity_tree',
  },
  {
    key: 'material',
    label: '工料机指标',
    dimensions: [
      { value: 'material_tree', label: '材料树' },
      { value: 'category_tree', label: '分类树' },
    ],
    defaultDimension: 'material_tree',
  },
]

/** Tab 配置映射 */
export const TAB_CONFIG_MAP = Object.fromEntries(
  TAB_CONFIGS.map((config) => [config.key, config])
) as Record<TabKey, TabConfig>

// ============================================================================
// 维度选项（按 Tab 分组）
// ============================================================================

export const DIMENSION_OPTIONS: Record<TabKey, DimensionOption[]> = {
  original: [],
  economic: [
    { value: 'aggregated', label: '归集后' },
    { value: 'original', label: '原始' },
  ],
  quantity: [
    { value: 'quantity_tree', label: '工程量树' },
    { value: 'boq_tree', label: '清单树' },
  ],
  material: [
    { value: 'material_tree', label: '材料树' },
    { value: 'category_tree', label: '分类树' },
  ],
}

/** 默认维度值 */
export const DEFAULT_DIMENSIONS: Record<TabKey, string> = {
  original: '',
  economic: 'aggregated',
  quantity: 'quantity_tree',
  material: 'material_tree',
}

// ============================================================================
// 展开层次
// ============================================================================

export const EXPAND_LEVEL_MIN = 0
export const EXPAND_LEVEL_MAX = 10
export const EXPAND_LEVEL_DEFAULT = 2

// ============================================================================
// 权限 Key
// ============================================================================

export const PERMISSION_KEYS = {
  READ: 'standardize.read',
  WRITE: 'standardize.write',
  EXPORT: 'standardize.export',
} as const

// ============================================================================
// 分析状态
// ============================================================================

export const ANALYZE_STATUS_OPTIONS = [
  { value: 'processing', label: '处理中', color: 'processing' as const },
  { value: 'completed', label: '已完成', color: 'success' as const },
  { value: 'failed', label: '失败', color: 'error' as const },
]

// ============================================================================
// 轮询配置
// ============================================================================

export const ANALYZE_POLL_INTERVAL = 2000  // 2秒轮询一次
export const ANALYZE_POLL_MAX_RETRIES = 150  // 最多轮询150次（5分钟）
