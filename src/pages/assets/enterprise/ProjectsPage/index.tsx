// src/pages/assets/enterprise/ProjectsPage/index.tsx
// 企业项目库页面

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Drawer,
  Descriptions,
  Tag,
  Typography,
  message,
  Popconfirm,
} from 'antd'
import {
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { EnterpriseProjectDTO } from '@/types/enterprise'
import {
  getMockEnterpriseProjectList,
  getMockEnterpriseStats,
} from '@/mocks/enterprise'
import {
  getTableColumns,
  PROJECT_CATEGORY_OPTIONS,
  COMPILATION_PHASE_OPTIONS,
  ENTERPRISE_PROJECT_STATUS_OPTIONS,
} from './config'
import { StatsCards } from './components/StatsCards'
import styles from './ProjectsPage.module.css'

const { RangePicker } = DatePicker
const { Text } = Typography

/**
 * 企业项目库页面
 */
export const EnterpriseProjectsPage = () => {
  const navigate = useNavigate()

  // 状态
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<EnterpriseProjectDTO[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    projectCount: 0,
    totalAmount: 0,
    totalArea: 0,
    avgQualityScore: 0,
  })

  // 筛选
  const [keyword, setKeyword] = useState('')
  const [projectCategory, setProjectCategory] = useState<string>('')
  const [compilationPhase, setCompilationPhase] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [timeRange, setTimeRange] = useState<[string, string] | null>(null)

  // 分页
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // 抽屉
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<EnterpriseProjectDTO | null>(null)

  // 加载数据
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const result = getMockEnterpriseProjectList({
        keyword,
        projectCategory,
        compilationPhase,
        status,
        timeRange: timeRange || undefined,
        page,
        pageSize,
      })

      setProjects(result.items)
      setTotal(result.total)

      // 获取统计数据
      const statsData = getMockEnterpriseStats()
      setStats(statsData)
    } finally {
      setLoading(false)
    }
  }, [keyword, projectCategory, compilationPhase, status, timeRange, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 搜索
  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  // 重置筛选
  const handleReset = () => {
    setKeyword('')
    setProjectCategory('')
    setCompilationPhase('')
    setStatus('')
    setTimeRange(null)
    setPage(1)
  }

  // 分页变化
  const handleTableChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  // 查看详情
  const handleView = (record: EnterpriseProjectDTO) => {
    setCurrentProject(record)
    setDrawerOpen(true)
  }

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setCurrentProject(null)
  }

  // 跳转分析
  const handleAnalyze = (record: EnterpriseProjectDTO) => {
    navigate(`/standardize/files/${record.id}`)
  }

  // 归档
  const handleArchive = async (record: EnterpriseProjectDTO) => {
    message.success(`已归档: ${record.projectName}`)
    fetchData()
  }

  // 导出
  const handleExport = () => {
    message.info('正在导出数据...')
  }

  // 表格列
  const columns: ColumnsType<EnterpriseProjectDTO> = [
    ...getTableColumns(),
    {
      title: '操作',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" onClick={() => handleAnalyze(record)}>
            分析
          </Button>
          {record.status === 'active' && (
            <Popconfirm
              title="确定要归档该项目吗？"
              onConfirm={() => handleArchive(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small">
                归档
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>企业项目库</h1>
        <Button icon={<ExportOutlined />} onClick={handleExport}>
          导出数据
        </Button>
      </div>

      {/* 统计卡片 */}
      <StatsCards stats={stats} loading={loading} />

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="搜索项目名称"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="工程分类"
            value={projectCategory || undefined}
            onChange={setProjectCategory}
            style={{ width: 120 }}
            allowClear
            options={PROJECT_CATEGORY_OPTIONS}
          />
          <Select
            placeholder="编制阶段"
            value={compilationPhase || undefined}
            onChange={setCompilationPhase}
            style={{ width: 130 }}
            allowClear
            options={COMPILATION_PHASE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
          />
          <Select
            placeholder="状态"
            value={status || undefined}
            onChange={setStatus}
            style={{ width: 100 }}
            allowClear
            options={ENTERPRISE_PROJECT_STATUS_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
          />
          <RangePicker
            placeholder={['入库开始', '入库结束']}
            onChange={(dates) => {
              if (dates?.[0] && dates?.[1]) {
                setTimeRange([
                  dates[0].format('YYYY-MM-DD'),
                  dates[1].format('YYYY-MM-DD'),
                ])
              } else {
                setTimeRange(null)
              }
              setPage(1)
            }}
            style={{ width: 240 }}
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
          dataSource={projects}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          scroll={{ x: 1600 }}
        />
      </div>

      {/* 详情抽屉 */}
      <Drawer
        title="项目详情"
        width={560}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        extra={
          <Space>
            <Button onClick={() => currentProject && handleAnalyze(currentProject)}>
              分析
            </Button>
            <Button type="primary" icon={<EyeOutlined />}>
              查看详情
            </Button>
          </Space>
        }
      >
        {currentProject && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="项目名称">
              {currentProject.projectName}
            </Descriptions.Item>
            <Descriptions.Item label="工程地点">
              {`${currentProject.region.province} ${currentProject.region.city} ${currentProject.region.district || ''}`}
            </Descriptions.Item>
            <Descriptions.Item label="工程分类">
              {PROJECT_CATEGORY_OPTIONS.find((o) => o.value === currentProject.projectCategory)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="编制阶段">
              {COMPILATION_PHASE_OPTIONS.find((o) => o.value === currentProject.compilationPhase)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="金额">
              <Text strong style={{ color: '#1890ff' }}>
                {(currentProject.amount / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2 })} 万元
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="建筑面积">
              {currentProject.buildingArea.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} ㎡
            </Descriptions.Item>
            <Descriptions.Item label="单方造价">
              {currentProject.unitPrice.toLocaleString('zh-CN')} 元/㎡
            </Descriptions.Item>
            <Descriptions.Item label="材价时间">
              {currentProject.materialPriceDate}
            </Descriptions.Item>
            <Descriptions.Item label="质量评分">
              <span
                style={{
                  color: currentProject.qualityScore >= 90 ? '#52c41a' : currentProject.qualityScore >= 80 ? '#1890ff' : '#faad14',
                  fontWeight: 600,
                }}
              >
                {currentProject.qualityScore} 分
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="引用次数">
              {currentProject.referenceCount} 次
            </Descriptions.Item>
            <Descriptions.Item label="单项工程数">
              {currentProject.subProjectCount} 个
            </Descriptions.Item>
            <Descriptions.Item label="单位工程数">
              {currentProject.unitCount} 个
            </Descriptions.Item>
            <Descriptions.Item label="入库时间">
              {new Date(currentProject.approvedTime).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="入库人">
              {currentProject.approvedBy}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                color={
                  ENTERPRISE_PROJECT_STATUS_OPTIONS.find((o) => o.value === currentProject.status)?.color
                }
              >
                {ENTERPRISE_PROJECT_STATUS_OPTIONS.find((o) => o.value === currentProject.status)?.label}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

export default EnterpriseProjectsPage