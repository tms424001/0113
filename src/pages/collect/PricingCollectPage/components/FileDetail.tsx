// src/pages/collect/PricingCollectPage/components/FileDetail.tsx
// 造价文件详情组件

import { Button, Typography, Descriptions, Tag, Space, message } from 'antd'
import { PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import type { PricingCollectFileDTO } from '@/types/pricingCollect'
import { PRICING_SOURCE_CHANNEL_OPTIONS } from '@/types/pricingCollect'
import styles from './FileDetail.module.css'

const { Text, Title } = Typography

interface FileDetailProps {
  file: PricingCollectFileDTO | null
}

/**
 * 获取状态标签
 */
function getStatusTag(status: string) {
  switch (status) {
    case 'pending':
      return <Tag color="default">待处理</Tag>
    case 'processing':
      return <Tag color="processing">处理中</Tag>
    case 'completed':
      return <Tag color="success">已完成</Tag>
    case 'failed':
      return <Tag color="error">失败</Tag>
    default:
      return <Tag>{status}</Tag>
  }
}

/**
 * 造价文件详情组件
 */
export const FileDetail = ({ file }: FileDetailProps) => {
  if (!file) {
    return (
      <div className={styles.empty}>
        <Text type="secondary">请在左侧选择文件查看详情</Text>
      </div>
    )
  }

  const sourceOpt = PRICING_SOURCE_CHANNEL_OPTIONS.find(
    (o) => o.value === file.sourceChannel
  )

  // 开始分析
  const handleStartAnalysis = () => {
    message.success('开始分析文件')
  }

  // 删除文件
  const handleDelete = () => {
    message.success('已删除文件')
  }

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div>
          <Title level={5} style={{ margin: 0 }}>{file.fileName}</Title>
          <Space style={{ marginTop: 8 }}>
            <Tag color={sourceOpt?.color}>{sourceOpt?.label}</Tag>
            {getStatusTag(file.status)}
          </Space>
        </div>
      </div>

      {/* 基本信息 */}
      <Descriptions column={2} className={styles.info}>
        <Descriptions.Item label="项目名称">{file.projectName || '-'}</Descriptions.Item>
        <Descriptions.Item label="文件类型">{file.fileType || '-'}</Descriptions.Item>
        <Descriptions.Item label="上传时间">{file.uploadTime}</Descriptions.Item>
        <Descriptions.Item label="上传人">{file.uploadBy}</Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>{file.remark || '-'}</Descriptions.Item>
      </Descriptions>

      {/* 操作按钮 */}
      <div className={styles.actions}>
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleStartAnalysis}
            disabled={file.status === 'processing'}
          >
            开始分析
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            删除
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default FileDetail
