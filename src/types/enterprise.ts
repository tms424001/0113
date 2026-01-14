// src/types/enterprise.ts
// 企业资产相关类型定义

/**
 * 企业项目状态
 */
export type EnterpriseProjectStatus = 'active' | 'archived' | 'deprecated'

/**
 * 企业项目状态选项
 */
export const ENTERPRISE_PROJECT_STATUS_OPTIONS = [
  { value: 'active', label: '正常', color: 'success' },
  { value: 'archived', label: '已归档', color: 'default' },
  { value: 'deprecated', label: '已废弃', color: 'error' },
] as const

/**
 * 企业项目数据传输对象
 */
export interface EnterpriseProjectDTO {
  id: string
  /** 项目名称 */
  projectName: string
  /** 工程地点 */
  region: {
    province: string
    city: string
    district?: string
  }
  /** 工程分类 */
  projectCategory: string
  /** 编制阶段 */
  compilationPhase: string
  /** 金额（元） */
  amount: number
  /** 建筑面积 */
  buildingArea: number
  /** 单方造价 */
  unitPrice: number
  /** 材价时间 */
  materialPriceDate: string
  /** 入库时间 */
  approvedTime: string
  /** 入库人 */
  approvedBy: string
  /** 状态 */
  status: EnterpriseProjectStatus
  /** 引用次数（被使用次数） */
  referenceCount: number
  /** 单项工程数 */
  subProjectCount: number
  /** 单位工程数 */
  unitCount: number
  /** 数据质量评分 */
  qualityScore: number
}

/**
 * 企业材料数据传输对象
 */
export interface EnterpriseMaterialDTO {
  id: string
  /** 材料编码 */
  materialCode: string
  /** 材料名称 */
  materialName: string
  /** 规格型号 */
  specification: string
  /** 单位 */
  unit: string
  /** 含税价格 */
  priceWithTax: number
  /** 不含税价格 */
  priceWithoutTax: number
  /** 供应商 */
  supplier?: string
  /** 价格时间 */
  priceDate: string
  /** 来源项目数 */
  sourceProjectCount: number
  /** 数据条数 */
  dataCount: number
  /** 状态 */
  status: 'active' | 'outdated'
}

/**
 * 企业清单数据传输对象
 */
export interface EnterpriseBOQDTO {
  id: string
  /** 清单编码 */
  boqCode: string
  /** 清单名称 */
  boqName: string
  /** 单位 */
  unit: string
  /** 综合单价（均值） */
  avgUnitPrice: number
  /** 综合单价（最低） */
  minUnitPrice: number
  /** 综合单价（最高） */
  maxUnitPrice: number
  /** 来源项目数 */
  sourceProjectCount: number
  /** 数据条数 */
  dataCount: number
  /** 最近更新时间 */
  updatedAt: string
}

/**
 * 企业项目列表查询参数
 */
export interface EnterpriseProjectListParams {
  keyword?: string
  projectCategory?: string
  compilationPhase?: string
  region?: string[]
  status?: EnterpriseProjectStatus | ''
  timeRange?: [string, string]
  page: number
  pageSize: number
}