// src/components/ui/PageStateEmpty.tsx
import React from 'react'
import type { ReactNode } from 'react'
import { Empty, Button } from 'antd'
import { PlusOutlined, ClearOutlined } from '@ant-design/icons'
import styles from './PageState.module.css'

export interface PageStateEmptyProps {
  type: 'init' | 'filtered'
  title?: string
  description?: string
  onCreate?: () => void
  onClearFilter?: () => void
  extra?: ReactNode
}

const DEFAULT_MESSAGES = {
  init: {
    title: '暂无数据',
    description: '点击下方按钮创建第一条记录',
  },
  filtered: {
    title: '无匹配结果',
    description: '当前筛选条件下没有数据，试试调整筛选条件',
  },
}

export const PageStateEmpty: React.FC<PageStateEmptyProps> = ({
  type,
  title,
  description,
  onCreate,
  onClearFilter,
  extra,
}) => {
  const messages = DEFAULT_MESSAGES[type]
  const displayTitle = title || messages.title
  const displayDescription = description || messages.description

  return (
    <div className={styles.emptyContainer}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className={styles.emptyContent}>
            <div className={styles.emptyTitle}>{displayTitle}</div>
            <div className={styles.emptyDescription}>{displayDescription}</div>
          </div>
        }
      >
        <div className={styles.emptyActions}>
          {type === 'init' && onCreate && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
              新建
            </Button>
          )}
          {type === 'filtered' && onClearFilter && (
            <Button icon={<ClearOutlined />} onClick={onClearFilter}>
              清空筛选
            </Button>
          )}
          {extra}
        </div>
      </Empty>
    </div>
  )
}

export default PageStateEmpty
