# Phase 1B: Infrastructure (Core Utilities)

> **Goal**: 搭建基础设施：样式系统、HTTP 客户端、环境变量、错误边界。
> **Status**: [ ] Pending
> **Depends on**: Phase 1A ✅ (AppShell must be stable)

---

## Reference Specs (AI Must Read First)

| Priority | Document | Purpose |
|----------|----------|---------|
| 1 | `docs/AGENTS.md` | 技术栈、目录结构 |
| 2 | `docs/ui/DesignTokens.md` | CSS 变量、AntD theme |
| 3 | `docs/styles/CSSRules.md` | 样式写法规范 |
| 4 | `docs/templates/http.ts.md` | HTTP 客户端模板 |
| 5 | `docs/templates/env.ts.md` | 环境变量模板 |
| 6 | `docs/templates/ErrorBoundary.tsx.md` | 错误边界模板 |

---

## Step 1: Style System

### 1.1 CSS Tokens
- [ ] Create `src/styles/tokens.css`
  ```css
  :root {
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
    --spacing-xxl: 32px;

    /* Layout */
    --sidebar-width: 256px;
    --sidebar-collapsed-width: 64px;
    --topnav-height: 48px;
    --page-padding: 24px;

    /* Colors */
    --color-bg-page: #F5F7FA;
    --color-bg-card: #FFFFFF;
    --color-bg-sidebar-hover: rgba(0,0,0,0.04);
    --color-bg-sidebar-active: #e6f7ff;
    --color-bg-table-hover: #fafafa;
    --color-bg-table-selected: #e6f7ff;

    /* Radius */
    --radius-card: 8px;
    --radius-input: 6px;

    /* Transition */
    --transition-fast: 150ms;
    --transition-normal: 250ms;
  }
  ```

### 1.2 Global Styles
- [ ] Create `src/styles/global.css`
  ```css
  @import './tokens.css';

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.85);
    background: var(--color-bg-page);
  }
  ```

### 1.3 AntD Theme
- [ ] Create `src/styles/theme.ts`
  ```ts
  import type { ThemeConfig } from 'antd'

  export const themeConfig: ThemeConfig = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 8,
      fontSize: 14,
      colorBgLayout: '#F5F7FA',
      colorBgContainer: '#FFFFFF',
    },
  }
  ```

### 1.4 AntD Overrides (placeholder)
- [ ] Create `src/styles/antd-overrides.css`
  ```css
  /* Global AntD overrides - add as needed */
  ```

### 1.5 Import Styles
- [ ] Update `src/main.tsx` to import global styles:
  ```tsx
  import './styles/global.css'
  import './styles/antd-overrides.css'
  ```

---

## Step 2: Environment Variables

### 2.1 Env Config
- [ ] Create `src/constants/env.ts` — **copy from `docs/templates/env.ts.md`**

### 2.2 Env Files
- [ ] Create `.env.development`:
  ```
  VITE_API_BASE_URL=http://localhost:3000
  VITE_APP_TITLE=数据资产平台
  ```
- [ ] Create `.env.production`:
  ```
  VITE_API_BASE_URL=https://api.example.com
  VITE_APP_TITLE=数据资产平台
  ```

### 2.3 Type Declaration
- [ ] Update `src/vite-env.d.ts`:
  ```ts
  /// <reference types="vite/client" />

  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_APP_TITLE?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  ```

---

## Step 3: HTTP Client

### 3.1 HTTP Service
- [ ] Create `src/services/http.ts` — **copy from `docs/templates/http.ts.md`**
  - axios instance with baseURL from env
  - Request interceptor: attach token
  - Response interceptor: normalize errors
  - 401 handling: redirect to login
  - Export `request` helper with typed methods

### 3.2 API Types
- [ ] Create `src/types/api.ts`:
  ```ts
  export interface ApiResponse<T = unknown> {
    code: number
    message: string
    data: T
  }

  export interface PagedResponse<T> {
    items: T[]
    page: number
    pageSize: number
    total: number
  }

  export interface PagedQuery {
    page: number
    pageSize: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }

  export interface ApiError {
    code: number | 'network'
    message: string
    details?: Record<string, unknown>
  }
  ```

---

## Step 4: Error Boundary

### 4.1 Error Boundary Component
- [ ] Create `src/app/ErrorBoundary.tsx` — **copy from `docs/templates/ErrorBoundary.tsx.md`**

### 4.2 Wrap App
- [ ] Update `src/App.tsx`:
  ```tsx
  import { ErrorBoundary } from '@/app/ErrorBoundary'
  import { ConfigProvider } from 'antd'
  import { themeConfig } from '@/styles/theme'
  import { router } from '@/app/routes'
  import { RouterProvider } from 'react-router-dom'

  function App() {
    return (
      <ErrorBoundary>
        <ConfigProvider theme={themeConfig}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </ErrorBoundary>
    )
  }

  export default App
  ```

---

## Step 5: Providers Wrapper (Optional)

### 5.1 Providers Component
- [ ] Create `src/app/Providers.tsx`:
  ```tsx
  import { ConfigProvider } from 'antd'
  import { themeConfig } from '@/styles/theme'

  export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    )
  }
  ```

---

## Deliverables (产出物)

```
src/
├── app/
│   ├── ErrorBoundary.tsx
│   ├── Providers.tsx (optional)
│   └── routes.tsx (from Phase 1A)
├── services/
│   └── http.ts
├── types/
│   └── api.ts
├── constants/
│   ├── env.ts
│   └── routes.ts (from Phase 1A)
├── styles/
│   ├── tokens.css
│   ├── global.css
│   ├── theme.ts
│   └── antd-overrides.css
├── App.tsx (updated)
└── main.tsx (updated)

Root:
├── .env.development
├── .env.production
└── src/vite-env.d.ts (updated)
```

---

## Acceptance Criteria (验收标准)

### Style System
- [ ] CSS 变量正确生效（检查 DevTools）
- [ ] AntD 主题色正确应用
- [ ] 全局字体、背景色正确

### Environment
- [ ] `ENV.API_BASE_URL` 可正确读取
- [ ] 开发/生产环境变量分离

### HTTP Client
- [ ] axios 实例创建成功
- [ ] baseURL 从 env 读取
- [ ] 无 401 时请求正常（可用 mock）

### Error Boundary
- [ ] 手动抛错时显示降级页面
- [ ] 降级页面有「返回首页」和「刷新」按钮
- [ ] 开发环境显示错误详情

### Integration
- [ ] 应用可正常启动
- [ ] 无 TypeScript 错误
- [ ] 无控制台报错

---

## Prompt for AI

```
我们开始 Phase 1B：基础设施开发。

请先阅读以下文档：
- docs/AGENTS.md（技术栈）
- docs/ui/DesignTokens.md（样式 Token）
- docs/styles/CSSRules.md（样式规范）
- docs/templates/http.ts.md（HTTP 模板）
- docs/templates/env.ts.md（环境变量模板）
- docs/templates/ErrorBoundary.tsx.md（错误边界模板）

然后按照 docs/roadmap/Phase1B_Infra.md 的步骤执行。

关键要求：
1. 样式必须使用 CSS 变量，不能硬编码
2. HTTP 客户端必须按模板实现，包含错误标准化
3. 环境变量必须通过 env.ts 统一读取
4. ErrorBoundary 必须包裹在 App 最外层

完成后，确保验收标准全部通过。
```

---

## Notes

- Phase 1A 的 AppShell 必须先稳定，再做此阶段
- http.ts 会在 Phase 3 被 Service 使用
- ErrorBoundary 是最后一道防线，必须有
- 完成此阶段后进入 Phase 2（组件）