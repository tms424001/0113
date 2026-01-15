// src/pages/collect/BOQCollectPage/components/ImportFileModal.tsx
// 导入清单价格文件弹窗

import { useState } from 'react'
import {
  Modal,
  Upload,
  Form,
  DatePicker,
  Select,
  Input,
  Button,
  Space,
  message,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { BOQ_SOURCE_CHANNEL_OPTIONS } from '@/types/boqCollect'
import styles from './ImportFileModal.module.css'

const { Dragger } = Upload
const { TextArea } = Input

interface ImportFileModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}

/**
 * 导入清单价格文件弹窗
 */
export const ImportFileModal = ({ open, onCancel, onSuccess }: ImportFileModalProps) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  // 重置
  const handleReset = () => {
    form.resetFields()
    setFileList([])
  }

  // 关闭
  const handleCancel = () => {
    handleReset()
    onCancel()
  }

  // 提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (fileList.length === 0) {
        message.warning('请上传文件')
        return
      }

      setLoading(true)

      // 模拟上传
      await new Promise((resolve) => setTimeout(resolve, 1500))

      message.success('文件导入成功，正在解析中...')
      handleReset()
      onSuccess()
    } catch (error) {
      // 表单验证失败
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="导入清单价格文件"
      open={open}
      onCancel={handleCancel}
      width={560}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          开始导入
        </Button>,
      ]}
    >
      <div className={styles.content}>
        {/* 文件上传 */}
        <Dragger
          accept=".xlsx,.xls,.csv"
          fileList={fileList}
          maxCount={1}
          beforeUpload={(file) => {
            setFileList([file as unknown as UploadFile])
            return false
          }}
          onRemove={() => {
            setFileList([])
          }}
          className={styles.dragger}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处</p>
          <p className="ant-upload-hint">支持 .xlsx .xls .csv 格式</p>
        </Dragger>

        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          initialValues={{
            region: '武汉',
          }}
        >
          {/* 来源渠道 */}
          <Form.Item
            name="sourceChannel"
            label="来源渠道"
            rules={[{ required: true, message: '请选择来源渠道' }]}
          >
            <Space wrap>
              {BOQ_SOURCE_CHANNEL_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type={form.getFieldValue('sourceChannel') === opt.value ? 'primary' : 'default'}
                  onClick={() => form.setFieldValue('sourceChannel', opt.value)}
                  style={{ minWidth: 100 }}
                >
                  {opt.icon} {opt.label}
                </Button>
              ))}
            </Space>
          </Form.Item>

          {/* 价格日期 */}
          <Form.Item
            name="priceDate"
            label="价格日期"
            rules={[{ required: true, message: '请选择价格日期' }]}
          >
            <DatePicker
              picker="month"
              placeholder="选择价格月份"
              style={{ width: '100%' }}
              format="YYYY-MM"
            />
          </Form.Item>

          {/* 适用地区 */}
          <Form.Item
            name="region"
            label="适用地区"
            rules={[{ required: true, message: '请选择适用地区' }]}
          >
            <Select
              placeholder="请选择地区"
              options={[
                { value: '武汉', label: '武汉' },
                { value: '上海', label: '上海' },
                { value: '成都', label: '成都' },
                { value: '广州', label: '广州' },
                { value: '深圳', label: '深圳' },
                { value: '重庆', label: '重庆' },
              ]}
            />
          </Form.Item>

          {/* 备注 */}
          <Form.Item name="remark" label="备注">
            <TextArea placeholder="可选" rows={2} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default ImportFileModal
