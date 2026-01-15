// src/pages/collect/PricingCollectPage/components/RecordList.tsx
// 造价记录列表组件

import { useState, useEffect } from 'react'
import { Table, Button, Space, Typography, Tooltip, message, Popconfirm, Select, Tag } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { PricingRecordDTO } from '@/types/pricingCollect'
import {
  PRICING_SOURCE_CHANNEL_OPTIONS,
  PRICING_RECORD_TYPE_OPTIONS,
  PRICING_MAPPING_STATUS_OPTIONS,
} from '@/types/pricingCollect'
import { getMockPricingRecords } from '@/mocks/pricingCollect'
import styles from './RecordList.module.css'

const { Text } = Typography

interface RecordListProps {
  fileId: string | null
  fileName?: string
}

/**
 * 造价记录列表组件
 */
export const RecordList = ({ fileId, fileName }: RecordListProps) => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<PricingRecordDTO[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>('')
  const [mappingStatusFilter, setMappingStatusFilter] = useState<string>('')

  // 加载数据
  useEffect(() => {
    if (!fileId) {
      setRecords([])
      return
    }

    setLoading(true)
    // 模拟加载
    setTimeout(() => {
      const data = getMockPricingRecords(fileId, {
        recordType: recordTypeFilter || undefined,
        mappingStatus: mappingStatusFilter || undefined,
      })
      setRecords(data)
      setLoading(false)
    }, 300)
  }, [fileId, recordTypeFilter, mappingStatusFilter])

  // 统计
  const mappedCount = records.filter((r) => r.mappingStatus === 'mapped').length
  const pendingCount = records.filter((r) => r.mappingStatus === 'pending').length

  // 推送到我的库
  const handlePushToLibrary = () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要推送的记录')
      return
    }
    message.success(`已推送 ${selectedIds.length} 条记录到我的造价库`)
    setSelectedIds([])
  }

  const columns: ColumnsType<PricingRecordDTO> = [
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 50,
      render: (value) => {
        const opt = PRICING_SOURCE_CHANNEL_OPTIONS.find((o) => o.value === value)
        return (
          <Tooltip title={opt?.label}>
            <span>{opt?.icon}</span>
          </Tooltip>
        )
      },
    },
    {
      title: '类型',
      dataIndex: 'recordType',
      key: 'recordType',
      width: 70,
      render: (value) => {
        const opt = PRICING_RECORD_TYPE_OPTIONS.find((o) => o.value === value)
        return opt ? <Tag color={opt.color}>{opt.label}</Tag> : value
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      ellipsis: true,
    },
    {
      title: '规格特征',
      dataIndex: 'specification',
      key: 'specification',
      width: 140,
      ellipsis: true,
    },
    {
      title: '标准名称',
      dataIndex: 'standardName',
      key: 'standardName',
      width: 120,
      render: (value) =>
        value ? (
          <Text>{value}</Text>
        ) : (
          <Text type="warning">[待映射]</Text>
        ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 60,
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 90,
      align: 'right',
      render: (value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right',
      render: (value) => (
        <Text strong style={{ color: '#1890ff' }}>
          {value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: '合价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right',
      render: (value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '映射状态',
      dataIndex: 'mappingStatus',
      key: 'mappingStatus',
      width: 90,
      render: (value) => {
        const opt = PRICING_MAPPING_STATUS_OPTIONS.find((o) => o.value === value)
        return opt ? <Tag color={opt.color}>{opt.label}</Tag> : value
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            映射
          </Button>
          <Popconfirm
            title="确定删除该记录？"
            onConfirm={() => message.success('已删除')}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (!fileId) {
    return (
      <div className={styles.empty}>
        <Text type="secondary">请在左侧选择文件查看记录</Text>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.title}>
          <Text strong>记录列表</Text>
          {fileName && (
            <Text type="secondary" style={{ marginLeft: 8 }}>
              - {fileName}
            </Text>
          )}
        </div>
        <Button icon={<SyncOutlined />} size="small">
          刷新
        </Button>
      </div>

      {/* 筛选行 */}
      <div className={styles.filterRow}>
        <Select
          placeholder="记录类型"
          value={recordTypeFilter || undefined}
          onChange={setRecordTypeFilter}
          style={{ width: 100 }}
          allowClear
          size="small"
          options={[
            { value: '', label: '全部类型' },
            ...PRICING_RECORD_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
        <Select
          placeholder="映射状态"
          value={mappingStatusFilter || undefined}
          onChange={setMappingStatusFilter}
          style={{ width: 100 }}
          allowClear
          size="small"
          options={[
            { value: '', label: '全部状态' },
            ...PRICING_MAPPING_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </div>

      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={records}
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ x: 1200, y: 350 }}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (keys) => setSelectedIds(keys as string[]),
        }}
      />

      {/* 底部统计和操作 */}
      <div className={styles.footer}>
        <div className={styles.stats}>
          <Text>共 {records.length} 条</Text>
          <Text type="success" style={{ marginLeft: 16 }}>
            已映射 {mappedCount}
          </Text>
          {pendingCount > 0 && (
            <Text type="warning" style={{ marginLeft: 8 }}>
              待映射 {pendingCount}
            </Text>
          )}
        </div>
        <Button type="primary" onClick={handlePushToLibrary}>
          推送到我的造价库
        </Button>
      </div>
    </div>
  )
}

export default RecordList
