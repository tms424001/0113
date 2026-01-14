// src/types/pr.ts
// PR 入库申请相关类型定义

/**
 * PR 状态类型
 */
export type PRStatus = 'draft' | 'pending' | 'reviewing' | 'approved' | 'rejected' | 'returned'

/**
 * PR 状态选项配置
 */
export const PR_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿', color: 'default' },
  { value: 'pending', label: '待审批', color: 'processing' },
  { value: 'reviewing', label: '审批中', color: 'warning' },
  { value: 'approved', label: '已通过', color: 'success' },
  { value: 'rejected', label: '已驳回', color: 'error' },
  { value: 'returned', label: '已退回', color: 'orange' },
] as const

/**
 * 审批级别
 */
export type ReviewLevel = 'level1' | 'level2'

/**
 * PR 数据传输对象
 */
export interface PRDTO {
  id: string
  /** PR 标题 */
  title: string
  /** 关联项目 ID */
  projectId: string
  /** 项目名称 */
  projectName: string
  /** 金额（元） */
  amount: number
  /** 建筑面积 */
  buildingArea?: number
  /** 状态 */
  status: PRStatus
  /** 当前审批级别 */
  currentLevel?: ReviewLevel
  /** 补录完成度 */
  completeness: number
  /** 申请人 */
  applicant: string
  /** 申请时间 */
  applyTime: string
  /** 目标空间 */
  targetSpace: string
  /** 审批人 */
  reviewer?: string
  /** 审批时间 */
  reviewTime?: string
  /** 审批意见 */
  reviewComment?: string
  /** 更新时间 */
  updatedAt: string
}

/**
 * PR 列表查询参数
 */
export interface PRListParams {
  /** Tab 类型 */
  tab: 'my' | 'pending'
  /** 搜索关键词 */
  keyword?: string
  /** 状态筛选 */
  status?: PRStatus | ''
  /** 时间范围 */
  timeRange?: [string, string]
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * PR 列表响应
 */
export interface PRListResponse {
  items: PRDTO[]
  total: number
  page: number
  pageSize: number
}

/**
 * 审批操作类型
 */
export type ReviewAction = 'approve' | 'reject' | 'return'

/**
 * 审批请求参数
 */
export interface ReviewParams {
  prId: string
  action: ReviewAction
  comment?: string
}