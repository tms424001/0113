# LayoutSpec v1.1 — AppShell + Standard Patterns

## 1. AppShell (Global Layout)

### Structure
```
┌─────────────────────────────────────────────────┐
│                    TopNav                        │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│  Sidebar │           Content                     │
│  (256px) │    ┌─────────────────────────┐       │
│          │    │      PageHeader         │       │
│          │    ├─────────────────────────┤       │
│          │    │                         │       │
│          │    │      MainContent        │       │
│          │    │                         │       │
│          │    └─────────────────────────┘       │
└──────────┴──────────────────────────────────────┘
```

### Constraints
- Sidebar width: 256px (fixed)
- Sidebar navigation: max 2 levels
- One active highlight style for whole platform

---

## 2. Sidebar Modes (Config-driven)

Only 3 modes allowed:

| Mode | Use Case | Features |
|------|----------|----------|
| **SimpleNav** | 采集类 | Grouped links |
| **WorkspaceNav** | 资产类 | Space switch + grouped links |
| **WorkflowTree** | 计价类 | Collapsible groups + status badges |

All modes MUST share:
- Same item height (40px)
- Same icon size (16px)
- Same badge style
- Same active style (背景高亮 + 左侧指示条)
- Same group header style

### Sidebar Config Schema

```ts
type SidebarConfig = {
  mode: 'SimpleNav' | 'WorkspaceNav' | 'WorkflowTree'
  groups: SidebarGroup[]
}

type SidebarGroup = {
  key: string
  label: string
  icon?: string
  children: SidebarItem[]
}

type SidebarItem = {
  key: string
  label: string
  path: string
  permission?: string  // 可选，有则检查
  badge?: number | 'dot'
}
```

### Example Config (Collect Module)

```ts
// src/app/sidebar/collectSidebar.ts
export const collectSidebarConfig: SidebarConfig = {
  mode: 'SimpleNav',
  groups: [
    {
      key: 'collect',
      label: '数据采集',
      children: [
        { key: 'drafts', label: '草稿总览', path: '/collect/drafts', permission: 'collect.read' },
        { key: 'pricing-files', label: '造价文件采集', path: '/collect/pricing-files' },
        { key: 'materials', label: '材料数据采集', path: '/collect/materials' },
        { key: 'boq-prices', label: '清单价格采集', path: '/collect/boq-prices' },
      ]
    }
  ]
}
```

---

## 3. Standard Page Patterns (Choose One)

### Pattern P1: List Workbench
```
┌─────────────────────────────────────┐
│ PageHeader [title] [primary action] │
├─────────────────────────────────────┤
│ FilterBar                           │
├─────────────────────────────────────┤
│ DataTable                           │
│                                     │
├─────────────────────────────────────┤
│ [DetailDrawer - optional, right]    │
└─────────────────────────────────────┘
```
Use for: 列表 + 筛选 + 详情

### Pattern P2: Dashboard
```
┌─────────────────────────────────────┐
│ PageHeader [title]                  │
├─────────────────────────────────────┤
│ Metrics Cards (row)                 │
├─────────────────────────────────────┤
│ Section 1 (table/chart)             │
├─────────────────────────────────────┤
│ Section 2 (table/chart)             │
└─────────────────────────────────────┘
```
Use for: 数据概览 + 图表

### Pattern P3: Form Page
```
┌─────────────────────────────────────┐
│ PageHeader [title] [primary action] │
├─────────────────────────────────────┤
│ Form Section 1 (card)               │
├─────────────────────────────────────┤
│ Form Section 2 (card)               │
├─────────────────────────────────────┤
│ Footer [Cancel] [Save]              │
└─────────────────────────────────────┘
```
Use for: 创建/编辑表单

### Pattern P4: Master-Detail
```
┌────────────────┬────────────────────┐
│ PageHeader                          │
├────────────────┼────────────────────┤
│                │                    │
│  Left List     │   Right Detail     │
│  (or Tree)     │   Panel/Drawer     │
│                │                    │
└────────────────┴────────────────────┘
```
Use for: 左右分栏浏览

---

## 4. Pattern → Component Mapping

| Pattern | Region | Component Path |
|---------|--------|----------------|
| P1 List | FilterBar | components/business/FilterBar |
| P1 List | DataTable | components/business/DataTable |
| P1 List | DetailDrawer | components/business/DetailDrawer |
| P3 Form | FormSection | components/business/FormSection |
| All | PageContainer | components/ui/PageContainer |

---

## 5. PageHeader Rules

- Title + optional description
- **Primary action: ONE per page** (主操作唯一)
- Secondary actions in "More" dropdown
- Description should be concise (1 line)

---

## 6. State UI Rules

Every major region (table/detail/form) MUST have:
- **Loading**: skeleton/spinner
- **Empty**: message + actionable CTA
- **Error**: error banner + retry

See /docs/ui/StatesSpec.md for details.

---

## 7. Layout Constants

| Name | Value | Description |
|------|-------|-------------|
| SIDEBAR_WIDTH | 256px | 固定，不可变 |
| SIDEBAR_COLLAPSED_WIDTH | 64px | 收起时 |
| TOPNAV_HEIGHT | 48px | 全局顶栏 |
| PAGE_HEADER_MIN_HEIGHT | 64px | 含标题+描述 |
| CONTENT_PADDING | 24px | 内容区内边距 |
| CONTENT_MAX_WIDTH | 1200px | 可选，居中布局时 |

---

## 8. Quick Reference for AI

Choose page pattern:
- 列表 + 筛选 + 详情 → **P1 List Workbench**
- 数据概览 + 图表 → **P2 Dashboard**
- 创建/编辑表单 → **P3 Form Page**
- 左右分栏浏览 → **P4 Master-Detail**

Forbidden:
- ❌ 自创第5种页面模式
- ❌ Sidebar 超过2级
- ❌ 把业务逻辑放 Sidebar
- ❌ 忘记 Loading/Empty/Error 状态
- ❌ 多于1个 Primary 按钮
