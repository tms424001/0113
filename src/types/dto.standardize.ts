// src/types/dto.standardize.ts
// 标准化分析模块 DTO 类型定义
// 基于 StandardizationPage Golden Example v1.0

// ============================================================================
// 工程列表树 (左侧)
// ============================================================================

/** 工程树节点类型 */
export type ProjectTreeNodeType = 'project' | 'subProject' | 'unit'

/** 工程树节点 */
export interface ProjectTreeNode {
  id: string
  name: string
  type: ProjectTreeNodeType
  parentId?: string
  children?: ProjectTreeNode[]
  checked?: boolean
}

/** 工程树响应 */
export interface ProjectTreeResponse {
  tree: ProjectTreeNode[]
}

// ============================================================================
// Tab 数据行类型
// ============================================================================

/** 基础树形数据行 */
export interface BaseTreeRow {
  id: string
  name: string
  parentId?: string
  level: number
}

/** 原样预览数据行 */
export interface OriginalDataRow extends BaseTreeRow {
  amount?: number
  buildingArea?: number
  unitPrice?: number
  unit?: string
  compositePrice?: number
  totalRatio?: number
  parentRatio?: number
}

/** 工程经济指标数据行 */
export interface EconomicIndexRow extends BaseTreeRow {
  amount?: number
  buildingArea?: number
  unitPrice?: number
  unit?: string
  quantity?: number
  compositePrice?: number
  totalRatio?: number
  specialScale?: number
  specialUnit?: string
  specialUnitPrice?: number
  remark?: string
}

/** 主要工程量指标数据行 */
export interface QuantityIndexRow extends BaseTreeRow {
  code: string                 // 工程分类编码，如 010401
  unit?: string
  quantity?: number
  compositePrice?: number
  amount?: number
  buildingArea?: number
  unitContent?: number         // 单位含量
  unitCost?: number            // 单位造价
  totalRatio?: number
  parentRatio?: number
}

/** 工料机指标数据行 */
export interface MaterialIndexRow extends BaseTreeRow {
  code: string                 // 材料分类编码，如 0101
  unit?: string
  quantity?: number
  avgPrice?: number            // 平均价格
  amount?: number
  unitContent?: number         // 单位含量
  unitCost?: number            // 单方造价
  totalRatio?: number
}

// ============================================================================
// API 查询参数
// ============================================================================

/** Tab 数据查询参数 */
export interface TabDataQuery {
  unitIds?: string[]           // 勾选的单位工程ID
  dimension?: string           // 维度
}

// ============================================================================
// API 响应类型
// ============================================================================

/** 数据汇总 */
export interface DataSummary {
  totalAmount?: number
  buildingArea?: number
  [key: string]: unknown
}

/** 原样预览响应 */
export interface OriginalDataResponse {
  items: OriginalDataRow[]
  summary: DataSummary
}

/** 工程经济指标响应 */
export interface EconomicIndexResponse {
  items: EconomicIndexRow[]
  summary: DataSummary
}

/** 主要工程量指标响应 */
export interface QuantityIndexResponse {
  items: QuantityIndexRow[]
  summary: DataSummary
}

/** 工料机指标响应 */
export interface MaterialIndexResponse {
  items: MaterialIndexRow[]
  summary: DataSummary
}

// ============================================================================
// 分析任务
// ============================================================================

/** 分析选项 */
export interface AnalyzeOptions {
  includeOriginal?: boolean
  includeEconomic?: boolean
  includeQuantity?: boolean
  includeMaterial?: boolean
}

/** 开始分析请求 */
export interface StartAnalyzePayload {
  unitIds: string[]
  options?: AnalyzeOptions
}

/** 分析任务状态 */
export type AnalyzeStatus = 'processing' | 'completed' | 'failed'

/** 开始分析响应 */
export interface StartAnalyzeResponse {
  taskId: string
  status: AnalyzeStatus
}

/** 分析结果 */
export interface AnalyzeResult {
  projectId: string
  stats: Record<string, unknown>
}

/** 分析状态响应 */
export interface AnalyzeStatusResponse {
  status: AnalyzeStatus
  progress: number             // 0-100
  result?: AnalyzeResult
}

// ============================================================================
// Tab 类型
// ============================================================================

/** Tab Key 类型 */
export type TabKey = 'original' | 'economic' | 'quantity' | 'material'

/** 维度选项 */
export interface DimensionOption {
  value: string
  label: string
}

/** Tab 配置 */
export interface TabConfig {
  key: TabKey
  label: string
  dimensions: DimensionOption[]
  defaultDimension?: string
}
