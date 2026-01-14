// src/components/ui/PageStateLoading.tsx
import React from 'react'
import { Skeleton, Spin } from 'antd'
import styles from './PageState.module.css'

export interface PageStateLoadingProps {
  type?: 'table' | 'drawer' | 'card'
  rows?: number
}

export const PageStateLoading: React.FC<PageStateLoadingProps> = ({
  type = 'table',
  rows = 5,
}) => {
  if (type === 'table') {
    return (
      <div className={styles.loadingContainer}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            key={index}
            active
            title={false}
            paragraph={{ rows: 1, width: '100%' }}
            className={styles.tableRow}
          />
        ))}
      </div>
    )
  }

  if (type === 'drawer') {
    return (
      <div className={styles.drawerLoading}>
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className={styles.cardLoading}>
        <Spin size="large" />
      </div>
    )
  }

  return null
}

export default PageStateLoading
