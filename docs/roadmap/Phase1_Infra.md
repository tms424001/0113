# Phase 1: Infrastructure & AppShell

> **Goal**: 搭建应用骨架、路由、全局状态、核心基础设施文件。
> **Status**: [ ] Pending

---

## Reference Specs (AI Must Read First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/AGENTS.md` | 技术栈、目录结构、命名规范 |
| 2 | `docs/ui/LayoutSpec.md` | AppShell 结构、Sidebar 模式 |
| 3 | `docs/ui/DesignTokens.md` | 颜色、间距、CSS 变量 |
| 4 | `docs/spec/RoutesAndIA.md` | 路由表、模块划分 |
| 5 | `docs/templates/*.md` | http/env/ErrorBoundary 模板 |

---

## Tasks

### 1.1 Project Setup
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install dependencies: `antd`, `react-router-dom`, `zustand`, `axios`
- [ ] Configure `tsconfig.json` with `strict: true`
- [ ] Setup path alias `@/` → `src/`

### 1.2 Global Styles & Theme
- [ ] Create `src/styles/tokens.css` based on `docs/ui/DesignTokens.md`
- [ ] Create `src/styles/global.css` (reset, base styles)
- [ ] Create `src/styles/theme.ts` (AntD ConfigProvider theme)
- [ ] Create `src/styles/antd-overrides.css` (placeholder)

### 1.3 Environment & HTTP
- [ ] Create `src/constants/env.ts` — copy from `docs/templates/env.ts.md`
- [ ] Create `src/services/http.ts` — copy from `docs/templates/http.ts.md`
- [ ] Create `.env.development` with `VITE_API_BASE_URL=http://localhost:3000`

### 1.4 Error Boundary
- [ ] Create `src/app/ErrorBoundary.tsx` — copy from `docs/templates/ErrorBoundary.tsx.md`

### 1.5 Router Setup
- [ ] Create `src/app/routes.tsx` based on `docs/spec/RoutesAndIA.md`
- [ ] Create route constants `src/constants/routes.ts`
- [ ] Setup lazy loading for page components

### 1.6 Global Store
- [ ] Create `src/stores/appStore.ts` (Zustand)
  - `user: User | null`
  - `permissions: string[]`
  - `sidebarCollapsed: boolean`
  - `setUser()`, `clearUser()`, `toggleSidebar()`

### 1.7 AppShell Layout
- [ ] Create `src/components/layout/AppShell.tsx`
  - TopNav (logo + module tabs)
  - Sidebar (config-driven, 256px fixed)
  - Content area
- [ ] Create `src/components/layout/TopNav.tsx`
- [ ] Create `src/components/layout/Sidebar.tsx`
  - Support 3 modes: SimpleNav / WorkspaceNav / WorkflowTree
  - Active state derived from `useLocation()` (NOT manual state)

### 1.8 Sidebar Config
- [ ] Create `src/app/sidebar/collectSidebar.ts` (Collect module config)
- [ ] Create `src/app/sidebar/pricingSidebar.ts` (Pricing module config)

### 1.9 App Entry
- [ ] Create `src/App.tsx` with:
  - ErrorBoundary wrapper
  - ConfigProvider (AntD theme)
  - RouterProvider
- [ ] Create `src/app/Providers.tsx` (组合所有 Provider)

---

## Deliverables (产出物)

```
src/
├── app/
│   ├── routes.tsx
│   ├── Providers.tsx
│   ├── ErrorBoundary.tsx
│   └── sidebar/
│       ├── collectSidebar.ts
│       └── pricingSidebar.ts
├── components/
│   └── layout/
│       ├── AppShell.tsx
│       ├── TopNav.tsx
│       └── Sidebar.tsx
├── stores/
│   └── appStore.ts
├── services/
│   └── http.ts
├── constants/
│   ├── env.ts
│   └── routes.ts
├── styles/
│   ├── tokens.css
│   ├── global.css
│   ├── theme.ts
│   └── antd-overrides.css
└── App.tsx
```

---

## Acceptance Criteria (验收标准)

- [ ] 应用可启动，无控制台报错
- [ ] AppShell 布局正确显示（TopNav + Sidebar + Content）
- [ ] Sidebar 宽度 256px，样式符合 DesignTokens
- [ ] 点击 Sidebar 菜单可切换路由
- [ ] **Sidebar 高亮由 URL 驱动**，刷新页面后高亮正确
- [ ] ErrorBoundary 工作正常（可手动抛错测试）
- [ ] `ENV.API_BASE_URL` 可正确读取

---

## Prompt for AI

```
我们开始 Phase 1 基础设施搭建。

请先阅读以下文档：
- docs/AGENTS.md（总纲）
- docs/ui/LayoutSpec.md（布局规范）
- docs/ui/DesignTokens.md（设计 Token）
- docs/spec/RoutesAndIA.md（路由表）
- docs/templates/env.ts.md
- docs/templates/http.ts.md
- docs/templates/ErrorBoundary.tsx.md

然后按照 docs/roadmap/Phase1_Infra.md 的 Tasks 列表，从 1.1 开始依次执行。

完成后，确保验收标准全部通过。
```

---

## Notes

- 此阶段不涉及业务组件，只搭骨架
- Sidebar 数据暂时写死配置，不需要从 API 获取
- 页面组件用空白占位符即可（如 `<div>Draft Overview Page</div>`）
- 完成此阶段后再进入 Phase 2

