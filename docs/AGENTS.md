# AGENTS.md — Windsurf Coding Constitution (v1.1.2)

## 0. Project Goal

Build a multi-module web app (React + Ant Design + CSS) with consistent layout, navigation, UX patterns, and API contracts.
All pages must follow platform-level specs in /docs.

---

## 1. Tech Stack (Fixed)

- React 18+
- React Router v6+
- Ant Design v5+
- TypeScript (strict mode)
- State: Zustand (global/app + page session)
- Data fetching: **axios** (all requests MUST go through `src/services/http.ts`)
- Styling: CSS Modules (default) + AntD theme tokens
- Icons: Ant Design Icons (preferred)

---

## 2. Non-negotiable Rules

### 数据与 Schema

1. **DO NOT invent data fields.** If schema is missing, **STOP and ask** for schema in API contract.

### 布局与组件

2. **DO NOT create a new sidebar/layout per page.** MUST use AppShell layout.

3. **DO NOT mix random styling approaches.** MUST follow `/docs/styles/CSSRules.md`.

4. **DO NOT exceed 2 levels in sidebar navigation.**

5. **禁止私造平台组件 & 页面职责限定**:
   - FilterBar / DataTable / DetailDrawer / ActionBar / StatusBadge 必须复用 `src/components/business/*`
   - Pages 只负责"组合与配置"，禁止在页面内重新实现等效 UI 逻辑

6. **导航高亮必须由路由驱动**: Sidebar active/open state MUST be derived from React Router path, not manual state.

### 质量与验收

7. **Every page MUST satisfy the 5-item DoD** (see `/docs/quality/DoD_Checklist.md`).

8. **Every response that changes UI MUST include "DoD Checklist"** ✅/❌.

### 数据请求

9. **Data fetching MUST use axios.** All requests MUST go through `src/services/http.ts`.
   > 模板参考: `/docs/templates/http.ts.md`

### TypeScript 严格度

10. **TypeScript strict mode REQUIRED**:
    - `tsconfig.json` MUST set `strict: true`
    - **No `any`** unless explicitly justified with comment `// eslint-disable-next-line @typescript-eslint/no-explicit-any` + reason
    - Prefer `unknown` over `any` for untyped payloads
    - DTO types MUST live in `src/types/` and be imported by pages/components

### 错误处理

11. **Error handling MUST be 统一（API + UI）**:
    - All API errors MUST be normalized in `src/services/http.ts`
    - Pages MUST NOT write ad-hoc try/catch for every request; use service helpers/hooks
    - UI must render errors using `/docs/ui/StatesSpec.md` (Error state with Retry)
    - 401/403/404/5xx/network MUST map to distinct user-facing states (per StatesSpec)
    > 模板参考: `/docs/templates/http.ts.md`

12. **Global Error Boundary REQUIRED**:
    - App root MUST register an Error Boundary that renders a safe fallback page
    - Fallback must provide: "Back to Home" + "Reload" actions
    > 模板参考: `/docs/templates/ErrorBoundary.tsx.md`

### 环境与依赖

13. **Environment variables 规范**:
    - Only read env vars through `src/constants/env.ts`
    - Required: `VITE_API_BASE_URL` (or `REACT_APP_API_BASE_URL` depending on build tool)
    - Do not hardcode base URLs inside services/pages
    > 模板参考: `/docs/templates/env.ts.md`

14. **Third-party dependencies 引入规则**:
    - New dependency must be recorded in `docs/DEPENDENCIES.md` with purpose + scope
    - Prefer existing stack; do not add overlapping libraries (e.g., multiple date libs)

### 代码生成自检

15. **生成代码后必须自检**:
    - 确认 import 路径正确（相对路径 vs alias）
    - 确认没有引入未声明的依赖
    - 确认 DTO 类型已在 `src/types/` 中定义

---

## 3. Folder & Naming (Recommended)

```
src/
  app/               (router, app shell, providers, error boundary)
  pages/             (route pages)
  components/        (reusable UI components)
    business/        (platform business components)
    ui/              (low-level wrappers)
  stores/            (zustand stores)
  services/          (api clients, http.ts)
  types/             (DTO types)
  styles/            (global, tokens, overrides)
  constants/         (enums, options, config, env.ts)
  hooks/             (custom hooks)
```

Naming:
- Page components: PascalCase + Page suffix (e.g., `DraftOverviewPage`)
- Business components: PascalCase (e.g., `FilterBar`, `DataTable`, `DetailDrawer`)
- Routes: kebab-case path segments

---

## 4. Mandatory UI Skeleton

All modules MUST use:
- **AppShell** (TopNav + Sidebar + Content)
- **PageContainer** (title + description + actions)
- One of standard page patterns from `/docs/ui/LayoutSpec.md`

---

## 5. Zustand Usage Rules

Use Zustand for:
- `appStore`: user, permissions, active module, theme preference
- `uiStore`: sidebar badge counts, global drawer state (optional)
- `pageStore`: per-page session (filters, pagination, selectedRowId)

Rules:
- Do NOT store large list datasets globally. Lists belong to the page query state.
- Page stores should be named `{module}{Page}PageStore` (e.g., `collectDraftsPageStore`)

---

## 6. Output Format Requirement

When generating/updating UI, always output:

1. Brief summary of what changed + key files
2. Any assumptions made
3. DoD Checklist (5 items) ✅/❌ with reasons
4. If blocked, ask for minimum missing info (schema/permission/routes)
5. List created/modified files (with paths)

---

## 7. Mandatory Specs (Must Follow)

### Core Specs (必读)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `/docs/AGENTS.md` | 总纲，技术栈，硬规则 |
| 2 | `/docs/ui/LayoutSpec.md` | 布局模式，页面骨架 |
| 3 | `/docs/ui/ComponentsSpec.md` | 组件接口，Props |
| 4 | `/docs/ui/InteractionSpec.md` | 交互行为，hover/focus |
| 5 | `/docs/ui/ResponsiveSpec.md` | 断点，响应式规则 |
| 6 | `/docs/ui/StatesSpec.md` | Loading/Empty/Error |
| 7 | `/docs/styles/CSSRules.md` | 样式写法 |

### Reference Specs (按需查阅)

| Document | Purpose |
|----------|---------|
| `/docs/ui/DesignTokens.md` | 颜色、间距、字号 |
| `/docs/spec/RoutesAndIA.md` | 路由清单 |
| `/docs/api/OpenAPI_Min.md` | API 契约 |
| `/docs/api/schemas/*.md` | 模块 DTO 定义 |
| `/docs/security/Permissions.md` | 权限 key |
| `/docs/quality/DoD_Checklist.md` | 完成标准 |
| `/docs/examples/*.md` | 黄金示例 |
| `/docs/templates/*.md` | 代码模板 |

### Conflict Resolution

Priority order (higher wins):
```
AGENTS.md > LayoutSpec.md > ComponentsSpec.md > InteractionSpec.md > ResponsiveSpec.md > StatesSpec.md > CSSRules.md
```

---

## 8. Quick Lookup Guide

| I want to... | Read first |
|--------------|------------|
| Create a new page | LayoutSpec → choose Pattern |
| Write a filter bar | ComponentsSpec §2 FilterBar |
| Write a data table | ComponentsSpec §3 DataTable |
| Handle empty/error states | StatesSpec |
| Handle permissions | Permissions.md |
| Confirm data fields | `/docs/api/schemas/{module}.md` |
| Write styles | CSSRules + DesignTokens |
| Handle responsive | ResponsiveSpec |
| Handle interactions | InteractionSpec |
| See a complete example | `/docs/examples/` |
| Setup http/env/error boundary | `/docs/templates/` |

---

## 9. When In Doubt

- Layout/Shell → see `/docs/ui/LayoutSpec.md`
- Component API → see `/docs/ui/ComponentsSpec.md`
- Data shape → see `/docs/api/schemas/{module}.md`
- Permission check → see `/docs/security/Permissions.md`
- If none of these answer your question → **ASK, do not assume.**

---

## Appendix (Optional Policies)

### A. i18n (if enabled)

- All user-facing strings must be centralized in `src/locales/zh-CN.ts`
- Components/pages must not hardcode long text blocks inline

### B. Testing (if enabled)

- Unit: critical business components (FilterBar/DataTable/DetailDrawer) should have tests
- E2E: at least 1 golden flow per module (list -> open drawer -> action)

### C. Git Commits (if enabled)

- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`

### D. Performance (if enabled)

- 列表超过 100 条必须分页或虚拟滚动
- 避免在 render 中创建新对象/函数（useCallback/useMemo）
- 图片必须指定尺寸，避免 CLS