// src/pages/assets/personal/MaterialsPage/index.tsx
// 个人材料库页面 - 管理个人采集的材料价格数据

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  message,
  Popconfirm,
  Modal,
} from 'antd'
import {
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { PersonalMaterialDTO } from '@/types/materialCollect'
import {
  MATERIAL_SOURCE_CHANNEL_OPTIONS,
  PERSONAL_MATERIAL_STATUS_OPTIONS,
} from '@/types/materialCollect'
import { getMockPersonalMaterialList } from '@/mocks/materialCollect'
import styles from './MaterialsPage.module.css'

const { Text } = Typography

/**
 * 个人材料库页面
 */
export const PersonalMaterialsPage = () => {
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<PersonalMaterialDTO[]>([])
  const [total, setTotal] = useState(0)

  // 筛选
  const [keyword, setKeyword] = useState('')
  const [source, setSource] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [timeRange, setTimeRange] = useState<string>('')

  // 分页
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 选中
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 加载数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const result = getMockPersonalMaterialList({
        keyword,
        source,
        status,
        region,
        page,
        pageSize,
      })
      setMaterials(result.items)
      setTotal(result.total)
    } finally {
      setLoading(false)
    }
  }, [keyword, source, status, region, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 重置
  const handleReset = () => {
    setKeyword('')
    setSource('')
    setStatus('')
    setRegion('')
    setTimeRange('')
    setPage(1)
  }

  // 删除
  const handleDelete = (ids: string[]) => {
    message.success(`已删除 ${ids.length} 条材料`)
    setSelectedIds([])
    fetchData()
  }

  // 推送
  const handlePush = (record: PersonalMaterialDTO) => {
    Modal.confirm({
      title: '推送到企业材料库',
      content: `确定将「${record.materialName}」推送到企业材料库审核吗？`,
      okText: '确认推送',
      cancelText: '取消',
      onOk: () => {
        message.success('已提交审核')
        fetchData()
      },
    })
  }

  // 批量推送
  const handleBatchPush = () => {
    const draftItems = materials.filter(
      (m) => selectedIds.includes(m.id) && m.pushStatus === 'draft'
    )
    if (draftItems.length === 0) {
      message.warning('请选择未推送的材料')
      return
    }
    Modal.confirm({
      title: '批量推送',
      content: `确定将选中的 ${draftItems.length} 条材料推送到企业材料库审核吗？`,
      okText: '确认推送',
      cancelText: '取消',
      onOk: () => {
        message.success(`已提交 ${draftItems.length} 条审核`)
        setSelectedIds([])
        fetchData()
      },
    })
  }

  const columns: ColumnsType<PersonalMaterialDTO> = [
    {
      title: '材料名称',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 160,
      render: (value) => (
        <Text style={{ cursor: 'pointer' }}>
          <span style={{ marginRight: 4 }}>›</span>
          {value}
        </Text>
      ),
    },
    {
      title: '规格型号',
      dataIndex: 'specification',
      key: 'specification',
      width: 140,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 70,
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (value) => (
        <Text strong style={{ color: '#fa8c16' }}>
          ¥{value.toLocaleString('zh-CN')}
        </Text>
      ),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (value) => {
        const opt = MATERIAL_SOURCE_CHANNEL_OPTIONS.find((o) => o.value === value)
        return <Tag color={opt?.color}>{opt?.label}</Tag>
      },
    },
    {
      title: '时间',
      dataIndex: 'priceDate',
      key: 'priceDate',
      width: 90,
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      width: 90,
    },
    {
      title: '推送状态',
      dataIndex: 'pushStatus',
      key: 'pushStatus',
      width: 90,
      align: 'center',
      render: (value) => {
        const opt = PERSONAL_MATERIAL_STATUS_OPTIONS.find((o) => o.value === value)
        return <Tag color={opt?.color}>{opt?.label}</Tag>
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
          {record.pushStatus === 'draft' && (
            <Button
              type="text"
              size="small"
              icon={<SendOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => handlePush(record)}
            />
          )}
          <Popconfirm
            title="确定删除该材料？"
            onConfirm={() => handleDelete([record.id])}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>个人材料库</h1>
          <Text type="secondary">管理个人采集的材料价格数据</Text>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className={styles.searchBar}>
        <Input.Search
          placeholder="搜索材料名称、规格..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={() => setPage(1)}
          style={{ width: '100%' }}
          allowClear
          size="large"
        />
      </div>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size="middle">
          <Select
            placeholder="来源"
            value={source || undefined}
            onChange={setSource}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: '', label: '全部' },
              ...MATERIAL_SOURCE_CHANNEL_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              })),
            ]}
          />
          <Select
            placeholder="时间"
            value={timeRange || undefined}
            onChange={setTimeRange}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: '', label: '全部时间' },
              { value: '2025-12', label: '2025-12' },
              { value: '2025-11', label: '2025-11' },
              { value: '2025-10', label: '2025-10' },
            ]}
          />
          <Select
            placeholder="地区"
            value={region || undefined}
            onChange={setRegion}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: '', label: '全部地区' },
              { value: '武汉', label: '武汉市' },
              { value: '宜昌', label: '宜昌市' },
              { value: '成都', label: '成都市' },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
        <Text type="secondary">共 {total} 条数据</Text>
      </div>

      {/* 数据表格 */}
      <div className={styles.tableContainer}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={materials}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: (keys) => setSelectedIds(keys as string[]),
          }}
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
          scroll={{ x: 1100 }}
        />
      </div>

      {/* 底部操作栏 */}
      {selectedIds.length > 0 && (
        <div className={styles.bottomBar}>
          <Text>
            已选 {selectedIds.length} 条
            <Text type="warning" style={{ marginLeft: 8 }}>
              待推送 {materials.filter((m) => selectedIds.includes(m.id) && m.pushStatus === 'draft').length} 条
            </Text>
          </Text>
          <Space>
            <Button type="primary" onClick={handleBatchPush}>
              批量推送
            </Button>
            <Popconfirm
              title={`确定删除选中的 ${selectedIds.length} 条材料？`}
              onConfirm={() => handleDelete(selectedIds)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger>批量删除</Button>
            </Popconfirm>
          </Space>
        </div>
      )}
    </div>
  )
}

export default PersonalMaterialsPage