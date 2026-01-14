# 我的项目页面 - Golden Example

## 页面结构

```
我的项目
├── 筛选栏：项目名称 + 来源 + 状态 + 时间范围 + [从草稿箱导入]
├── 表格列：项目名称、上传时间、来源、金额、建筑面积、单方造价、完成度、状态、操作
├── 操作按钮：查看、编辑、分析、入库、删除、导出（6个按钮对齐）
├── 批量操作：批量删除
└── 详情抽屉：补录完成度 + 项目详情
```

## 核心功能

| 功能 | 说明 |
|------|------|
| **完成度显示** | 表格列 + 抽屉中显示补录完成度百分比 |
| **入库校验** | 完成度 < 80% 时提示，不允许发起 PR |
| **状态控制** | 已提交的项目不能删除 |
| **从草稿箱导入** | 跳转到草稿箱页面（带 action 参数） |

## 路由跳转

| 操作 | 跳转路由 |
|------|----------|
| 从草稿箱导入 | `/collect/drafts?action=import` |
| 编辑 | `/assets/personal/projects/:id/edit` |
| 分析 | `/standardize/files/:id` |
| 发起入库 | `/pr/create?projectId=:id` |

## 文件清单

```
src/
├── types/
│   └── project.ts                           # 项目类型定义
├── mocks/
│   └── projects.ts                          # Mock 数据（68条）
├── stores/
│   └── personalProjectsPageStore.ts         # Zustand Store
└── pages/assets/personal/ProjectsPage/
    ├── index.tsx                            # 主页面组件
    ├── config.tsx                           # 配置文件
    └── ProjectsPage.module.css              # 样式
```

## 与草稿箱的衔接

```
草稿箱                          我的项目
┌────────────────┐              ┌────────────────┐
│ 原始采集数据   │   基础补录    │ 标准化后数据   │
│ (各模块来源)   │ ──────────→  │ (可反复编辑)   │
│                │ 时间/地区/   │                │
│ [补录] 按钮    │ 阶段/计价类型 │ [入库] 按钮    │
└────────────────┘              └────────────────┘
                                      │
                                      │ 完成度≥80%
                                      ▼
                                ┌────────────────┐
                                │   PR 入库      │
                                │  (完整补录)    │
                                └────────────────┘
```

## 类型定义

### ProjectDTO

```typescript
interface ProjectDTO {
  id: string
  projectName: string
  uploadTime: string
  source: ProjectSource  // 'collect' | 'quality' | 'pricing' | 'estimate'
  amount: number
  status: ProjectStatus  // 'draft' | 'ready' | 'submitted' | 'approved'
  compilationPhase?: string
  region?: { province: string; city: string; district?: string }
  subProjectCount?: number
  unitCount?: number
  buildingArea?: number
  unitPrice?: number
  completeness?: number  // 补录完成度 0-100
  createdBy?: string
  updatedAt?: string
}
```

### 来源选项

```typescript
const PROJECT_SOURCE_OPTIONS = [
  { value: 'collect', label: '采集', color: 'blue' },
  { value: 'quality', label: '质控', color: 'green' },
  { value: 'pricing', label: '计价', color: 'orange' },
  { value: 'estimate', label: '估算', color: 'purple' },
]
```

### 状态选项

```typescript
const PROJECT_STATUS_OPTIONS = [
  { value: 'draft', label: '编辑中', color: 'default' },
  { value: 'ready', label: '可入库', color: 'success' },
  { value: 'submitted', label: '已提交', color: 'processing' },
  { value: 'approved', label: '已入库', color: 'purple' },
]
```

## Store 结构

```typescript
interface PersonalProjectsPageState {
  // 数据
  projects: ProjectDTO[]
  loading: boolean
  error: string | null

  // 筛选
  filter: {
    keyword: string
    source: ProjectSource | ''
    status: ProjectStatus | ''
    uploadTimeRange: [string, string] | null
  }

  // 分页
  pagination: { page: number; pageSize: number; total: number }

  // 选中
  selectedIds: string[]

  // 抽屉
  drawerOpen: boolean
  currentProject: ProjectDTO | null

  // Actions
  fetchProjects: () => Promise<void>
  setFilter: (filter: Partial<FilterState>) => void
  resetFilter: () => void
  setPagination: (pagination: Partial<PaginationState>) => void
  setSelectedIds: (ids: string[]) => void
  openDrawer: (project: ProjectDTO) => void
  closeDrawer: () => void
  deleteProject: (id: string) => Promise<boolean>
  deleteSelectedProjects: () => Promise<number>
}
```

## 页面访问

- **路由**: `/assets/personal/projects`
- **侧边栏**: 数据资产 → 我的项目
