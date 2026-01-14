// src/components/business/DetailDrawer.tsx
import React, { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Drawer, Button, Space, Descriptions, Modal } from 'antd'
import dayjs from 'dayjs'
import { PageStateLoading, PageStateError, StatusBadge } from '../ui'
import type { StatusOption } from '../ui'
import styles from './DetailDrawer.module.css'

export interface DrawerField {
  key: string
  label: string
  dataIndex: string
  span?: 1 | 2
  render?: 'text' | 'date' | 'status' | 'link' | 'tags' | ((value: unknown) => ReactNode)
  statusOptions?: StatusOption[]
}

export interface DrawerSection {
  key: string
  title: string
  fields: DrawerField[]
}

export interface ActionItem {
  key: string
  label: string
  type?: 'primary' | 'default' | 'danger'
  permission?: string
  confirm?: { title: string; content: string }
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export interface DetailDrawerProps {
  open: boolean
  id: string | null
  data?: Record<string, unknown>
  sections: DrawerSection[]
  onClose: () => void
  loading?: boolean
  error?: { code?: number | 'network'; message?: string }
  onRetry?: () => void
  title?: string
  subtitle?: string
  actions?: ActionItem[]
  width?: number
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  open,
  id,
  data,
  sections,
  onClose,
  loading = false,
  error,
  onRetry,
  title,
  subtitle,
  actions,
  width = 600,
}) => {
  // Esc 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleActionClick = useCallback((action: ActionItem) => {
    if (action.confirm) {
      Modal.confirm({
        title: action.confirm.title,
        content: action.confirm.content,
        okText: '确认',
        cancelText: '取消',
        okButtonProps: action.type === 'danger' ? { danger: true } : undefined,
        onOk: action.onClick,
      })
    } else {
      action.onClick()
    }
  }, [])

  const renderFieldValue = (field: DrawerField, value: unknown): ReactNode => {
    if (typeof field.render === 'function') {
      return field.render(value)
    }

    switch (field.render) {
      case 'date':
        return value ? dayjs(value as string).format('YYYY-MM-DD HH:mm') : '-'

      case 'status':
        if (field.statusOptions && value) {
          return (
            <StatusBadge
              status={value as string}
              options={field.statusOptions}
            />
          )
        }
        return String(value) || '-'

      case 'link':
        return value ? (
          <a href={value as string} target="_blank" rel="noopener noreferrer">
            {value as string}
          </a>
        ) : '-'

      case 'tags':
        if (Array.isArray(value)) {
          return (value as string[]).join(', ') || '-'
        }
        return value != null ? String(value) : '-'

      case 'text':
      default:
        return value != null ? String(value) : '-'
    }
  }

  const renderContent = () => {
    // Loading state
    if (loading) {
      return <PageStateLoading type="drawer" />
    }

    // Error state
    if (error && onRetry) {
      return (
        <PageStateError
          code={error.code}
          message={error.message}
          onRetry={onRetry}
        />
      )
    }

    // No data
    if (!data) {
      return null
    }

    // Render sections
    return (
      <div className={styles.content}>
        {sections.map((section) => (
          <div key={section.key} className={styles.section}>
            <h4 className={styles.sectionTitle}>{section.title}</h4>
            <Descriptions column={2} size="small" bordered>
              {section.fields.map((field) => (
                <Descriptions.Item
                  key={field.key}
                  label={field.label}
                  span={field.span || 1}
                >
                  {renderFieldValue(field, data[field.dataIndex])}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        ))}
      </div>
    )
  }

  const renderFooter = () => {
    if (!actions || actions.length === 0) {
      return null
    }

    return (
      <div className={styles.footer}>
        <Space>
          {actions.map((action) => (
            <Button
              key={action.key}
              type={action.type === 'danger' ? 'default' : action.type}
              danger={action.type === 'danger'}
              loading={action.loading}
              disabled={action.disabled}
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </div>
    )
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={width}
      title={
        <div className={styles.header}>
          <div className={styles.title}>{title || `详情 ${id || ''}`}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      }
      footer={renderFooter()}
      destroyOnClose
    >
      {renderContent()}
    </Drawer>
  )
}

export default DetailDrawer
