# env.ts — 环境变量统一读取模板

> 用途：集中管理环境变量，避免硬编码和分散读取。
> 位置：`src/constants/env.ts`

---

## 完整代码

```ts
// src/constants/env.ts

/**
 * 环境变量统一读取
 * 
 * 规则：
 * 1. 所有环境变量必须通过此文件读取
 * 2. 禁止在其他文件直接使用 import.meta.env 或 process.env
 * 3. 新增环境变量需在此文件声明并添加校验
 */

// ============================================
// 1. Vite 项目配置（推荐）
// ============================================

// Vite 环境变量前缀为 VITE_
const getViteEnv = () => ({
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  APP_TITLE: (import.meta.env.VITE_APP_TITLE as string) || '数据资产平台',
  MODE: import.meta.env.MODE as 'development' | 'production' | 'test',
  DEV: import.meta.env.DEV as boolean,
  PROD: import.meta.env.PROD as boolean,
})

// ============================================
// 2. CRA 项目配置（备选）
// ============================================

// Create React App 环境变量前缀为 REACT_APP_
// const getCraEnv = () => ({
//   API_BASE_URL: process.env.REACT_APP_API_BASE_URL as string,
//   APP_TITLE: process.env.REACT_APP_TITLE || '数据资产平台',
//   MODE: process.env.NODE_ENV as 'development' | 'production' | 'test',
//   DEV: process.env.NODE_ENV === 'development',
//   PROD: process.env.NODE_ENV === 'production',
// })

// ============================================
// 3. 导出 ENV 对象
// ============================================

export const ENV = getViteEnv()
// export const ENV = getCraEnv() // 如果是 CRA 项目

// ============================================
// 4. 环境变量校验（启动时执行）
// ============================================

const requiredEnvVars = ['API_BASE_URL'] as const

export function validateEnv(): void {
  const missing: string[] = []
  
  for (const key of requiredEnvVars) {
    if (!ENV[key]) {
      missing.push(key)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file.`
    )
  }
}

// 开发环境自动校验
if (ENV.DEV) {
  validateEnv()
}

// ============================================
// 5. 类型声明（Vite）
// ============================================

// 在 src/vite-env.d.ts 中添加类型声明
/*
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
*/
```

---

## .env 文件示例

### .env（默认/通用）

```bash
# API 配置
VITE_API_BASE_URL=http://localhost:3000

# 应用配置
VITE_APP_TITLE=数据资产平台
```

### .env.development

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:3000
```

### .env.production

```bash
# 生产环境
VITE_API_BASE_URL=https://api.example.com
```

### .env.staging

```bash
# 预发布环境
VITE_API_BASE_URL=https://staging-api.example.com
```

---

## 使用示例

### 在 http.ts 中使用

```ts
// src/services/http.ts
import { ENV } from '@/constants/env'

const http = axios.create({
  baseURL: ENV.API_BASE_URL,  // ✅ 正确
  // baseURL: 'http://api.example.com',  // ❌ 禁止硬编码
})
```

### 在组件中使用

```tsx
// src/components/ui/AppTitle.tsx
import { ENV } from '@/constants/env'

export const AppTitle = () => (
  <h1>{ENV.APP_TITLE}</h1>
)
```

### 条件渲染

```tsx
import { ENV } from '@/constants/env'

// 开发环境显示调试工具
{ENV.DEV && <DebugPanel />}

// 生产环境启用分析
{ENV.PROD && <Analytics />}
```

---

## 注意事项

1. **前缀必须正确**：Vite 用 `VITE_`，CRA 用 `REACT_APP_`
2. **不要提交敏感信息**：API Keys 等敏感信息用 `.env.local`（已在 .gitignore）
3. **类型安全**：在 `vite-env.d.ts` 中声明类型
4. **启动校验**：确保必需变量存在，避免运行时错误

---

## .gitignore 配置

```bash
# 环境变量文件
.env.local
.env.*.local
```