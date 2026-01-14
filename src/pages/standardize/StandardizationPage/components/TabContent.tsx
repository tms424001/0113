// src/pages/standardize/StandardizationPage/components/TabContent.tsx
// Tab 内容包装组件

import React from 'react'
import { Spin, Empty, Alert, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import styles from '../StandardizationPage.module.css'

// ============================================================================
// Types
// ============================================================================

export interface TabContentProps {
  /** 子元素 */
  children: React.ReactNode
  /** 加载中 */
  loading?: boolean
  /** 是否为空 */
  isEmpty?: boolean
  /** 空状态提示 */
  emptyText?: string
  /** 错误信息 */
  error?: string | null
  /** 重试回调 */
  onRetry?: () => void
}

// ============================================================================
// Component
// ============================================================================

export const TabContent: React.FC<TabContentProps> = ({
  children,
  loading = false,
  isEmpty = false,
  emptyText = '暂无数据',
  error = null,
  onRetry,
}) => {
  // 错误状态
  if (error) {
    return (
      <div className={styles.stateContainer}>
        <Alert
          type="error"
          message="加载失败"
          description={error}
          showIcon
          action={
            onRetry && (
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={onRetry}
              >
                重试
              </Button>
            )
          }
        />
      </div>
    )
  }

  // 加载状态
  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  // 空状态
  if (isEmpty) {
    return (
      <div className={styles.stateContainer}>
        <Empty description={emptyText} />
      </div>
    )
  }

  // 正常内容
  return <>{children}</>
}

export default TabContent
