# OpenAPI Minimal Contract v1.1

## 0. Conventions

### Response Envelope (Success)

```json
{
  "code": 0,
  "message": "ok",
  "data": <payload>
}
```

### Error Envelope

```json
{
  "code": <nonzero>,
  "message": "<human readable>",
  "details": { ...optional... }
}
```

---

## 1. List Endpoint (Unified)

```
GET /api/<resource>
```

### Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| page | number | 1-based |
| pageSize | number | default 20 |
| sortBy | string | field name |
| sortOrder | "asc" \| "desc" | |
| keyword | string | search term |
| [filters] | various | resource-specific filters |

### Response Data

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 0
}
```

---

## 2. Detail Endpoint

```
GET /api/<resource>/:id
```

### Response Data

```json
{ ...dto... }
```

---

## 3. Create / Update / Delete

```
POST   /api/<resource>          → Create
PUT    /api/<resource>/:id      → Update
DELETE /api/<resource>/:id      → Delete
```

### Create/Update Response

```json
{
  "code": 0,
  "message": "ok",
  "data": { ...created/updated dto... }
}
```

### Delete Response

```json
{
  "code": 0,
  "message": "ok",
  "data": { "ok": true }
}
```

---

## 4. Frontend Schema Rule

- UI fields **MUST** come from DTO in `/docs/api/schemas/{module}.md`
- If DTO is unknown, **STOP and request schema**
- Do NOT invent fields

---

## 5. Error Codes

| Code | HTTP Status | Description | UI Handling |
|------|-------------|-------------|-------------|
| 0 | 200 | Success | Normal |
| 400 | 400 | Bad Request | Form validation error |
| 401 | 401 | Unauthorized | Redirect to login |
| 403 | 403 | Forbidden | Show "No Permission" state |
| 404 | 404 | Not Found | Show "Not Found" state |
| 500 | 500 | Server Error | Show "Server Error" + Retry |

---

## 6. Common UI States Mapping

| Condition | UI State |
|-----------|----------|
| Request pending | Loading |
| total === 0 | Empty |
| code !== 0 OR network error | Error + Retry |

See /docs/ui/StatesSpec.md for implementation.

---

## 7. Module Schemas

Detailed DTO definitions for each module:

| Module | Schema File |
|--------|-------------|
| Collect | /docs/api/schemas/collect.md |
| Pricing | /docs/api/schemas/pricing.md |
| Assets | /docs/api/schemas/assets.md (TBD) |

⚠️ **If target module schema file does not exist, STOP and request it.**

---

## 8. TypeScript Type Generation

All DTOs should be defined in `src/types/`:

```
src/types/
  dto.collect.ts    # Collect module DTOs
  dto.pricing.ts    # Pricing module DTOs
  dto.assets.ts     # Assets module DTOs
  api.ts            # Common API types
```

### Common Types

```ts
// src/types/api.ts
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export interface PagedQuery {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

---

## 9. API Client Pattern

```ts
// src/services/collect.ts
import { api } from './client'
import { DraftDTO, DraftListQuery, DraftListResponse } from '@/types/dto.collect'

export const collectApi = {
  getDrafts: (query: DraftListQuery) => 
    api.get<DraftListResponse>('/api/collect/drafts', { params: query }),
  
  getDraft: (id: string) => 
    api.get<DraftDTO>(`/api/collect/drafts/${id}`),
  
  createDraft: (data: CreateDraftPayload) => 
    api.post<DraftDTO>('/api/collect/drafts', data),
  
  updateDraft: (id: string, data: UpdateDraftPayload) => 
    api.put<DraftDTO>(`/api/collect/drafts/${id}`, data),
  
  deleteDraft: (id: string) => 
    api.delete(`/api/collect/drafts/${id}`),
}
```