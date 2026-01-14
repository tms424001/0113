// src/components/ui/StatusBadge.tsx
import React from 'react'
import { Tag } from 'antd'

export interface StatusOption {
  value: string
  label: string
  color: 'default' | 'processing' | 'success' | 'error' | 'warning'
}

export interface StatusBadgeProps {
  status: string
  options: StatusOption[]
  size?: 'small' | 'default'
}

const COLOR_MAP: Record<StatusOption['color'], string> = {
  default: 'default',
  processing: 'processing',
  success: 'success',
  error: 'error',
  warning: 'warning',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  options,
  size = 'default',
}) => {
  const option = options.find((opt) => opt.value === status)

  if (!option) {
    return <Tag>{status}</Tag>
  }

  return (
    <Tag
      color={COLOR_MAP[option.color]}
      style={size === 'small' ? { fontSize: 12, padding: '0 4px' } : undefined}
    >
      {option.label}
    </Tag>
  )
}

export default StatusBadge
