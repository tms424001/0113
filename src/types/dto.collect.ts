// src/types/dto.collect.ts
// Collect 模块 DTO 定义 - 严格按照 docs/api/schemas/collect.md

// ============================================================================
// Type Aliases
// ============================================================================

export type DraftType = 'pricing_file' | 'material_sheet' | 'boq_price_sheet'
export type DraftStatus = 'draft' | 'processing' | 'ready' | 'failed'
export type DraftSource = 'upload' | 'import' | 'sync'
export type JobType = 'parse' | 'normalize' | 'validate'
export type JobState = 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled'
export type IssueLevel = 'error' | 'warning' | 'info'

// ============================================================================
// Draft (草稿)
// ============================================================================

export interface DraftDTO {
  id: string
  name: string
  type: DraftType
  status: DraftStatus
  source: DraftSource
  projectName?: string
  orgName?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
  stats?: {
    itemsTotal?: number
    issues?: number
    warnings?: number
  }
  tags?: string[]
}

export interface DraftListQuery {
  page: number
  pageSize: number
  keyword?: string
  type?: DraftType
  status?: DraftStatus
  source?: DraftSource
  createdAtFrom?: string
  createdAtTo?: string
  sortBy?: 'updatedAt' | 'createdAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface DraftListResponse {
  items: DraftDTO[]
  page: number
  pageSize: number
  total: number
}

export interface CreateDraftPayload {
  name: string
  type: DraftType
  projectName?: string
  tags?: string[]
}

export interface UpdateDraftPayload {
  name?: string
  projectName?: string
  tags?: string[]
}

// ============================================================================
// Ingest Job (采集任务)
// ============================================================================

export interface IngestJobDTO {
  id: string
  draftId: string
  jobType: JobType
  state: JobState
  progress?: number
  message?: string
  startedAt?: string
  finishedAt?: string
}

export interface CreateJobPayload {
  jobType: JobType
}

// ============================================================================
// Issue (采集阶段问题)
// ============================================================================

export interface CollectIssueDTO {
  id: string
  draftId: string
  level: IssueLevel
  code: string
  title: string
  detail?: string
  fieldPath?: string
  suggestion?: string
  createdAt: string
}
