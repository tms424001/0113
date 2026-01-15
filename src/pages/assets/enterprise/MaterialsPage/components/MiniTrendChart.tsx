// src/pages/assets/enterprise/MaterialsPage/components/MiniTrendChart.tsx
// 迷你走势图组件

import { useMemo } from 'react'
import styles from './MiniTrendChart.module.css'

interface MiniTrendChartProps {
  data: number[]
  width?: number
  height?: number
}

/**
 * 迷你走势图组件（SVG 实现）
 */
export const MiniTrendChart: React.FC<MiniTrendChartProps> = ({
  data,
  width = 100,
  height = 24,
}) => {
  const pathD = useMemo(() => {
    if (!data || data.length < 2) return ''

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })

    return `M ${points.join(' L ')}`
  }, [data, width, height])

  // 判断趋势：最后一个值与第一个值比较
  const trend = useMemo(() => {
    if (!data || data.length < 2) return 'neutral'
    const first = data[0]
    const last = data[data.length - 1]
    if (last > first) return 'up'
    if (last < first) return 'down'
    return 'neutral'
  }, [data])

  const strokeColor = trend === 'up' ? '#52c41a' : trend === 'down' ? '#ff4d4f' : '#1890ff'

  if (!data || data.length < 2) {
    return <span className={styles.noData}>-</span>
  }

  return (
    <svg width={width} height={height} className={styles.chart}>
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MiniTrendChart
