// src/pages/collect/CollectUploadPage/components/FileList.tsx
// 已上传文件列表组件

import React from 'react'
import { List, Tag, Progress, Button, Typography } from 'antd'
import {
  FileOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import type { UploadedFile } from '@/types/dto.upload'
import { formatFileSize, formatAmount } from '@/constants/upload'
import styles from '../CollectUploadPage.module.css'

const { Text } = Typography

// ============================================================================
// Types
// ============================================================================

export interface FileListProps {
  files: UploadedFile[]
  onDelete: (fileId: string) => void
  onSelect?: (fileId: string) => void
  selectedFileId?: string | null
}

// ============================================================================
// Component
// ============================================================================

export const FileList: React.FC<FileListProps> = ({
  files,
  onDelete,
  onSelect,
  selectedFileId,
}) => {
  if (files.length === 0) {
    return null
  }

  const renderStatus = (file: UploadedFile) => {
    switch (file.parseStatus) {
      case 'pending':
        return <Tag icon={<LoadingOutlined spin />} color="default">等待解析</Tag>
      case 'parsing':
        return <Tag icon={<LoadingOutlined spin />} color="processing">解析中...</Tag>
      case 'success':
        return <Tag icon={<CheckCircleOutlined />} color="success">解析成功</Tag>
      case 'failed':
        return <Tag icon={<CloseCircleOutlined />} color="error">解析失败</Tag>
      default:
        return null
    }
  }

  const renderProgress = (file: UploadedFile) => {
    // 上传中
    if (file.uploadProgress !== undefined && file.uploadProgress < 100) {
      return (
        <Progress
          percent={file.uploadProgress}
          size="small"
          status="active"
          format={(p) => `上传 ${p}%`}
        />
      )
    }

    // 解析中
    if (file.parseStatus === 'parsing' || file.parseStatus === 'pending') {
      return (
        <Progress
          percent={file.parseProgress}
          size="small"
          status="active"
          format={(p) => `解析 ${p}%`}
        />
      )
    }

    return null
  }

  const renderSummary = (file: UploadedFile) => {
    if (file.parseStatus === 'success' && file.parseResult) {
      const { subProjectCount, totalAmount } = file.parseResult
      return (
        <Text type="secondary" className={styles.fileSummary}>
          {file.formatName} 格式 | 单项工程 {subProjectCount}个 | 总金额 {formatAmount(totalAmount)}万
        </Text>
      )
    }

    if (file.parseStatus === 'failed' && file.error) {
      return (
        <Text type="danger" className={styles.fileError}>
          {file.error}
        </Text>
      )
    }

    return null
  }

  return (
    <div className={styles.fileList}>
      <div className={styles.fileListHeader}>已上传文件</div>
      <List
        dataSource={files}
        renderItem={(file) => (
          <List.Item
            className={`${styles.fileItem} ${selectedFileId === file.fileId ? styles.selected : ''}`}
            onClick={() => onSelect?.(file.fileId)}
            actions={[
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file.fileId)
                }}
              >
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<FileOutlined className={styles.fileIcon} />}
              title={
                <div className={styles.fileTitle}>
                  <span className={styles.fileName}>{file.fileName}</span>
                  <span className={styles.fileSize}>{formatFileSize(file.fileSize)}</span>
                  {renderStatus(file)}
                </div>
              }
              description={
                <div className={styles.fileDesc}>
                  {renderProgress(file)}
                  {renderSummary(file)}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default FileList
