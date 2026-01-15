// src/pages/collect/MaterialCollectPage/components/FileList.tsx
// 文件列表组件

import { List, Tag, Button, Typography, Space } from 'antd'
import { FileExcelOutlined, SyncOutlined } from '@ant-design/icons'
import type { MaterialCollectFileDTO } from '@/types/materialCollect'
import { MATERIAL_SOURCE_CHANNEL_OPTIONS } from '@/types/materialCollect'
import styles from './FileList.module.css'

const { Text } = Typography

interface FileListProps {
  files: MaterialCollectFileDTO[]
  loading: boolean
  selectedId: string | null
  onSelect: (file: MaterialCollectFileDTO) => void
  onRefresh: () => void
  onImport: () => void
}

/**
 * 获取状态标签
 */
function getStatusTag(status: string) {
  switch (status) {
    case 'pending':
      return <Tag color="orange">待处理</Tag>
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
 * 文件列表组件
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
      <div className={styles.header}>
        <Text strong>文件列表</Text>
        <Button type="text" size="small" icon={<SyncOutlined />} onClick={onRefresh}>
          刷新列表
        </Button>
      </div>

      <List
        className={styles.list}
        loading={loading}
        dataSource={files}
        renderItem={(file) => {
          const sourceOpt = MATERIAL_SOURCE_CHANNEL_OPTIONS.find(
            (o) => o.value === file.sourceChannel
          )
          const isSelected = file.id === selectedId

          return (
            <div
              className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
              onClick={() => onSelect(file)}
            >
              <div className={styles.itemIcon}>
                <FileExcelOutlined style={{ fontSize: 20, color: '#52c41a' }} />
              </div>
              <div className={styles.itemContent}>
                <div className={styles.itemTitle}>{file.fileName}</div>
                <div className={styles.itemMeta}>
                  <Tag color={sourceOpt?.color} style={{ marginRight: 4 }}>
                    {sourceOpt?.label}
                  </Tag>
                  {getStatusTag(file.status)}
                  <Text type="secondary" style={{ marginLeft: 4 }}>
                    {file.recordCount}条
                  </Text>
                </div>
              </div>
            </div>
          )
        }}
      />

      <Button type="primary" block className={styles.importBtn} onClick={onImport}>
        📤 导入文件
      </Button>
    </div>
  )
}

export default FileList