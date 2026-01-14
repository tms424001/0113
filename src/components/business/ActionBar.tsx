// src/components/business/ActionBar.tsx
import React, { useCallback } from 'react'
import type { ReactNode } from 'react'
import { Button, Space, Dropdown, Modal } from 'antd'
import type { MenuProps } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import styles from './ActionBar.module.css'

export interface ActionItem {
  key: string
  label: string
  icon?: ReactNode
  onClick: () => void
  permission?: string
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  confirm?: { title: string; content: string }
}

export interface ActionBarProps {
  primary?: ActionItem
  secondary?: ActionItem[]
}

export const ActionBar: React.FC<ActionBarProps> = ({ primary, secondary }) => {
  const handleClick = useCallback((action: ActionItem) => {
    if (action.confirm) {
      Modal.confirm({
        title: action.confirm.title,
        content: action.confirm.content,
        okText: '确认',
        cancelText: '取消',
        okButtonProps: action.danger ? { danger: true } : undefined,
        onOk: action.onClick,
      })
    } else {
      action.onClick()
    }
  }, [])

  const hasSecondary = secondary && secondary.length > 0

  // 如果次级操作超过 2 个，放入下拉菜单
  const showDropdown = hasSecondary && secondary.length > 2
  const inlineSecondary = hasSecondary && !showDropdown ? secondary : []
  const dropdownSecondary = showDropdown ? secondary : []

  const dropdownItems: MenuProps['items'] = dropdownSecondary.map((action) => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    disabled: action.disabled,
    onClick: () => handleClick(action),
  }))

  return (
    <div className={styles.actionBar}>
      <Space>
        {inlineSecondary.map((action) => (
          <Button
            key={action.key}
            icon={action.icon}
            danger={action.danger}
            disabled={action.disabled}
            loading={action.loading}
            onClick={() => handleClick(action)}
          >
            {action.label}
          </Button>
        ))}

        {showDropdown && (
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Button icon={<MoreOutlined />}>更多</Button>
          </Dropdown>
        )}

        {primary && (
          <Button
            type="primary"
            icon={primary.icon}
            disabled={primary.disabled}
            loading={primary.loading}
            onClick={() => handleClick(primary)}
          >
            {primary.label}
          </Button>
        )}
      </Space>
    </div>
  )
}

export default ActionBar
