// src/components/ui/PageContainer.tsx
import React from 'react'
import type { ReactNode } from 'react'
import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import styles from './PageContainer.module.css'

export interface ActionItem {
  key: string
  label: string
  icon?: ReactNode
  onClick: () => void
  permission?: string
  danger?: boolean
  disabled?: boolean
}

export interface PageContainerProps {
  title: string
  description?: string
  primaryAction?: ActionItem
  secondaryActions?: ActionItem[]
  children: ReactNode
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  primaryAction,
  secondaryActions,
  children,
}) => {
  const hasSecondaryActions = secondaryActions && secondaryActions.length > 0

  const secondaryMenuItems: MenuProps['items'] = secondaryActions?.map((action) => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    disabled: action.disabled,
    onClick: action.onClick,
  }))

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.actions}>
          {hasSecondaryActions && (
            <Dropdown menu={{ items: secondaryMenuItems }} placement="bottomRight">
              <Button icon={<MoreOutlined />}>更多</Button>
            </Dropdown>
          )}
          {primaryAction && (
            <Button
              type="primary"
              icon={primaryAction.icon}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default PageContainer
