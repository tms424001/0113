// src/types/dto.pricing.ts
// Pricing 模块 DTO 定义 - 严格按照 docs/api/schemas/pricing.md

// ============================================================================
// Type Aliases
// ============================================================================

export type PricingTaskStatus = 'pending' | 'mapping' | 'reviewing' | 'completed' | 'failed'
export type MappingType = 'auto' | 'manual' | 'pending'
export type MappingStatus = 'unmapped' | 'mapped' | 'confirmed' | 'rejected'
export type PricingIssueType = 'mapping_conflict' | 'unit_mismatch' | 'missing_quota' | 'quantity_error' | 'other'
export type PricingIssueStatus = 'open' | 'resolved' | 'ignored'
export type PushTargetSystem = 'client_a' | 'client_b' | 'erp'
export type PushStatus = 'pending' | 'pushing' | 'succeeded' | 'failed'

// ============================================================================
// Pricing Task (套定额任务)
// ============================================================================

export interface PricingTaskDTO {
  id: string
  name: string
  status: PricingTaskStatus
  draftId?: string
  draftName?: string
  projectName?: string
  progress?: number
  itemsTotal: number
  itemsCompleted: number
  issuesCount: number
  mappingRate?: number
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
  assignee?: {
    id: string
    name: string
  }
}

export interface PricingTaskListQuery {
  page: number
  pageSize: number
  keyword?: string
  status?: PricingTaskStatus
  assigneeId?: string
  createdAtFrom?: string
  createdAtTo?: string
  sortBy?: 'updatedAt' | 'createdAt' | 'progress'
  sortOrder?: 'asc' | 'desc'
}

export interface PricingTaskListResponse {
  items: PricingTaskDTO[]
  page: number
  pageSize: number
  total: number
}

// ============================================================================
// Mapping Record (映射记录)
// ============================================================================

export interface MappingIssue {
  code: string
  level: 'error' | 'warning'
  message: string
}

export interface MappingRecordDTO {
  id: string
  taskId: string
  sourceItem: {
    code: string
    name: string
    unit: string
    quantity?: number
  }
  targetQuota?: {
    code: string
    name: string
    unit: string
  }
  mappingType: MappingType
  confidence?: number
  status: MappingStatus
  issues?: MappingIssue[]
  createdAt: string
  updatedAt: string
}

export interface MappingRecordListQuery {
  taskId: string
  page: number
  pageSize: number
  keyword?: string
  mappingType?: MappingType
  status?: MappingStatus
  hasIssues?: boolean
  sortBy?: 'confidence' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface MappingRecordListResponse {
  items: MappingRecordDTO[]
  page: number
  pageSize: number
  total: number
}

export interface UpdateMappingPayload {
  targetQuota?: {
    code: string
    name: string
    unit: string
  }
  status?: MappingStatus
}

// ============================================================================
// Pricing Issue (计价问题)
// ============================================================================

export interface PricingIssueDTO {
  id: string
  taskId: string
  taskName: string
  recordId?: string
  type: PricingIssueType
  level: 'error' | 'warning' | 'info'
  code: string
  title: string
  description?: string
  suggestion?: string
  status: PricingIssueStatus
  resolvedBy?: {
    id: string
    name: string
  }
  resolvedAt?: string
  createdAt: string
}

export interface PricingIssueListQuery {
  page: number
  pageSize: number
  taskId?: string
  type?: PricingIssueType
  level?: 'error' | 'warning' | 'info'
  status?: PricingIssueStatus
  keyword?: string
  sortBy?: 'createdAt' | 'level'
  sortOrder?: 'asc' | 'desc'
}

export interface PricingIssueListResponse {
  items: PricingIssueDTO[]
  page: number
  pageSize: number
  total: number
}

// ============================================================================
// Push Record (推送记录)
// ============================================================================

export interface PushRecordDTO {
  id: string
  taskId: string
  taskName: string
  targetSystem: PushTargetSystem
  status: PushStatus
  itemsTotal: number
  itemsPushed: number
  errorMessage?: string
  pushedBy: {
    id: string
    name: string
  }
  pushedAt: string
  completedAt?: string
}

export interface PushRecordListQuery {
  page: number
  pageSize: number
  taskId?: string
  targetSystem?: PushTargetSystem
  status?: PushStatus
  sortBy?: 'pushedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface PushRecordListResponse {
  items: PushRecordDTO[]
  page: number
  pageSize: number
  total: number
}

export interface CreatePushPayload {
  targetSystem: PushTargetSystem
}
