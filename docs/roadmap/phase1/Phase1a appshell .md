# Phase 1A: AppShell (Platform Skeleton)

> **Goal**: 固化平台骨架（TopNav + Sidebar + Layout），所有页面都长在这个壳子里。
> **Status**: [ ] Pending
> **Priority**: 🔴 最高优先级 — 壳子不稳，后面必返工

---

## Reference Specs (AI Must Read First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/ui/LayoutSpec.md` | AppShell 结构、Sidebar 3 种模式 |
| 2 | `docs/spec/RoutesAndIA.md` | 路由表、模块划分 |
| 3 | `docs/templates/sidebarConfig.ts.md` | **侧边栏配置模板（必读）** |
| 4 | `docs/ui/DesignTokens.md` | 颜色、间距 |
| 5 | `docs/ui/InteractionSpec.md` | hover/active 样式 |

---

## Step 0: Project Bootstrap

### 0.1 Initialize Project
- [ ] Create Vite + React + TypeScript project
- [ ] Install dependencies:
  ```bash
  npm install react-router-dom antd @ant-design/icons zustand axios
  ```
- [ ] Configure `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "strict": true,
      "baseUrl": ".",
      "paths": { "@/*": ["src/*"] }
    }
  }
  ```
- [ ] Configure Vite path alias in `vite.config.ts`

### 0.2 Basic Folder Structure
- [ ] Create folder structure:
  ```
  src/
  ├── app/
  │   └── sidebar/
  ├── components/
  │   └── layout/
  ├── stores/
  ├── constants/
  └── styles/
  ```

---

## Step 1: TopNav (顶部模块菜单)

### 1.1 TopNav Config
- [ ] Create `src/app/topNavConfig.ts`
  - 定义 5 个模块：Collect / Assets / QC / Pricing / Estimation
  - 每个模块有：key, label, icon, defaultPath, permission?

### 1.2 TopNav Component
- [ ] Create `src/components/layout/TopNav.tsx`
  - 左侧：Logo
  - 中间/右侧：模块 Tab 列表
  - **当前模块高亮判定**：从 `pathname` 前缀判断（如 `/collect/*` → collect 高亮）
  - 点击模块 → 跳转到该模块的 `defaultPath`
  - 有权限控制：无权限的模块隐藏

### 1.3 TopNav Styles
- [ ] Create `src/components/layout/TopNav.module.css`
  - 高度 48px
  - 背景色、字体大小按 DesignTokens
  - hover/active 样式按 InteractionSpec

### Acceptance Criteria (TopNav)
- [ ] 切模块能稳定跳到默认入口页
- [ ] 刷新后当前模块仍正确高亮
- [ ] 无权限模块自动隐藏

---

## Step 2: Sidebar (侧边栏)

### 2.1 Sidebar Types & Config
- [ ] Create `src/app/sidebar/types.ts` — 类型定义
  - `SidebarMode`: 'SimpleNav' | 'WorkspaceNav' | 'WorkflowTree'
  - `SidebarConfig`, `SidebarGroup`, `SidebarItem`, `SidebarSubItem`
  - 参考 `docs/templates/sidebarConfig.ts.md`

- [ ] Create `src/app/sidebar/collectSidebar.ts` — Collect 配置
- [ ] Create `src/app/sidebar/assetsSidebar.ts` — Assets 配置
- [ ] Create `src/app/sidebar/pricingSidebar.ts` — Pricing 配置
- [ ] Create `src/app/sidebar/index.ts` — 统一导出 + `getModuleFromPath()` + `moduleDefaultPaths`

### 2.2 AppShellSidebar Component
- [ ] Create `src/components/layout/AppShellSidebar.tsx`
  - Props: 无（从 URL 自动判断模块）
  - **配置驱动**：接收 `sidebarConfig`
  - **路由驱动高亮**：从 `useLocation().pathname` 推导 `selectedKey` / `openKeys`
  - **权限过滤**：有 `permission` 字段的项，无权限则隐藏
  - **Badge 支持**：有 `badgeKey` 字段的项，从 store 读取数字
  - **2 级深度限制**：超出则 console.error 并拒绝渲染

### 2.3 Sidebar Styles
- [ ] Create `src/components/layout/AppShellSidebar.module.css`
  - 宽度 256px（固定）
  - 收起宽度 64px
  - item 高度 40px
  - icon 大小 16px
  - hover 背景：`rgba(0,0,0,0.04)`
  - active 背景：`#e6f7ff` + 左侧 2px 指示条
  - **所有模块视觉一致**

### Acceptance Criteria (Sidebar)
- [ ] 任意页面刷新，侧边栏高亮不丢
- [ ] 不同模块侧边栏视觉一致，只是内容不同
- [ ] 无权限菜单项隐藏
- [ ] 支持 collapse（收起/展开）
- [ ] 最多 2 级菜单，超出报错

---

## Step 3: AppShell Layout

### 3.1 AppShell Component
- [ ] Create `src/components/layout/AppShell.tsx`
  ```tsx
  <div className={styles.appShell}>
    <TopNav />
    <div className={styles.body}>
      <AppShellSidebar />
      <main className={styles.content}>
        <Outlet />  {/* React Router 子路由渲染 */}
      </main>
    </div>
  </div>
  ```

### 3.2 AppShell Styles
- [ ] Create `src/components/layout/AppShell.module.css`
  - TopNav 固定顶部
  - Sidebar 固定左侧
  - Content 区自适应剩余宽度
  - Content 内边距 24px

### 3.3 Layout Index
- [ ] Create `src/components/layout/index.ts` — 统一导出

### Acceptance Criteria (AppShell)
- [ ] 任何新页面都不需要再写布局
- [ ] 样式/间距一致（DesignTokens 生效）
- [ ] Sidebar collapse 时 Content 自动扩展

---

## Step 4: Basic Router Setup

### 4.1 Route Constants
- [ ] Create `src/constants/routes.ts`
  ```ts
  export const ROUTES = {
    COLLECT: { DRAFTS: '/collect/drafts', ... },
    ASSETS: { ... },
    PRICING: { ... },
  }
  ```

### 4.2 Basic Router
- [ ] Create `src/app/routes.tsx`
  - 顶层路由使用 `AppShell` 作为 Layout
  - 子路由：`/collect/*`, `/assets/*`, `/pricing/*`, `/qc/*`, `/estimation/*`
  - 每个模块有默认重定向（如 `/collect` → `/collect/drafts`）
  - 页面组件暂用占位符：`<div>Page Name</div>`

### 4.3 App Entry
- [ ] Create `src/App.tsx`
  ```tsx
  <RouterProvider router={router} />
  ```

### Acceptance Criteria (Router)
- [ ] 访问 `/collect` 自动跳转到 `/collect/drafts`
- [ ] 访问 `/assets` 自动跳转到 `/assets/personal/dashboard`
- [ ] 所有路由都渲染在 AppShell 内

---

## Step 5: Global Store (Minimal)

### 5.1 App Store
- [ ] Create `src/stores/appStore.ts`
  ```ts
  interface AppState {
    user: User | null
    permissions: string[]
    sidebarCollapsed: boolean
    setUser: (user: User, permissions: string[]) => void
    clearUser: () => void
    toggleSidebar: () => void
  }
  ```

### 5.2 Mock Permissions (for testing)
- [ ] 在 appStore 初始状态中设置 mock permissions：
  ```ts
  permissions: ['collect.read', 'collect.write', 'pricing.read', 'pricing.write']
  ```

---

## Deliverables (产出物)

```
src/
├── app/
│   ├── routes.tsx
│   ├── topNavConfig.ts
│   └── sidebar/
│       ├── types.ts
│       ├── collectSidebar.ts
│       ├── assetsSidebar.ts
│       ├── pricingSidebar.ts
│       └── index.ts
├── components/
│   └── layout/
│       ├── AppShell.tsx
│       ├── AppShell.module.css
│       ├── TopNav.tsx
│       ├── TopNav.module.css
│       ├── AppShellSidebar.tsx
│       ├── AppShellSidebar.module.css
│       └── index.ts
├── stores/
│   └── appStore.ts
├── constants/
│   └── routes.ts
└── App.tsx
```

---

## Final Acceptance Criteria (Phase 1A 总验收)

### TopNav
- [ ] 5 个模块 Tab 正确显示
- [ ] 点击模块跳转到对应默认页
- [ ] 刷新后当前模块高亮正确
- [ ] 无权限模块隐藏（可用 mock 测试）

### Sidebar
- [ ] 切换模块后侧边栏内容变化
- [ ] 点击菜单项跳转正确
- [ ] 刷新后高亮不丢失
- [ ] 无权限菜单项隐藏
- [ ] collapse 功能正常

### Layout
- [ ] 所有页面都渲染在 AppShell 内
- [ ] TopNav 固定顶部 48px
- [ ] Sidebar 固定左侧 256px（collapse 后 64px）
- [ ] Content 区内边距 24px

### Router
- [ ] 模块默认重定向正确（`/collect` → `/collect/drafts`）
- [ ] 404 页面正确处理（可选）

---

## Prompt for AI

```
我们开始 Phase 1A：AppShell 骨架开发。

请先阅读以下文档：
- docs/ui/LayoutSpec.md（AppShell 结构）
- docs/spec/RoutesAndIA.md（路由表）
- docs/templates/sidebarConfig.ts.md（侧边栏配置模板，非常重要）
- docs/ui/DesignTokens.md（样式 Token）
- docs/ui/InteractionSpec.md（交互样式）

然后按照 docs/roadmap/Phase1A_AppShell.md 的步骤执行。

关键要求：
1. 侧边栏必须是配置驱动，不能硬编码
2. 高亮状态必须从 URL 推导，不能用手动 state
3. 无权限的菜单项必须隐藏
4. 所有模块的侧边栏视觉必须一致

完成后，确保 Final Acceptance Criteria 全部通过。
```

---

## Notes

- 此阶段**不涉及业务组件和 API**，只做壳子
- 页面组件用占位符即可（如 `<div>草稿总览</div>`）
- Mock permissions 用于测试权限过滤功能
- **壳子稳了再进入 Phase 1B**