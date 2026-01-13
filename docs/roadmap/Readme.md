# Development Roadmap

> 本目录包含项目开发的阶段性执行文档。每个 Phase 都是一个独立的里程碑。

---

## Overview

| Phase | Name | Goal | Status |
|-------|------|------|--------|
| 1 | [Infrastructure](./Phase1_Infra.md) | 应用骨架、路由、全局状态 | [ ] Pending |
| 2 | [Components](./Phase2_Components.md) | 通用组件「五件套」+ 状态组件 | [ ] Pending |
| 3 | [Data Layer](./Phase3_Data.md) | DTO、API Service、Hooks | [ ] Pending |
| 4 | [Golden Page](./Phase4_GoldenPage.md) | 第一个完整页面（DraftOverview） | [ ] Pending |

---

## Execution Order

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4
  │           │           │           │
  │           │           │           └── 黄金样板页
  │           │           └── DTO + Service
  │           └── UI 组件
  └── 基础设施
```

**必须按顺序执行**，后一阶段依赖前一阶段的产出物。

---

## How to Use with AI (Windsurf/Cursor)

### 启动新阶段

```
我们开始 Phase X 开发。
请先阅读 docs/roadmap/PhaseX_XXX.md，然后按照 Tasks 列表执行。
```

### 继续未完成的阶段

```
请阅读 docs/roadmap/PhaseX_XXX.md，检查哪些 Tasks 还未完成，继续执行。
```

### 验收当前阶段

```
请检查 docs/roadmap/PhaseX_XXX.md 的 Acceptance Criteria，确认是否全部通过。
```

---

## Progress Tracking

在每个 Phase 文档中：
- `[ ]` 表示待完成
- `[x]` 表示已完成

你可以手动更新这些状态，或让 AI 在完成后更新。

---

## After All Phases Complete

Phase 1-4 完成后，你将拥有：

1. **完整的应用骨架**（AppShell + Router + Store）
2. **可复用的组件库**（FilterBar/DataTable/DetailDrawer 等）
3. **类型安全的数据层**（DTO + Service + Hooks）
4. **一个黄金样板页**（DraftOverviewPage）

后续开发其他页面时，只需：
1. 复制 `DraftOverviewPage` 目录结构
2. 修改 `config.ts` 中的配置
3. 使用对应模块的 DTO 和 Service

---

## Troubleshooting

### AI 不遵循规范？
让 AI 重新阅读 `docs/AGENTS.md` 和相关 spec 文档。

### 组件接口不确定？
查看 `docs/ui/ComponentsSpec.md`。

### 字段不确定？
查看 `docs/api/schemas/{module}.md`，禁止自创字段。

### 权限逻辑不确定？
查看 `docs/security/Permissions.md`。