// src/pages/collect/CollectUploadPage/components/BasicInfoForm.tsx
// 基本信息表单组件

import React from 'react'
import { Form, Input, Cascader, Select, Card } from 'antd'
import type { BasicInfo, RegionInfo } from '@/types/dto.upload'
import {
  REGION_OPTIONS,
  PRICING_TYPE_OPTIONS,
  COMPOSITE_PRICE_TYPE_OPTIONS,
} from '@/constants/upload'
import styles from '../CollectUploadPage.module.css'

// ============================================================================
// Types
// ============================================================================

export interface BasicInfoFormProps {
  values: BasicInfo
  onChange: (values: Partial<BasicInfo>) => void
  disabled?: boolean
}

// ============================================================================
// Component
// ============================================================================

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  values,
  onChange,
  disabled = false,
}) => {
  // 处理地区变化
  const handleRegionChange = (value: (string | number)[]) => {
    if (value && value.length === 3) {
      const region: RegionInfo = {
        province: String(value[0]),
        city: String(value[1]),
        district: String(value[2]),
      }
      onChange({ region })
    }
  }

  // 获取地区级联值
  const getRegionValue = (): string[] => {
    if (values.region.province && values.region.city && values.region.district) {
      return [values.region.province, values.region.city, values.region.district]
    }
    return []
  }

  return (
    <Card
      title="基本信息（自动识别，可修改）"
      className={styles.basicInfoCard}
      size="small"
    >
      <Form layout="vertical" disabled={disabled}>
        <Form.Item label="项目名称">
          <Input
            value={values.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="请输入项目名称"
          />
        </Form.Item>

        <Form.Item
          label="工程地点"
          required
          tooltip="必填，用于后续数据分析"
        >
          <Cascader
            options={REGION_OPTIONS}
            value={getRegionValue()}
            onChange={handleRegionChange}
            placeholder="请选择省/市/区"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <div className={styles.formRow}>
          <Form.Item
            label="计价类型"
            required
            className={styles.formItemHalf}
          >
            <Select
              value={values.pricingType}
              onChange={(value) => onChange({ pricingType: value })}
              options={PRICING_TYPE_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            label="综合单价构成"
            className={styles.formItemHalf}
          >
            <Select
              value={values.compositePriceType}
              onChange={(value) => onChange({ compositePriceType: value })}
              options={COMPOSITE_PRICE_TYPE_OPTIONS}
            />
          </Form.Item>
        </div>
      </Form>
    </Card>
  )
}

export default BasicInfoForm
