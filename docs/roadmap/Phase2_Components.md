# Phase 2: Core Business Components (UI Kit)

> **Goal**: 构建可复用的业务组件「五件套」+ 状态组件「三件套」。
> **Status**: [ ] Pending
> **Depends on**: Phase 1 ✅

---

## Reference Specs (AI Must Read First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/ui/ComponentsSpec.md` | 组件接口定义、Props 类型 |
| 2 | `docs/ui/StatesSpec.md` | Loading/Empty/Error 三态规范 |
| 3 | `docs/ui/InteractionSpec.md` | 交互行为、hover/focus |
| 4 | `docs/ui/DesignTokens.md` | 样式 Token |
| 5 | `docs/styles/CSSRules.md` | CSS 写法规范 |

---

## Tasks

### 2.1 State Components (三件套)
- [ ] Create `src/components/ui/PageStateLoading.tsx`
  - Props: `type?: 'table' | 'drawer' | 'card'`, `rows?: number`
  - 表格用 Skeleton，抽屉用 Spin + 占位
- [ ] Create `src/components/ui/PageStateEmpty.tsx`
  - Props: `type: 'init' | 'filtered'`, `onCreate?`, `onClearFilter?`
  - **必须有 CTA 按钮**
- [ ] Create `src/components/ui/PageStateError.tsx`
  - Props: `code?: number | 'network'`, `message?`, `onRetry`
  - **必须有重试按钮**
- [ ] Create `src/components/ui/index.ts` (统一导出)

### 2.2 PageContainer
- [ ] Create `src/components/ui/PageContainer.tsx`
  - Props: `title`, `description?`, `primaryAction?`, `secondaryActions?`
  - 布局：标题行 + 操作按钮区
  - **主操作唯一**（primaryAction 只能有一个）

### 2.3 StatusBadge
- [ ] Create `src/components/ui/StatusBadge.tsx`
  - Props: `status: string`, `options: StatusOption[]`, `size?`
  - 根据 status 值匹配 options 里的 color
  - 使用 AntD Tag 或 Badge 组件

### 2.4 FilterBar (Config-driven)
- [ ] Create `src/components/business/FilterBar.tsx`
  - Props: `filters: FilterItem[]`, `values`, `onSearch`, `onReset`, `loading?`
  - 支持类型: `input`, `select`, `dateRange`, `cascader`
  - **Enter 触发搜索**
  - **Reset 恢复默认值**
- [ ] Create `src/components/business/FilterBar.module.css`

### 2.5 DataTable (AntD Table Wrapper)
- [ ] Create `src/components/business/DataTable.tsx`
  - Props: `columns`, `dataSource`, `loading`, `error`, `pagination`, `emptyType`, `onCreate`, `onClearFilter`, `onRetry`
  - **内置三态处理**：
    - `loading=true` → 显示 PageStateLoading
    - `error` 存在 → 显示 PageStateError
    - `dataSource.length === 0` → 显示 PageStateEmpty
  - 支持列优先级 (P0/P1/P2) 用于响应式
- [ ] Create `src/components/business/DataTable.module.css`

### 2.6 DetailDrawer
- [ ] Create `src/components/business/DetailDrawer.tsx`
  - Props: `open`, `id`, `title?`, `sections`, `actions?`, `onClose`, `loading?`, `error?`, `onRetry?`
  - **Esc 关闭**
  - **关闭时保持列表筛选状态**（由调用方控制，组件不清空外部状态）
  - 支持编辑态的「未保存确认」
- [ ] Create `src/components/business/DetailDrawer.module.css`

### 2.7 ActionBar
- [ ] Create `src/components/business/ActionBar.tsx`
  - Props: `primary?`, `secondary?`
  - **只允许一个 Primary 按钮**
  - 危险操作需要 confirm

### 2.8 Business Components Index
- [ ] Create `src/components/business/index.ts` (统一导出)

---

## Deliverables (产出物)

```
src/components/
├── ui/
│   ├── PageContainer.tsx
│   ├── PageStateLoading.tsx
│   ├── PageStateEmpty.tsx
│   ├── PageStateError.tsx
│   ├── StatusBadge.tsx
│   └── index.ts
└── business/
    ├── FilterBar.tsx
    ├── FilterBar.module.css
    ├── DataTable.tsx
    ├── DataTable.module.css
    ├── DetailDrawer.tsx
    ├── DetailDrawer.module.css
    ├── ActionBar.tsx
    └── index.ts
```

---

## Acceptance Criteria (验收标准)

### State Components
- [ ] PageStateLoading 在 table/drawer/card 模式下显示不同骨架
- [ ] PageStateEmpty 的 init 类型显示「新建」按钮
- [ ] PageStateEmpty 的 filtered 类型显示「清空筛选」按钮
- [ ] PageStateError 显示错误信息 + 重试按钮

### FilterBar
- [ ] 可通过 config 配置筛选项
- [ ] Enter 键触发搜索
- [ ] Reset 按钮恢复默认值

### DataTable
- [ ] `loading=true` 时显示 Loading 态
- [ ] `error` 时显示 Error 态 + Retry
- [ ] 数据为空时根据 `emptyType` 显示对应 Empty 态
- [ ] 数据存在时正常渲染表格

### DetailDrawer
- [ ] Esc 键可关闭抽屉
- [ ] 关闭抽屉后，外部筛选状态不丢失

### General
- [ ] 所有组件使用 CSS Modules 样式
- [ ] 所有组件有完整的 TypeScript 类型定义
- [ ] 没有使用 `any` 类型

---

## Prompt for AI

```
我们开始 Phase 2 通用组件开发。

请先阅读以下文档：
- docs/ui/ComponentsSpec.md（组件接口定义）
- docs/ui/StatesSpec.md（三态规范，非常重要）
- docs/ui/InteractionSpec.md（交互规范）
- docs/styles/CSSRules.md（样式规范）

然后按照 docs/roadmap/Phase2_Components.md 的 Tasks 列表，从 2.1 开始依次执行。

重要提醒：
1. 组件放在 src/components/ui/ 和 src/components/business/
2. 使用 CSS Modules 写样式
3. DataTable 必须内置三态处理
4. 所有 Props 必须有 TypeScript 类型

完成后，确保验收标准全部通过。
```

---

## Notes

- 此阶段的组件都是「纯展示 + 回调」，不直接调用 API
- 可以用硬编码的 Mock 数据测试组件
- 组件的 Props 接口必须严格按照 `ComponentsSpec.md`
- 完成此阶段后再进入 Phase 3
