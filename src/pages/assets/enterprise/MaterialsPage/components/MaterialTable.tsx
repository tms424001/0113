// src/pages/assets/enterprise/MaterialsPage/components/MaterialTable.tsx
// 材料列表表格组件

import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MaterialListItem } from '../types'
import { MiniTrendChart } from './MiniTrendChart'
import styles from './MaterialTable.module.css'

const { Text } = Typography

interface MaterialTableProps {
  loading: boolean
  data: MaterialListItem[]
  total: number
  page: number
  pageSize: number
  selectedRowKeys: React.Key[]
  onPageChange: (page: number, pageSize: number) => void
  onRowClick: (record: MaterialListItem) => void
  onSelectionChange: (keys: React.Key[]) => void
  onSort: (field: string, order: 'asc' | 'desc' | undefined) => void
}

/**
 * 材料列表表格组件
 */
export const MaterialTable: React.FC<MaterialTableProps> = ({
  loading,
  data,
  total,
  page,
  pageSize,
  selectedRowKeys,
  onPageChange,
  onRowClick,
  onSelectionChange,
  onSort,
}) => {
  const columns: ColumnsType<MaterialListItem> = [
    {
      title: '材料信息',
      key: 'materialInfo',
      width: 280,
      render: (_, record) => (
        <div className={styles.materialInfo}>
          <div className={styles.materialName}>{record.materialName}</div>
          <div className={styles.materialSpec}>
            <Text type="secondary">{record.specification}</Text>
            {record.brand && record.brand !== '-' && (
              <Tag className={styles.brandTag}>{record.brand}</Tag>
            )}
          </div>
        </div>
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
      title: '基准价',
      dataIndex: 'basePrice',
      key: 'basePrice',
      width: 100,
      align: 'right',
      sorter: true,
      render: (value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '综合价',
      dataIndex: 'compositePrice',
      key: 'compositePrice',
      width: 100,
      align: 'right',
      sorter: true,
      render: (value) => (
        <Text strong>{value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</Text>
      ),
    },
    {
      title: '偏离',
      dataIndex: 'deviationRate',
      key: 'deviationRate',
      width: 80,
      align: 'right',
      sorter: true,
      render: (value) => {
        const color = value > 0 ? '#ff4d4f' : value < 0 ? '#52c41a' : '#666'
        const prefix = value > 0 ? '+' : ''
        return <span style={{ color }}>{prefix}{value.toFixed(2)}%</span>
      },
    },
    {
      title: '走势',
      dataIndex: 'trendData',
      key: 'trendData',
      width: 120,
      align: 'center',
      render: (data) => <MiniTrendChart data={data} />,
    },
    {
      title: '样本',
      dataIndex: 'sampleCount',
      key: 'sampleCount',
      width: 60,
      align: 'center',
      sorter: true,
    },
  ]

  const handleTableChange = (
    _pagination: any,
    _filters: any,
    sorter: any
  ) => {
    if (sorter.field) {
      const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined
      onSort(sorter.field, order)
    }
  }

  return (
    <div className={styles.container}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
        }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条数据`,
          pageSizeOptions: ['20', '50', '100'],
          onChange: onPageChange,
        }}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: 'pointer' },
        })}
        scroll={{ x: 900 }}
        size="middle"
      />
    </div>
  )
}

export default MaterialTable
