// src/pages/pr/PRListPage/index.tsx
// PR 列表页面

import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tabs,
  Popconfirm,
  message,
  Tag,
  Modal,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { usePRListPageStore } from '@/stores/prListPageStore'
import type { PRDTO } from '@/types/pr'
import { PR_STATUS_OPTIONS } from '@/types/pr'
import { filterConfig, getMyPRColumns, getPendingPRColumns, tabConfig, emptyConfig } from './config'
import styles from './PRListPage.module.css'

const { RangePicker } = DatePicker

/**
 * PR 列表页面
 */
export const PRListPage = () => {
  const navigate = useNavigate()

  // Store
  const {
    activeTab,
    prs,
    loading,
    filter,
    pagination,
    setActiveTab,
    fetchPRs,
    setFilter,
    resetFilter,
    setPagination,
    withdrawPR,
    deletePR,
    reviewPR,
  } = usePRListPageStore()

  // 首次加载
  useEffect(() => {
    fetchPRs()
  }, [fetchPRs])

  // ===== 操作处理 =====

  /** Tab 切换 */
  const handleTabChange = useCallback(
    (key: string) => {
      setActiveTab(key as 'my' | 'pending')
    },
    [setActiveTab]
  )

  /** 搜索 */
  const handleSearch = useCallback(
    (value: string) => {
      setFilter({ keyword: value })
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
          timeRange: [
            dates[0].format('YYYY-MM-DD'),
            dates[1].format('YYYY-MM-DD'),
          ],
        })
      } else {
        setFilter({ timeRange: null })
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

  /** 查看详情 */
  const handleView = useCallback(
    (record: PRDTO) => {
      navigate(`/pr/${record.id}`)
    },
    [navigate]
  )

  /** 编辑 */
  const handleEdit = useCallback(
    (record: PRDTO) => {
      navigate(`/pr/${record.id}/edit`)
    },
    [navigate]
  )

  /** 撤回 */
  const handleWithdraw = useCallback(
    async (record: PRDTO) => {
      const success = await withdrawPR(record.id)
      if (success) {
        message.success('撤回成功')
      } else {
        message.error('撤回失败')
      }
    },
    [withdrawPR]
  )

  /** 删除 */
  const handleDelete = useCallback(
    async (record: PRDTO) => {
      const success = await deletePR(record.id)
      if (success) {
        message.success('删除成功')
      } else {
        message.error('删除失败，只能删除草稿状态的申请')
      }
    },
    [deletePR]
  )

  /** 审批通过 */
  const handleApprove = useCallback(
    async (record: PRDTO) => {
      Modal.confirm({
        title: '确认审批通过',
        content: `确定通过「${record.projectName}」的入库申请吗？`,
        okText: '通过',
        cancelText: '取消',
        onOk: async () => {
          const success = await reviewPR(record.id, 'approve', '审核通过')
          if (success) {
            message.success('审批通过')
          } else {
            message.error('操作失败')
          }
        },
      })
    },
    [reviewPR]
  )

  /** 驳回 */
  const handleReject = useCallback(
    async (record: PRDTO) => {
      Modal.confirm({
        title: '确认驳回',
        content: `确定驳回「${record.projectName}」的入库申请吗？驳回后申请将终止。`,
        okText: '驳回',
        okButtonProps: { danger: true },
        cancelText: '取消',
        onOk: async () => {
          const success = await reviewPR(record.id, 'reject', '数据存在问题，审核不通过')
          if (success) {
            message.success('已驳回')
          } else {
            message.error('操作失败')
          }
        },
      })
    },
    [reviewPR]
  )

  /** 退回修改 */
  const handleReturn = useCallback(
    async (record: PRDTO) => {
      Modal.confirm({
        title: '确认退回',
        content: `确定将「${record.projectName}」退回给申请人修改吗？`,
        okText: '退回',
        cancelText: '取消',
        onOk: async () => {
          const success = await reviewPR(record.id, 'return', '请补充完善相关信息后重新提交')
          if (success) {
            message.success('已退回')
          } else {
            message.error('操作失败')
          }
        },
      })
    },
    [reviewPR]
  )

  /** 创建 PR */
  const handleCreate = useCallback(() => {
    navigate('/collect/my/projects')
  }, [navigate])

  // ===== 表格列 =====

  // 我发起的 PR 列
  const myColumns: ColumnsType<PRDTO> = [
    ...getMyPRColumns(),
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
          {record.status === 'draft' && (
            <Button type="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
          )}
          {['pending', 'returned'].includes(record.status) && (
            <Popconfirm
              title="确定要撤回该申请吗？"
              onConfirm={() => handleWithdraw(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small">
                撤回
              </Button>
            </Popconfirm>
          )}
          {record.status === 'draft' && (
            <Popconfirm
              title="确定要删除该申请吗？"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ]

  // 待我审批的 PR 列
  const pendingColumns: ColumnsType<PRDTO> = [
    ...getPendingPRColumns(),
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Button type="link" size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            style={{ color: '#52c41a' }}
            onClick={() => handleApprove(record)}
          >
            通过
          </Button>
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleReturn(record)}
          >
            退回
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            onClick={() => handleReject(record)}
          >
            驳回
          </Button>
        </div>
      ),
    },
  ]

  // 获取状态 Tag
  const getStatusTag = (status: string) => {
    const option = PR_STATUS_OPTIONS.find((o) => o.value === status)
    if (!option) return null
    return <Tag color={option.color}>{option.label}</Tag>
  }

  // ===== 渲染 =====

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <h1 className={styles.title}>入库申请</h1>
      </div>

      {/* Tab + 筛选栏 */}
      <div className={styles.tabContainer}>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabConfig.map((tab) => ({
            key: tab.key,
            label: tab.label,
          }))}
        />
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
          {activeTab === 'my' && (
            <Select
              placeholder="全部状态"
              value={filter.status || undefined}
              onChange={handleStatusChange}
              style={{ width: 120 }}
              allowClear
              options={PR_STATUS_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          )}
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            onChange={handleTimeRangeChange}
            style={{ width: 240 }}
          />
          <Button icon={<ReloadOutlined />} onClick={resetFilter}>
            重置
          </Button>
        </Space>
        {activeTab === 'my' && (
          <div className={styles.filterRight}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              发起入库申请
            </Button>
          </div>
        )}
      </div>

      {/* 数据表格 */}
      <div className={styles.tableContainer}>
        <Table
          rowKey="id"
          columns={activeTab === 'my' ? myColumns : pendingColumns}
          dataSource={prs}
          loading={loading}
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
          scroll={{ x: activeTab === 'my' ? 1200 : 1300 }}
          locale={{
            emptyText: (
              <div className={styles.empty}>
                <p>{emptyConfig[activeTab].description}</p>
                {activeTab === 'my' && emptyConfig.my.buttonText && (
                  <Button type="primary" onClick={handleCreate}>
                    {emptyConfig.my.buttonText}
                  </Button>
                )}
              </div>
            ),
          }}
        />
      </div>
    </div>
  )
}

export default PRListPage