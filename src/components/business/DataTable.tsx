// src/components/business/DataTable.tsx
import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { Table, Tag } from 'antd'
import type { TableProps, ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { PageStateLoading, PageStateEmpty, PageStateError, StatusBadge } from '../ui'
import type { StatusOption } from '../ui'
import styles from './DataTable.module.css'

export type ColumnRenderType = 'text' | 'date' | 'status' | 'actions' | 'link' | 'tags'

export interface ColumnDef<T = unknown> {
  key: string
  title: string
  dataIndex: string | string[]
  width?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  priority: 'P0' | 'P1' | 'P2'
  render?: ColumnRenderType | ((value: unknown, record: T) => ReactNode)
  statusOptions?: StatusOption[]
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  dataSource: T[]
  loading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
  onChange?: TableProps<T>['onChange']
  onRow?: (record: T) => { onClick?: () => void }
  rowClassName?: (record: T) => string
  rowKey?: string | ((record: T) => string)
  error?: { code?: number | 'network'; message?: string }
  onRetry?: () => void
  emptyType?: 'init' | 'filtered'
  onCreate?: () => void
  onClearFilter?: () => void
}

function getNestedValue<T>(record: T, dataIndex: string | string[]): unknown {
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce<unknown>((obj, key) => {
      if (obj && typeof obj === 'object') {
        return (obj as Record<string, unknown>)[key]
      }
      return undefined
    }, record)
  }
  return (record as Record<string, unknown>)[dataIndex]
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  dataSource,
  loading = false,
  pagination,
  onChange,
  onRow,
  rowClassName,
  rowKey = 'id',
  error,
  onRetry,
  emptyType = 'init',
  onCreate,
  onClearFilter,
}: DataTableProps<T>) {
  // Error state
  if (error && onRetry) {
    return (
      <div className={styles.stateContainer}>
        <PageStateError
          code={error.code}
          message={error.message}
          onRetry={onRetry}
        />
      </div>
    )
  }

  // Loading state
  if (loading && dataSource.length === 0) {
    return (
      <div className={styles.stateContainer}>
        <PageStateLoading type="table" rows={10} />
      </div>
    )
  }

  // Empty state
  if (!loading && dataSource.length === 0) {
    return (
      <div className={styles.stateContainer}>
        <PageStateEmpty
          type={emptyType}
          onCreate={onCreate}
          onClearFilter={onClearFilter}
        />
      </div>
    )
  }

  // Build AntD columns
  const antdColumns: ColumnsType<T> = useMemo(() => {
    return columns.map((col) => ({
      key: col.key,
      title: col.title,
      dataIndex: col.dataIndex,
      width: col.width,
      fixed: col.fixed,
      sorter: col.sortable,
      render: (value: unknown, record: T) => {
        const actualValue = Array.isArray(col.dataIndex)
          ? getNestedValue(record, col.dataIndex)
          : value

        if (typeof col.render === 'function') {
          return col.render(actualValue, record)
        }

        switch (col.render) {
          case 'date':
            return actualValue
              ? dayjs(actualValue as string).format('YYYY-MM-DD HH:mm')
              : '-'

          case 'status':
            if (col.statusOptions && actualValue) {
              return (
                <StatusBadge
                  status={actualValue as string}
                  options={col.statusOptions}
                />
              )
            }
            return actualValue || '-'

          case 'tags':
            if (Array.isArray(actualValue)) {
              return (
                <>
                  {(actualValue as string[]).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </>
              )
            }
            return actualValue || '-'

          case 'link':
          case 'actions':
          case 'text':
          default:
            return actualValue ?? '-'
        }
      },
    }))
  }, [columns])

  // Pagination config
  const paginationConfig = pagination
    ? {
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`,
      }
    : false

  return (
    <div className={styles.tableContainer}>
      <Table<T>
        columns={antdColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={paginationConfig}
        onChange={onChange}
        onRow={onRow}
        rowClassName={rowClassName}
        rowKey={rowKey}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default DataTable
