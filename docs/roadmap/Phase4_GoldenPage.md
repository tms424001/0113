# Phase 4: Golden Page (Draft Overview)

> **Goal**: 组装第一个完整页面，验证整体架构。这是「大考」。
> **Status**: [ ] Pending
> **Depends on**: Phase 1 ✅, Phase 2 ✅, Phase 3 ✅

---

## Reference Specs (AI Must Read First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/examples/DraftOverviewPage_GoldenExample.md` | **页面蓝图，必须严格遵循** |
| 2 | `docs/security/Permissions.md` | 权限 key 与按钮控制 |
| 3 | `docs/ui/ComponentsSpec.md` | 组件使用方式 |
| 4 | `docs/quality/DoD_Checklist.md` | 完成标准 |

---

## Tasks

### 4.1 Page Store
- [ ] Create `src/stores/collectDraftsPageStore.ts` (Zustand)
  ```ts
  interface CollectDraftsPageState {
    // Filters
    filters: Partial<DraftListQuery>
    setFilters: (filters: Partial<DraftListQuery>) => void
    resetFilters: () => void
    
    // Pagination
    pagination: { page: number; pageSize: number }
    setPagination: (pagination: { page: number; pageSize: number }) => void
    
    // Selection
    selectedDraftId: string | null
    setSelectedDraftId: (id: string | null) => void
  }
  ```

### 4.2 Page Config
- [ ] Create `src/pages/collect/DraftOverviewPage/config.ts`
  - `draftFilterConfig: FilterItem[]` — 筛选项配置
  - `draftColumns: ColumnDef[]` — 表格列配置（带 priority）
  - `draftDetailSections: DrawerSection[]` — 抽屉详情配置

### 4.3 Page Component
- [ ] Create `src/pages/collect/DraftOverviewPage/index.tsx`
  - 使用 `PageContainer` 包裹
  - 使用 `FilterBar` + config
  - 使用 `DataTable` + config
  - 使用 `DetailDrawer` + config
  - **严格按照 GoldenExample.md 结构**

### 4.4 Data Integration
- [ ] 在页面中使用 `useRequest` + `collectApi.getDrafts`
- [ ] 筛选条件变化时重新请求
- [ ] 分页变化时重新请求

### 4.5 Detail Drawer Content
- [ ] 抽屉显示草稿详情（基本信息）
- [ ] 抽屉显示 Jobs 列表（处理任务）
- [ ] 抽屉显示 Issues 列表（问题列表）

### 4.6 Permission Control
- [ ] 「新增草稿」按钮：需要 `collect.write` 权限，无权限则隐藏
- [ ] 「删除」操作：需要 `collect.delete` 权限，无权限则禁用 + tooltip
- [ ] 「运行任务」：需要 `collect.runJobs` 权限

### 4.7 Interaction Polish
- [ ] Esc 关闭抽屉
- [ ] Enter 触发筛选
- [ ] 删除操作二次确认
- [ ] 操作成功/失败 Toast 提示

### 4.8 Route Registration
- [ ] 在 `src/app/routes.tsx` 中注册 `/collect/drafts` 路由
- [ ] 确保 Sidebar 正确高亮

---

## Deliverables (产出物)

```
src/
├── pages/
│   └── collect/
│       └── DraftOverviewPage/
│           ├── index.tsx
│           ├── config.ts
│           └── DraftOverviewPage.module.css (if needed)
└── stores/
    └── collectDraftsPageStore.ts
```

---

## Acceptance Criteria (验收标准)

### DoD Checklist (必须全部通过)

- [ ] **DoD-1 Main Flow**: 列表 → 点击行 → 抽屉详情 → 关闭，≤3 步完成
- [ ] **DoD-2 States**: Loading/Empty/Error 三态全部实现
  - [ ] Loading 时显示骨架屏
  - [ ] Empty-Init 显示「新增草稿」按钮
  - [ ] Empty-Filtered 显示「清空筛选」按钮
  - [ ] Error 显示错误信息 + 重试按钮
- [ ] **DoD-3 Data Binding**: 所有字段来自 `DraftDTO`，无自造字段
- [ ] **DoD-4 Validation**: N/A（本页无表单提交）
- [ ] **DoD-5 Consistency**: 使用 AppShell + P1 List 模式，主操作唯一

### Functional

- [ ] 筛选功能正常（关键词、类型、状态）
- [ ] 分页功能正常
- [ ] 点击行打开详情抽屉
- [ ] 抽屉显示基本信息、Jobs、Issues
- [ ] 关闭抽屉后筛选条件不丢失
- [ ] 刷新页面后 URL 驱动 Sidebar 高亮正确

### Permission

- [ ] 无 `collect.write` 权限时，「新增」按钮不显示
- [ ] 无 `collect.delete` 权限时，「删除」按钮禁用

### Code Quality

- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 错误
- [ ] 无 `any` 类型
- [ ] 使用 Phase 2 的组件，没有重复实现

---

## Prompt for AI

```
我们开始 Phase 4 黄金样板页开发。

请先阅读以下文档：
- docs/examples/DraftOverviewPage_GoldenExample.md（页面蓝图，最重要）
- docs/security/Permissions.md（权限控制）
- docs/quality/DoD_Checklist.md（完成标准）

然后按照 docs/roadmap/Phase4_GoldenPage.md 的 Tasks 列表执行。

关键要求：
1. 严格按照 GoldenExample.md 的结构实现
2. 必须使用 Phase 2 创建的组件（FilterBar/DataTable/DetailDrawer）
3. 必须使用 Phase 3 创建的 DTO 和 API Service
4. 权限控制必须实现
5. 完成后输出 DoD Checklist

这是整个项目的「大考」，确保所有验收标准通过。
```

---

## Final Output Format

完成 Phase 4 后，输出格式：

```markdown
## Summary
- Created DraftOverviewPage with FilterBar, DataTable, DetailDrawer
- Implemented permission controls for create/delete actions
- Connected to collectApi with useRequest hook

## Files Created/Modified
- src/pages/collect/DraftOverviewPage/index.tsx
- src/pages/collect/DraftOverviewPage/config.ts
- src/stores/collectDraftsPageStore.ts
- src/app/routes.tsx (modified)

## DoD Checklist
- DoD-1: ✅ 列表 → 点击行 → 抽屉详情 → 关闭，3步完成
- DoD-2: ✅ Loading/Empty-Init/Empty-Filtered/Error 四种状态全部实现
- DoD-3: ✅ 所有字段来自 DraftDTO (name/type/status/projectName/updatedAt/stats.issues)
- DoD-4: ⚠️ N/A 本页无表单提交
- DoD-5: ✅ AppShell + P1 List 模式，主操作「新增草稿」唯一
```

---

## Notes

- 这是第一个完整页面，作为后续页面的模板
- 完成后，其他页面（如 PricingTasksPage）可以参照此模式快速开发
- 如果使用 Mock 数据开发，确保 Mock 数据结构与 DTO 一致
- **禁止在页面内重新实现 FilterBar/DataTable 等组件**
