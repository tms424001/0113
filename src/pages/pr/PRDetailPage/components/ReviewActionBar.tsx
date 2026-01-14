// src/pages/pr/PRDetailPage/components/ReviewActionBar.tsx
// 审批操作栏组件

import { useState } from 'react'
import { Card, Button, Space, Modal, Input, message, Typography } from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import type { PRDetailDTO } from '@/mocks/prDetail'
import styles from './ReviewActionBar.module.css'

const { TextArea } = Input
const { Text } = Typography

interface ReviewActionBarProps {
  data: PRDetailDTO
  onReview: (action: 'approve' | 'reject' | 'return', comment: string) => Promise<void>
}

/**
 * 审批操作栏组件
 */
export const ReviewActionBar = ({ data, onReview }: ReviewActionBarProps) => {
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'return' | null>(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  // 只有待审批状态才显示操作栏
  if (!['pending', 'reviewing'].includes(data.status)) {
    return null
  }

  const handleSubmit = async () => {
    if (!modalType) return

    if (modalType !== 'approve' && !comment.trim()) {
      message.warning('请填写审批意见')
      return
    }

    setLoading(true)
    try {
      await onReview(modalType, comment || '审核通过')
      setModalType(null)
      setComment('')
    } finally {
      setLoading(false)
    }
  }

  const getModalConfig = () => {
    switch (modalType) {
      case 'approve':
        return {
          title: '确认审批通过',
          content: '确定通过该入库申请吗？通过后数据将进入企业资产库。',
          okText: '确认通过',
          okType: 'primary' as const,
        }
      case 'reject':
        return {
          title: '驳回申请',
          content: '确定驳回该入库申请吗？驳回后申请将终止，不可恢复。',
          okText: '确认驳回',
          okType: 'primary' as const,
          danger: true,
        }
      case 'return':
        return {
          title: '退回修改',
          content: '将该申请退回给申请人进行修改，修改后可重新提交。',
          okText: '确认退回',
          okType: 'default' as const,
        }
      default:
        return null
    }
  }

  const modalConfig = getModalConfig()

  return (
    <>
      <Card className={styles.actionBar}>
        <div className={styles.content}>
          <div className={styles.info}>
            <Text type="secondary">
              当前审批级别：
              <Text strong>
                {data.currentLevel === 'level1' ? '一级审批' : '二级审批'}
              </Text>
            </Text>
          </div>
          <Space size="middle">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => setModalType('approve')}
            >
              通过
            </Button>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => setModalType('return')}
            >
              退回修改
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => setModalType('reject')}
            >
              驳回
            </Button>
          </Space>
        </div>
      </Card>

      <Modal
        title={modalConfig?.title}
        open={!!modalType}
        onCancel={() => {
          setModalType(null)
          setComment('')
        }}
        onOk={handleSubmit}
        okText={modalConfig?.okText}
        okButtonProps={{ 
          danger: modalConfig?.danger,
          loading,
        }}
        cancelText="取消"
      >
        <p>{modalConfig?.content}</p>
        <div className={styles.commentSection}>
          <Text type="secondary">
            审批意见{modalType !== 'approve' && <Text type="danger">*</Text>}
          </Text>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              modalType === 'approve'
                ? '可选填写审批意见'
                : '请填写审批意见'
            }
            rows={3}
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </>
  )
}

export default ReviewActionBar