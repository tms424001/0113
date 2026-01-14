// src/pages/assets/enterprise/ProjectsPage/components/StatsCards.tsx
// 统计卡片组件

import { Card, Row, Col, Statistic } from 'antd'
import {
  ProjectOutlined,
  DollarOutlined,
  AreaChartOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import styles from './StatsCards.module.css'

interface StatsCardsProps {
  stats: {
    projectCount: number
    totalAmount: number
    totalArea: number
    avgQualityScore: number
  }
  loading?: boolean
}

/**
 * 统计卡片组件
 */
export const StatsCards = ({ stats, loading }: StatsCardsProps) => {
  return (
    <Row gutter={16} className={styles.statsRow}>
      <Col xs={12} sm={12} md={6}>
        <Card size="small" loading={loading}>
          <Statistic
            title="项目总数"
            value={stats.projectCount}
            suffix="个"
            prefix={<ProjectOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card size="small" loading={loading}>
          <Statistic
            title="总金额"
            value={(stats.totalAmount / 100000000).toFixed(2)}
            suffix="亿元"
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card size="small" loading={loading}>
          <Statistic
            title="总建筑面积"
            value={(stats.totalArea / 10000).toFixed(0)}
            suffix="万㎡"
            prefix={<AreaChartOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} md={6}>
        <Card size="small" loading={loading}>
          <Statistic
            title="平均质量评分"
            value={stats.avgQualityScore}
            suffix="分"
            prefix={<SafetyCertificateOutlined />}
            valueStyle={{ color: stats.avgQualityScore >= 80 ? '#52c41a' : '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default StatsCards
