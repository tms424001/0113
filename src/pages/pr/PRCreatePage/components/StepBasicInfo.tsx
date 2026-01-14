// src/pages/pr/PRCreatePage/components/StepBasicInfo.tsx
// 步骤2: 基本信息

import { Card, Form, Input, Select, DatePicker, Cascader, Row, Col, Typography } from 'antd'
import type { FormInstance } from 'antd'
import { REGION_OPTIONS } from '@/constants/region'
import { basicFormFields } from '../config'
import styles from './StepBasicInfo.module.css'

const { Text } = Typography

interface StepBasicInfoProps {
  form: FormInstance
}

/**
 * 渲染表单项
 */
const renderFormItem = (field: typeof basicFormFields[0]['fields'][0]) => {
  const { name, label, type, required, options } = field

  switch (type) {
    case 'input':
      return <Input placeholder={`请输入${label}`} />
    case 'date':
      return <DatePicker style={{ width: '100%' }} placeholder={`选择${label}`} />
    case 'select':
      return (
        <Select
          placeholder={`请选择${label}`}
          options={options?.map((o) => ({ value: o.value, label: o.label }))}
          allowClear={!required}
        />
      )
    case 'cascader':
      return (
        <Cascader
          options={REGION_OPTIONS}
          placeholder={`请选择${label}`}
          style={{ width: '100%' }}
        />
      )
    default:
      return <Input placeholder={`请输入${label}`} />
  }
}

/**
 * 步骤2: 基本信息组件
 */
export const StepBasicInfo = ({ form }: StepBasicInfoProps) => {
  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        {basicFormFields.map((section) => (
          <Card
            key={section.section}
            title={section.section}
            className={styles.card}
            size="small"
          >
            <Row gutter={16}>
              {section.fields.map((field) => (
                <Col key={field.name} span={field.span}>
                  <Form.Item
                    name={field.name}
                    label={field.label}
                    rules={[
                      {
                        required: field.required,
                        message: `请${field.type === 'select' || field.type === 'cascader' ? '选择' : '输入'}${field.label}`,
                      },
                    ]}
                  >
                    {renderFormItem(field)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </Form>

      <div className={styles.tips}>
        <Text type="secondary">
          提示：带 * 的为必填项，基本信息将用于入库后的数据检索和分析
        </Text>
      </div>
    </div>
  )
}

export default StepBasicInfo