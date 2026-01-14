// src/pages/pr/PRDetailPage/components/ReviewTimeline.tsx
// 审批记录时间线组件

import { Card, Timeline, Typography, Tag } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  SendOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import type { PRDetailDTO } from '@/mocks/prDetail'
import styles from './ReviewTimeline.module.css'

const { Text } = Typography

interface ReviewTimelineProps {
  data: PRDetailDTO
}

type ReviewRecord = PRDetailDTO['reviewHistory'][number]

/**
 * 获取操作图标和颜色
 */
function getActionConfig(action: ReviewRecord['action']) {
  const configs = {
    submit: { icon: <SendOutlined />, color: '#1890ff', label: '提交申请' },
    approve: { icon: <CheckCircleOutlined />, color: '#52c41a', label: '审批通过' },
    reject: { icon: <CloseCircleOutlined />, color: '#ff4d4f', label: '驳回' },
    return: { icon: <RollbackOutlined />, color: '#fa8c16', label: '退回修改' },
    withdraw: { icon: <MinusCircleOutlined />, color: '#d9d9d9', label: '撤回' },
  }
  return configs[action] || configs.submit
}

/**
 * 审批记录时间线组件
 */
export const ReviewTimeline = ({ data }: ReviewTimelineProps) => {
  const items = data.reviewHistory.map((record) => {
    const config = getActionConfig(record.action)
    return {
      key: record.id,
      dot: config.icon,
      color: config.color,
      children: (
        <div className={styles.timelineItem}>
          <div className={styles.itemHeader}>
            <Tag color={config.color}>{config.label}</Tag>
            <Text type="secondary" className={styles.levelTag}>
              {record.level === 'level1' ? '一级审批' : '二级审批'}
            </Text>
          </div>
          <div className={styles.itemContent}>
            <Text>{record.operator}</Text>
            <Text type="secondary" className={styles.time}>
              {record.operateTime}
            </Text>
          </div>
          {record.comment && (
            <div className={styles.comment}>
              <Text type="secondary">"{record.comment}"</Text>
            </div>
          )}
        </div>
      ),
    }
  })

  // 如果是待审批状态，添加等待节点
  if (['pending', 'reviewing'].includes(data.status)) {
    items.push({
      key: 'waiting',
      dot: <MinusCircleOutlined />,
      color: '#d9d9d9',
      children: (
        <div className={styles.timelineItem}>
          <div className={styles.itemHeader}>
            <Tag color="processing">等待审批</Tag>
            <Text type="secondary" className={styles.levelTag}>
              {data.currentLevel === 'level1' ? '一级审批' : '二级审批'}
            </Text>
          </div>
          <div className={styles.itemContent}>
            <Text type="secondary">等待审批人处理...</Text>
          </div>
        </div>
      ),
    })
  }

  return (
    <Card title="审批记录" className={styles.card}>
      <Timeline items={items} />
    </Card>
  )
}

export default ReviewTimeline