// src/pages/assets/enterprise/MaterialsPage/index.tsx
// 企业材料库页面

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
} from 'antd'
import { ReloadOutlined, ExportOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { EnterpriseMaterialDTO } from '@/types/enterprise'
import { getMockEnterpriseMaterialList, mockEnterpriseMaterials } from '@/mocks/enterprise'
import styles from './MaterialsPage.module.css'

const { Text } = Typography

/**
 * 企业材料库页面
 */
export const EnterpriseMaterialsPage = () => {
  // 状态
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<EnterpriseMaterialDTO[]>([])
  const [total, setTotal] = useState(0)

  // 筛选
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>('')

  // 分页
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 加载数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const result = getMockEnterpriseMaterialList({
        keyword,
        status,
        page,
        pageSize,
      })

      setMaterials(result.items)
      setTotal(result.total)
    } finally {
      setLoading(false)
    }
  }, [keyword, status, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 重置
  const handleReset = () => {
    setKeyword('')
    setStatus('')
    setPage(1)
  }

  // 表格列
  const columns: ColumnsType<EnterpriseMaterialDTO> = [
    {
      title: '材料编码',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
    },
    {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 200,
      ellipsis: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
      align: 'center',
    },
    {
      title: '含税价',
      dataIndex: 'priceWithTax',
      key: 'priceWithTax',
      width: 110,
      align: 'right',
      sorter: (a, b) => a.priceWithTax - b.priceWithTax,
      render: (value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '不含税价',
      dataIndex: 'priceWithoutTax',
      key: 'priceWithoutTax',
      width: 110,
      align: 'right',
      render: (value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '价格时间',
      dataIndex: 'priceDate',
      key: 'priceDate',
      width: 110,
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (value) => (
        <Tag color={value === 'active' ? 'success' : 'warning'}>
          {value === 'active' ? '有效' : '过期'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: () => (
        <Button type="link" size="small">
          查看详情
        </Button>
      ),
    },
  ]

  // 统计数据
  const activeCount = mockEnterpriseMaterials.filter((m) => m.status === 'active').length
  const avgPrice = mockEnterpriseMaterials.reduce((sum, m) => sum + m.priceWithTax, 0) / mockEnterpriseMaterials.length

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>企业材料库</h1>
        <Button icon={<ExportOutlined />}>导出数据</Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic title="材料总数" value={mockEnterpriseMaterials.length} suffix="种" />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic title="有效材料" value={activeCount} suffix="种" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic
              title="总数据量"
              value={mockEnterpriseMaterials.reduce((sum, m) => sum + m.dataCount, 0)}
              suffix="条"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Card size="small">
            <Statistic title="来源项目" value={86} suffix="个" />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="搜索材料名称/编码"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={() => setPage(1)}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            placeholder="全部状态"
            value={status || undefined}
            onChange={setStatus}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: 'active', label: '有效' },
              { value: 'outdated', label: '过期' },
            ]}
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
          dataSource={materials}
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
          scroll={{ x: 1300 }}
        />
      </div>
    </div>
  )
}

export default EnterpriseMaterialsPage