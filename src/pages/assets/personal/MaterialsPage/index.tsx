// src/pages/assets/personal/MaterialsPage/index.tsx
// 个人材料库页面

import { useState, useEffect, useCallback } from 'react'
import { Card, Table, Input, Select, Button, Space, Row, Col, Tag } from 'antd'
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import styles from './MaterialsPage.module.css'

interface PersonalMaterial {
  id: string
  materialName: string
  specification: string
  unit: string
  brand: string
  price: number
  source: string
  updateTime: string
  status: 'active' | 'archived'
}

const STATUS_OPTIONS = [
  { value: 'active', label: '正常', color: 'success' },
  { value: 'archived', label: '已归档', color: 'default' },
]

const PersonalMaterialsPage = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PersonalMaterial[]>([])
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
    const mockData: PersonalMaterial[] = Array.from({ length: 25 }, (_, i) => ({
      id: `mat-${i + 1}`,
      materialName: `材料${i + 1}`,
      specification: `规格${i + 1}`,
      unit: ['m', 'kg', '个', '套'][i % 4],
      brand: `品牌${(i % 5) + 1}`,
      price: Math.round(Math.random() * 1000 * 100) / 100,
      source: `项目${(i % 10) + 1}`,
      updateTime: new Date(Date.now() - i * 86400000).toISOString(),
      status: i % 5 === 0 ? 'archived' : 'active',
    }))
    setData(mockData)
    setTotal(mockData.length)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const columns: ColumnsType<PersonalMaterial> = [
    { title: '材料名称', dataIndex: 'materialName', key: 'materialName', width: 200 },
    { title: '规格型号', dataIndex: 'specification', key: 'specification', width: 150 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80, align: 'center' },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 100 },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (v) => `¥${v.toFixed(2)}`,
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
        <h1 className={styles.title}>我的材料</h1>
        <Button icon={<ExportOutlined />}>导出</Button>
      </div>

      <Card size="small" className={styles.filterBar}>
        <Row gutter={16} align="middle">
          <Col flex="240px">
            <Input
              placeholder="搜索材料名称"
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
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default PersonalMaterialsPage
