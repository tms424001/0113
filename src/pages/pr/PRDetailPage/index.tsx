// src/pages/pr/PRDetailPage/index.tsx
// PR 详情页面

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Space, Spin, Result, message } from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import type { PRDetailDTO } from '@/mocks/prDetail'
import { getMockPRDetail } from '@/mocks/prDetail'
import { reviewMockPR, withdrawMockPR } from '@/mocks/prs'
import { BasicInfoCard } from './components/BasicInfoCard'
import { SubProjectsCard } from './components/SubProjectsCard'
import { ReviewTimeline } from './components/ReviewTimeline'
import { CheckResultsCard } from './components/CheckResultsCard'
import { ReviewActionBar } from './components/ReviewActionBar'
import styles from './PRDetailPage.module.css'

/**
 * PR 详情页面
 */
export const PRDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PRDetailDTO | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 加载数据
  const fetchData = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const result = getMockPRDetail(id)
      if (result) {
        setData(result)
      } else {
        setError('未找到该申请')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 返回列表
  const handleBack = useCallback(() => {
    navigate('/pr/list')
  }, [navigate])

  // 编辑
  const handleEdit = useCallback(() => {
    navigate(`/pr/${id}/edit`)
  }, [navigate, id])

  // 撤回
  const handleWithdraw = useCallback(async () => {
    if (!id) return
    const success = withdrawMockPR(id)
    if (success) {
      message.success('撤回成功')
      fetchData()
    } else {
      message.error('撤回失败')
    }
  }, [id, fetchData])

  // 审批操作
  const handleReview = useCallback(
    async (action: 'approve' | 'reject' | 'return', comment: string) => {
      if (!id) return

      const success = reviewMockPR(id, action, comment)
      if (success) {
        const messages = {
          approve: '审批通过',
          reject: '已驳回',
          return: '已退回',
        }
        message.success(messages[action])
        fetchData()
      } else {
        message.error('操作失败')
      }
    },
    [id, fetchData]
  )

  // 加载中
  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  // 错误状态
  if (error || !data) {
    return (
      <div className={styles.page}>
        <Result
          status="404"
          title="未找到申请"
          subTitle={error || '该入库申请不存在或已被删除'}
          extra={
            <Button type="primary" onClick={handleBack}>
              返回列表
            </Button>
          }
        />
      </div>
    )
  }

  // 判断是否可以编辑/撤回
  const canEdit = data.status === 'draft'
  const canWithdraw = ['pending', 'returned'].includes(data.status)
  // 判断是否显示审批操作栏（模拟：假设当前用户是审批人）
  const showReviewActions = ['pending', 'reviewing'].includes(data.status)

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className={styles.backButton}
          >
            返回列表
          </Button>
          <h1 className={styles.title}>入库申请详情</h1>
        </div>
        <Space>
          {canWithdraw && (
            <Button icon={<RollbackOutlined />} onClick={handleWithdraw}>
              撤回
            </Button>
          )}
          {canEdit && (
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              编辑
            </Button>
          )}
        </Space>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        {/* 左侧主内容 */}
        <div className={styles.mainContent}>
          {/* 基本信息 */}
          <BasicInfoCard data={data} />

          {/* 单项工程 */}
          <SubProjectsCard data={data} />

          {/* 智能校核 */}
          <CheckResultsCard data={data} />
        </div>

        {/* 右侧审批记录 */}
        <div className={styles.sideContent}>
          <ReviewTimeline data={data} />
        </div>
      </div>

      {/* 审批操作栏 */}
      {showReviewActions && (
        <ReviewActionBar data={data} onReview={handleReview} />
      )}
    </div>
  )
}

export default PRDetailPage