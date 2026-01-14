// src/types/project.ts
// 我的项目相关类型定义

/**
 * 项目来源类型
 */
export type ProjectSource = 'collect' | 'quality' | 'pricing' | 'estimate'

/**
 * 项目来源选项配置
 */
export const PROJECT_SOURCE_OPTIONS = [
  { value: 'collect', label: '采集', color: 'blue' },
  { value: 'quality', label: '质控', color: 'green' },
  { value: 'pricing', label: '计价', color: 'orange' },
  { value: 'estimate', label: '估算', color: 'purple' },
] as const

/**
 * 项目状态类型
 */
export type ProjectStatus = 'draft' | 'ready' | 'submitted' | 'approved'

/**
 * 项目状态选项配置
 */
export const PROJECT_STATUS_OPTIONS = [
  { value: 'draft', label: '编辑中', color: 'default' },
  { value: 'ready', label: '可入库', color: 'success' },
  { value: 'submitted', label: '已提交', color: 'processing' },
  { value: 'approved', label: '已入库', color: 'purple' },
] as const

/**
 * 编制阶段选项
 */
export const COMPILATION_PHASE_OPTIONS = [
  { value: 'estimate', label: '估算' },
  { value: 'budget_estimate', label: '概算' },
  { value: 'bidding_boq', label: '招标工程量清单' },
  { value: 'bidding_control', label: '招标控制价' },
  { value: 'budget', label: '施工图预算' },
  { value: 'settlement', label: '结算' },
  { value: 'final_account', label: '决算' },
] as const

/**
 * 项目数据传输对象
 */
export interface ProjectDTO {
  id: string
  /** 项目名称 */
  projectName: string
  /** 上传时间 */
  uploadTime: string
  /** 来源 */
  source: ProjectSource
  /** 金额（元） */
  amount: number
  /** 状态 */
  status: ProjectStatus
  /** 编制阶段 */
  compilationPhase?: string
  /** 地区 */
  region?: {
    province: string
    city: string
    district?: string
  }
  /** 单项工程数 */
  subProjectCount?: number
  /** 单位工程数 */
  unitCount?: number
  /** 建筑面积 */
  buildingArea?: number
  /** 单方造价 */
  unitPrice?: number
  /** 补录完成度 */
  completeness?: number
  /** 创建人 */
  createdBy?: string
  /** 更新时间 */
  updatedAt?: string
}

/**
 * 项目列表查询参数
 */
export interface ProjectListParams {
  /** 搜索关键词（项目名称） */
  keyword?: string
  /** 来源筛选 */
  source?: ProjectSource | ''
  /** 状态筛选 */
  status?: ProjectStatus | ''
  /** 上传时间范围 */
  uploadTimeRange?: [string, string]
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 项目列表响应
 */
export interface ProjectListResponse {
  items: ProjectDTO[]
  total: number
  page: number
  pageSize: number
}

/**
 * 项目基础补录信息（草稿箱 → 我的项目）
 */
export interface ProjectBasicSupplement {
  /** 项目时间 */
  projectTime: string
  /** 地区 */
  region: {
    province: string
    city: string
    district?: string
  }
  /** 编制阶段 */
  compilationPhase: string
  /** 计价类型 */
  pricingType: 'list' | 'quota'
}

/**
 * 项目详细补录信息（我的项目 → PR）
 */
export interface ProjectDetailSupplement {
  // 项目基本信息
  basic: {
    projectName: string
    projectTime: string
    region: { province: string; city: string; district?: string }
    projectCategory: string
    compilationPhase: string
    pricingType: string
    constructionNature: string
  }
  // 编制信息
  compilation?: {
    pricingBasis?: string
    materialPriceDate?: string
    priceComposition?: string
    taxMethod?: string
  }
  // 规划信息
  planning?: {
    totalInvestment?: number
    projectLevel?: string
    altitude?: number
  }
  // 单项工程概况
  subProjects: Array<{
    subProjectId: string
    subProjectName: string
    buildingArea?: number
    structureType?: string
    aboveGroundFloors?: number
    undergroundFloors?: number
  }>
  // 单位工程特征
  units: Array<{
    unitId: string
    unitName: string
    foundationType?: string
    wallMaterial?: string
    roofType?: string
    windowType?: string
  }>
}