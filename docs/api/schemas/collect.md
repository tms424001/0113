# Collect Module DTO Schema v1.0

> 目的：前端禁止臆造字段；列表/详情/筛选必须来自本文件。

---

## 1. Draft (草稿)

### DraftDTO

```ts
interface DraftDTO {
  id: string                    // uuid
  name: string
  type: DraftType
  status: DraftStatus
  source: DraftSource
  projectName?: string
  orgName?: string
  createdAt: string             // ISO 8601
  updatedAt: string             // ISO 8601
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

type DraftType = 'pricing_file' | 'material_sheet' | 'boq_price_sheet'
type DraftStatus = 'draft' | 'processing' | 'ready' | 'failed'
type DraftSource = 'upload' | 'import' | 'sync'
```

### DraftListQuery

```ts
interface DraftListQuery {
  page: number                  // 1-based
  pageSize: number
  keyword?: string              // 搜索 name/projectName
  type?: DraftType
  status?: DraftStatus
  source?: DraftSource
  createdAtFrom?: string        // ISO date
  createdAtTo?: string          // ISO date
  sortBy?: 'updatedAt' | 'createdAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}
```

### DraftListResponse

```ts
interface DraftListResponse {
  items: DraftDTO[]
  page: number
  pageSize: number
  total: number
}
```

### CreateDraftPayload

```ts
interface CreateDraftPayload {
  name: string
  type: DraftType
  projectName?: string
  tags?: string[]
}
```

### UpdateDraftPayload

```ts
interface UpdateDraftPayload {
  name?: string
  projectName?: string
  tags?: string[]
}
```

---

## 2. Ingest Job (采集任务)

### IngestJobDTO

```ts
interface IngestJobDTO {
  id: string
  draftId: string
  jobType: 'parse' | 'normalize' | 'validate'
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled'
  progress?: number             // 0-100
  message?: string
  startedAt?: string            // ISO
  finishedAt?: string           // ISO
}
```

---

## 3. Issue (采集阶段问题)

### CollectIssueDTO

```ts
interface CollectIssueDTO {
  id: string
  draftId: string
  level: 'error' | 'warning' | 'info'
  code: string                  // e.g., "COLLECT_PARSE_001"
  title: string
  detail?: string
  fieldPath?: string            // e.g., "rows[12].materialName"
  suggestion?: string
  createdAt: string             // ISO
}
```

---

## 4. Endpoints (契约引用)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | /api/collect/drafts | DraftListQuery | PagedResponse<DraftDTO> |
| GET | /api/collect/drafts/:id | - | DraftDTO |
| POST | /api/collect/drafts | CreateDraftPayload | DraftDTO |
| PUT | /api/collect/drafts/:id | UpdateDraftPayload | DraftDTO |
| DELETE | /api/collect/drafts/:id | - | { ok: true } |
| GET | /api/collect/drafts/:id/jobs | - | IngestJobDTO[] |
| GET | /api/collect/drafts/:id/issues | - | CollectIssueDTO[] |
| POST | /api/collect/drafts/:id/jobs | { jobType } | IngestJobDTO |

---

## 5. Enum Options (UI Display)

```ts
// src/constants/collect.ts

export const DRAFT_TYPE_OPTIONS = [
  { value: 'pricing_file', label: '造价文件' },
  { value: 'material_sheet', label: '材料表' },
  { value: 'boq_price_sheet', label: '清单价格表' },
]

export const DRAFT_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿', color: 'default' },
  { value: 'processing', label: '处理中', color: 'processing' },
  { value: 'ready', label: '就绪', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
]

export const DRAFT_SOURCE_OPTIONS = [
  { value: 'upload', label: '上传' },
  { value: 'import', label: '导入' },
  { value: 'sync', label: '同步' },
]

export const JOB_TYPE_OPTIONS = [
  { value: 'parse', label: '解析' },
  { value: 'normalize', label: '标准化' },
  { value: 'validate', label: '校验' },
]

export const JOB_STATE_OPTIONS = [
  { value: 'queued', label: '排队中', color: 'default' },
  { value: 'running', label: '运行中', color: 'processing' },
  { value: 'succeeded', label: '成功', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
  { value: 'canceled', label: '已取消', color: 'default' },
]

export const ISSUE_LEVEL_OPTIONS = [
  { value: 'error', label: '错误', color: 'error' },
  { value: 'warning', label: '警告', color: 'warning' },
  { value: 'info', label: '提示', color: 'processing' },
]
```

---

## 6. Mock Data Example

```json
// GET /api/collect/drafts 响应示例
{
  "code": 0,
  "message": "ok",
  "data": {
    "items": [
      {
        "id": "draft_001",
        "name": "XX项目造价文件",
        "type": "pricing_file",
        "status": "draft",
        "source": "upload",
        "projectName": "XX住宅项目",
        "orgName": "XX建设公司",
        "createdBy": { "id": "user_001", "name": "张三" },
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T14:20:00Z",
        "stats": { "itemsTotal": 1200, "issues": 5, "warnings": 12 },
        "tags": ["住宅", "2024"]
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1
  }
}
```

---

## 7. TypeScript File

All types should be exported from:

```ts
// src/types/dto.collect.ts
export interface DraftDTO { ... }
export interface DraftListQuery { ... }
export interface DraftListResponse { ... }
export interface CreateDraftPayload { ... }
export interface UpdateDraftPayload { ... }
export interface IngestJobDTO { ... }
export interface CollectIssueDTO { ... }

export type DraftType = 'pricing_file' | 'material_sheet' | 'boq_price_sheet'
export type DraftStatus = 'draft' | 'processing' | 'ready' | 'failed'
export type DraftSource = 'upload' | 'import' | 'sync'
```