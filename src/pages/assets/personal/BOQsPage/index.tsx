// src/pages/assets/personal/BOQsPage/index.tsx
// 个人清单库页面

import { useState, useEffect, useCallback } from 'react'
import { Card, Table, Input, Select, Button, Space, Row, Col, Tag } from 'antd'
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import styles from './BOQsPage.module.css'

interface PersonalBOQ {
  id: string
  boqCode: string
  boqName: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  source: string
  updateTime: string
  status: 'active' | 'archived'
}

const STATUS_OPTIONS = [
  { value: 'active', label: '正常', color: 'success' },
  { value: 'archived', label: '已归档', color: 'default' },
]

const PersonalBOQsPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PersonalBOQ[]>([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined as string | undefined,
  })
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    // 模拟数据
    await new Promise((r) => setTimeout(r, 500))
    const mockData: PersonalBOQ[] = Array.from({ length: 30 }, (_, i) => {
      const quantity = Math.round(Math.random() * 1000 * 100) / 100
      const unitPrice = Math.round(Math.random() * 500 * 100) / 100
      return {
        id: `boq-${i + 1}`,
        boqCode: `010${String(i + 1).padStart(3, '0')}`,
        boqName: `清单项${i + 1}`,
        unit: ['m²', 'm³', 't', '个'][i % 4],
        quantity,
        unitPrice,
        totalPrice: Math.round(quantity * unitPrice * 100) / 100,
        source: `项目${(i % 10) + 1}`,
        updateTime: new Date(Date.now() - i * 86400000).toISOString(),
        status: i % 6 === 0 ? 'archived' : 'active',
      }
    })
    setData(mockData)
    setTotal(mockData.length)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns: ColumnsType<PersonalBOQ> = [
    { title: '清单编码', dataIndex: 'boqCode', key: 'boqCode', width: 120 },
    { title: '清单名称', dataIndex: 'boqName', key: 'boqName', width: 200 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80, align: 'center' },
    {
      title: '工程量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (v) => v.toLocaleString('zh-CN'),
    },
    {
      title: '综合单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 110,
      align: 'right',
      render: (v) => `¥${v.toFixed(2)}`,
    },
    {
      title: '合价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right',
      render: (v) => `¥${v.toLocaleString('zh-CN')}`,
    },
    { title: '来源项目', dataIndex: 'source', key: 'source', width: 120 },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
      render: (v) => new Date(v).toLocaleDateString('zh-CN'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (v) => {
        const opt = STATUS_OPTIONS.find((o) => o.value === v)
        return <Tag color={opt?.color}>{opt?.label}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>我的清单</h1>
        <Button icon={<ExportOutlined />}>导出</Button>
      </div>

      <Card size="small" className={styles.filterBar}>
        <Row gutter={16} align="middle">
          <Col flex="240px">
            <Input
              placeholder="搜索清单编码或名称"
              prefix={<SearchOutlined />}
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              allowClear
            />
          </Col>
          <Col flex="140px">
            <Select
              placeholder="状态"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(v) => setFilters({ ...filters, status: v })}
              options={STATUS_OPTIONS}
              allowClear
            />
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              刷新
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className={styles.tableContainer}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            ...pagination,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default PersonalBOQsPage
