// src/pages/collect/OverviewPage/index.tsx
// 总览页面

import { useState, useEffect } from 'react'
import { Row, Col, Typography, Spin } from 'antd'
import { StatsCards } from './components/StatsCards'
import { TodoList } from './components/TodoList'
import type { TodoItem } from './components/TodoList'
import { SourceChart } from './components/SourceChart'
import type { SourceData } from './components/SourceChart'
import { QuickActions } from './components/QuickActions'
import { RecentProjects } from './components/RecentProjects'
import type { RecentProjectDTO } from './components/RecentProjects'
import { getMockOverviewData } from '@/mocks/overview'
import styles from './OverviewPage.module.css'

const { Title } = Typography

/**
 * 统计数据类型
 */
interface StatsData {
  projects: { total: number; canSubmit: number; editing: number }
  materials: { total: number; approved: number; pending: number }
  boqs: { total: number; approved: number; pending: number }
}

/**
 * 总览页面
 */
export const OverviewPage = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData>({
    projects: { total: 0, canSubmit: 0, editing: 0 },
    materials: { total: 0, approved: 0, pending: 0 },
    boqs: { total: 0, approved: 0, pending: 0 },
  })
  const [todoItems, setTodoItems] = useState<TodoItem[]>([])
  const [sourceData, setSourceData] = useState<SourceData[]>([])
  const [sourceTotal, setSourceTotal] = useState(0)
  const [recentProjects, setRecentProjects] = useState<RecentProjectDTO[]>([])

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 模拟 API 延迟
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        const data = getMockOverviewData()
        setStats(data.stats)
        setTodoItems(data.todoItems)
        setSourceData(data.sourceData)
        setSourceTotal(data.sourceTotal)
        setRecentProjects(data.recentProjects)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Title level={4} style={{ margin: 0 }}>总览</Title>
      </div>

      {/* 统计卡片 */}
      <div className={styles.section}>
        <StatsCards data={stats} />
      </div>

      {/* 待处理事项 + 来源分布 */}
      <Row gutter={16} className={styles.section}>
        <Col xs={24} lg={12}>
          <TodoList items={todoItems} />
        </Col>
        <Col xs={24} lg={12}>
          <SourceChart data={sourceData} total={sourceTotal} />
        </Col>
      </Row>

      {/* 快捷操作 */}
      <div className={styles.section}>
        <QuickActions />
      </div>

      {/* 最近项目 */}
      <div className={styles.section}>
        <RecentProjects data={recentProjects} />
      </div>
    </div>
  )
}

export default OverviewPage