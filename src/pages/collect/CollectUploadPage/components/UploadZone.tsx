// src/pages/collect/CollectUploadPage/components/UploadZone.tsx
// 上传区域组件

import React, { useCallback, useRef } from 'react'
import { Button, message } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { MAX_FILE_SIZE_MB, ACCEPT_STRING, FILE_FORMATS } from '@/constants/upload'
import styles from '../CollectUploadPage.module.css'

// ============================================================================
// Types
// ============================================================================

export interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>
  loading?: boolean
  disabled?: boolean
}

// ============================================================================
// Component
// ============================================================================

export const UploadZone: React.FC<UploadZoneProps> = ({
  onUpload,
  loading = false,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // 处理文件选择
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // 检查文件大小
      const isLtMaxSize = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB
      if (!isLtMaxSize) {
        message.error(`文件大小不能超过 ${MAX_FILE_SIZE_MB}MB`)
        return
      }

      // 调用上传
      onUpload(file)

      // 清空 input 以便重复选择同一文件
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [onUpload]
  )

  // 处理拖拽
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (disabled || loading) return

      const file = e.dataTransfer.files?.[0]
      if (!file) return

      // 检查文件大小
      const isLtMaxSize = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB
      if (!isLtMaxSize) {
        message.error(`文件大小不能超过 ${MAX_FILE_SIZE_MB}MB`)
        return
      }

      onUpload(file)
    },
    [onUpload, disabled, loading]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // 点击选择文件
  const handleClick = useCallback(() => {
    if (disabled || loading) return
    inputRef.current?.click()
  }, [disabled, loading])

  // 生成支持格式文本
  const softwareList = [...new Set(FILE_FORMATS.map((f) => f.software))]
    .filter((s) => s !== '通用')
    .join('、')

  return (
    <div className={styles.uploadZone}>
      {/* 隐藏的文件输入 */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 拖拽区域 */}
      <div
        className={styles.dragger}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className={styles.uploadIcon}>
          <InboxOutlined />
        </p>
        <p className={styles.uploadText}>拖拽文件到此处，或点击选择文件</p>
        <p className={styles.uploadHint}>
          支持格式: {softwareList}、Excel、压缩包等
        </p>
        <p className={styles.uploadHint}>支持混合格式上传，系统自动识别</p>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          loading={loading}
          className={styles.uploadButton}
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          选择文件
        </Button>
      </div>
    </div>
  )
}

export default UploadZone
