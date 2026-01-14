# PR (Pull Request) Flow Schema v1.0

> 个人数据 → PR流程 → 企业数据库
> 最多两级审批，支持补录校核

---

## 1. PR 流程概述

### 状态机

```
┌─────────┐    提交     ┌──────────┐   一级通过   ┌──────────────┐
│  草稿   │ ─────────→ │  待审核  │ ──────────→ │ 一级审批中   │
│  draft  │            │ pending  │             │ level1_review│
└─────────┘            └──────────┘             └──────────────┘
                            │                         │
                            │ 驳回                    │ 一级通过
                            ▼                         ▼
                       ┌──────────┐             ┌──────────────┐
                       │  已驳回  │             │ 二级审批中   │ (可选)
                       │ rejected │             │ level2_review│
                       └──────────┘             └──────────────┘
                            ▲                         │
                            │ 驳回                    │ 二级通过
                            └─────────────────────────┤
                                                      ▼
                                                ┌──────────┐
                                                │  已通过  │
                                                │ approved │
                                                └──────────┘
                                                      │
                                                      │ 入库
                                                      ▼
                                                ┌──────────┐
                                                │  已入库  │
                                                │ merged   │
                                                └──────────┘
```

### 角色

| 角色 | 职责 |
|------|------|
| 个人用户 | 发起 PR、补录数据 |
| 一级审核员 | 初审数据完整性 |
| 二级审核员 | 终审数据准确性（可选） |

---

## 2. PullRequest (PR主体)

### PullRequestDTO

```ts
interface PullRequestDTO {
  id: string
  // 基本信息
  title: string
  description?: string
  prNumber: string                 // PR 编号，如 PR-2024-001
  
  // 来源与目标
  sourceSpace: 'personal'          // 来源空间（个人）
  targetSpace: 'enterprise'        // 目标空间（企业）
  sourceProjectId: string          // 来源工程ID
  targetProjectId?: string         // 目标工程ID（可能新建）
  
  // 数据范围
  dataScope: PRDataScope
  
  // 状态
  status: PRStatus
  currentLevel: 1 | 2              // 当前审批层级
  requireLevel2: boolean           // 是否需要二级审批
  
  // 补录信息
  supplementInfo?: SupplementInfo
  
  // 校核结果
  validationResult?: ValidationResult
  
  // 时间线
  submittedAt?: string
  level1ReviewedAt?: string
  level2ReviewedAt?: string
  approvedAt?: string
  mergedAt?: string
  rejectedAt?: string
  
  // 人员
  createdBy: UserRef
  level1Reviewer?: UserRef
  level2Reviewer?: UserRef
  
  // 元数据
  createdAt: string
  updatedAt: string
}

type PRStatus = 
  | 'draft'           // 草稿
  | 'pending'         // 待审核
  | 'level1_review'   // 一级审批中
  | 'level2_review'   // 二级审批中
  | 'approved'        // 已通过
  | 'rejected'        // 已驳回
  | 'merged'          // 已入库

interface UserRef {
  id: string
  name: string
  avatar?: string
}
```

### PRDataScope (数据范围)

```ts
interface PRDataScope {
  // 包含的数据类型
  includeMaterials: boolean
  includeBoqItems: boolean
  includeIndices: boolean
  includePricingFiles: boolean
  
  // 数据统计
  stats: {
    pricingFileCount: number
    materialCount: number
    boqItemCount: number
    indexCount: number
  }
  
  // 具体ID列表（可选，用于部分提交）
  pricingFileIds?: string[]
  materialIds?: string[]
  boqItemIds?: string[]
  indexIds?: string[]
}
```

### SupplementInfo (补录信息)

```ts
interface SupplementInfo {
  // 项目信息补录
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
  
  // 单位工程信息补录
  units?: Array<{
    unitId: string
    structureType?: string
    floorCount?: number
    description?: string
  }>
  
  // 补录完整度评分 (0-100)
  completenessScore?: number
  
  // 缺失字段提示
  missingFields?: string[]
}
```

### ValidationResult (校核结果)

```ts
interface ValidationResult {
  // 整体状态
  status: 'passed' | 'warning' | 'failed'
  score: number                    // 校核评分 (0-100)
  
  // 校核项
  items: ValidationItem[]
  
  // 统计
  passedCount: number
  warningCount: number
  failedCount: number
  
  // 执行时间
  executedAt: string
  executedBy?: 'system' | 'manual'
}

interface ValidationItem {
  id: string
  category: ValidationCategory
  level: 'error' | 'warning' | 'info'
  title: string
  description: string
  suggestion?: string
  
  // 关联数据
  relatedType?: 'material' | 'boq' | 'index' | 'pricing_file'
  relatedId?: string
  relatedName?: string
  
  // 状态
  status: 'open' | 'fixed' | 'ignored'
}

type ValidationCategory = 
  | 'data_integrity'      // 数据完整性
  | 'data_accuracy'       // 数据准确性
  | 'price_deviation'     // 价格偏差
  | 'quantity_anomaly'    // 工程量异常
  | 'code_standard'       // 编码规范
  | 'duplicate_check'     // 重复检查
```

---

## 3. PRReviewRecord (审批记录)

### PRReviewRecordDTO

```ts
interface PRReviewRecordDTO {
  id: string
  prId: string
  
  // 审批信息
  level: 1 | 2
  action: 'approve' | 'reject' | 'request_change'
  comment?: string
  
  // 审批人
  reviewer: UserRef
  
  // 时间
  createdAt: string
}
```

---

## 4. PRComment (PR评论)

### PRCommentDTO

```ts
interface PRCommentDTO {
  id: string
  prId: string
  
  // 评论内容
  content: string
  
  // 关联（可选，针对具体数据的评论）
  relatedType?: 'material' | 'boq' | 'index' | 'validation_item'
  relatedId?: string
  
  // 作者
  author: UserRef
  
  // 时间
  createdAt: string
  updatedAt: string
}
```

---

## 5. Query Types

### PRListQuery

```ts
interface PRListQuery {
  page: number
  pageSize: number
  keyword?: string                 // 搜索标题/编号
  status?: PRStatus | PRStatus[]
  sourceProjectId?: string
  targetProjectId?: string
  createdById?: string             // 创建人
  reviewerId?: string              // 审批人
  createdAtFrom?: string
  createdAtTo?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'prNumber'
  sortOrder?: 'asc' | 'desc'
}
```

---

## 6. Endpoints

### PR CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/prs | PR列表 |
| GET | /api/prs/:id | PR详情 |
| POST | /api/prs | 创建PR（草稿） |
| PUT | /api/prs/:id | 更新PR |
| DELETE | /api/prs/:id | 删除PR（仅草稿可删） |

### PR Actions

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/prs/:id/submit | 提交审核 |
| POST | /api/prs/:id/review | 审批（通过/驳回） |
| POST | /api/prs/:id/merge | 入库 |
| POST | /api/prs/:id/withdraw | 撤回（仅待审核可撤） |
| POST | /api/prs/:id/validate | 触发校核 |

### PR Related

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/prs/:id/reviews | 审批记录列表 |
| GET | /api/prs/:id/comments | 评论列表 |
| POST | /api/prs/:id/comments | 添加评论 |
| GET | /api/prs/:id/diff | 数据差异对比 |

---

## 7. Enum Options (UI Display)

```ts
// src/constants/pr.ts

export const PR_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿', color: 'default' },
  { value: 'pending', label: '待审核', color: 'warning' },
  { value: 'level1_review', label: '一级审批中', color: 'processing' },
  { value: 'level2_review', label: '二级审批中', color: 'processing' },
  { value: 'approved', label: '已通过', color: 'success' },
  { value: 'rejected', label: '已驳回', color: 'error' },
  { value: 'merged', label: '已入库', color: 'success' },
]

export const PR_ACTION_OPTIONS = [
  { value: 'approve', label: '通过' },
  { value: 'reject', label: '驳回' },
  { value: 'request_change', label: '要求修改' },
]

export const VALIDATION_CATEGORY_OPTIONS = [
  { value: 'data_integrity', label: '数据完整性' },
  { value: 'data_accuracy', label: '数据准确性' },
  { value: 'price_deviation', label: '价格偏差' },
  { value: 'quantity_anomaly', label: '工程量异常' },
  { value: 'code_standard', label: '编码规范' },
  { value: 'duplicate_check', label: '重复检查' },
]

export const VALIDATION_STATUS_OPTIONS = [
  { value: 'passed', label: '通过', color: 'success' },
  { value: 'warning', label: '警告', color: 'warning' },
  { value: 'failed', label: '失败', color: 'error' },
]
```

---

## 8. PR 页面模式

### 8.1 PR 列表页 (Pattern: P1 List)

```
FilterBar: status, createdBy, reviewer, dateRange
DataTable: prNumber, title, status, sourceProject, createdBy, createdAt, actions
DetailDrawer: PR详情 + 数据范围 + 校核结果 + 审批记录
```

### 8.2 PR 详情页 (Pattern: P4 Master-Detail)

```
Left: 数据树（PricingFiles → Materials/BOQs/Indices）
Right: 详情面板 + 补录表单 + 校核问题列表
Footer: 操作按钮（提交/审批/入库）
```

---

## 9. 业务规则

### 提交规则
- 补录完整度 ≥ 80% 才能提交
- 必须至少包含一种数据类型

### 审批规则
- 一级审批：检查数据完整性
- 二级审批：检查数据准确性（金额 > 100万 自动开启）

### 入库规则
- 校核评分 ≥ 60 才能入库
- 所有 error 级别问题必须处理

---

## 10. TypeScript File

```ts
// src/types/dto.pr.ts
export interface PullRequestDTO { ... }
export interface PRDataScope { ... }
export interface SupplementInfo { ... }
export interface ValidationResult { ... }
export interface ValidationItem { ... }
export interface PRReviewRecordDTO { ... }
export interface PRCommentDTO { ... }
export interface PRListQuery { ... }

export type PRStatus = 'draft' | 'pending' | 'level1_review' | 'level2_review' | 'approved' | 'rejected' | 'merged'
```