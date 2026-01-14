// src/pages/assets/personal/ProjectsPage/config.tsx
// 我的项目页面配置

import { Tag, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ProjectDTO } from '@/types/project'
import { PROJECT_SOURCE_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/types/project'

/**
 * 筛选栏配置
 */
export const filterConfig = {
  search: {
    placeholder: '搜索项目名称',
  },
}

/**
 * 表格列配置
 * 项目名称、上传时间、来源、金额、建筑面积、单方造价、完成度、状态
 */
export const getTableColumns = (): ColumnsType<ProjectDTO> => [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    ellipsis: true,
    width: 280,
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 160,
    sorter: (a, b) => new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime(),
    defaultSortOrder: 'descend',
    render: (value: string) => {
      if (!value) return '-'
      const date = new Date(value)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    width: 80,
    align: 'center',
    render: (value: string) => {
      const option = PROJECT_SOURCE_OPTIONS.find((o) => o.value === value)
      return option ? <Tag color={option.color}>{option.label}</Tag> : value
    },
  },
  {
    title: '金额（万元）',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    align: 'right',
    sorter: (a, b) => a.amount - b.amount,
    render: (value: number) => {
      if (value === 0 || value === undefined) return '-'
      return (value / 10000).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
  },
  {
    title: '建筑面积（㎡）',
    dataIndex: 'buildingArea',
    key: 'buildingArea',
    width: 120,
    align: 'right',
    render: (value: number) => {
      if (!value) return '-'
      return value.toLocaleString('zh-CN')
    },
  },
  {
    title: '单方造价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 100,
    align: 'right',
    render: (value: number) => {
      if (!value) return '-'
      return `${value.toLocaleString('zh-CN')} 元/㎡`
    },
  },
  {
    title: '完成度',
    dataIndex: 'completeness',
    key: 'completeness',
    width: 120,
    render: (value: number) => {
      if (value === undefined) return '-'
      return (
        <Progress
          percent={value}
          size="small"
          status={value >= 80 ? 'success' : 'normal'}
          strokeColor={value >= 80 ? '#52c41a' : '#faad14'}
        />
      )
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 90,
    align: 'center',
    render: (value: string) => {
      const option = PROJECT_STATUS_OPTIONS.find((o) => o.value === value)
      return option ? <Tag color={option.color}>{option.label}</Tag> : value
    },
  },
]

/**
 * 抽屉配置
 */
export const drawerConfig = {
  title: '项目详情',
  width: 560,
}

/**
 * 空状态配置
 */
export const emptyConfig = {
  description: '暂无项目数据',
  buttonText: '从草稿箱导入',
}
