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
