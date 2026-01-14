// src/pages/pr/PRListPage/config.tsx
// PR 列表页面配置

import { Tag, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { PRDTO } from '@/types/pr'
import { PR_STATUS_OPTIONS } from '@/types/pr'

/**
 * Tab 配置
 */
export const tabConfig = [
  { key: 'my', label: '我发起的' },
  { key: 'pending', label: '待我审批' },
] as const

/**
 * 筛选配置
 */
export const filterConfig = {
  search: {
    placeholder: '搜索项目名称',
  },
  status: {
    placeholder: '全部状态',
    options: PR_STATUS_OPTIONS,
  },
  timeRange: {
    placeholder: ['开始日期', '结束日期'] as [string, string],
  },
}

/**
 * 空状态配置
 */
export const emptyConfig = {
  my: {
    description: '暂无入库申请记录',
    buttonText: '发起入库申请',
  },
  pending: {
    description: '暂无待审批的申请',
    buttonText: '',
  },
}

/**
 * 格式化金额
 */
const formatAmount = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(2)} 亿`
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)} 万`
  }
  return `${amount.toFixed(2)} 元`
}

/**
 * 格式化时间
 */
const formatTime = (time: string): string => {
  return new Date(time).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 获取状态 Tag
 */
const getStatusTag = (status: string) => {
  const option = PR_STATUS_OPTIONS.find((o) => o.value === status)
  if (!option) return null
  return <Tag color={option.color}>{option.label}</Tag>
}

/**
 * 我发起的 PR 表格列配置
 */
export const getMyPRColumns = (): ColumnsType<PRDTO> => [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 280,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 120,
    render: (time: string) => formatTime(time),
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    align: 'right',
    render: (amount: number) => formatAmount(amount),
  },
  {
    title: '目标空间',
    dataIndex: 'targetSpace',
    key: 'targetSpace',
    width: 120,
  },
  {
    title: '完成度',
    dataIndex: 'completeness',
    key: 'completeness',
    width: 120,
    render: (value: number) => (
      <Progress
        percent={value}
        size="small"
        status={value >= 100 ? 'success' : 'active'}
        strokeColor={value >= 100 ? '#52c41a' : '#1890ff'}
      />
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => getStatusTag(status),
  },
  {
    title: '审批人',
    dataIndex: 'reviewer',
    key: 'reviewer',
    width: 100,
    render: (reviewer: string) => reviewer || '-',
  },
]

/**
 * 待我审批的 PR 表格列配置
 */
export const getPendingPRColumns = (): ColumnsType<PRDTO> => [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 280,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    width: 120,
    render: (time: string) => formatTime(time),
  },
  {
    title: '申请人',
    dataIndex: 'applicant',
    key: 'applicant',
    width: 100,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    align: 'right',
    render: (amount: number) => formatAmount(amount),
  },
  {
    title: '目标空间',
    dataIndex: 'targetSpace',
    key: 'targetSpace',
    width: 120,
  },
  {
    title: '完成度',
    dataIndex: 'completeness',
    key: 'completeness',
    width: 120,
    render: (value: number) => (
      <Progress
        percent={value}
        size="small"
        status={value >= 100 ? 'success' : 'active'}
        strokeColor={value >= 100 ? '#52c41a' : '#1890ff'}
      />
    ),
  },
  {
    title: '当前级别',
    dataIndex: 'currentLevel',
    key: 'currentLevel',
    width: 100,
    render: (level: string) => {
      if (!level) return '-'
      return level === 'level1' ? '一级审批' : '二级审批'
    },
  },
]
