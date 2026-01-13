# Phase 3: Data Layer & Contracts

> **Goal**: 生成类型安全的 DTO、API Service、自定义 Hooks。
> **Status**: [ ] Pending
> **Depends on**: Phase 1 ✅ (http.ts already exists)

---

## Reference Specs (AI Must Read First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/api/OpenAPI_Min.md` | API 通用规范、响应格式 |
| 2 | `docs/api/schemas/collect.md` | Collect 模块 DTO 定义 |
| 3 | `docs/api/schemas/pricing.md` | Pricing 模块 DTO 定义 |
| 4 | `docs/ui/StatesSpec.md` | 错误码与 UI 状态映射 |

---

## Tasks

### 3.1 Common Types
- [ ] Create `src/types/api.ts`
  ```ts
  export interface ApiResponse<T> { code: number; message: string; data: T }
  export interface PagedResponse<T> { items: T[]; page: number; pageSize: number; total: number }
  export interface PagedQuery { page: number; pageSize: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ```

### 3.2 Collect Module DTOs
- [ ] Create `src/types/dto.collect.ts` — **严格按照 `docs/api/schemas/collect.md`**
  - `DraftDTO`
  - `DraftListQuery`
  - `DraftListResponse`
  - `CreateDraftPayload`
  - `UpdateDraftPayload`
  - `IngestJobDTO`
  - `CollectIssueDTO`
  - Type aliases: `DraftType`, `DraftStatus`, `DraftSource`

### 3.3 Collect Module Constants
- [ ] Create `src/constants/collect.ts` — **严格按照 `docs/api/schemas/collect.md` §5**
  - `DRAFT_TYPE_OPTIONS`
  - `DRAFT_STATUS_OPTIONS`
  - `DRAFT_SOURCE_OPTIONS`
  - `JOB_TYPE_OPTIONS`
  - `JOB_STATE_OPTIONS`
  - `ISSUE_LEVEL_OPTIONS`

### 3.4 Pricing Module DTOs
- [ ] Create `src/types/dto.pricing.ts` — **严格按照 `docs/api/schemas/pricing.md`**
  - `PricingTaskDTO`
  - `MappingRecordDTO`
  - `PricingIssueDTO`
  - `PushRecordDTO`
  - Related query/response types

### 3.5 Pricing Module Constants
- [ ] Create `src/constants/pricing.ts` — **严格按照 `docs/api/schemas/pricing.md` §6**
  - `PRICING_TASK_STATUS_OPTIONS`
  - `MAPPING_TYPE_OPTIONS`
  - `MAPPING_STATUS_OPTIONS`
  - `PRICING_ISSUE_TYPE_OPTIONS`
  - etc.

### 3.6 Collect API Service
- [ ] Create `src/services/collect.ts`
  ```ts
  import { request } from './http'
  import type { DraftDTO, DraftListQuery, DraftListResponse, ... } from '@/types/dto.collect'
  
  export const collectApi = {
    getDrafts: (query: DraftListQuery) => request.get<DraftListResponse>('/api/collect/drafts', query),
    getDraft: (id: string) => request.get<DraftDTO>(`/api/collect/drafts/${id}`),
    createDraft: (data: CreateDraftPayload) => request.post<DraftDTO>('/api/collect/drafts', data),
    updateDraft: (id: string, data: UpdateDraftPayload) => request.put<DraftDTO>(`/api/collect/drafts/${id}`, data),
    deleteDraft: (id: string) => request.delete(`/api/collect/drafts/${id}`),
    getDraftJobs: (id: string) => request.get<IngestJobDTO[]>(`/api/collect/drafts/${id}/jobs`),
    getDraftIssues: (id: string) => request.get<CollectIssueDTO[]>(`/api/collect/drafts/${id}/issues`),
  }
  ```

### 3.7 Custom Hooks
- [ ] Create `src/hooks/useRequest.ts` — 通用请求 Hook
  ```ts
  function useRequest<T, P extends unknown[]>(requestFn: (...args: P) => Promise<T>)
  // Returns: { data, loading, error, run, reset }
  ```
- [ ] Create `src/hooks/usePermission.ts` — 权限检查 Hook
  ```ts
  function usePermission(key: string): boolean
  function usePermissions(keys: string[]): Record<string, boolean>
  ```

### 3.8 Mock Data (Optional, for development)
- [ ] Create `src/services/mock/collect.mock.ts`
  - 返回符合 `DraftDTO` 的假数据
  - 用于 Phase 4 开发时无后端联调

---

## Deliverables (产出物)

```
src/
├── types/
│   ├── api.ts
│   ├── dto.collect.ts
│   └── dto.pricing.ts
├── constants/
│   ├── collect.ts
│   └── pricing.ts
├── services/
│   ├── http.ts (Phase 1 已创建)
│   ├── collect.ts
│   └── mock/
│       └── collect.mock.ts
└── hooks/
    ├── useRequest.ts
    └── usePermission.ts
```

---

## Acceptance Criteria (验收标准)

### Type Safety
- [ ] 所有 DTO 类型与 `docs/api/schemas/*.md` 完全一致
- [ ] 没有使用 `any` 类型
- [ ] IDE 中导入 DTO 有完整的类型提示

### Constants
- [ ] Options 数组的 `value` 与 DTO 的枚举值完全匹配
- [ ] Options 数组包含 `label` 和 `color`（状态类）

### API Service
- [ ] 所有方法有正确的入参和返回类型
- [ ] 使用 `src/services/http.ts` 的 `request` 方法
- [ ] 没有硬编码的 API base URL

### Hooks
- [ ] `useRequest` 返回 `{ data, loading, error, run, reset }`
- [ ] `usePermission` 从 `appStore.permissions` 读取

### Mock Data
- [ ] Mock 数据结构与 DTO 完全一致
- [ ] 包含各种状态的测试数据（draft/processing/ready/failed）

---

## Prompt for AI

```
我们开始 Phase 3 数据层开发。

请先阅读以下文档：
- docs/api/OpenAPI_Min.md（API 通用规范）
- docs/api/schemas/collect.md（Collect DTO 定义）
- docs/api/schemas/pricing.md（Pricing DTO 定义）

然后按照 docs/roadmap/Phase3_Data.md 的 Tasks 列表执行。

关键要求：
1. DTO 字段必须与 schema 文档 100% 一致，禁止增减字段
2. Constants 的 value 必须与 DTO 的类型枚举一致
3. API Service 必须使用 Phase 1 创建的 http.ts
4. 所有代码必须有完整的 TypeScript 类型

完成后，确保验收标准全部通过。
```

---

## Notes

- **禁止发明字段**：DTO 必须与 schema 文档完全一致
- http.ts 在 Phase 1 已创建，本阶段不需要重复创建
- Mock 数据可选，但建议创建以便 Phase 4 开发
- 完成此阶段后再进入 Phase 4
