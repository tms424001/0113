// src/pages/collect/DraftsPage/config.ts
// 草稿库页面配置

import type { ColumnsType } from 'antd/es/table'
import type { DraftDTO } from '@/types/draft'
import { DRAFT_SOURCE_OPTIONS, DRAFT_STATUS_OPTIONS } from '@/types/draft'

/**
 * 筛选配置
 */
export const filterConfig = {
  /** 搜索框 */
  search: {
    placeholder: '搜索项目名称',
    field: 'keyword',
  },
  /** 筛选项 */
  filters: [
    {
      field: 'source',
      label: '来源',
      type: 'select' as const,
      options: DRAFT_SOURCE_OPTIONS,
      placeholder: '全部来源',
    },
    {
      field: 'status',
      label: '状态',
      type: 'select' as const,
      options: DRAFT_STATUS_OPTIONS,
      placeholder: '全部状态',
    },
    {
      field: 'uploadTimeRange',
      label: '上传时间',
      type: 'dateRange' as const,
      placeholder: ['开始日期', '结束日期'],
    },
  ],
}

/**
 * 表格列配置
 * 简化版：项目名称、上传时间、来源、金额、操作
 */
export const getTableColumns = (): ColumnsType<DraftDTO> => [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    ellipsis: true,
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
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
      const option = DRAFT_SOURCE_OPTIONS.find((o) => o.value === value)
      return option?.label || value
    },
  },
  {
    title: '金额（万元）',
    dataIndex: 'amount',
    key: 'amount',
    width: 140,
    align: 'right',
    sorter: (a, b) => a.amount - b.amount,
    render: (value: number) => {
      if (value === 0 || value === undefined) return '-'
      // 转换为万元，保留2位小数，千分位
      const wan = value / 10000
      return wan.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
  },
]

/**
 * 抽屉配置
 */
export const drawerConfig = {
  title: '草稿详情',
  width: 480,
  /** 详情字段配置 */
  fields: [
    { label: '项目名称', key: 'projectName' },
    { label: '上传时间', key: 'uploadTime', format: 'datetime' },
    { label: '来源', key: 'source', format: 'source' },
    { label: '金额（万元）', key: 'amount', format: 'money' },
    { label: '编制阶段', key: 'compilationPhase' },
    { label: '状态', key: 'status', format: 'status' },
    { label: '文件格式', key: 'fileFormat' },
    { label: '单项工程数', key: 'subProjectCount' },
    { label: '创建人', key: 'createdBy' },
  ],
}

/**
 * 操作按钮配置
 */
export const actionConfig = {
  /** 主操作（表格右侧）- 5个按钮：查看、分析、补录、删除、导出 */
  rowActions: [
    {
      key: 'view',
      label: '查看',
      type: 'link' as const,
    },
    {
      key: 'analyze',
      label: '分析',
      type: 'link' as const,
    },
    {
      key: 'supplement',
      label: '补录',
      type: 'link' as const,
    },
    {
      key: 'delete',
      label: '删除',
      type: 'link' as const,
      danger: true,
      confirm: '确定要删除该草稿吗？',
    },
    {
      key: 'export',
      label: '导出',
      type: 'link' as const,
    },
  ],
  /** 批量操作（表格上方） */
  batchActions: [
    {
      key: 'batchDelete',
      label: '批量删除',
      danger: true,
      confirm: (count: number) => `确定要删除选中的 ${count} 条草稿吗？`,
    },
  ],
  /** 头部操作 */
  headerActions: [
    {
      key: 'create',
      label: '上传文件',
      type: 'primary' as const,
      icon: 'PlusOutlined',
    },
  ],
}

/**
 * 空状态配置
 */
export const emptyConfig = {
  description: '暂无草稿数据',
  buttonText: '上传造价文件',
}