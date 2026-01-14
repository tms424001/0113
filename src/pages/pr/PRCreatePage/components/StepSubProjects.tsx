// src/pages/pr/PRCreatePage/components/StepSubProjects.tsx
// 步骤3: 单项工程

import { Card, Table, InputNumber, Select, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { STRUCTURE_TYPE_OPTIONS } from '../config'
import styles from './StepSubProjects.module.css'

const { Text } = Typography

/**
 * 单项工程数据
 */
export interface SubProjectData {
  id: string
  subProjectName: string
  buildingArea: number
  structureType?: string
  aboveGroundFloors?: number
  undergroundFloors?: number
  buildingHeight?: number
  amount: number
}

interface StepSubProjectsProps {
  subProjects: SubProjectData[]
  onChange: (data: SubProjectData[]) => void
}

/**
 * 步骤3: 单项工程组件
 */
export const StepSubProjects = ({
  subProjects,
  onChange,
}: StepSubProjectsProps) => {
  // 更新单项工程数据
  const handleFieldChange = (
    id: string,
    field: keyof SubProjectData,
    value: any
  ) => {
    const newData = subProjects.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    )
    onChange(newData)
  }

  // 计算合计
  const totalArea = subProjects.reduce(
    (sum, s) => sum + (s.buildingArea || 0),
    0
  )
  const totalAmount = subProjects.reduce((sum, s) => sum + (s.amount || 0), 0)

  const columns: ColumnsType<SubProjectData> = [
    {
      title: '单项工程名称',
      dataIndex: 'subProjectName',
      key: 'subProjectName',
      width: 180,
      fixed: 'left',
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'buildingArea',
      key: 'buildingArea',
      width: 140,
      render: (value, record) => (
        <InputNumber
          value={value}
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(v) => handleFieldChange(record.id, 'buildingArea', v)}
        />
      ),
    },
    {
      title: '结构类型',
      dataIndex: 'structureType',
      key: 'structureType',
      width: 140,
      render: (value, record) => (
        <Select
          value={value}
          placeholder="请选择"
          style={{ width: '100%' }}
          allowClear
          options={STRUCTURE_TYPE_OPTIONS}
          onChange={(v) => handleFieldChange(record.id, 'structureType', v)}
        />
      ),
    },
    {
      title: '地上层数',
      dataIndex: 'aboveGroundFloors',
      key: 'aboveGroundFloors',
      width: 110,
      render: (value, record) => (
        <InputNumber
          value={value}
          min={0}
          precision={0}
          style={{ width: '100%' }}
          onChange={(v) => handleFieldChange(record.id, 'aboveGroundFloors', v)}
        />
      ),
    },
    {
      title: '地下层数',
      dataIndex: 'undergroundFloors',
      key: 'undergroundFloors',
      width: 110,
      render: (value, record) => (
        <InputNumber
          value={value}
          min={0}
          precision={0}
          style={{ width: '100%' }}
          onChange={(v) =>
            handleFieldChange(record.id, 'undergroundFloors', v)
          }
        />
      ),
    },
    {
      title: '建筑高度(m)',
      dataIndex: 'buildingHeight',
      key: 'buildingHeight',
      width: 120,
      render: (value, record) => (
        <InputNumber
          value={value}
          min={0}
          precision={1}
          style={{ width: '100%' }}
          onChange={(v) => handleFieldChange(record.id, 'buildingHeight', v)}
        />
      ),
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
      title: '单方造价',
      key: 'unitPrice',
      width: 120,
      align: 'right',
      render: (_, record) => {
        if (!record.buildingArea || !record.amount) return '-'
        const unitPrice = record.amount / record.buildingArea
        return `${unitPrice.toLocaleString('zh-CN', { maximumFractionDigits: 0 })} 元/㎡`
      },
    },
  ]

  return (
    <div className={styles.container}>
      <Card title="单项工程信息" className={styles.card}>
        <div className={styles.tips}>
          <Text type="secondary">
            请完善各单项工程的特征信息，这些信息将用于数据分析和估算参考
          </Text>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={subProjects}
          pagination={false}
          scroll={{ x: 1100 }}
          size="small"
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>合计</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>
                    {totalArea.toLocaleString('zh-CN', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} />
                <Table.Summary.Cell index={6} align="right">
                  <Text strong>
                    {(totalAmount / 10000).toLocaleString('zh-CN', {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  <Text strong>
                    {totalArea > 0
                      ? `${Math.round(totalAmount / totalArea).toLocaleString('zh-CN')} 元/㎡`
                      : '-'}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  )
}

export default StepSubProjects