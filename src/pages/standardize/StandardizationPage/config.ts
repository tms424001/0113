// src/pages/standardize/StandardizationPage/config.ts
// 标准化分析页面配置 - 列定义和维度选项

import type { TabKey } from '@/types/dto.standardize'

// ============================================================================
// TreeTable 列类型
// ============================================================================

export interface TreeTableColumn {
  id: string
  header: string
  width?: number
  fillspace?: boolean
  template?: string
  format?: 'money' | 'percent' | 'number'
}

// ============================================================================
// 原样预览列配置
// ============================================================================

export const originalColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40, template: '{common.checkbox()}' },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'buildingArea', header: '建设规模(建筑面积)(M2)', width: 180 },
  { id: 'unitPrice', header: '单方造价', width: 100 },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'compositePrice', header: '综合单价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100, format: 'percent' },
  { id: 'parentRatio', header: '占上级比(%)', width: 100, format: 'percent' },
]

// ============================================================================
// 工程经济指标列配置
// ============================================================================

export const economicColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40, template: '{common.checkbox()}' },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'buildingArea', header: '建设规模(建筑面积)(M2)', width: 180 },
  { id: 'unitPrice', header: '单方造价', width: 100 },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'quantity', header: '工程量', width: 100 },
  { id: 'compositePrice', header: '综合单价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100, format: 'percent' },
  { id: 'specialScale', header: '特殊规模', width: 100 },
  { id: 'specialUnit', header: '特殊单位', width: 80 },
  { id: 'specialUnitPrice', header: '特殊单价', width: 100 },
  { id: 'remark', header: '备注', width: 120 },
]

// ============================================================================
// 主要工程量指标列配置
// ============================================================================

export const quantityColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40, template: '{common.checkbox()}' },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'quantity', header: '工程量', width: 100 },
  { id: 'compositePrice', header: '综合单价', width: 100 },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'buildingArea', header: '建设规模(建筑面积)(M2)', width: 180 },
  { id: 'unitContent', header: '单位含量', width: 100 },
  { id: 'unitCost', header: '单位造价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100, format: 'percent' },
  { id: 'parentRatio', header: '占上级比(%)', width: 100, format: 'percent' },
]

// ============================================================================
// 工料机指标列配置
// ============================================================================

export const materialColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40, template: '{common.checkbox()}' },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'quantity', header: '数量', width: 100 },
  { id: 'avgPrice', header: '平均价格', width: 100 },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'unitContent', header: '单位含量', width: 100 },
  { id: 'unitCost', header: '单方造价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100, format: 'percent' },
]

// ============================================================================
// 列配置映射
// ============================================================================

export const COLUMNS_MAP: Record<TabKey, TreeTableColumn[]> = {
  original: originalColumns,
  economic: economicColumns,
  quantity: quantityColumns,
  material: materialColumns,
}

// ============================================================================
// 获取列配置
// ============================================================================

export function getColumnsByTab(tabKey: TabKey): TreeTableColumn[] {
  return COLUMNS_MAP[tabKey] || originalColumns
}
