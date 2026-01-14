// src/pages/collect/CollectUploadPage/index.tsx
// 采集上传页面主组件

import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, message } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@/components/ui/PageContainer'
import { UploadZone, FileList, BasicInfoForm } from './components'
import { useCollectUploadPageStore } from '@/stores/collectUploadPageStore'
import styles from './CollectUploadPage.module.css'

// ============================================================================
// Component
// ============================================================================

export const CollectUploadPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')

  const {
    files,
    selectedFileId,
    basicInfo,
    uploading,
    analyzing,
    uploadFile,
    deleteFile,
    selectFile,
    setBasicInfo,
    startAnalysis,
    reset,
  } = useCollectUploadPageStore()

  // 页面卸载时重置状态
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // 是否有解析成功的文件
  const hasSuccessFile = files.some((f) => f.parseStatus === 'success')

  // 是否可以开始分析（开发环境暂时放宽条件）
  const canStart = hasSuccessFile

  // 处理开始分析
  const handleStartAnalysis = async () => {
    try {
      const result = await startAnalysis()
      message.success('开始分析')
      navigate(result.redirectUrl)
    } catch (error) {
      message.error((error as Error).message || '启动分析失败，请重试')
    }
  }

  // 处理取消
  const handleCancel = () => {
    if (from) {
      navigate(-1)
    } else {
      navigate('/collect/dashboard')
    }
  }

  return (
    <PageContainer title="上传造价文件">
      <div className={styles.page}>
        {/* 上传区域 */}
        <UploadZone
          onUpload={uploadFile}
          loading={uploading}
          disabled={analyzing}
        />

        {/* 已上传文件列表 */}
        <FileList
          files={files}
          onDelete={deleteFile}
          onSelect={selectFile}
          selectedFileId={selectedFileId}
        />

        {/* 基本信息表单 */}
        {hasSuccessFile && (
          <BasicInfoForm
            values={basicInfo}
            onChange={setBasicInfo}
            disabled={analyzing}
          />
        )}

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <Button onClick={handleCancel} disabled={analyzing}>
            取消
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleStartAnalysis}
            loading={analyzing}
            disabled={!canStart}
          >
            开始分析
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}

export default CollectUploadPage
