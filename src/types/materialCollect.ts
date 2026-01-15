// src/types/materialCollect.ts
// 材料数据采集相关类型定义

/**
 * 来源渠道
 */
export type MaterialSourceChannel = 
  | 'supplier'      // 供应商报价
  | 'certified'     // 认质认价
  | 'website'       // 网站价
  | 'finance'       // 财评价
  | 'other'         // 其他

/**
 * 来源渠道选项
 */
export const MATERIAL_SOURCE_CHANNEL_OPTIONS = [
  { value: 'supplier', label: '供应商报价', icon: '📦', color: 'blue' },
  { value: 'certified', label: '认质认价', icon: '📋', color: 'green' },
  { value: 'website', label: '网站价', icon: '🌐', color: 'cyan' },
  { value: 'finance', label: '财评价', icon: '💰', color: 'orange' },
  { value: 'other', label: '其他', icon: '📁', color: 'default' },
] as const

/**
 * 文件处理状态
 */
export type FileProcessStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * 材料采集文件
 */
export interface MaterialCollectFileDTO {
  id: string
  /** 文件名 */
  fileName: string
  /** 来源渠道 */
  sourceChannel: MaterialSourceChannel
  /** 处理状态 */
  status: FileProcessStatus
  /** 记录条数 */
  recordCount: number
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
 * 映射状态
 */
export type MappingStatus = 'pending' | 'mapped' | 'ignored'

/**
 * 材料记录（采集的原始记录）
 */
export interface MaterialRecordDTO {
  id: string
  /** 所属文件ID */
  fileId: string
  /** 来源 */
  source: MaterialSourceChannel
  /** 材料名称（原始） */
  name: string
  /** 规格型号（原始） */
  specification: string
  /** 标准名称（映射后） */
  standardName?: string
  /** 标准规格（映射后） */
  standardSpec?: string
  /** 单位 */
  unit: string
  /** 价格 */
  price: number
  /** 价格日期 */
  priceDate: string
  /** 地区 */
  region: string
  /** 映射状态 */
  mappingStatus: MappingStatus
}

/**
 * 个人材料状态
 */
export type PersonalMaterialStatus = 'draft' | 'pending' | 'approved' | 'rejected'

/**
 * 个人材料推送状态选项
 */
export const PERSONAL_MATERIAL_STATUS_OPTIONS = [
  { value: 'draft', label: '未推送', color: 'default' },
  { value: 'pending', label: '审核中', color: 'processing' },
  { value: 'approved', label: '已入库', color: 'success' },
  { value: 'rejected', label: '已驳回', color: 'error' },
] as const

/**
 * 个人材料数据
 */
export interface PersonalMaterialDTO {
  id: string
  /** 材料名称 */
  materialName: string
  /** 规格型号 */
  specification: string
  /** 单位 */
  unit: string
  /** 价格 */
  price: number
  /** 来源 */
  source: MaterialSourceChannel
  /** 价格日期 */
  priceDate: string
  /** 地区 */
  region: string
  /** 推送状态 */
  pushStatus: PersonalMaterialStatus
  /** 关联项目 */
  relatedProject?: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 导入材料文件参数
 */
export interface ImportMaterialFileParams {
  file: File
  sourceChannel: MaterialSourceChannel
  priceDate: string
  region: string
  remark?: string
}