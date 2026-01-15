// src/pages/assets/enterprise/MaterialsPage/components/FilterBar.tsx
// 顶部筛选栏组件

import { Select, Input, Button, DatePicker, Space } from 'antd'
import { ExportOutlined, SettingOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import {
  mockRegionOptions,
  mockPriceStageOptions,
  mockSourceTypeOptions,
} from '@/mocks/enterpriseMaterial'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  regionCode: string
  period: string
  priceStage: string
  sourceType: string
  keyword: string
  selectedCount: number
  onRegionChange: (value: string) => void
  onPeriodChange: (value: string) => void
  onPriceStageChange: (value: string) => void
  onSourceTypeChange: (value: string) => void
  onKeywordChange: (value: string) => void
  onSearch: () => void
  onExport: () => void
}

/**
 * 顶部筛选栏组件
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  regionCode,
  period,
  priceStage,
  sourceType,
  keyword,
  selectedCount,
  onRegionChange,
  onPeriodChange,
  onPriceStageChange,
  onSourceTypeChange,
  onKeywordChange,
  onSearch,
  onExport,
}) => {
  const handlePeriodChange = (date: Dayjs | null) => {
    if (date) {
      onPeriodChange(date.format('YYYY-MM'))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <Space wrap size="middle">
          <Select
            value={regionCode}
            onChange={onRegionChange}
            options={mockRegionOptions}
            style={{ width: 120 }}
            placeholder="选择地区"
          />

          <DatePicker
            picker="month"
            value={period ? dayjs(period, 'YYYY-MM') : null}
            onChange={handlePeriodChange}
            format="YYYY-MM"
            placeholder="选择时间"
            style={{ width: 120 }}
            allowClear={false}
          />

          <Select
            value={priceStage}
            onChange={onPriceStageChange}
            options={mockPriceStageOptions}
            style={{ width: 120 }}
            placeholder="阶段"
          />

          <Select
            value={sourceType}
            onChange={onSourceTypeChange}
            options={mockSourceTypeOptions}
            style={{ width: 120 }}
            placeholder="来源"
          />

          <Input.Search
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onSearch={onSearch}
            placeholder="搜索材料名称/编码/品牌"
            style={{ width: 220 }}
            allowClear
            enterButton
          />
        </Space>
      </div>

      <div className={styles.actions}>
        <Space>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={onExport}
          >
            导出{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </Button>
          <Button icon={<SettingOutlined />}>设置</Button>
        </Space>
      </div>
    </div>
  )
}

export default FilterBar
