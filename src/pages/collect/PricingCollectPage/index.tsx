// src/pages/collect/PricingCollectPage/index.tsx
// 造价文件采集页面

import { useState, useEffect, useCallback } from 'react'
import {
  Input,
  Select,
  Button,
  Space,
  Tabs,
  Typography,
  Row,
  Col,
  Card,
} from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import type { PricingCollectFileDTO } from '@/types/pricingCollect'
import { PRICING_SOURCE_CHANNEL_OPTIONS } from '@/types/pricingCollect'
import { getMockPricingFiles, getMockPricingCollectStats } from '@/mocks/pricingCollect'
import { FileList } from './components/FileList'
import { RecordList } from './components/RecordList'
import { ImportFileModal } from './components/ImportFileModal'
import { PricingFileList } from './components/PricingFileList'
import styles from './PricingCollectPage.module.css'

const { Title, Text } = Typography

/**
 * 造价文件采集页面
 */
export const PricingCollectPage = () => {
  // 状态
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<PricingCollectFileDTO[]>([])
  const [selectedFile, setSelectedFile] = useState<PricingCollectFileDTO | null>(null)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [stats, setStats] = useState({ totalFiles: 0, pendingFiles: 0, completedFiles: 0 })

  // 筛选
  const [keyword, setKeyword] = useState('')
  const [sourceChannel, setSourceChannel] = useState<string>('')
  const [region, setRegion] = useState<string>('')

  // 加载文件列表
  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = getMockPricingFiles({
        keyword,
        sourceChannel,
        page: 1,
        pageSize: 100,
      })
      setFiles(result.items)

      // 加载统计
      const statsData = getMockPricingCollectStats()
      setStats(statsData)
    } finally {
      setLoading(false)
    }
  }, [keyword, sourceChannel])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // 搜索
  const handleSearch = () => {
    fetchFiles()
  }

  // 重置
  const handleReset = () => {
    setKeyword('')
    setSourceChannel('')
    setRegion('')
  }

  // 导入成功
  const handleImportSuccess = () => {
    setImportModalOpen(false)
    fetchFiles()
  }

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div>
          <Title level={4} style={{ margin: 0 }}>造价文件采集</Title>
          <Text type="secondary">
            草稿文件 {stats.pendingFiles} · 已完成 {stats.completedFiles}
          </Text>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size="middle">
          <Input
            placeholder="名称/编码"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 140 }}
            prefix={<SearchOutlined />}
          />
          <Input placeholder="规格特征" style={{ width: 120 }} />
          <Space.Compact>
            <Input placeholder="最低" style={{ width: 80 }} />
            <Input
              style={{ width: 30, textAlign: 'center', pointerEvents: 'none' }}
              placeholder="~"
              disabled
            />
            <Input placeholder="最高" style={{ width: 80 }} />
          </Space.Compact>
          <Select
            placeholder="地区"
            value={region || undefined}
            onChange={setRegion}
            style={{ width: 100 }}
            allowClear
            options={[
              { value: '全部', label: '全部' },
              { value: '武汉', label: '武汉' },
              { value: '上海', label: '上海' },
              { value: '成都', label: '成都' },
            ]}
          />
          <Select
            placeholder="来源"
            value={sourceChannel || undefined}
            onChange={setSourceChannel}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: '', label: '全部' },
              ...PRICING_SOURCE_CHANNEL_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              })),
            ]}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>

      {/* 主内容区 - Tab */}
      <div className={styles.content}>
        <Tabs
          defaultActiveKey="collect"
          items={[
            {
              key: 'collect',
              label: '📁 文件采集',
              children: (
                <Row gutter={16} className={styles.mainRow}>
                  {/* 左侧文件列表 */}
                  <Col span={7}>
                    <FileList
                      files={files}
                      loading={loading}
                      selectedId={selectedFile?.id || null}
                      onSelect={setSelectedFile}
                      onRefresh={fetchFiles}
                      onImport={() => setImportModalOpen(true)}
                    />
                  </Col>
                  {/* 右侧记录列表 */}
                  <Col span={17}>
                    <Card className={styles.recordCard}>
                      <RecordList
                        fileId={selectedFile?.id || null}
                        fileName={selectedFile?.fileName}
                      />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'extract',
              label: '📄 造价文件提取',
              children: <PricingFileList />,
            },
          ]}
        />
      </div>

      {/* 导入弹窗 */}
      <ImportFileModal
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  )
}

export default PricingCollectPage
