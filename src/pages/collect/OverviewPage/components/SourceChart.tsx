// src/pages/collect/OverviewPage/components/SourceChart.tsx
// 项目来源分布图组件

import { Card, Typography, Progress } from 'antd'
import styles from './SourceChart.module.css'

const { Text } = Typography

/**
 * 来源数据
 */
export interface SourceData {
  source: string
  label: string
  count: number
  percent: number
  color: string
}

interface SourceChartProps {
  data: SourceData[]
  total: number
}

/**
 * 项目来源分布图组件
 */
export const SourceChart = ({ data, total }: SourceChartProps) => {
  return (
    <Card title="📊 项目来源分布" className={styles.card}>
      <div className={styles.chartContent}>
        {data.map((item) => (
          <div key={item.source} className={styles.barItem}>
            <div className={styles.barLabel}>
              <Text>{item.label}</Text>
            </div>
            <div className={styles.barWrapper}>
              <Progress
                percent={item.percent}
                strokeColor={item.color}
                showInfo={false}
                size="small"
              />
            </div>
            <div className={styles.barValue}>
              <Text type="secondary">{item.percent}%</Text>
              <Text strong style={{ marginLeft: 8 }}>{item.count}个</Text>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <Text type="secondary">共 {total} 个项目</Text>
      </div>
    </Card>
  )
}

export default SourceChart