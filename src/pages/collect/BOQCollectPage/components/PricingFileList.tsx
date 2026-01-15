// src/pages/collect/BOQCollectPage/components/PricingFileList.tsx
// 造价文件提取组件 - 左右布局（左侧文件列表 + 右侧清单记录列表）

import { useState, useEffect } from 'react'
import { Row, Col, Card, Typography, Tag, Button, message, Popconfirm } from 'antd'
import { FileTextOutlined, SyncOutlined } from '@ant-design/icons'
import type { BOQPricingFileDTO } from '@/types/boqCollect'
import { mockBOQPricingFiles } from '@/mocks/boqCollect'
import { RecordList } from './RecordList'
import styles from './PricingFileList.module.css'

const { Text } = Typography

/**
 * 获取状态标签
 */
function getStatusTag(status: string) {
  switch (status) {
    case 'pending':
      return <Tag color="default">待提取</Tag>
    case 'extracting':
      return <Tag color="processing">提取中</Tag>
    case 'completed':
      return <Tag color="success">已完成</Tag>
    case 'failed':
      return <Tag color="error">提取失败</Tag>
    default:
      return <Tag>{status}</Tag>
  }
}

/**
 * 造价文件提取组件
 */
export const PricingFileList = () => {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<BOQPricingFileDTO[]>([])
  const [selectedFile, setSelectedFile] = useState<BOQPricingFileDTO | null>(null)

  // 加载数据
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setFiles(mockBOQPricingFiles)
      setLoading(false)
    }, 300)
  }, [])

  // 刷新
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setFiles(mockBOQPricingFiles)
      setLoading(false)
    }, 300)
  }

  // 提取清单
  const handleExtract = (file: BOQPricingFileDTO) => {
    message.success(`开始提取「${file.fileName}」中的清单价格`)
  }

  return (
    <Row gutter={16} className={styles.mainRow}>
      {/* 左侧文件列表 */}
      <Col span={7}>
        <div className={styles.fileListContainer}>
          <div className={styles.fileListHeader}>
            <Text strong>造价文件列表</Text>
            <Button icon={<SyncOutlined />} size="small" onClick={handleRefresh} loading={loading}>
              刷新
            </Button>
          </div>
          <div className={styles.fileList}>
            {files.map((file) => (
              <div
                key={file.id}
                className={`${styles.fileItem} ${selectedFile?.id === file.id ? styles.fileItemSelected : ''}`}
                onClick={() => setSelectedFile(file)}
              >
                <div className={styles.fileIcon}>
                  <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <div className={styles.fileContent}>
                  <div className={styles.fileName}>{file.fileName}</div>
                  <div className={styles.fileMeta}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{file.projectName}</Text>
                    <span style={{ margin: '0 4px', color: '#d9d9d9' }}>|</span>
                    {getStatusTag(file.extractStatus)}
                    {file.extractStatus === 'completed' && (
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
                        {file.boqCount} 条
                      </Text>
                    )}
                  </div>
                </div>
                <div className={styles.fileActions}>
                  {file.extractStatus === 'pending' && (
                    <Button
                      type="link"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExtract(file)
                      }}
                    >
                      提取
                    </Button>
                  )}
                  {file.extractStatus === 'failed' && (
                    <Button
                      type="link"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExtract(file)
                      }}
                    >
                      重试
                    </Button>
                  )}
                  <Popconfirm
                    title="确定删除该文件？"
                    onConfirm={() => message.success('已删除')}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={(e) => e.stopPropagation()}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>

      {/* 右侧清单记录列表 */}
      <Col span={17}>
        <Card className={styles.recordCard}>
          <RecordList
            fileId={selectedFile?.id || null}
            fileName={selectedFile?.fileName}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default PricingFileList
