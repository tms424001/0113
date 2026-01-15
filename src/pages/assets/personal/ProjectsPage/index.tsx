// src/pages/assets/personal/ProjectsPage/index.tsx
// 我的项目页面

import { useEffect, useCallback } from 'react'
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
  Popconfirm,
  message,
  Tag,
  Typography,
  Progress,
} from 'antd'
import {
  ImportOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { usePersonalProjectsPageStore } from '@/stores/personalProjectsPageStore'
import type { ProjectDTO } from '@/types/project'
import { PROJECT_SOURCE_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/types/project'
import { filterConfig, getTableColumns, drawerConfig, emptyConfig } from './config'
import styles from './ProjectsPage.module.css'

const { RangePicker } = DatePicker
const { Text } = Typography

/**
 * 我的项目页面
 */
export const ProjectsPage = () => {
  const navigate = useNavigate()

  // Store
  const {
    projects,
    loading,
    filter,
    pagination,
    selectedIds,
    drawerOpen,
    currentProject,
    fetchProjects,
    setFilter,
    resetFilter,
    setPagination,
    setSelectedIds,
    openDrawer,
    closeDrawer,
    deleteProject,
    deleteSelectedProjects,
  } = usePersonalProjectsPageStore()

  // 首次加载
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // ===== 操作处理 =====

  /** 搜索 */
  const handleSearch = useCallback(
    (value: string) => {
      setFilter({ keyword: value })
    },
    [setFilter]
  )

  /** 来源筛选 */
  const handleSourceChange = useCallback(
    (value: string) => {
      setFilter({ source: value as typeof filter.source })
    },
    [setFilter]
  )

  /** 状态筛选 */
  const handleStatusChange = useCallback(
    (value: string) => {
      setFilter({ status: value as typeof filter.status })
    },
    [setFilter]
  )

  /** 时间范围筛选 */
  const handleTimeRangeChange = useCallback(
    (dates: any) => {
      if (dates && dates[0] && dates[1]) {
        setFilter({
          uploadTimeRange: [
            dates[0].format('YYYY-MM-DD'),
            dates[1].format('YYYY-MM-DD'),
          ],
        })
      } else {
        setFilter({ uploadTimeRange: null })
      }
    },
    [setFilter]
  )

  /** 分页变化 */
  const handleTableChange = useCallback(
    (page: number, pageSize: number) => {
      setPagination({ page, pageSize })
    },
    [setPagination]
  )

  /** 选中行变化 */
  const handleSelectionChange = useCallback(
    (selectedRowKeys: React.Key[]) => {
      setSelectedIds(selectedRowKeys as string[])
    },
    [setSelectedIds]
  )

  /** 查看 */
  const handleView = useCallback(
    (record: ProjectDTO) => {
      openDrawer(record)
    },
    [openDrawer]
  )

  /** 编辑 */
  const handleEdit = useCallback(
    (record: ProjectDTO) => {
      navigate(`/collect/my/projects/${record.id}/edit`)
    },
    [navigate]
  )

  /** 分析 */
  const handleAnalyze = useCallback(
    (record: ProjectDTO) => {
      navigate(`/standardize/files/${record.id}`)
    },
    [navigate]
  )

  /** 发起入库 PR */
  const handlePR = useCallback(
    (record: ProjectDTO) => {
      if (record.completeness && record.completeness < 80) {
        message.warning('补录完成度需达到80%才能发起入库申请，请先完善项目信息')
        return
      }
      navigate(`/pr/create?projectId=${record.id}`)
    },
    [navigate]
  )

  /** 删除单条 */
  const handleDelete = useCallback(
    async (record: ProjectDTO) => {
      if (record.status === 'submitted') {
        message.warning('已提交的项目不能删除')
        return
      }
      const success = await deleteProject(record.id)
      if (success) {
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    },
    [deleteProject]
  )

  /** 导出 */
  const handleExport = useCallback(
    (record: ProjectDTO) => {
      message.info(`导出: ${record.projectName}`)
      // TODO: 实现导出逻辑
    },
    []
  )

  /** 批量删除 */
  const handleBatchDelete = useCallback(async () => {
    const count = await deleteSelectedProjects()
    if (count > 0) {
      message.success(`成功删除 ${count} 个项目`)
    } else {
      message.error('删除失败')
    }
  }, [deleteSelectedProjects])

  /** 从草稿箱导入 */
  const handleImport = useCallback(() => {
    navigate('/collect/cost-files?action=import')
  }, [navigate])

  // ===== 表格列 =====

  const columns: ColumnsType<ProjectDTO> = [
    ...getTableColumns(),
    {
      title: '操作',
      key: 'actions',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => handleAnalyze(record)}>
            分析
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={() => handlePR(record)}
            disabled={record.status === 'submitted' || record.status === 'approved'}
          >
            入库
          </Button>
          <Popconfirm
            title="确定要删除该项目吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
            disabled={record.status === 'submitted'}
          >
            <Button 
              type="link" 
              size="small" 
              danger
              disabled={record.status === 'submitted'}
            >
              删除
            </Button>
          </Popconfirm>
          <Button type="link" size="small" onClick={() => handleExport(record)}>
            导出
          </Button>
        </div>
      ),
    },
  ]

  // ===== 渲染 =====

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>我的项目</h1>
      </div>

      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <Space wrap size="middle">
          <Input.Search
            placeholder={filterConfig.search.placeholder}
            value={filter.keyword}
            onChange={(e) => setFilter({ keyword: e.target.value })}
            onSearch={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="全部来源"
            value={filter.source || undefined}
            onChange={handleSourceChange}
            style={{ width: 120 }}
            allowClear
            options={PROJECT_SOURCE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
          />
          <Select
            placeholder="全部状态"
            value={filter.status || undefined}
            onChange={handleStatusChange}
            style={{ width: 120 }}
            allowClear
            options={PROJECT_STATUS_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
          />
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            onChange={handleTimeRangeChange}
            style={{ width: 240 }}
          />
          <Button icon={<ReloadOutlined />} onClick={resetFilter}>
            重置
          </Button>
        </Space>
        <div className={styles.filterRight}>
          <Button type="primary" icon={<ImportOutlined />} onClick={handleImport}>
            从草稿箱导入
          </Button>
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedIds.length > 0 && (
        <div className={styles.batchBar}>
          <Space>
            <Text>已选择 {selectedIds.length} 项</Text>
            <Popconfirm
              title={`确定要删除选中的 ${selectedIds.length} 个项目吗？`}
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button danger icon={<DeleteOutlined />}>
                批量删除
              </Button>
            </Popconfirm>
            <Button onClick={() => setSelectedIds([])}>取消选择</Button>
          </Space>
        </div>
      )}

      {/* 数据表格 */}
      <div className={styles.tableContainer}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={projects}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: handleSelectionChange,
            getCheckboxProps: (record) => ({
              disabled: record.status === 'submitted',
            }),
          }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          scroll={{ x: 1400 }}
          locale={{
            emptyText: (
              <div className={styles.empty}>
                <p>{emptyConfig.description}</p>
                <Button type="primary" onClick={handleImport}>
                  {emptyConfig.buttonText}
                </Button>
              </div>
            ),
          }}
        />
      </div>

      {/* 详情抽屉 */}
      <Drawer
        title={drawerConfig.title}
        width={drawerConfig.width}
        open={drawerOpen}
        onClose={closeDrawer}
        extra={
          <Space>
            <Button onClick={() => currentProject && handleEdit(currentProject)}>
              编辑
            </Button>
            <Button onClick={() => currentProject && handleAnalyze(currentProject)}>
              分析
            </Button>
            <Button
              type="primary"
              onClick={() => currentProject && handlePR(currentProject)}
              disabled={
                currentProject?.status === 'submitted' ||
                currentProject?.status === 'approved' ||
                (currentProject?.completeness ?? 0) < 80
              }
            >
              发起入库
            </Button>
          </Space>
        }
      >
        {currentProject && (
          <>
            {/* 补录完成度 */}
            <div className={styles.completenessCard}>
              <div className={styles.completenessHeader}>
                <Text strong>补录完成度</Text>
                <Text type={currentProject.completeness && currentProject.completeness >= 80 ? 'success' : 'warning'}>
                  {currentProject.completeness}%
                </Text>
              </div>
              <Progress 
                percent={currentProject.completeness} 
                status={currentProject.completeness && currentProject.completeness >= 80 ? 'success' : 'normal'}
                strokeColor={currentProject.completeness && currentProject.completeness >= 80 ? '#52c41a' : '#faad14'}
              />
              {currentProject.completeness && currentProject.completeness < 80 && (
                <Text type="secondary" className={styles.completenessHint}>
                  完成度达到80%后可发起入库申请
                </Text>
              )}
            </div>

            <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="项目名称">
                {currentProject.projectName}
              </Descriptions.Item>
              <Descriptions.Item label="上传时间">
                {new Date(currentProject.uploadTime).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="来源">
                <Tag
                  color={
                    PROJECT_SOURCE_OPTIONS.find((o) => o.value === currentProject.source)?.color
                  }
                >
                  {PROJECT_SOURCE_OPTIONS.find((o) => o.value === currentProject.source)?.label || currentProject.source}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag
                  color={
                    PROJECT_STATUS_OPTIONS.find((o) => o.value === currentProject.status)?.color
                  }
                >
                  {PROJECT_STATUS_OPTIONS.find((o) => o.value === currentProject.status)?.label || currentProject.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="金额（万元）">
                {currentProject.amount
                  ? (currentProject.amount / 10000).toLocaleString('zh-CN', {
                      minimumFractionDigits: 2,
                    })
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="建筑面积">
                {currentProject.buildingArea
                  ? `${currentProject.buildingArea.toLocaleString('zh-CN')} ㎡`
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="单方造价">
                {currentProject.unitPrice
                  ? `${currentProject.unitPrice.toLocaleString('zh-CN')} 元/㎡`
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="编制阶段">
                {currentProject.compilationPhase || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="地区">
                {currentProject.region
                  ? `${currentProject.region.province} ${currentProject.region.city} ${currentProject.region.district || ''}`
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="单项工程数">
                {currentProject.subProjectCount || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="单位工程数">
                {currentProject.unitCount || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建人">
                {currentProject.createdBy || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">
                {currentProject.updatedAt
                  ? new Date(currentProject.updatedAt).toLocaleString('zh-CN')
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  )
}

export default ProjectsPage