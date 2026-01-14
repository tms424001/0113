// src/pages/pr/PRCreatePage/components/StepSelectProject.tsx
// 步骤1: 选择项目

import { useState, useEffect } from 'react'
import { Table, Input, Card, Typography, Tag, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PROJECT_SOURCE_OPTIONS } from '@/types/project'
import styles from './StepSelectProject.module.css'

const { Search } = Input
const { Text } = Typography

/**
 * 项目数据
 */
interface ProjectItem {
  id: string
  projectName: string
  uploadTime: string
  source: string
  amount: number
  buildingArea: number
  completeness: number
}

interface StepSelectProjectProps {
  selectedProjectId: string | null
  onSelect: (project: ProjectItem | null) => void
}

/**
 * Mock 项目列表
 */
const mockProjects: ProjectItem[] = [
  {
    id: 'project_001',
    projectName: '金牛区沙河源街道友联社区商业用地项目',
    uploadTime: '2026-01-10 14:30:00',
    source: 'collect',
    amount: 830704600,
    buildingArea: 45521.15,
    completeness: 85,
  },
  {
    id: 'project_002',
    projectName: '惠民科技展示中心项目配套建筑',
    uploadTime: '2026-01-09 10:20:00',
    source: 'quality',
    amount: 647900700,
    buildingArea: 32450.80,
    completeness: 92,
  },
  {
    id: 'project_003',
    projectName: '某产业园及配套基础设施建设项目',
    uploadTime: '2026-01-08 16:45:00',
    source: 'estimate',
    amount: 708686900,
    buildingArea: 58720.30,
    completeness: 78,
  },
  {
    id: 'project_004',
    projectName: '成都市公共卫生应急病房评审项目',
    uploadTime: '2026-01-07 09:15:00',
    source: 'pricing',
    amount: 764184000,
    buildingArea: 41250.00,
    completeness: 88,
  },
  {
    id: 'project_005',
    projectName: '新津区某幼儿园项目',
    uploadTime: '2026-01-06 11:30:00',
    source: 'collect',
    amount: 343879600,
    buildingArea: 18560.25,
    completeness: 95,
  },
]

/**
 * 步骤1: 选择项目组件
 */
export const StepSelectProject = ({
  selectedProjectId,
  onSelect,
}: StepSelectProjectProps) => {
  const [keyword, setKeyword] = useState('')
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects)

  // 搜索过滤
  useEffect(() => {
    if (keyword) {
      setProjects(
        mockProjects.filter((p) =>
          p.projectName.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    } else {
      setProjects(mockProjects)
    }
  }, [keyword])

  const columns: ColumnsType<ProjectItem> = [
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
      width: 160,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 80,
      render: (value) => {
        const option = PROJECT_SOURCE_OPTIONS.find((o) => o.value === value)
        return <Tag color={option?.color}>{option?.label}</Tag>
      },
    },
    {
      title: '金额(万元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      render: (value) =>
        (value / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'buildingArea',
      key: 'buildingArea',
      width: 130,
      align: 'right',
      render: (value) =>
        value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '完成度',
      dataIndex: 'completeness',
      key: 'completeness',
      width: 90,
      align: 'center',
      render: (value) => {
        const color = value >= 80 ? '#52c41a' : '#faad14'
        return <span style={{ color }}>{value}%</span>
      },
    },
  ]

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Text type="secondary">
            请选择要发起入库申请的项目（仅显示补录完成度 ≥ 80% 的项目）
          </Text>
          <Search
            placeholder="搜索项目名称"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={projects}
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: selectedProjectId ? [selectedProjectId] : [],
            onChange: (_, selectedRows) => {
              onSelect(selectedRows[0] || null)
            },
            getCheckboxProps: (record) => ({
              disabled: record.completeness < 80,
            }),
          }}
          onRow={(record) => ({
            onClick: () => {
              if (record.completeness >= 80) {
                onSelect(record)
              }
            },
            style: {
              cursor: record.completeness >= 80 ? 'pointer' : 'not-allowed',
              opacity: record.completeness >= 80 ? 1 : 0.5,
            },
          })}
          locale={{
            emptyText: <Empty description="暂无可用项目" />,
          }}
        />
      </Card>
    </div>
  )
}

export default StepSelectProject