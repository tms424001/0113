// src/pages/assets/enterprise/MaterialsPage/components/MaterialDetailDrawer.tsx
// 材料详情抽屉组件

import { useState, useEffect, useMemo } from 'react'
import {
  Drawer,
  Spin,
  Typography,
  Tag,
  Descriptions,
  Statistic,
  Row,
  Col,
  Divider,
  Table,
  Button,
  Collapse,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MaterialDetail, TrendDataPoint, SampleItem } from '../types'
import {
  getMockMaterialDetail,
  getMockTrendHistory,
  getMockSampleList,
} from '@/mocks/enterpriseMaterial'
import styles from './MaterialDetailDrawer.module.css'

const { Title, Text } = Typography

interface MaterialDetailDrawerProps {
  open: boolean
  materialId: string | null
  onClose: () => void
}

/**
 * 材料详情抽屉组件
 */
export const MaterialDetailDrawer: React.FC<MaterialDetailDrawerProps> = ({
  open,
  materialId,
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<MaterialDetail | null>(null)
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
  const [sampleList, setSampleList] = useState<SampleItem[]>([])

  useEffect(() => {
    if (open && materialId) {
      loadData(materialId)
    }
  }, [open, materialId])

  const loadData = async (id: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const detailData = getMockMaterialDetail(id)
      const trend = getMockTrendHistory(id)
      const samples = getMockSampleList(id)

      setDetail(detailData)
      setTrendData(trend)
      setSampleList(samples)
    } finally {
      setLoading(false)
    }
  }

  // 状态标签颜色
  const statusColor = useMemo(() => {
    if (!detail) return 'default'
    switch (detail.status) {
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }, [detail])

  const statusText = useMemo(() => {
    if (!detail) return ''
    switch (detail.status) {
      case 'approved':
        return '已审核'
      case 'pending':
        return '待审核'
      case 'rejected':
        return '已拒绝'
      default:
        return ''
    }
  }, [detail])

  // 样本溯源表格列
  const sampleColumns: ColumnsType<SampleItem> = [
    {
      title: '来源名称',
      dataIndex: 'sourceName',
      key: 'sourceName',
      width: 140,
    },
    {
      title: '类型',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 80,
      render: (type) => {
        const typeMap: Record<string, string> = {
          info_price: '信息价',
          market: '市场价',
          enterprise: '企业价',
        }
        return typeMap[type] || type
      },
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      align: 'right',
      render: (value) => value.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 60,
      align: 'right',
      render: (value) => `${value}%`,
    },
  ]

  // 简单的趋势图（SVG）
  const TrendChart = () => {
    if (trendData.length < 2) return <div className={styles.noData}>暂无趋势数据</div>

    const prices = trendData.map((d) => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min || 1

    const width = 320
    const height = 120
    const padding = 20

    const points = trendData.map((d, i) => {
      const x = padding + (i / (trendData.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((d.price - min) / range) * (height - 2 * padding)
      return `${x},${y}`
    })

    const pathD = `M ${points.join(' L ')}`

    return (
      <div className={styles.chartContainer}>
        <svg width={width} height={height}>
          {/* 网格线 */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e8e8e8" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e8e8e8" />

          {/* 折线 */}
          <path d={pathD} fill="none" stroke="#1890ff" strokeWidth={2} />

          {/* 数据点 */}
          {trendData.map((d, i) => {
            const x = padding + (i / (trendData.length - 1)) * (width - 2 * padding)
            const y = height - padding - ((d.price - min) / range) * (height - 2 * padding)
            return <circle key={i} cx={x} cy={y} r={3} fill="#1890ff" />
          })}
        </svg>

        {/* X 轴标签 */}
        <div className={styles.xLabels}>
          {trendData.filter((_, i) => i % 3 === 0).map((d) => (
            <span key={d.period} className={styles.xLabel}>{d.period.slice(5)}</span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Drawer
      title={null}
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      className={styles.drawer}
    >
      {loading ? (
        <div className={styles.loading}>
          <Spin tip="加载中..." />
        </div>
      ) : detail ? (
        <div className={styles.content}>
          {/* 头部 */}
          <div className={styles.header}>
            <Title level={4} className={styles.title}>{detail.materialName}</Title>
            <Text type="secondary">{detail.materialCode}</Text>
            <div className={styles.tags}>
              <Tag color={statusColor}>{statusText}</Tag>
              <Tag>{detail.region}</Tag>
              <Tag>{detail.period}</Tag>
              <Tag>{detail.priceStage}</Tag>
            </div>
          </div>

          <Collapse
            defaultActiveKey={['attributes', 'price', 'trend', 'samples']}
            ghost
            items={[
              {
                key: 'attributes',
                label: '材料属性',
                children: (
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="规格">{detail.specification}</Descriptions.Item>
                    <Descriptions.Item label="品牌">{detail.brand}</Descriptions.Item>
                    <Descriptions.Item label="产地">{detail.origin}</Descriptions.Item>
                    <Descriptions.Item label="单位">{detail.unit}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'price',
                label: '价格信息',
                children: (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title="基准价"
                          value={detail.basePrice}
                          precision={2}
                          suffix={`元/${detail.unit}`}
                        />
                        <Text type="secondary" className={styles.priceNote}>集团指导价</Text>
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="综合入库价"
                          value={detail.compositePrice}
                          precision={2}
                          suffix={`元/${detail.unit}`}
                          valueStyle={{ color: '#1890ff', fontWeight: 600 }}
                        />
                        <Text type="secondary" className={styles.priceNote}>加权计算</Text>
                      </Col>
                    </Row>

                    <Divider className={styles.smallDivider} />

                    <Descriptions column={2} size="small">
                      <Descriptions.Item label="偏离度">
                        <span style={{ color: detail.deviationRate > 0 ? '#ff4d4f' : '#52c41a' }}>
                          {detail.deviationRate > 0 ? '+' : ''}{detail.deviationRate.toFixed(2)}%
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="离散系数">
                        {detail.cvRate.toFixed(1)}%
                        <Tag color={detail.cvRate < 10 ? 'green' : detail.cvRate < 20 ? 'orange' : 'red'} className={styles.cvTag}>
                          {detail.cvRate < 10 ? '稳定' : detail.cvRate < 20 ? '一般' : '波动'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="价格区间" span={2}>
                        {detail.priceMin.toFixed(2)} - {detail.priceMax.toFixed(2)}
                      </Descriptions.Item>
                      <Descriptions.Item label="样本量">
                        {detail.sampleCount} 个
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                ),
              },
              {
                key: 'trend',
                label: '历史趋势（近12期）',
                children: <TrendChart />,
              },
              {
                key: 'samples',
                label: '样本溯源（加权计算来源）',
                children: (
                  <>
                    <Table
                      rowKey="id"
                      columns={sampleColumns}
                      dataSource={sampleList}
                      pagination={false}
                      size="small"
                    />
                    <Button type="link" className={styles.moreBtn}>查看更多历史</Button>
                  </>
                ),
              },
            ]}
          />
        </div>
      ) : (
        <div className={styles.noData}>暂无数据</div>
      )}
    </Drawer>
  )
}

export default MaterialDetailDrawer
