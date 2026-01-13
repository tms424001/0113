# ErrorBoundary.tsx — 全局错误边界模板

> 用途：捕获 React 组件树中的 JavaScript 错误，防止白屏崩溃。
> 位置：`src/app/ErrorBoundary.tsx`

---

## 完整代码

```tsx
// src/app/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button, Result } from 'antd'

// ============================================
// 1. Props & State 类型
// ============================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode  // 自定义降级 UI
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// ============================================
// 2. ErrorBoundary 组件
// ============================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  // 捕获错误，更新 state
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  // 记录错误信息
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    
    // 上报错误到监控系统（可选）
    this.reportError(error, errorInfo)
  }

  // 错误上报（可接入 Sentry 等）
  private reportError(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)
    
    // TODO: 接入错误监控服务
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } })
    // }
  }

  // 重置错误状态
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  // 返回首页
  private handleBackHome = (): void => {
    window.location.href = '/'
  }

  // 刷新页面
  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // 自定义 fallback
      if (fallback) {
        return fallback
      }

      // 默认错误页面
      return (
        <ErrorFallback
          error={error}
          onBackHome={this.handleBackHome}
          onReload={this.handleReload}
        />
      )
    }

    return children
  }
}

// ============================================
// 3. 默认错误降级页面
// ============================================

interface ErrorFallbackProps {
  error: Error | null
  onBackHome: () => void
  onReload: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onBackHome, onReload }) => {
  const isDev = import.meta.env.DEV

  return (
    <div style={styles.container}>
      <Result
        status="error"
        title="页面出错了"
        subTitle="抱歉，页面发生了意外错误。请尝试刷新页面或返回首页。"
        extra={[
          <Button key="home" onClick={onBackHome}>
            返回首页
          </Button>,
          <Button key="reload" type="primary" onClick={onReload}>
            刷新页面
          </Button>,
        ]}
      />

      {/* 开发环境显示错误详情 */}
      {isDev && error && (
        <div style={styles.errorDetail}>
          <h4>错误信息（仅开发环境可见）</h4>
          <pre style={styles.errorPre}>
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================
// 4. 样式
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    background: '#f5f7fa',
  },
  errorDetail: {
    maxWidth: '800px',
    width: '100%',
    marginTop: '24px',
    padding: '16px',
    background: '#fff1f0',
    border: '1px solid #ffa39e',
    borderRadius: '8px',
  },
  errorPre: {
    margin: 0,
    padding: '12px',
    background: '#fff',
    borderRadius: '4px',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '300px',
  },
}

export default ErrorBoundary
```

---

## 在 App 中使用

```tsx
// src/App.tsx
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { AppRoutes } from '@/app/routes'
import { Providers } from '@/app/providers'

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <AppRoutes />
      </Providers>
    </ErrorBoundary>
  )
}

export default App
```

---

## 局部错误边界（可选）

对于关键模块，可以使用局部错误边界防止整页崩溃：

```tsx
// src/pages/pricing/PricingTasksPage.tsx
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { DataTable } from '@/components/business/DataTable'

export const PricingTasksPage = () => {
  return (
    <PageContainer title="套定额任务">
      <FilterBar ... />
      
      {/* 表格区域单独包裹，崩溃不影响筛选栏 */}
      <ErrorBoundary fallback={<TableErrorFallback />}>
        <DataTable ... />
      </ErrorBoundary>
    </PageContainer>
  )
}

const TableErrorFallback = () => (
  <Result
    status="error"
    title="表格加载失败"
    extra={<Button onClick={() => window.location.reload()}>刷新</Button>}
  />
)
```

---

## 错误边界 Hook（React 19+ / 实验性）

```tsx
// 未来可使用 React 官方 Hook（目前需要 Class Component）
// import { useErrorBoundary } from 'react-error-boundary'
```

---

## 注意事项

1. **Error Boundary 不能捕获**：
   - 事件处理器中的错误（需要 try/catch）
   - 异步代码（如 setTimeout、Promise）
   - 服务端渲染
   - Error Boundary 自身的错误

2. **最佳实践**：
   - 在 App 根级别包裹一个全局 Error Boundary
   - 在关键功能模块包裹局部 Error Boundary
   - 生产环境隐藏错误详情，仅上报到监控系统

3. **错误监控接入**：
   - 推荐 Sentry、Bugsnag 等服务
   - 在 `reportError` 方法中接入

---

## 与 StatesSpec 的关系

| 错误类型 | 处理方式 | 组件 |
|----------|----------|------|
| API 错误 (401/403/404/5xx) | `PageStateError` | StatesSpec 定义 |
| 网络错误 | `PageStateError` | StatesSpec 定义 |
| **React 渲染错误** | `ErrorBoundary` | 本模板 |
| **JS 运行时错误** | `ErrorBoundary` | 本模板 |

- `PageStateError`：处理可预期的 API/业务错误
- `ErrorBoundary`：处理不可预期的代码崩溃