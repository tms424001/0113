// src/types/dto.pr.ts
// PR (Pull Request) 模块 DTO 定义 - 严格按照 docs/api/schemas/pr.md
// 个人数据 → PR流程 → 企业数据库

// ============================================================================
// Type Aliases
// ============================================================================

export type PRStatus =
  | 'draft'
  | 'pending'
  | 'level1_review'
  | 'level2_review'
  | 'approved'
  | 'rejected'
  | 'merged'

export type PRAction = 'approve' | 'reject' | 'request_change'

export type ValidationCategory =
  | 'data_integrity'
  | 'data_accuracy'
  | 'price_deviation'
  | 'quantity_anomaly'
  | 'code_standard'
  | 'duplicate_check'

export type ValidationStatus = 'passed' | 'warning' | 'failed'
export type ValidationItemStatus = 'open' | 'fixed' | 'ignored'
export type RelatedDataType = 'material' | 'boq' | 'index' | 'pricing_file'
export type CommentRelatedType = 'material' | 'boq' | 'index' | 'validation_item'

// ============================================================================
// Common Types
// ============================================================================

export interface UserRef {
  id: string
  name: string
  avatar?: string
}

// ============================================================================
// PRDataScope (数据范围)
// ============================================================================

export interface PRDataScope {
  includeMaterials: boolean
  includeBoqItems: boolean
  includeIndices: boolean
  includePricingFiles: boolean
  stats: {
    pricingFileCount: number
    materialCount: number
    boqItemCount: number
    indexCount: number
  }
  pricingFileIds?: string[]
  materialIds?: string[]
  boqItemIds?: string[]
  indexIds?: string[]
}

// ============================================================================
// SupplementInfo (补录信息)
// ============================================================================

export interface SupplementInfo {
  project?: {
    name?: string
    code?: string
    type?: string
    region?: string
    owner?: string
    contractor?: string
    buildingArea?: number
    totalAmount?: number
    startDate?: string
    completionDate?: string
  }
  units?: Array<{
    unitId: string
    structureType?: string
    floorCount?: number
    description?: string
  }>
  completenessScore?: number
  missingFields?: string[]
}

// ============================================================================
// ValidationResult (校核结果)
// ============================================================================

export interface ValidationItem {
  id: string
  category: ValidationCategory
  level: 'error' | 'warning' | 'info'
  title: string
  description: string
  suggestion?: string
  relatedType?: RelatedDataType
  relatedId?: string
  relatedName?: string
  status: ValidationItemStatus
}

export interface ValidationResult {
  status: ValidationStatus
  score: number
  items: ValidationItem[]
  passedCount: number
  warningCount: number
  failedCount: number
  executedAt: string
  executedBy?: 'system' | 'manual'
}

// ============================================================================
// PullRequest (PR主体)
// ============================================================================

export interface PullRequestDTO {
  id: string
  title: string
  description?: string
  prNumber: string
  sourceSpace: 'personal'
  targetSpace: 'enterprise'
  sourceProjectId: string
  targetProjectId?: string
  dataScope: PRDataScope
  status: PRStatus
  currentLevel: 1 | 2
  requireLevel2: boolean
  supplementInfo?: SupplementInfo
  validationResult?: ValidationResult
  submittedAt?: string
  level1ReviewedAt?: string
  level2ReviewedAt?: string
  approvedAt?: string
  mergedAt?: string
  rejectedAt?: string
  createdBy: UserRef
  level1Reviewer?: UserRef
  level2Reviewer?: UserRef
  createdAt: string
  updatedAt: string
}

export interface PRListQuery {
  page: number
  pageSize: number
  keyword?: string
  status?: PRStatus | PRStatus[]
  sourceProjectId?: string
  targetProjectId?: string
  createdById?: string
  reviewerId?: string
  createdAtFrom?: string
  createdAtTo?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'prNumber'
  sortOrder?: 'asc' | 'desc'
}

export interface PRListResponse {
  items: PullRequestDTO[]
  page: number
  pageSize: number
  total: number
}

export interface CreatePRPayload {
  title: string
  description?: string
  sourceProjectId: string
  targetProjectId?: string
  dataScope: Omit<PRDataScope, 'stats'>
}

export interface UpdatePRPayload {
  title?: string
  description?: string
  targetProjectId?: string
  dataScope?: Omit<PRDataScope, 'stats'>
  supplementInfo?: SupplementInfo
}

// ============================================================================
// PRReviewRecord (审批记录)
// ============================================================================

export interface PRReviewRecordDTO {
  id: string
  prId: string
  level: 1 | 2
  action: PRAction
  comment?: string
  reviewer: UserRef
  createdAt: string
}

export interface ReviewPayload {
  action: PRAction
  comment?: string
}

// ============================================================================
// PRComment (PR评论)
// ============================================================================

export interface PRCommentDTO {
  id: string
  prId: string
  content: string
  relatedType?: CommentRelatedType
  relatedId?: string
  author: UserRef
  createdAt: string
  updatedAt: string
}

export interface CreateCommentPayload {
  content: string
  relatedType?: CommentRelatedType
  relatedId?: string
}
