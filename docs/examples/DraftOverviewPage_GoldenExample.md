# DraftOverviewPage — Golden Example v1.0

> 这是"让 AI 学会平台风格"的关键样板：Pattern、组件、三态、权限、DTO 绑定、DoD 自检，都在这里对齐。

---

## A. Page Intent

**用户目标**：查看采集草稿列表，筛选/搜索，打开详情抽屉查看状态、任务与问题，并可新增/删除（按权限）。

**Pattern**: P1 List Workbench

**Layout**:
- PageContainer (title + description + primary action)
- FilterBar
- DataTable
- DetailDrawer (optional, right side)

---

## B. Data Contract (Must Use)

**DTO**: DraftDTO (see /docs/api/schemas/collect.md)

### List API
```
GET /api/collect/drafts?page&pageSize&keyword&type&status&source&sortBy&sortOrder
```

### Detail APIs
```
GET /api/collect/drafts/:id
GET /api/collect/drafts/:id/jobs
GET /api/collect/drafts/:id/issues
```

---

## C. Permissions

| Action | Permission Key |
|--------|----------------|
| View | collect.read |
| Create/Edit | collect.write |
| Delete | collect.delete |
| Run Jobs | collect.runJobs |
| Export | collect.export |

---

## D. UI Skeleton

### 1) PageContainer

```tsx
<PageContainer
  title="草稿总览"
  description="管理造价文件/材料表/清单价格表的采集草稿与处理状态"
  primaryAction={canWrite ? { label: '新增草稿', onClick: handleCreate } : undefined}
  secondaryActions={[
    { label: '导出', onClick: handleExport, permission: 'collect.export' }
  ]}
/>
```

### 2) FilterBar (config-driven)

```ts
// config.ts
export const draftFilterConfig: FilterItem[] = [
  { key: 'keyword', type: 'input', label: '关键词', placeholder: '搜索草稿名称/项目' },
  { key: 'type', type: 'select', label: '类型', options: DRAFT_TYPE_OPTIONS },
  { key: 'status', type: 'select', label: '状态', options: DRAFT_STATUS_OPTIONS },
  { key: 'source', type: 'select', label: '来源', options: DRAFT_SOURCE_OPTIONS },
]
```

**Behavior**:
- Enter triggers search
- Reset restores defaults
- **Persist in pageStore**: `collectDraftsPageStore`

### 3) DataTable (columns must map to DraftDTO)

```ts
// config.ts
export const draftColumns: ColumnDef[] = [
  { key: 'name', title: '名称', dataIndex: 'name', priority: 'P0', width: 200 },
  { key: 'type', title: '类型', dataIndex: 'type', priority: 'P0', width: 100, render: 'select' },
  { key: 'status', title: '状态', dataIndex: 'status', priority: 'P0', width: 100, render: 'status' },
  { key: 'projectName', title: '项目', dataIndex: 'projectName', priority: 'P1', width: 150 },
  { key: 'updatedAt', title: '更新时间', dataIndex: 'updatedAt', priority: 'P1', width: 160, render: 'date' },
  { key: 'issues', title: '问题数', dataIndex: ['stats', 'issues'], priority: 'P2', width: 80, render: 'badge' },
  { key: 'actions', title: '操作', priority: 'P0', width: 120, fixed: 'right', render: 'actions' },
]
```

**Row behavior**:
- Click row → open DetailDrawer(id)
- Selected row highlight

**States** (must follow /docs/ui/StatesSpec.md):
- Loading: table loading
- Empty-Init: CTA = 新增草稿/导入
- Empty-Filtered: CTA = 清空筛选
- Error: Retry reload list

### 4) DetailDrawer

**Header**:
- name + status badge

**Tabs/Sections**:
1. **基本信息**: type/source/projectName/orgName/createdAt/updatedAt
2. **处理任务**: jobs list (state/progress/message)
3. **问题列表**: issues list (level/title/suggestion/fieldPath)

**Actions**:
- Run Normalize (requires `collect.runJobs`)
- Delete (requires `collect.delete`, confirm modal)

```ts
// config.ts
export const draftDetailSections: DrawerSection[] = [
  {
    key: 'basic',
    title: '基本信息',
    fields: [
      { key: 'type', label: '类型', dataIndex: 'type', render: 'select' },
      { key: 'source', label: '来源', dataIndex: 'source', render: 'select' },
      { key: 'projectName', label: '项目名称', dataIndex: 'projectName' },
      { key: 'orgName', label: '组织', dataIndex: 'orgName' },
      { key: 'createdAt', label: '创建时间', dataIndex: 'createdAt', render: 'date' },
      { key: 'updatedAt', label: '更新时间', dataIndex: 'updatedAt', render: 'date' },
    ]
  }
]
```

**Interaction Rules** (must follow InteractionSpec):
- Esc closes drawer
- Close with unsaved edit → confirm (if edit mode exists)

---

## E. Stores (Zustand)

### appStore
```ts
{
  currentUser: User
  permissions: string[]
}
```

### collectDraftsPageStore
```ts
{
  // Filters
  filters: DraftListQuery
  setFilters: (filters: Partial<DraftListQuery>) => void
  resetFilters: () => void
  
  // Pagination
  pagination: { page: number; pageSize: number }
  setPagination: (pagination) => void
  
  // Selection
  selectedDraftId: string | null
  setSelectedDraftId: (id: string | null) => void
}
```

**Rule**: Do NOT store list dataset globally; store query state only.

---

## F. Complete Page Code

```tsx
// src/pages/collect/DraftOverviewPage/index.tsx
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/ui/PageContainer'
import { FilterBar } from '@/components/business/FilterBar'
import { DataTable } from '@/components/business/DataTable'
import { DetailDrawer } from '@/components/business/DetailDrawer'
import { usePermission } from '@/hooks/usePermission'
import { useDraftList, useDraftDetail } from '@/services/collect'
import { useCollectDraftsPageStore } from '@/stores/collectDraftsPageStore'
import { draftFilterConfig, draftColumns, draftDetailSections, draftDetailActions } from './config'
import { ROUTES } from '@/constants/routes'

export const DraftOverviewPage = () => {
  const navigate = useNavigate()
  
  // Permissions
  const canWrite = usePermission('collect.write')
  const canExport = usePermission('collect.export')
  
  // Page store
  const { 
    filters, setFilters, resetFilters, 
    pagination, setPagination,
    selectedDraftId, setSelectedDraftId 
  } = useCollectDraftsPageStore()
  
  // Data fetching
  const { data, loading, error, refetch } = useDraftList(filters, pagination)
  
  // Computed
  const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '')

  // Handlers
  const handleCreate = () => navigate(ROUTES.COLLECT.DRAFTS + '/create')
  const handleExport = () => { /* export logic */ }

  return (
    <PageContainer
      title="草稿总览"
      description="管理造价文件/材料表/清单价格表的采集草稿与处理状态"
      primaryAction={canWrite ? { label: '新增草稿', onClick: handleCreate } : undefined}
      secondaryActions={canExport ? [{ label: '导出', onClick: handleExport }] : undefined}
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
        pagination={{ 
          page: pagination.page, 
          pageSize: pagination.pageSize, 
          total: data?.total || 0 
        }}
        onChange={(pag) => setPagination(pag)}
        emptyType={hasFilters ? 'filtered' : 'init'}
        onCreate={canWrite ? handleCreate : undefined}
        onClearFilter={resetFilters}
        onRow={(record) => ({ 
          onClick: () => setSelectedDraftId(record.id) 
        })}
        rowClassName={(record) => 
          record.id === selectedDraftId ? 'row-selected' : ''
        }
        rowKey="id"
      />

      <DetailDrawer
        open={!!selectedDraftId}
        id={selectedDraftId}
        sections={draftDetailSections}
        actions={draftDetailActions}
        onClose={() => setSelectedDraftId(null)}
      />
    </PageContainer>
  )
}

export default DraftOverviewPage
```

---

## G. DoD Checklist

```
## DoD Checklist

- DoD-1: ✅ 草稿列表 → 点击行 → 抽屉详情 → 关闭，3步完成
- DoD-2: ✅ DataTable 已配置 loading/empty/error 三态，Empty-Init 有「新增草稿」按钮，Empty-Filtered 有「清空筛选」
- DoD-3: ✅ columns 字段来自 DraftDTO (name/type/status/projectName/updatedAt/stats.issues)，无自造字段
- DoD-4: ⚠️ N/A 本页无表单提交，仅列表展示
- DoD-5: ✅ 使用 AppShell + P1 List 模式，主操作「新增草稿」唯一，遵循 DesignTokens 间距
```

---

## H. File Structure

```
src/pages/collect/DraftOverviewPage/
  index.tsx           # Main page component
  config.ts           # Filter config, column config, drawer sections
  DraftOverviewPage.module.css  # Page-specific styles (if any)
```

---

## I. Key Takeaways for AI

1. **Always use config-driven approach** for FilterBar and DataTable
2. **All fields must exist in DTO** — never invent
3. **States are mandatory** — Loading/Empty/Error for every data region
4. **Permissions control visibility** — hide or disable based on permission
5. **Store only query state** — not list data
6. **End every response with DoD Checklist**