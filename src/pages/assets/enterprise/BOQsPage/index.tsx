// src/pages/assets/enterprise/BOQsPage/index.tsx
// 企业清单库页面

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
} from 'antd'
import { ReloadOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { EnterpriseBOQDTO } from '@/types/enterprise'
import { getMockEnterpriseBOQList, mockEnterpriseBOQs } from '@/mocks/enterprise'
import styles from './BOQsPage.module.css'

const { Text } = Typography

/**
 * 企业清单库页面
 */
export const EnterpriseBOQsPage = () => {
  // 状态
  const [loading, setLoading] = useState(false)
  const [boqs, setBOQs] = useState<EnterpriseBOQDTO[]>([])
  const [total, setTotal] = useState(0)

  // 筛选
  const [keyword, setKeyword] = useState('')

  // 分页
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 加载数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const result = getMockEnterpriseBOQList({
        keyword,
        page,
        pageSize,
      })

      setBOQs(result.items)
      setTotal(result.total)
    } finally {
      setLoading(false)
    }
  }, [keyword, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 重置
  const handleReset = () => {
    setKeyword('')
    setPage(1)
  }

  // 表格列
  const columns: ColumnsType<EnterpriseBOQDTO> = [
    {
      title: '清单编码',
      dataIndex: 'boqCode',
      key: 'boqCode',
      width: 130,
    },
    {
      title: '清单名称',
      dataIndex: 'boqName',
      key: 'boqName',
      width: 200,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      align: 'center',
    },
    {
      title: '平均单价',
      dataIndex: 'avgUnitPrice',
      key: 'avgUnitPrice',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.avgUnitPrice - b.avgUnitPrice,
      render: (value) => (
        <Text strong style={{ color: '#1890ff' }}>
          {value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: '最低单价',
      dataIndex: 'minUnitPrice',
      key: 'minUnitPrice',
      width: 110,
      align: 'right',
      render: (value) => (
        <Text type="success">
          {value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: '最高单价',
      dataIndex: 'maxUnitPrice',
      key: 'maxUnitPrice',
      width: 110,
      align: 'right',
      render: (value) => (
        <Text type="danger">
          {value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: '价格区间',
      key: 'priceRange',
      width: 150,
      render: (_, record) => {
        const range = record.maxUnitPrice - record.minUnitPrice
        const percent = (range / record.avgUnitPrice * 100).toFixed(0)
        return (
          <span style={{ color: Number(percent) > 50 ? '#ff4d4f' : '#52c41a' }}>
            ±{percent}%
          </span>
        )
      },
    },
    {
      title: '来源项目',
      dataIndex: 'sourceProjectCount',
      key: 'sourceProjectCount',
      width: 100,
      align: 'center',
      render: (value) => `${value} 个`,
    },
    {
      title: '数据条数',
      dataIndex: 'dataCount',
      key: 'dataCount',
      width: 100,
      align: 'center',
    },
    {
      title: '最近更新',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 110,
      render: (value) => new Date(value).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            详情
          </Button>
          <Button type="link" size="small">
            分析
          </Button>
        </Space>
      ),
    },
  ]

  // 统计数据
  const totalDataCount = mockEnterpriseBOQs.reduce((sum, b) => sum + b.dataCount, 0)

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>企业清单库</h1>
        <Button icon={<ExportOutlined />}>导出数据</Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic title="清单项数" value={mockEnterpriseBOQs.length} suffix="项" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic title="总数据量" value={totalDataCount} suffix="条" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic title="来源项目" value={86} suffix="个" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic
              title="平均置信度"
              value={85}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="搜索清单名称/编码"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => setPage(1)}
            style={{ width: 240 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>

      {/* 数据表格 */}
      <div className={styles.tableContainer}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={boqs}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (p, ps) => {
              setPage(p)
              setPageSize(ps)
            },
          }}
          scroll={{ x: 1400 }}
        />
      </div>
    </div>
  )
}

export default EnterpriseBOQsPage