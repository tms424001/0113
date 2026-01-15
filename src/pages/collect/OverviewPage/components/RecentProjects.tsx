// src/pages/collect/OverviewPage/components/RecentProjects.tsx
// 最近项目列表组件

import { Card, Table, Typography, Button, Tag, Progress } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import styles from './RecentProjects.module.css'

const { Text } = Typography

/**
 * 项目来源
 */
type ProjectSource = 'pricing' | 'quality' | 'estimate' | 'collect'

/**
 * 项目状态
 */
type ProjectStatus = 'editing' | 'canSubmit' | 'submitted'

/**
 * 项目数据
 */
export interface RecentProjectDTO {
  id: string
  projectName: string
  subProjectCount?: number
  uploadTime: string
  source: ProjectSource
  amount: number
  completion: number
  status: ProjectStatus
}

interface RecentProjectsProps {
  data: RecentProjectDTO[]
  loading?: boolean
}

/**
 * 获取来源标签
 */
function getSourceTag(source: ProjectSource) {
  const config: Record<ProjectSource, { label: string; color: string }> = {
    pricing: { label: '计价', color: 'blue' },
    quality: { label: '质控', color: 'orange' },
    estimate: { label: '估算', color: 'purple' },
    collect: { label: '采集', color: 'cyan' },
  }
  const { label, color } = config[source]
  return <Tag color={color}>{label}</Tag>
}

/**
 * 获取状态标签
 */
function getStatusTag(status: ProjectStatus) {
  const config: Record<ProjectStatus, { label: string; color: string }> = {
    editing: { label: '编辑中', color: 'default' },
    canSubmit: { label: '可入库', color: 'success' },
    submitted: { label: '已入库', color: 'blue' },
  }
  const { label, color } = config[status]
  return <Tag color={color}>{label}</Tag>
}

/**
 * 获取完成度颜色
 */
function getCompletionColor(percent: number) {
  if (percent >= 80) return '#52c41a'
  if (percent >= 60) return '#faad14'
  return '#ff4d4f'
}

/**
 * 最近项目列表组件
 */
export const RecentProjects = ({ data, loading }: RecentProjectsProps) => {
  const navigate = useNavigate()

  const columns: ColumnsType<RecentProjectDTO> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: true,
      render: (value, record) => (
        <span>
          {value}
          {record.subProjectCount && (
            <Text type="secondary">({record.subProjectCount})</Text>
          )}
        </span>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 120,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 70,
      render: (value) => getSourceTag(value),
    },
    {
      title: '金额(万元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 110,
      align: 'right',
      render: (value) => value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }),
    },
    {
      title: '完成度',
      dataIndex: 'completion',
      key: 'completion',
      width: 120,
      render: (value) => (
        <div className={styles.completion}>
          <Progress
            percent={value}
            size="small"
            strokeColor={getCompletionColor(value)}
            showInfo={false}
            style={{ width: 60 }}
          />
          <Text style={{ marginLeft: 8, color: getCompletionColor(value) }}>
            {value}%
          </Text>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (value) => getStatusTag(value),
    },
  ]

  const handleViewAll = () => {
    navigate('/collect/my/projects')
  }

  const handleRowClick = (record: RecentProjectDTO) => {
    navigate(`/collect/my/projects/${record.id}`)
  }

  return (
    <Card
      title="📋 我的项目"
      className={styles.card}
      extra={
        <Button type="link" onClick={handleViewAll}>
          查看全部 <RightOutlined />
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        size="small"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
      />
    </Card>
  )
}

export default RecentProjects