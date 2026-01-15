// src/pages/assets/enterprise/MaterialsPage/components/L3AttributeFilter.tsx
// L3 属性筛选组件

import { Tag, Space } from 'antd'
import type { L3Attribute } from '../types'
import styles from './L3AttributeFilter.module.css'

interface L3AttributeFilterProps {
  attributes: L3Attribute[]
  selectedValues: Record<string, string>
  onChange: (key: string, value: string) => void
}

/**
 * L3 属性筛选组件
 */
export const L3AttributeFilter: React.FC<L3AttributeFilterProps> = ({
  attributes,
  selectedValues,
  onChange,
}) => {
  if (!attributes || attributes.length === 0) {
    return null
  }

  const handleTagClick = (attrKey: string, value: string) => {
    // 如果已选中，则取消选中
    if (selectedValues[attrKey] === value) {
      onChange(attrKey, '')
    } else {
      onChange(attrKey, value)
    }
  }

  return (
    <div className={styles.container}>
      {attributes.map((attr) => (
        <div key={attr.key} className={styles.attributeRow}>
          <span className={styles.label}>{attr.label}：</span>
          <Space size={[4, 4]} wrap>
            {attr.options.map((option) => (
              <Tag
                key={option.value}
                className={styles.tag}
                color={selectedValues[attr.key] === option.value ? 'blue' : undefined}
                onClick={() => handleTagClick(attr.key, option.value)}
              >
                {option.label}
              </Tag>
            ))}
          </Space>
        </div>
      ))}
    </div>
  )
}

export default L3AttributeFilter
