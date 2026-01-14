// src/components/ui/PageStateError.tsx
import React from 'react'
import { Result, Button, Space } from 'antd'
import { ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import styles from './PageState.module.css'

export interface PageStateErrorProps {
  code?: number | 'network'
  message?: string
  onRetry: () => void
  onBack?: () => void
}

const ERROR_MESSAGES: Record<number | 'network' | 'default', { title: string; description: string }> = {
  401: { title: '登录已过期', description: '请重新登录' },
  403: { title: '无权限访问', description: '请联系管理员开通权限' },
  404: { title: '资源不存在', description: '该记录可能已被删除' },
  500: { title: '服务暂时不可用', description: '请稍后重试' },
  502: { title: '网关错误', description: '请稍后重试' },
  503: { title: '服务暂时不可用', description: '请稍后重试' },
  504: { title: '网关超时', description: '请稍后重试' },
  network: { title: '网络连接异常', description: '请检查网络后重试' },
  default: { title: '加载失败', description: '请稍后重试' },
}

export const PageStateError: React.FC<PageStateErrorProps> = ({
  code,
  message,
  onRetry,
  onBack,
}) => {
  const errorConfig = code !== undefined
    ? ERROR_MESSAGES[code] || ERROR_MESSAGES.default
    : ERROR_MESSAGES.default

  const displayMessage = message || errorConfig.description

  return (
    <div className={styles.errorContainer}>
      <Result
        status="error"
        title={errorConfig.title}
        subTitle={displayMessage}
        extra={
          <Space>
            {onBack && (
              <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
                返回
              </Button>
            )}
            <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
              重试
            </Button>
          </Space>
        }
      />
    </div>
  )
}

export default PageStateError
