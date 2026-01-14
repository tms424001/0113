// src/components/business/FilterBar.tsx
import React, { useCallback } from 'react'
import { Input, Select, DatePicker, InputNumber, Button, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import styles from './FilterBar.module.css'

const { RangePicker } = DatePicker
type RangeValue = [Dayjs | null, Dayjs | null] | null

export type FilterItemType = 'input' | 'select' | 'dateRange' | 'cascader' | 'number'

export interface FilterItem {
  key: string
  type: FilterItemType
  label: string
  placeholder?: string
  options?: { label: string; value: string | number }[]
  defaultValue?: unknown
  width?: number
}

export interface FilterBarProps {
  filters: FilterItem[]
  values: Record<string, unknown>
  onSearch: (values: Record<string, unknown>) => void
  onReset: () => void
  loading?: boolean
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onSearch,
  onReset,
  loading = false,
}) => {
  const [localValues, setLocalValues] = React.useState<Record<string, unknown>>(values)

  React.useEffect(() => {
    setLocalValues(values)
  }, [values])

  const handleChange = useCallback((key: string, value: unknown) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSearch = useCallback(() => {
    onSearch(localValues)
  }, [localValues, onSearch])

  const handleReset = useCallback(() => {
    const defaultValues: Record<string, unknown> = {}
    filters.forEach((filter) => {
      defaultValues[filter.key] = filter.defaultValue ?? undefined
    })
    setLocalValues(defaultValues)
    onReset()
  }, [filters, onReset])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const renderFilterItem = (filter: FilterItem) => {
    const value = localValues[filter.key]
    const width = filter.width || 200

    switch (filter.type) {
      case 'input':
        return (
          <Input
            placeholder={filter.placeholder || `请输入${filter.label}`}
            value={value as string}
            onChange={(e) => handleChange(filter.key, e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ width }}
            allowClear
          />
        )

      case 'select':
        return (
          <Select
            placeholder={filter.placeholder || `请选择${filter.label}`}
            value={value as string | number | undefined}
            onChange={(val) => handleChange(filter.key, val)}
            options={filter.options}
            style={{ width }}
            allowClear
          />
        )

      case 'dateRange':
        return (
          <RangePicker
            value={value as RangeValue}
            onChange={(dates) => handleChange(filter.key, dates)}
            style={{ width: width + 40 }}
          />
        )

      case 'number':
        return (
          <InputNumber
            placeholder={filter.placeholder || `请输入${filter.label}`}
            value={value as number}
            onChange={(val) => handleChange(filter.key, val)}
            onKeyDown={handleKeyDown}
            style={{ width }}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.filterBar}>
      <div className={styles.filters}>
        {filters.map((filter) => (
          <div key={filter.key} className={styles.filterItem}>
            <span className={styles.label}>{filter.label}</span>
            {renderFilterItem(filter)}
          </div>
        ))}
      </div>
      <Space className={styles.actions}>
        <Button icon={<ReloadOutlined />} onClick={handleReset} disabled={loading}>
          重置
        </Button>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
        >
          搜索
        </Button>
      </Space>
    </div>
  )
}

export default FilterBar
