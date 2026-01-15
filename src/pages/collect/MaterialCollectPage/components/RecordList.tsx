// src/pages/collect/MaterialCollectPage/components/RecordList.tsx
// 材料记录列表组件

import { useState, useEffect } from 'react'
import { Table, Button, Space, Typography, Tooltip, message, Popconfirm } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { MaterialRecordDTO } from '@/types/materialCollect'
import { MATERIAL_SOURCE_CHANNEL_OPTIONS } from '@/types/materialCollect'
import { getMockMaterialRecords } from '@/mocks/materialCollect'
import styles from './RecordList.module.css'

const { Text } = Typography

interface RecordListProps {
  fileId: string | null
  fileName?: string
}

/**
 * 材料记录列表组件
 */
export const RecordList = ({ fileId, fileName }: RecordListProps) => {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<MaterialRecordDTO[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 加载数据
  useEffect(() => {
    if (!fileId) {
      setRecords([])
      return
    }

    setLoading(true)
    // 模拟加载
    setTimeout(() => {
      const data = getMockMaterialRecords(fileId)
      setRecords(data)
      setLoading(false)
    }, 300)
  }, [fileId])

  // 统计
  const mappedCount = records.filter((r) => r.mappingStatus === 'mapped').length
  const pendingCount = records.filter((r) => r.mappingStatus === 'pending').length

  // 推送到我的材料
  const handlePushToLibrary = () => {
    if (selectedIds.length === 0) {
      message.warning('请选择要推送的材料')
      return
    }
    message.success(`已推送 ${selectedIds.length} 条材料到我的材料`)
    setSelectedIds([])
  }

  const columns: ColumnsType<MaterialRecordDTO> = [
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 50,
      render: (value) => {
        const opt = MATERIAL_SOURCE_CHANNEL_OPTIONS.find((o) => o.value === value)
        return (
          <Tooltip title={opt?.label}>
            <span>{opt?.icon}</span>
          </Tooltip>
        )
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
    },
    {
      title: '标准名称',
      dataIndex: 'standardName',
      key: 'standardName',
      width: 140,
      render: (value) =>
        value ? (
          <Text>{value}</Text>
        ) : (
          <Text type="warning">[待映射]</Text>
        ),
    },
    {
      title: '标准规格',
      dataIndex: 'standardSpec',
      key: 'standardSpec',
      width: 120,
      render: (value) => value || '-',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 60,
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (value) => (
        <Text strong style={{ color: '#1890ff' }}>
          {value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: '日期',
      dataIndex: 'priceDate',
      key: 'priceDate',
      width: 90,
    },
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
      width: 80,
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            查看
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
          <Text type="secondary" style={{ marginLeft: 8 }}>
            (共 {records.length} 条)
          </Text>
        </div>
        <Button icon={<SyncOutlined />} size="small">
          刷新
        </Button>
      </div>

      {/* 表格 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={records}
        loading={loading}
        size="small"
        pagination={false}
        scroll={{ y: 400 }}
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
          推送到我的材料
        </Button>
      </div>
    </div>
  )
}

export default RecordList