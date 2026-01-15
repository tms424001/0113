// src/pages/assets/enterprise/MaterialsPage/index.tsx
// 企业材料库页面 - 根据规范文档 v1.0 实现（三栏布局）

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tree, Table, Input, Select, Button, Space, Tag, DatePicker, Checkbox, Divider } from 'antd'
import { ExportOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TreeDataNode } from 'antd'
import dayjs from 'dayjs'
import styles from './MaterialsPage.module.css'

// ========== 类型定义 ==========
interface MaterialItem {
  id: string
  materialCode: string
  materialName: string
  specification: string
  brand: string
  unit: string
  basePrice: number
  compositePrice: number
  deviationRate: number
  cvRate: number
  trendData: number[]
  sampleCount: number
}

interface CategoryNode {
  id: string
  name: string
  count: number
  children?: CategoryNode[]
}

// ========== Mock 数据 ==========
const mockCategories: CategoryNode[] = [
  {
    id: 'all', name: '全部材料', count: 10,
    children: [
      {
        id: 'civil', name: '土建材料', count: 1856,
        children: [
          {
            id: 'steel', name: '钢材', count: 456,
            children: [
              { id: 'rebar', name: '钢筋', count: 234 },
              { id: 'plate', name: '钢板', count: 122 },
              { id: 'profile', name: '型钢', count: 100 },
            ]
          },
          { id: 'cement', name: '水泥', count: 128 },
          { id: 'concrete', name: '混凝土', count: 245 },
          { id: 'sand', name: '砂石', count: 89 },
        ]
      },
      { id: 'install', name: '安装材料', count: 680 },
      { id: 'decoration', name: '装饰材料', count: 320 },
    ]
  }
]

const mockMaterials: MaterialItem[] = [
  { id: '1', materialCode: 'HRB400 Φ12', materialName: '热轧带肋钢筋', specification: 'HRB400 Φ12', brand: '武钢', unit: 't', basePrice: 4100, compositePrice: 4250, deviationRate: 3.66, cvRate: 6.57, trendData: [4100, 4150, 4200, 4180, 4220, 4250], sampleCount: 156 },
  { id: '2', materialCode: 'HRB400 Φ14', materialName: '热轧带肋钢筋', specification: 'HRB400 Φ14', brand: '武钢', unit: 't', basePrice: 4100, compositePrice: 4180, deviationRate: 1.95, cvRate: 7.22, trendData: [4080, 4100, 4120, 4150, 4160, 4180], sampleCount: 142 },
  { id: '3', materialCode: 'HRB400 Φ16', materialName: '热轧带肋钢筋', specification: 'HRB400 Φ16', brand: '鄂钢', unit: 't', basePrice: 4050, compositePrice: 4120, deviationRate: 1.73, cvRate: 5.69, trendData: [4000, 4020, 4050, 4080, 4100, 4120], sampleCount: 138 },
  { id: '4', materialCode: 'HRB500 Φ12', materialName: '热轧带肋钢筋', specification: 'HRB500 Φ12', brand: '武钢', unit: 't', basePrice: 4200, compositePrice: 4380, deviationRate: 4.29, cvRate: 5.57, trendData: [4150, 4200, 4250, 4300, 4350, 4380], sampleCount: 125 },
]

// L3 属性筛选配置
const l3Attributes = {
  rebar: [
    { key: 'grade', label: '牌号', options: ['HRB400', 'HRB500', 'HPB300'] },
    { key: 'diameter', label: '直径', options: ['Φ6', 'Φ8', 'Φ10', 'Φ12', 'Φ14', 'Φ16', 'Φ20', 'Φ22', 'Φ25', 'Φ28', 'Φ32'] },
    { key: 'brand', label: '品牌', options: ['武钢', '鄂钢', '马钢', '沙钢', '首钢'] },
    { key: 'origin', label: '产地', options: ['本地', '外地'] },
  ]
}

// ========== 迷你走势图组件 ==========
const MiniTrend: React.FC<{ data: number[], deviation: number }> = ({ data, deviation }) => {
  const width = 80, height = 24
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ')
  const color = deviation >= 0 ? '#1890ff' : '#52c41a'
  
  return (
    <svg width={width} height={height}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

// ========== 分类树转换 ==========
const convertToTreeData = (nodes: CategoryNode[]): TreeDataNode[] => {
  return nodes.map(node => ({
    key: node.id,
    title: (
      <div className={styles.treeNode}>
        <span>{node.name}</span>
        <span className={styles.treeCount}>{node.count}</span>
      </div>
    ),
    children: node.children ? convertToTreeData(node.children) : undefined,
  }))
}

/**
 * 企业材料库页面
 */
export const EnterpriseMaterialsPage = () => {
  // ========== 状态 ==========
  const [loading, setLoading] = useState(false)
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('rebar')
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['all', 'civil', 'steel'])
  const [selectedL3, setSelectedL3] = useState<Record<string, string>>({})
  const [keyword, setKeyword] = useState('')

  // 分类树数据
  const treeData = useMemo(() => convertToTreeData(mockCategories), [])

  // 当前L3属性
  const currentL3 = useMemo(() => {
    return l3Attributes[selectedCategory as keyof typeof l3Attributes] || []
  }, [selectedCategory])

  // 加载数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 300))
    let filtered = [...mockMaterials]
    if (keyword) {
      const kw = keyword.toLowerCase()
      filtered = filtered.filter(m => m.materialName.includes(kw) || m.specification.includes(kw))
    }
    setMaterials(filtered)
    setLoading(false)
  }, [keyword])

  useEffect(() => { fetchData() }, [fetchData])

  // L3 标签点击
  const handleL3Click = (key: string, value: string) => {
    setSelectedL3(prev => prev[key] === value ? { ...prev, [key]: '' } : { ...prev, [key]: value })
  }

  // 表格列
  const columns: ColumnsType<MaterialItem> = [
    {
      title: <Checkbox />,
      width: 40,
      render: () => <Checkbox />,
    },
    {
      title: '材料信息',
      key: 'info',
      width: 200,
      render: (_, r) => (
        <div>
          <div className={styles.materialName}>
            {r.materialName} <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12 }} />
          </div>
          <div className={styles.materialSpec}>{r.specification}</div>
          <div className={styles.materialBrand}>{r.brand}</div>
        </div>
      ),
    },
    { title: '单位', dataIndex: 'unit', width: 60, align: 'center' },
    {
      title: '◇ 基准价',
      dataIndex: 'basePrice',
      width: 100,
      align: 'right',
      render: v => v.toLocaleString('zh-CN', { minimumFractionDigits: 2 }),
    },
    {
      title: '☆ 综合价',
      key: 'composite',
      width: 120,
      align: 'right',
      render: (_, r) => (
        <div>
          <div className={styles.compositePrice}>{r.compositePrice.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
          <Tag color="blue" className={styles.cvTag}>CV:{r.cvRate}%</Tag>
        </div>
      ),
    },
    {
      title: '◇ 走势',
      key: 'trend',
      width: 120,
      align: 'center',
      render: (_, r) => (
        <div className={styles.trendCell}>
          <span className={styles.deviation} style={{ color: r.deviationRate >= 0 ? '#ff4d4f' : '#52c41a' }}>
            {r.deviationRate >= 0 ? '↗' : '↘'} {r.deviationRate >= 0 ? '+' : ''}{r.deviationRate.toFixed(2)}%
          </span>
          <MiniTrend data={r.trendData} deviation={r.deviationRate} />
        </div>
      ),
    },
    { title: '样本', dataIndex: 'sampleCount', width: 60, align: 'center' },
  ]

  return (
    <div className={styles.page}>
      {/* 左侧分类树 */}
      <aside className={styles.sidebar}>
        <Tree
          treeData={treeData}
          selectedKeys={[selectedCategory]}
          expandedKeys={expandedKeys}
          onExpand={keys => setExpandedKeys(keys)}
          onSelect={keys => keys[0] && setSelectedCategory(keys[0] as string)}
          blockNode
        />
        <Divider style={{ margin: '12px 0' }} />
        <div className={styles.sidebarStats}>
          <div className={styles.statRow}>
            <span>📦 材料总数</span>
            <span className={styles.statValue}>2,856</span>
          </div>
          <div className={styles.statRow}>
            <span>📅 本月更新</span>
            <span className={styles.statValueBlue}>+128</span>
          </div>
        </div>
      </aside>

      {/* 右侧主内容 */}
      <main className={styles.main}>
        {/* 顶部筛选栏 */}
        <div className={styles.topBar}>
          <Space size="middle">
            <span>◎ 地区:</span>
            <Select defaultValue="420100" style={{ width: 100 }} options={[{ value: '420100', label: '武汉市' }]} />
            <span>📅 时间:</span>
            <DatePicker picker="month" defaultValue={dayjs('2025-12')} format="YYYY-MM" style={{ width: 120 }} />
            <span>阶段:</span>
            <Select defaultValue="control" style={{ width: 100 }} options={[{ value: 'control', label: '控制价' }]} />
            <span>◇ 来源:</span>
            <Select defaultValue="all" style={{ width: 80 }} options={[{ value: 'all', label: '全部' }]} />
          </Space>
          <Space>
            <Input.Search placeholder="搜索材料名称、编码、品牌..." value={keyword} onChange={e => setKeyword(e.target.value)} onSearch={fetchData} style={{ width: 240 }} allowClear />
            <Button type="primary" icon={<ExportOutlined />}>导出</Button>
            <Button icon={<SettingOutlined />} />
          </Space>
        </div>

        {/* L3 属性筛选 */}
        {currentL3.length > 0 && (
          <div className={styles.l3Filter}>
            <span className={styles.l3Title}>▽ L3 · 属性筛选</span>
            {currentL3.map(attr => (
              <div key={attr.key} className={styles.l3Row}>
                <span className={styles.l3Label}>{attr.label}</span>
                <Space size={4} wrap>
                  {attr.options.map(opt => (
                    <Tag
                      key={opt}
                      color={selectedL3[attr.key] === opt ? 'blue' : undefined}
                      onClick={() => handleL3Click(attr.key, opt)}
                      style={{ cursor: 'pointer' }}
                    >
                      {opt}
                    </Tag>
                  ))}
                </Space>
              </div>
            ))}
          </div>
        )}

        {/* 材料列表 */}
        <div className={styles.tableWrapper}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={materials}
            loading={loading}
            pagination={{ 
              pageSize: 20, 
              showTotal: t => `共 ${t} 条数据`,
              showQuickJumper: true,
            }}
            size="middle"
          />
        </div>
      </main>
    </div>
  )
}

export default EnterpriseMaterialsPage