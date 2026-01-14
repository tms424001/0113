// src/pages/pr/PRDetailPage/components/CheckResultsCard.tsx
// 智能校核结果卡片组件

import { Card, List, Typography, Tag } from 'antd'
import {
  WarningOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import type { PRDetailDTO } from '@/mocks/prDetail'
import styles from './CheckResultsCard.module.css'

const { Text } = Typography

interface CheckResultsCardProps {
  data: PRDetailDTO
}

/**
 * 获取校核类型配置
 */
function getTypeConfig(type: 'warning' | 'info' | 'error') {
  const configs = {
    warning: {
      icon: <WarningOutlined />,
      color: '#faad14',
      tagColor: 'warning',
    },
    info: {
      icon: <InfoCircleOutlined />,
      color: '#1890ff',
      tagColor: 'processing',
    },
    error: {
      icon: <CloseCircleOutlined />,
      color: '#ff4d4f',
      tagColor: 'error',
    },
  }
  return configs[type]
}

/**
 * 智能校核结果卡片
 */
export const CheckResultsCard = ({ data }: CheckResultsCardProps) => {
  if (!data.checkResults || data.checkResults.length === 0) {
    return (
      <Card title="智能校核" className={styles.card}>
        <div className={styles.empty}>
          <Text type="secondary">暂无校核问题</Text>
        </div>
      </Card>
    )
  }

  return (
    <Card title="智能校核" className={styles.card}>
      <List
        dataSource={data.checkResults}
        renderItem={(item) => {
          const config = getTypeConfig(item.type)
          return (
            <List.Item className={styles.listItem}>
              <div className={styles.itemContent}>
                <span className={styles.icon} style={{ color: config.color }}>
                  {config.icon}
                </span>
                <Tag color={config.tagColor} className={styles.categoryTag}>
                  {item.category}
                </Tag>
                <Text className={styles.message}>{item.message}</Text>
              </div>
            </List.Item>
          )
        }}
      />
    </Card>
  )
}

export default CheckResultsCard
