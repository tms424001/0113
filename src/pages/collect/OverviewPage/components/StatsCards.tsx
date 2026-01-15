// src/pages/collect/OverviewPage/components/StatsCards.tsx
// 统计卡片组件

import { Card, Row, Col, Typography, Space } from 'antd'
import {
  ProjectOutlined,
  DatabaseOutlined,
  UnorderedListOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './StatsCards.module.css'

const { Text } = Typography

interface StatsData {
  projects: {
    total: number
    canSubmit: number
    editing: number
  }
  materials: {
    total: number
    approved: number
    pending: number
  }
  boqs: {
    total: number
    approved: number
    pending: number
  }
}

interface StatsCardsProps {
  data: StatsData
}

/**
 * 统计卡片组件
 */
export const StatsCards = ({ data }: StatsCardsProps) => {
  const navigate = useNavigate()

  const cards = [
    {
      key: 'projects',
      title: '我的项目',
      icon: <ProjectOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
      total: data.projects.total,
      subItems: [
        { label: '可入库', value: data.projects.canSubmit },
        { label: '编辑中', value: data.projects.editing },
      ],
      path: '/collect/my/projects',
    },
    {
      key: 'materials',
      title: '我的材料',
      icon: <DatabaseOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
      total: data.materials.total,
      subItems: [
        { label: '已入库', value: data.materials.approved },
        { label: '待推送', value: data.materials.pending },
      ],
      path: '/collect/my/materials',
    },
    {
      key: 'boqs',
      title: '我的清单',
      icon: <UnorderedListOutlined />,
      color: '#fa8c16',
      bgColor: '#fff7e6',
      total: data.boqs.total,
      subItems: [
        { label: '已入库', value: data.boqs.approved },
        { label: '待推送', value: data.boqs.pending },
      ],
      path: '/collect/my/boqs',
    },
  ]

  return (
    <Row gutter={16}>
      {cards.map((card) => (
        <Col key={card.key} xs={24} sm={8}>
          <Card
            className={styles.card}
            hoverable
            onClick={() => navigate(card.path)}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.iconWrapper}
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  {card.icon}
                </div>
                <Text className={styles.cardTitle}>{card.title}</Text>
                <RightOutlined className={styles.arrow} />
              </div>
              <div className={styles.cardMain}>
                <span className={styles.totalNumber} style={{ color: card.color }}>
                  {card.total}
                </span>
              </div>
              <div className={styles.cardFooter}>
                {card.subItems.map((item, index) => (
                  <span key={item.label} className={styles.subItem}>
                    {index > 0 && <span className={styles.divider} />}
                    <Text type="secondary">{item.label}</Text>
                    <Text strong style={{ marginLeft: 4 }}>{item.value}</Text>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatsCards