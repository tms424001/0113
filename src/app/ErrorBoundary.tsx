// src/app/ErrorBoundary.tsx
import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button, Result } from 'antd'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo })
    this.reportError(error, errorInfo)
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  private handleBackHome = (): void => {
    window.location.href = '/'
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

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
