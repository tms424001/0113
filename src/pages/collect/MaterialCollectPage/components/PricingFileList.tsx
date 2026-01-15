// src/pages/collect/MaterialCollectPage/components/PricingFileList.tsx
// 造价文件提取组件 - 左右布局（左侧文件列表 + 右侧材料记录列表）

import { useState, useEffect } from 'react'
import { Row, Col, Card, Typography, Tag, Button, message, Popconfirm } from 'antd'
import { FileTextOutlined, SyncOutlined } from '@ant-design/icons'
import { RecordList } from './RecordList'
import styles from './PricingFileList.module.css'

const { Text } = Typography

/**
 * 造价文件数据
 */
interface PricingFileDTO {
  id: string
  fileName: string
  projectName: string
  uploadTime: string
  materialCount: number
  extractStatus: 'pending' | 'extracting' | 'completed' | 'failed'
}

/**
 * Mock 造价文件数据
 */
const mockPricingFiles: PricingFileDTO[] = [
  {
    id: 'pf_001',
    fileName: 'XX住宅项目_土建.gqs',
    projectName: 'XX住宅项目',
    uploadTime: '2025-12-15 10:30:00',
    materialCount: 328,
    extractStatus: 'completed',
  },
  {
    id: 'pf_002',
    fileName: 'XX商业综合体_安装.gqs',
    projectName: 'XX商业综合体',
    uploadTime: '2025-12-14 14:20:00',
    materialCount: 156,
    extractStatus: 'completed',
  },
  {
    id: 'pf_003',
    fileName: 'XX学校项目_土建.gqs',
    projectName: 'XX学校项目',
    uploadTime: '2025-12-13 09:15:00',
    materialCount: 0,
    extractStatus: 'pending',
  },
  {
    id: 'pf_004',
    fileName: 'XX医院项目_安装.gqs',
    projectName: 'XX医院项目',
    uploadTime: '2025-12-12 16:45:00',
    materialCount: 89,
    extractStatus: 'extracting',
  },
  {
    id: 'pf_005',
    fileName: 'XX办公楼_装饰.gqs',
    projectName: 'XX办公楼',
    uploadTime: '2025-12-11 11:30:00',
    materialCount: 0,
    extractStatus: 'failed',
  },
]

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
  const [files, setFiles] = useState<PricingFileDTO[]>([])
  const [selectedFile, setSelectedFile] = useState<PricingFileDTO | null>(null)

  // 加载数据
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setFiles(mockPricingFiles)
      setLoading(false)
    }, 300)
  }, [])

  // 刷新
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setFiles(mockPricingFiles)
      setLoading(false)
    }, 300)
  }

  // 提取材料
  const handleExtract = (file: PricingFileDTO) => {
    message.success(`开始提取「${file.fileName}」中的材料价格`)
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
                        {file.materialCount} 条
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

      {/* 右侧材料记录列表 */}
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
