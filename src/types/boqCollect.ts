// src/types/boqCollect.ts
// 清单数据采集相关类型定义

/**
 * 清单来源渠道
 */
export const BOQSourceChannel = {
  SUPPLIER_QUOTE: 'supplier_quote',   // 供应商报价
  CONTRACT_PRICE: 'contract_price',   // 合同价
  OTHER: 'other',                     // 其他
} as const

export type BOQSourceChannelType = typeof BOQSourceChannel[keyof typeof BOQSourceChannel]

/**
 * 清单来源渠道选项
 */
export const BOQ_SOURCE_CHANNEL_OPTIONS = [
  { value: BOQSourceChannel.SUPPLIER_QUOTE, label: '供应商报价', icon: '📦' },
  { value: BOQSourceChannel.CONTRACT_PRICE, label: '合同价', icon: '📋' },
  { value: BOQSourceChannel.OTHER, label: '其他', icon: '📁' },
]

/**
 * 清单采集文件状态
 */
export const BOQCollectFileStatus = {
  PENDING: 'pending',       // 待处理
  PROCESSING: 'processing', // 处理中
  COMPLETED: 'completed',   // 已完成
  FAILED: 'failed',         // 失败
} as const

export type BOQCollectFileStatusType = typeof BOQCollectFileStatus[keyof typeof BOQCollectFileStatus]

/**
 * 清单映射状态
 */
export const BOQMappingStatus = {
  PENDING: 'pending',   // 待映射
  MAPPED: 'mapped',     // 已映射
  IGNORED: 'ignored',   // 已忽略
} as const

export type BOQMappingStatusType = typeof BOQMappingStatus[keyof typeof BOQMappingStatus]

/**
 * 清单采集文件 DTO
 */
export interface BOQCollectFileDTO {
  id: string
  fileName: string
  sourceChannel: BOQSourceChannelType
  uploadTime: string
  priceDate: string
  recordCount: number
  mappedCount: number
  status: BOQCollectFileStatusType
  createdBy: string
}

/**
 * 清单记录 DTO
 */
export interface BOQRecordDTO {
  id: string
  fileId: string
  source: BOQSourceChannelType
  // 原始数据
  code: string              // 清单编码
  name: string              // 清单名称
  specification: string     // 规格特征
  unit: string              // 单位
  quantity: number          // 工程量
  unitPrice: number         // 综合单价
  totalPrice: number        // 合价
  // 标准映射
  standardCode?: string     // 标准编码
  standardName?: string     // 标准名称
  standardSpec?: string     // 标准规格
  // 状态
  mappingStatus: BOQMappingStatusType
  priceDate: string
  region: string
}

/**
 * 个人清单 DTO
 */
export interface PersonalBOQDTO {
  id: string
  code: string
  name: string
  specification: string
  unit: string
  unitPrice: number
  priceDate: string
  region: string
  source: BOQSourceChannelType
  sourceFileName: string
  pushStatus: 'pending' | 'pushed' | 'rejected'
  createdAt: string
  updatedAt: string
}

/**
 * 造价文件提取状态
 */
export type BOQExtractStatus = 'pending' | 'extracting' | 'completed' | 'failed'

/**
 * 造价文件 DTO（用于清单提取）
 */
export interface BOQPricingFileDTO {
  id: string
  fileName: string
  projectName: string
  uploadTime: string
  boqCount: number
  extractStatus: BOQExtractStatus
}
