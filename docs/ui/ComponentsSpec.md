# ComponentsSpec v1.1 — Platform Business Components

## 0. Goal

Prevent each page from reinventing UI. All pages reuse standardized business components.

---

## 1. Component Index

| Component | Purpose | Section |
|-----------|---------|---------|
| AppShellSidebar | 侧边导航 | §2 |
| FilterBar | 筛选栏 | §3 |
| DataTable | 数据表格 | §4 |
| DetailDrawer | 详情抽屉 | §5 |
| ActionBar | 操作栏 | §6 |
| StatusBadge | 状态标签 | §7 |
| PageStateLoading | 加载态 | §8 |
| PageStateEmpty | 空态 | §8 |
| PageStateError | 错误态 | §8 |

---

## 2. AppShellSidebar

### Props Interface

```ts
interface AppShellSidebarProps {
  mode: 'SimpleNav' | 'WorkspaceNav' | 'WorkflowTree'
  config: SidebarConfig
  badgeCounts?: Record<string, number>  // key -> badge number
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}
```

### Behaviors
- Active item derived from current route
- Max 2 depth
- Badges right aligned, 999+ cap
- Items filtered by permission (if `permission` field exists)

---

## 3. FilterBar (Config-driven)

### Props Interface

```ts
interface FilterBarProps {
  filters: FilterItem[]
  values: Record<string, any>
  onSearch: (values: Record<string, any>) => void
  onReset: () => void
  loading?: boolean
}

interface FilterItem {
  key: string
  type: 'input' | 'select' | 'dateRange' | 'cascader' | 'number'
  label: string
  placeholder?: string
  options?: { label: string; value: string | number }[]  // for select/cascader
  defaultValue?: any
  width?: number  // default 200
}
```

### Example

```tsx
const draftFilterConfig: FilterItem[] = [
  { key: 'keyword', type: 'input', label: '关键词', placeholder: '搜索名称/项目' },
  { key: 'type', type: 'select', label: '类型', options: DRAFT_TYPE_OPTIONS },
  { key: 'status', type: 'select', label: '状态', options: DRAFT_STATUS_OPTIONS },
  { key: 'createdAt', type: 'dateRange', label: '创建时间' },
]
```

### Rules
- Enter triggers search
- Reset restores defaults
- **Persist in pageStore**

---

## 4. DataTable (AntD Table Wrapper)

### Props Interface

```ts
interface DataTableProps<T> {
  columns: ColumnDef[]
  dataSource: T[]
  loading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
  onChange?: (pagination: any, filters: any, sorter: any) => void
  onRow?: (record: T) => { onClick?: () => void }
  rowClassName?: (record: T) => string
  rowKey?: string | ((record: T) => string)
  error?: { code?: number; message?: string }
  onRetry?: () => void
  emptyType?: 'init' | 'filtered'
  onCreate?: () => void
  onClearFilter?: () => void
}

interface ColumnDef {
  key: string
  title: string
  dataIndex: string
  width?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  priority: 'P0' | 'P1' | 'P2'  // for responsive
  render?: 'text' | 'date' | 'status' | 'actions' | 'link' | 'tags' | ((value: any, record: any) => ReactNode)
}
```

### Column Priority (for Responsive)

| Priority | Description | Visibility |
|----------|-------------|------------|
| P0 | 必须显示 (关键列) | Always |
| P1 | 重要列 | XL/L/M |
| P2 | 辅助信息 | XL/L only |

### States (Must Implement)
- **Loading**: skeleton/spinner in table area
- **Empty-Init**: show with CTA (新建/导入)
- **Empty-Filtered**: show with "清空筛选" CTA
- **Error**: error banner + retry

---

## 5. DetailDrawer

### Props Interface

```ts
interface DetailDrawerProps {
  open: boolean
  id: string | null
  sections: DrawerSection[]
  onClose: () => void
  loading?: boolean
  error?: { code?: number; message?: string }
  onRetry?: () => void
  title?: string
  subtitle?: string
  actions?: ActionItem[]
}

interface DrawerSection {
  key: string
  title: string
  fields: DrawerField[]
}

interface DrawerField {
  key: string
  label: string
  dataIndex: string
  span?: 1 | 2  // 占几列，默认1
  render?: 'text' | 'date' | 'status' | 'link' | 'tags' | ((value: any) => ReactNode)
}

interface ActionItem {
  key: string
  label: string
  type?: 'primary' | 'default' | 'danger'
  permission?: string
  confirm?: { title: string; content: string }
  onClick: () => void
}
```

### Behaviors
- Esc closes
- **Preserves list filters/scroll when closing**
- Edit mode with validation (if applicable)
- Unsaved changes → confirm on close

---

## 6. ActionBar

### Rules
- **Only ONE Primary button**
- Secondary actions: default buttons or "More" dropdown
- Destructive action separated with confirm modal

### Example

```tsx
<ActionBar
  primary={{ label: '新建草稿', onClick: handleCreate, permission: 'collect.write' }}
  secondary={[
    { label: '导出', onClick: handleExport, permission: 'collect.export' },
    { label: '批量删除', onClick: handleBatchDelete, permission: 'collect.delete', danger: true },
  ]}
/>
```

---

## 7. StatusBadge

### Props Interface

```ts
interface StatusBadgeProps {
  status: string
  options: StatusOption[]
  size?: 'small' | 'default'
}

interface StatusOption {
  value: string
  label: string
  color: 'default' | 'processing' | 'success' | 'error' | 'warning'
}
```

### Rules
- One style across platform
- Size & color from tokens
- **No ad-hoc badge variants**

---

## 8. State Components (Required)

See /docs/ui/StatesSpec.md for full details.

### PageStateLoading

```ts
interface PageStateLoadingProps {
  type?: 'table' | 'drawer' | 'card'
  rows?: number  // for table skeleton, default 5
}
```

### PageStateEmpty

```ts
interface PageStateEmptyProps {
  type: 'init' | 'filtered'
  title?: string
  description?: string
  onCreate?: () => void
  onClearFilter?: () => void
  extra?: ReactNode
}
```

### PageStateError

```ts
interface PageStateErrorProps {
  code?: number | 'network'
  message?: string
  onRetry: () => void
  onBack?: () => void
}
```

---

## 9. Forbidden Patterns

- ❌ Custom sidebar HTML/CSS per page
- ❌ Ad-hoc badge variants
- ❌ Ad-hoc "filter row" per page (use FilterBar)
- ❌ Inline column render functions (use registered render types)
- ❌ Skip any of Loading/Empty/Error states
- ❌ Direct AntD Table without DataTable wrapper

---

## 10. P1 List Page Complete Example

```tsx
// pages/collect/DraftOverviewPage/index.tsx
import { PageContainer } from '@/components/ui/PageContainer'
import { FilterBar } from '@/components/business/FilterBar'
import { DataTable } from '@/components/business/DataTable'
import { DetailDrawer } from '@/components/business/DetailDrawer'
import { usePermission } from '@/hooks/usePermission'
import { useDraftList } from '@/services/collect'
import { useCollectDraftsPageStore } from '@/stores/collectDraftsPageStore'
import { draftFilterConfig, draftColumns, draftDetailSections } from './config'

export const DraftOverviewPage = () => {
  const canWrite = usePermission('collect.write')
  const { filters, setFilters, resetFilters, pagination, selectedId, setSelectedId } = useCollectDraftsPageStore()
  const { data, loading, error, refetch } = useDraftList(filters, pagination)

  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  return (
    <PageContainer
      title="草稿总览"
      description="管理造价文件/材料表/清单价格表的采集草稿与处理状态"
      primaryAction={canWrite ? { label: '新增草稿', onClick: () => navigate('/collect/drafts/create') } : undefined}
    >
      <FilterBar
        filters={draftFilterConfig}
        values={filters}
        onSearch={setFilters}
        onReset={resetFilters}
      />

      <DataTable
        columns={draftColumns}
        dataSource={data?.items || []}
        loading={loading}
        error={error}
        onRetry={refetch}
        pagination={{ page: pagination.page, pageSize: pagination.pageSize, total: data?.total || 0 }}
        emptyType={hasFilters ? 'filtered' : 'init'}
        onCreate={canWrite ? () => navigate('/collect/drafts/create') : undefined}
        onClearFilter={resetFilters}
        onRow={(record) => ({ onClick: () => setSelectedId(record.id) })}
        rowClassName={(record) => record.id === selectedId ? 'row-selected' : ''}
      />

      <DetailDrawer
        open={!!selectedId}
        id={selectedId}
        sections={draftDetailSections}
        onClose={() => setSelectedId(null)}
      />
    </PageContainer>
  )
}
```

---

## 11. ProjectPicker (工程选择器)

> 通用组件，在多个模块被调用：采集补录、PR流程、对比归因、质控

### Props Interface

```ts
interface ProjectPickerProps {
  /** 选择模式 */
  mode: 'single' | 'multiple'
  /** 选中的工程ID */
  value?: string | string[]
  /** 选择回调 */
  onChange: (value: string | string[], projects: ProjectDTO | ProjectDTO[]) => void
  /** 展示方式 */
  display?: 'modal' | 'drawer' | 'inline'
  /** 触发器（modal/drawer 模式） */
  trigger?: ReactNode
  /** 是否显示（受控） */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 筛选条件 */
  filters?: {
    types?: ProjectType[]
    statuses?: ProjectStatus[]
    space?: 'personal' | 'enterprise' | 'all'
  }
  /** 是否显示层级（项目/单项/单位） */
  showHierarchy?: boolean
  /** 选择层级（默认 project） */
  selectLevel?: 'project' | 'subProject' | 'unit' | 'pricingFile'
  /** 最大选择数量（multiple 模式） */
  maxCount?: number
  /** 已禁用的ID列表 */
  disabledIds?: string[]
  /** 标题 */
  title?: string
  /** 占位文本 */
  placeholder?: string
}
```

### 使用场景

```tsx
// 场景1：采集补录 - 选择目标工程（单选）
<ProjectPicker
  mode="single"
  display="modal"
  trigger={<Button>选择目标工程</Button>}
  value={targetProjectId}
  onChange={(id, project) => setTargetProject(project)}
  title="选择目标工程"
/>

// 场景2：PR流程 - 选择来源和目标（单选 x 2）
<ProjectPicker
  mode="single"
  display="drawer"
  filters={{ space: 'personal' }}
  value={sourceProjectId}
  onChange={(id) => setSourceProjectId(id)}
  title="选择来源工程"
/>
<ProjectPicker
  mode="single"
  display="drawer"
  filters={{ space: 'enterprise' }}
  value={targetProjectId}
  onChange={(id) => setTargetProjectId(id)}
  title="选择目标工程"
/>

// 场景3：对比归因 - 多选（2个或以上）
<ProjectPicker
  mode="multiple"
  display="modal"
  value={compareProjectIds}
  onChange={(ids) => setCompareProjectIds(ids)}
  maxCount={5}
  title="选择对比工程"
  placeholder="请选择2-5个工程进行对比"
/>

// 场景4：质控 - 选择工程
<ProjectPicker
  mode="single"
  display="inline"
  showHierarchy
  selectLevel="unit"
  value={selectedUnitId}
  onChange={(id, unit) => setSelectedUnit(unit)}
/>
```

### 内部结构

```
┌────────────────────────────────────────────────┐
│ [搜索框] [类型筛选] [状态筛选]                 │
├────────────────────────────────────────────────┤
│                                                │
│  ┌─────────────┐  ┌──────────────────────────┐│
│  │ 项目树      │  │ 详情/子级列表            ││
│  │             │  │                          ││
│  │ ▶ 项目A     │  │ 单项工程1                ││
│  │   ▶ 单项1   │  │ 单项工程2                ││
│  │   ▶ 单项2   │  │ ...                      ││
│  │ ▶ 项目B     │  │                          ││
│  │             │  │                          ││
│  └─────────────┘  └──────────────────────────┘│
│                                                │
├────────────────────────────────────────────────┤
│ 已选择: 项目A > 单项工程1     [确定] [取消]   │
└────────────────────────────────────────────────┘
```

### Behaviors

- 支持搜索（按名称/编号）
- 支持按类型、状态筛选
- 树形展示层级关系（可选）
- 选中后显示完整路径
- multiple 模式支持批量选择/取消
- 已禁用项显示但不可选

### States

- **Loading**: 加载项目列表时显示骨架屏
- **Empty**: 无匹配项目时显示空态
- **Error**: 加载失败时显示错误 + 重试

---

## 12. Forbidden Patterns (Updated)

- ❌ Custom sidebar HTML/CSS per page
- ❌ Ad-hoc badge variants
- ❌ Ad-hoc "filter row" per page (use FilterBar)
- ❌ Inline column render functions (use registered render types)
- ❌ Skip any of Loading/Empty/Error states
- ❌ Direct AntD Table without DataTable wrapper
- ❌ **每个模块自己写工程选择逻辑（必须用 ProjectPicker）**
- ❌ **直接使用 webix.ui()，必须用封装组件**