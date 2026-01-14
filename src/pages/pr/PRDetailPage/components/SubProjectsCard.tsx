// src/pages/pr/PRDetailPage/components/SubProjectsCard.tsx
// 单项工程列表组件

import { Card, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { PRDetailDTO } from '@/mocks/prDetail'
import { STRUCTURE_TYPE_OPTIONS } from '../config'
import styles from './SubProjectsCard.module.css'

const { Text } = Typography

interface SubProjectsCardProps {
  data: PRDetailDTO
}

type SubProject = PRDetailDTO['subProjects'][number]

/**
 * 单项工程列表组件
 */
export const SubProjectsCard = ({ data }: SubProjectsCardProps) => {
  const columns: ColumnsType<SubProject> = [
    {
      title: '单项工程名称',
      dataIndex: 'subProjectName',
      key: 'subProjectName',
      width: 180,
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'buildingArea',
      key: 'buildingArea',
      width: 120,
      align: 'right',
      render: (value) => value?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '-',
    },
    {
      title: '结构类型',
      dataIndex: 'structureType',
      key: 'structureType',
      width: 120,
      render: (value) => {
        const option = STRUCTURE_TYPE_OPTIONS.find((o) => o.value === value)
        return option?.label || '-'
      },
    },
    {
      title: '地上层数',
      dataIndex: 'aboveGroundFloors',
      key: 'aboveGroundFloors',
      width: 90,
      align: 'center',
      render: (value) => value ?? '-',
    },
    {
      title: '地下层数',
      dataIndex: 'undergroundFloors',
      key: 'undergroundFloors',
      width: 90,
      align: 'center',
      render: (value) => value ?? '-',
    },
    {
      title: '建筑高度(m)',
      dataIndex: 'buildingHeight',
      key: 'buildingHeight',
      width: 110,
      align: 'right',
      render: (value) => value?.toFixed(1) || '-',
    },
    {
      title: '金额(万元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      render: (value) =>
        value
          ? (value / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2 })
          : '-',
    },
    {
      title: '单方造价(元/㎡)',
      key: 'unitPrice',
      width: 140,
      align: 'right',
      render: (_, record) => {
        if (!record.buildingArea || !record.amount) return '-'
        const unitPrice = record.amount / record.buildingArea
        return unitPrice.toLocaleString('zh-CN', { maximumFractionDigits: 0 })
      },
    },
  ]

  // 计算合计
  const totalArea = data.subProjects.reduce((sum, s) => sum + (s.buildingArea || 0), 0)
  const totalAmount = data.subProjects.reduce((sum, s) => sum + (s.amount || 0), 0)

  return (
    <Card title="单项工程概况" className={styles.card}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data.subProjects}
        pagination={false}
        size="small"
        scroll={{ x: 1000 }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text strong>合计</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong>
                  {totalArea.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
              <Table.Summary.Cell index={3} />
              <Table.Summary.Cell index={4} />
              <Table.Summary.Cell index={5} />
              <Table.Summary.Cell index={6} align="right">
                <Text strong>
                  {(totalAmount / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="right">
                <Text strong>
                  {totalArea > 0
                    ? Math.round(totalAmount / totalArea).toLocaleString('zh-CN')
                    : '-'}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  )
}

export default SubProjectsCard