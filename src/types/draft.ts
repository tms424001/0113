// src/types/draft.ts
// 草稿库相关类型定义

/**
 * 草稿来源类型
 */
export type DraftSource = 'collect' | 'quality' | 'pricing' | 'estimate'

/**
 * 草稿来源选项配置
 */
export const DRAFT_SOURCE_OPTIONS = [
  { value: 'collect', label: '采集', color: 'blue' },
  { value: 'quality', label: '质控', color: 'green' },
  { value: 'pricing', label: '计价', color: 'orange' },
  { value: 'estimate', label: '估算', color: 'purple' },
] as const

/**
 * 草稿状态类型
 */
export type DraftStatus = 'pending' | 'analyzing' | 'completed' | 'failed'

/**
 * 草稿状态选项配置
 */
export const DRAFT_STATUS_OPTIONS = [
  { value: 'pending', label: '待分析', color: 'default' },
  { value: 'analyzing', label: '分析中', color: 'processing' },
  { value: 'completed', label: '已完成', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
] as const

/**
 * 草稿数据传输对象
 */
export interface DraftDTO {
  id: string
  /** 项目名称 */
  projectName: string
  /** 上传时间 */
  uploadTime: string
  /** 来源 */
  source: DraftSource
  /** 金额（元） */
  amount: number
  /** 状态 */
  status: DraftStatus
  /** 编制阶段 */
  compilationPhase?: string
  /** 文件格式 */
  fileFormat?: string
  /** 单项工程数 */
  subProjectCount?: number
  /** 创建人 */
  createdBy?: string
}

/**
 * 草稿列表查询参数
 */
export interface DraftListParams {
  /** 搜索关键词（项目名称） */
  keyword?: string
  /** 来源筛选 */
  source?: DraftSource | ''
  /** 状态筛选 */
  status?: DraftStatus | ''
  /** 上传时间范围 */
  uploadTimeRange?: [string, string]
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 草稿列表响应
 */
export interface DraftListResponse {
  items: DraftDTO[]
  total: number
  page: number
  pageSize: number
}