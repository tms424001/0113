// src/pages/collect/DraftsPage/index.tsx
// 草稿箱页面

import { useEffect, useCallback, useState } from 'react'
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
  Modal,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useCollectDraftsPageStore } from '@/stores/collectDraftsPageStore'
import type { DraftDTO } from '@/types/draft'
import { DRAFT_SOURCE_OPTIONS } from '@/types/draft'
import { filterConfig, getTableColumns, drawerConfig, emptyConfig } from './config'
import { PushToProjectModal } from './components/PushToProjectModal'
import styles from './DraftsPage.module.css'

const { RangePicker } = DatePicker
const { Text } = Typography

/**
 * 草稿箱页面
 */
export const DraftsPage = () => {
  const navigate = useNavigate()

  // 推送弹窗状态
  const [pushModalOpen, setPushModalOpen] = useState(false)
  const [pushingDraft, setPushingDraft] = useState<DraftDTO | null>(null)

  // Store
  const {
    drafts,
    loading,
    filter,
    pagination,
    selectedIds,
    drawerOpen,
    currentDraft,
    fetchDrafts,
    setFilter,
    resetFilter,
    setPagination,
    setSelectedIds,
    openDrawer,
    closeDrawer,
    deleteDraft,
    deleteSelectedDrafts,
  } = useCollectDraftsPageStore()

  // 首次加载
  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

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

  /** 时间范围筛选 */
  const handleTimeRangeChange = useCallback(
    (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
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

  /** 分析 */
  const handleAnalyze = useCallback(
    (record: DraftDTO) => {
      navigate(`/standardize/files/${record.id}`)
    },
    [navigate]
  )

  /** 查看 */
  const handleView = useCallback(
    (record: DraftDTO) => {
      openDrawer(record)
    },
    [openDrawer]
  )

  /** 推送到我的项目 */
  const handlePush = useCallback(
    (record: DraftDTO) => {
      setPushingDraft(record)
      setPushModalOpen(true)
    },
    []
  )

  /** 推送成功回调 */
  const handlePushSuccess = useCallback(
    (projectId: string) => {
      setPushModalOpen(false)
      setPushingDraft(null)
      
      // 提示并询问是否跳转
      Modal.confirm({
        title: '推送成功',
        content: '已推送到我的项目，是否立即查看？',
        okText: '去查看',
        cancelText: '继续留在草稿箱',
        onOk: () => {
          navigate(`/assets/personal/projects`)
        },
      })
      
      // 刷新列表
      fetchDrafts()
    },
    [navigate, fetchDrafts]
  )

  /** 删除单条 */
  const handleDelete = useCallback(
    async (record: DraftDTO) => {
      const success = await deleteDraft(record.id)
      if (success) {
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    },
    [deleteDraft]
  )

  /** 批量删除 */
  const handleBatchDelete = useCallback(async () => {
    const count = await deleteSelectedDrafts()
    if (count > 0) {
      message.success(`成功删除 ${count} 条草稿`)
    } else {
      message.error('删除失败')
    }
  }, [deleteSelectedDrafts])

  /** 上传文件 */
  const handleCreate = useCallback(() => {
    navigate('/collect/upload')
  }, [navigate])

  // ===== 表格列 =====

  const columns: ColumnsType<DraftDTO> = [
    ...getTableColumns(),
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" size="small" onClick={() => handleAnalyze(record)}>
            分析
          </Button>
          <Button type="link" size="small" onClick={() => handlePush(record)}>
            推送
          </Button>
          <Popconfirm
            title="确定要删除该草稿吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  // ===== 渲染 =====

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>草稿箱</h1>
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
            options={DRAFT_SOURCE_OPTIONS.map((o) => ({
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            上传文件
          </Button>
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedIds.length > 0 && (
        <div className={styles.batchBar}>
          <Space>
            <Text>已选择 {selectedIds.length} 项</Text>
            <Popconfirm
              title={`确定要删除选中的 ${selectedIds.length} 条草稿吗？`}
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
          dataSource={drafts}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedIds,
            onChange: handleSelectionChange,
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
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <div className={styles.empty}>
                <p>{emptyConfig.description}</p>
                <Button type="primary" onClick={handleCreate}>
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
            <Button onClick={() => currentDraft && handleAnalyze(currentDraft)}>
              去分析
            </Button>
            <Button
              type="primary"
              onClick={() => currentDraft && handleSupplement(currentDraft)}
            >
              去补录
            </Button>
          </Space>
        }
      >
        {currentDraft && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="项目名称">
              {currentDraft.projectName}
            </Descriptions.Item>
            <Descriptions.Item label="上传时间">
              {new Date(currentDraft.uploadTime).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="来源">
              <Tag
                color={
                  DRAFT_SOURCE_OPTIONS.find((o) => o.value === currentDraft.source)
                    ?.color
                }
              >
                {DRAFT_SOURCE_OPTIONS.find((o) => o.value === currentDraft.source)
                  ?.label || currentDraft.source}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="金额（万元）">
              {currentDraft.amount
                ? (currentDraft.amount / 10000).toLocaleString('zh-CN', {
                    minimumFractionDigits: 2,
                  })
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="编制阶段">
              {currentDraft.compilationPhase || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="文件格式">
              {currentDraft.fileFormat || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="单项工程数">
              {currentDraft.subProjectCount || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建人">
              {currentDraft.createdBy || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* 推送到我的项目弹窗 */}
      <PushToProjectModal
        open={pushModalOpen}
        draft={pushingDraft}
        onClose={() => {
          setPushModalOpen(false)
          setPushingDraft(null)
        }}
        onSuccess={handlePushSuccess}
      />
    </div>
  )
}

export default DraftsPage