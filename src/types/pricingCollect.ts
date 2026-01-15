// src/types/pricingCollect.ts
// 造价文件采集相关类型定义

/**
 * 造价文件来源渠道
 */
export type PricingSourceChannel =
  | 'pricing'     // 计价
  | 'quality'     // 质控
  | 'estimation'  // 估算
  | 'collect'     // 采集

/**
 * 造价文件来源渠道选项
 */
export const PRICING_SOURCE_CHANNEL_OPTIONS = [
  { value: 'pricing', label: '计价', icon: '📊', color: 'blue' },
  { value: 'quality', label: '质控', icon: '✅', color: 'green' },
  { value: 'estimation', label: '估算', icon: '📐', color: 'orange' },
  { value: 'collect', label: '采集', icon: '📥', color: 'cyan' },
] as const

/**
 * 文件处理状态
 */
export type PricingFileStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * 文件处理状态选项
 */
export const PRICING_FILE_STATUS_OPTIONS = [
  { value: 'pending', label: '待处理', color: 'default' },
  { value: 'processing', label: '处理中', color: 'processing' },
  { value: 'completed', label: '已完成', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
] as const

/**
 * 映射状态
 */
export type PricingMappingStatus = 'pending' | 'mapped' | 'ignored'

/**
 * 映射状态选项
 */
export const PRICING_MAPPING_STATUS_OPTIONS = [
  { value: 'pending', label: '待映射', color: 'default' },
  { value: 'mapped', label: '已映射', color: 'success' },
  { value: 'ignored', label: '已忽略', color: 'warning' },
] as const

/**
 * 造价采集文件
 */
export interface PricingCollectFileDTO {
  id: string
  /** 文件名 */
  fileName: string
  /** 来源渠道 */
  sourceChannel: PricingSourceChannel
  /** 处理状态 */
  status: PricingFileStatus
  /** 项目名称 */
  projectName?: string
  /** 文件类型 */
  fileType?: string
  /** 记录条数 */
  recordCount: number
  /** 已映射条数 */
  mappedCount: number
  /** 价格日期 */
  priceDate?: string
  /** 适用地区 */
  region?: string
  /** 上传时间 */
  uploadTime: string
  /** 上传人 */
  uploadBy: string
  /** 备注 */
  remark?: string
}

/**
 * 造价记录类型
 */
export type PricingRecordType = 'boq' | 'material' | 'labor' | 'machine' | 'measure' | 'other'

/**
 * 造价记录类型选项
 */
export const PRICING_RECORD_TYPE_OPTIONS = [
  { value: 'boq', label: '清单', color: 'blue' },
  { value: 'material', label: '材料', color: 'green' },
  { value: 'labor', label: '人工', color: 'orange' },
  { value: 'machine', label: '机械', color: 'purple' },
  { value: 'measure', label: '措施', color: 'cyan' },
  { value: 'other', label: '其他', color: 'default' },
] as const

/**
 * 造价记录 DTO（采集的原始记录）
 */
export interface PricingRecordDTO {
  id: string
  /** 所属文件ID */
  fileId: string
  /** 来源渠道 */
  source: PricingSourceChannel
  /** 记录类型 */
  recordType: PricingRecordType
  /** 编码（原始） */
  code: string
  /** 名称（原始） */
  name: string
  /** 规格特征（原始） */
  specification: string
  /** 标准编码（映射后） */
  standardCode?: string
  /** 标准名称（映射后） */
  standardName?: string
  /** 标准规格（映射后） */
  standardSpec?: string
  /** 单位 */
  unit: string
  /** 工程量 */
  quantity: number
  /** 综合单价 */
  unitPrice: number
  /** 合价 */
  totalPrice: number
  /** 价格日期 */
  priceDate: string
  /** 地区 */
  region: string
  /** 映射状态 */
  mappingStatus: PricingMappingStatus
}

/**
 * 个人造价数据推送状态
 */
export type PersonalPricingStatus = 'draft' | 'pending' | 'approved' | 'rejected'

/**
 * 个人造价数据推送状态选项
 */
export const PERSONAL_PRICING_STATUS_OPTIONS = [
  { value: 'draft', label: '未推送', color: 'default' },
  { value: 'pending', label: '审核中', color: 'processing' },
  { value: 'approved', label: '已入库', color: 'success' },
  { value: 'rejected', label: '已驳回', color: 'error' },
] as const

/**
 * 个人造价数据 DTO
 */
export interface PersonalPricingDTO {
  id: string
  /** 记录类型 */
  recordType: PricingRecordType
  /** 编码 */
  code: string
  /** 名称 */
  name: string
  /** 规格特征 */
  specification: string
  /** 单位 */
  unit: string
  /** 综合单价 */
  unitPrice: number
  /** 来源渠道 */
  source: PricingSourceChannel
  /** 来源文件名 */
  sourceFileName: string
  /** 价格日期 */
  priceDate: string
  /** 地区 */
  region: string
  /** 推送状态 */
  pushStatus: PersonalPricingStatus
  /** 关联项目 */
  relatedProject?: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * 导入造价文件参数
 */
export interface ImportPricingFileParams {
  /** 文件 */
  file: File
  /** 来源渠道 */
  sourceChannel: PricingSourceChannel
  /** 价格日期 */
  priceDate: string
  /** 适用地区 */
  region: string
  /** 项目名称 */
  projectName?: string
  /** 文件类型 */
  fileType?: string
  /** 备注 */
  remark?: string
}

/**
 * 造价数据提取状态
 */
export type PricingExtractStatus = 'pending' | 'extracting' | 'completed' | 'failed'

/**
 * 造价文件提取 DTO（用于从造价文件提取数据）
 */
export interface PricingExtractFileDTO {
  id: string
  /** 文件名 */
  fileName: string
  /** 项目名称 */
  projectName: string
  /** 上传时间 */
  uploadTime: string
  /** 清单条数 */
  boqCount: number
  /** 材料条数 */
  materialCount: number
  /** 人工条数 */
  laborCount: number
  /** 机械条数 */
  machineCount: number
  /** 提取状态 */
  extractStatus: PricingExtractStatus
}
