// src/pages/collect/PricingCollectPage/components/FileList.tsx
// 造价文件列表组件

import { Typography, Tag, Button, Spin } from 'antd'
import { FileTextOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons'
import type { PricingCollectFileDTO } from '@/types/pricingCollect'
import { PRICING_SOURCE_CHANNEL_OPTIONS } from '@/types/pricingCollect'
import styles from './FileList.module.css'

const { Text } = Typography

interface FileListProps {
  files: PricingCollectFileDTO[]
  loading: boolean
  selectedId: string | null
  onSelect: (file: PricingCollectFileDTO) => void
  onRefresh: () => void
  onImport: () => void
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
 * 造价文件列表组件
 */
export const FileList = ({
  files,
  loading,
  selectedId,
  onSelect,
  onRefresh,
  onImport,
}: FileListProps) => {
  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <Text strong>文件列表</Text>
        <Button icon={<SyncOutlined />} size="small" onClick={onRefresh}>
          刷新列表
        </Button>
      </div>

      {/* 文件列表 */}
      <div className={styles.list}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            暂无文件
          </div>
        ) : (
          files.map((file) => {
            const sourceOpt = PRICING_SOURCE_CHANNEL_OPTIONS.find(
              (o) => o.value === file.sourceChannel
            )
            return (
              <div
                key={file.id}
                className={`${styles.item} ${selectedId === file.id ? styles.itemSelected : ''}`}
                onClick={() => onSelect(file)}
              >
                <div className={styles.itemIcon}>
                  <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{file.fileName}</div>
                  <div className={styles.itemMeta}>
                    <Tag color={sourceOpt?.color}>{sourceOpt?.label}</Tag>
                    {getStatusTag(file.status)}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {file.recordCount} 条
                      {file.mappedCount > 0 && ` (已映射 ${file.mappedCount})`}
                    </Text>
                  </div>
                  <div className={styles.itemProject}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {file.projectName || '未关联项目'} · {file.region || '未知地区'}
                    </Text>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 导入按钮 */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className={styles.importBtn}
        block
        onClick={onImport}
      >
        上传文件
      </Button>
    </div>
  )
}

export default FileList
