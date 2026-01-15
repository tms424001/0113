// src/pages/assets/enterprise/MaterialsPage/types.ts
// 企业材料库类型定义

/**
 * 材料分类节点
 */
export interface CategoryNode {
  id: string
  name: string
  parentId: string | null
  level: number
  count: number
  children?: CategoryNode[]
  isLeaf?: boolean
}

/**
 * L3 属性筛选项
 */
export interface L3Attribute {
  key: string
  label: string
  options: { value: string; label: string }[]
}

/**
 * 材料列表项
 */
export interface MaterialListItem {
  id: string
  materialCode: string
  materialName: string
  specification: string
  brand: string
  unit: string
  basePrice: number
  compositePrice: number
  deviationRate: number
  trendData: number[]
  sampleCount: number
  status: 'approved' | 'pending' | 'rejected'
  region: string
  period: string
  priceStage: string
}

/**
 * 材料详情
 */
export interface MaterialDetail {
  id: string
  materialCode: string
  materialName: string
  specification: string
  brand: string
  origin: string
  unit: string
  status: 'approved' | 'pending' | 'rejected'
  region: string
  period: string
  priceStage: string
  // 价格信息
  basePrice: number
  compositePrice: number
  deviationRate: number
  cvRate: number
  priceMin: number
  priceMax: number
  sampleCount: number
  // L3 属性
  attributes: Record<string, string>
}

/**
 * 历史趋势数据点
 */
export interface TrendDataPoint {
  period: string
  price: number
}

/**
 * 样本溯源项
 */
export interface SampleItem {
  id: string
  sourceName: string
  sourceType: 'info_price' | 'market' | 'enterprise'
  price: number
  weight: number
  date: string
}

/**
 * 筛选参数
 */
export interface FilterParams {
  regionCode: string
  period: string
  priceStage: string
  sourceType: string
  keyword: string
  categoryId: string
  attributes: Record<string, string>
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
