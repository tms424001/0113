# Pricing Module DTO Schema v1.0

> 目的：前端禁止臆造字段；列表/详情/筛选必须来自本文件。

---

## 1. Pricing Task (套定额任务)

### PricingTaskDTO

```ts
interface PricingTaskDTO {
  id: string
  name: string
  status: PricingTaskStatus
  draftId?: string              // 关联的采集草稿
  draftName?: string
  projectName?: string
  progress?: number             // 0-100
  itemsTotal: number
  itemsCompleted: number
  issuesCount: number
  mappingRate?: number          // 映射率 0-100
  createdAt: string             // ISO
  updatedAt: string             // ISO
  createdBy: {
    id: string
    name: string
  }
  assignee?: {
    id: string
    name: string
  }
}

type PricingTaskStatus = 'pending' | 'mapping' | 'reviewing' | 'completed' | 'failed'
```

### PricingTaskListQuery

```ts
interface PricingTaskListQuery {
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
```

### PricingTaskListResponse

```ts
interface PricingTaskListResponse {
  items: PricingTaskDTO[]
  page: number
  pageSize: number
  total: number
}
```

---

## 2. Mapping Record (映射记录)

### MappingRecordDTO

```ts
interface MappingRecordDTO {
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
  mappingType: 'auto' | 'manual' | 'pending'
  confidence?: number           // 0-100, only for auto
  status: 'unmapped' | 'mapped' | 'confirmed' | 'rejected'
  issues?: MappingIssue[]
  createdAt: string
  updatedAt: string
}

interface MappingIssue {
  code: string
  level: 'error' | 'warning'
  message: string
}
```

### MappingRecordListQuery

```ts
interface MappingRecordListQuery {
  taskId: string
  page: number
  pageSize: number
  keyword?: string
  mappingType?: 'auto' | 'manual' | 'pending'
  status?: 'unmapped' | 'mapped' | 'confirmed' | 'rejected'
  hasIssues?: boolean
  sortBy?: 'confidence' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}
```

---

## 3. Pricing Issue (计价问题)

### PricingIssueDTO

```ts
interface PricingIssueDTO {
  id: string
  taskId: string
  taskName: string
  recordId?: string
  type: PricingIssueType
  level: 'error' | 'warning' | 'info'
  code: string                  // e.g., "PRICING_MAP_001"
  title: string
  description?: string
  suggestion?: string
  status: 'open' | 'resolved' | 'ignored'
  resolvedBy?: {
    id: string
    name: string
  }
  resolvedAt?: string
  createdAt: string
}

type PricingIssueType = 'mapping_conflict' | 'unit_mismatch' | 'missing_quota' | 'quantity_error' | 'other'
```

### PricingIssueListQuery

```ts
interface PricingIssueListQuery {
  page: number
  pageSize: number
  taskId?: string
  type?: PricingIssueType
  level?: 'error' | 'warning' | 'info'
  status?: 'open' | 'resolved' | 'ignored'
  keyword?: string
  sortBy?: 'createdAt' | 'level'
  sortOrder?: 'asc' | 'desc'
}
```

---

## 4. Push Record (推送记录)

### PushRecordDTO

```ts
interface PushRecordDTO {
  id: string
  taskId: string
  taskName: string
  targetSystem: 'client_a' | 'client_b' | 'erp'
  status: 'pending' | 'pushing' | 'succeeded' | 'failed'
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
```

---

## 5. Endpoints

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | /api/pricing/tasks | PricingTaskListQuery | PagedResponse<PricingTaskDTO> |
| GET | /api/pricing/tasks/:id | - | PricingTaskDTO |
| POST | /api/pricing/tasks | CreateTaskPayload | PricingTaskDTO |
| PUT | /api/pricing/tasks/:id | UpdateTaskPayload | PricingTaskDTO |
| DELETE | /api/pricing/tasks/:id | - | { ok: true } |
| GET | /api/pricing/tasks/:id/records | MappingRecordListQuery | PagedResponse<MappingRecordDTO> |
| PUT | /api/pricing/records/:id | UpdateMappingPayload | MappingRecordDTO |
| GET | /api/pricing/issues | PricingIssueListQuery | PagedResponse<PricingIssueDTO> |
| PUT | /api/pricing/issues/:id/resolve | - | PricingIssueDTO |
| PUT | /api/pricing/issues/:id/ignore | - | PricingIssueDTO |
| GET | /api/pricing/push-records | PushRecordListQuery | PagedResponse<PushRecordDTO> |
| POST | /api/pricing/tasks/:id/push | { targetSystem } | PushRecordDTO |

---

## 6. Enum Options (UI Display)

```ts
// src/constants/pricing.ts

export const PRICING_TASK_STATUS_OPTIONS = [
  { value: 'pending', label: '待处理', color: 'default' },
  { value: 'mapping', label: '映射中', color: 'processing' },
  { value: 'reviewing', label: '审核中', color: 'warning' },
  { value: 'completed', label: '已完成', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
]

export const MAPPING_TYPE_OPTIONS = [
  { value: 'auto', label: '自动映射' },
  { value: 'manual', label: '手动映射' },
  { value: 'pending', label: '待映射' },
]

export const MAPPING_STATUS_OPTIONS = [
  { value: 'unmapped', label: '未映射', color: 'default' },
  { value: 'mapped', label: '已映射', color: 'processing' },
  { value: 'confirmed', label: '已确认', color: 'success' },
  { value: 'rejected', label: '已拒绝', color: 'error' },
]

export const PRICING_ISSUE_TYPE_OPTIONS = [
  { value: 'mapping_conflict', label: '映射冲突' },
  { value: 'unit_mismatch', label: '单位不匹配' },
  { value: 'missing_quota', label: '定额缺失' },
  { value: 'quantity_error', label: '工程量错误' },
  { value: 'other', label: '其他' },
]

export const PRICING_ISSUE_STATUS_OPTIONS = [
  { value: 'open', label: '待处理', color: 'error' },
  { value: 'resolved', label: '已解决', color: 'success' },
  { value: 'ignored', label: '已忽略', color: 'default' },
]

export const PUSH_TARGET_OPTIONS = [
  { value: 'client_a', label: '客户端 A' },
  { value: 'client_b', label: '客户端 B' },
  { value: 'erp', label: 'ERP 系统' },
]

export const PUSH_STATUS_OPTIONS = [
  { value: 'pending', label: '待推送', color: 'default' },
  { value: 'pushing', label: '推送中', color: 'processing' },
  { value: 'succeeded', label: '成功', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
]
```

---

## 7. TypeScript File

```ts
// src/types/dto.pricing.ts
export interface PricingTaskDTO { ... }
export interface PricingTaskListQuery { ... }
export interface MappingRecordDTO { ... }
export interface PricingIssueDTO { ... }
export interface PushRecordDTO { ... }
// ... all types
```