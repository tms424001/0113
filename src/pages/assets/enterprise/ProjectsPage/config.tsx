// src/pages/assets/enterprise/ProjectsPage/config.tsx
// 企业项目库页面配置

import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { EnterpriseProjectDTO } from '@/types/enterprise'

/**
 * 工程分类选项
 */
export const PROJECT_CATEGORY_OPTIONS = [
  { value: 'residential', label: '住宅' },
  { value: 'commercial', label: '商业' },
  { value: 'office', label: '办公' },
  { value: 'industrial', label: '工业' },
  { value: 'public', label: '公共建筑' },
] as const

/**
 * 编制阶段选项
 */
export const COMPILATION_PHASE_OPTIONS = [
  { value: 'budget_estimate', label: '概算' },
  { value: 'bidding_boq', label: '招标工程量清单' },
  { value: 'max_bid_limit', label: '最高投标限价' },
  { value: 'contract_price', label: '合同价' },
  { value: 'settlement', label: '结算' },
] as const

/**
 * 企业项目状态选项
 */
export const ENTERPRISE_PROJECT_STATUS_OPTIONS = [
  { value: 'active', label: '正常', color: 'success' },
  { value: 'archived', label: '已归档', color: 'default' },
  { value: 'deprecated', label: '已废弃', color: 'error' },
] as const

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
 * 获取表格列配置
 */
export const getTableColumns = (): ColumnsType<EnterpriseProjectDTO> => [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 280,
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '地点',
    key: 'region',
    width: 140,
    render: (_, record) =>
      `${record.region.city} ${record.region.district || ''}`,
  },
  {
    title: '分类',
    dataIndex: 'projectCategory',
    key: 'projectCategory',
    width: 80,
    render: (value) => {
      const option = PROJECT_CATEGORY_OPTIONS.find((o) => o.value === value)
      return option?.label || value
    },
  },
  {
    title: '阶段',
    dataIndex: 'compilationPhase',
    key: 'compilationPhase',
    width: 120,
    render: (value) => {
      const option = COMPILATION_PHASE_OPTIONS.find((o) => o.value === value)
      return option?.label || value
    },
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 110,
    align: 'right',
    sorter: (a, b) => a.amount - b.amount,
    render: (value) => formatAmount(value),
  },
  {
    title: '面积(㎡)',
    dataIndex: 'buildingArea',
    key: 'buildingArea',
    width: 110,
    align: 'right',
    sorter: (a, b) => a.buildingArea - b.buildingArea,
    render: (value) => value.toLocaleString('zh-CN', { maximumFractionDigits: 0 }),
  },
  {
    title: '单方(元/㎡)',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 110,
    align: 'right',
    sorter: (a, b) => a.unitPrice - b.unitPrice,
    render: (value) => value.toLocaleString('zh-CN'),
  },
  {
    title: '评分',
    dataIndex: 'qualityScore',
    key: 'qualityScore',
    width: 80,
    align: 'center',
    sorter: (a, b) => a.qualityScore - b.qualityScore,
    render: (value) => {
      const color = value >= 90 ? '#52c41a' : value >= 80 ? '#1890ff' : '#faad14'
      return <span style={{ color, fontWeight: 600 }}>{value}</span>
    },
  },
  {
    title: '引用',
    dataIndex: 'referenceCount',
    key: 'referenceCount',
    width: 70,
    align: 'center',
    sorter: (a, b) => a.referenceCount - b.referenceCount,
    render: (value) => `${value}次`,
  },
  {
    title: '入库时间',
    dataIndex: 'approvedTime',
    key: 'approvedTime',
    width: 100,
    render: (value) => new Date(value).toLocaleDateString('zh-CN'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (value) => {
      const option = ENTERPRISE_PROJECT_STATUS_OPTIONS.find((o) => o.value === value)
      return <Tag color={option?.color}>{option?.label}</Tag>
    },
  },
]
