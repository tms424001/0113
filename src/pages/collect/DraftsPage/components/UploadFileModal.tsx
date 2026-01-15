// src/pages/collect/DraftsPage/components/UploadFileModal.tsx
// 上传造价文件弹窗

import { useState } from 'react'
import { Modal, Upload, Form, Input, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { DRAFT_SOURCE_OPTIONS } from '@/types/draft'
import styles from './UploadFileModal.module.css'

const { Dragger } = Upload

interface UploadFileModalProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
}

/**
 * 上传造价文件弹窗
 */
export const UploadFileModal = ({ open, onCancel, onSuccess }: UploadFileModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [sourceChannel, setSourceChannel] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // 处理文件变化
  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList.slice(-1)) // 只保留最后一个文件
  }

  // 开始上传
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的文件')
      return
    }
    if (!sourceChannel) {
      message.warning('请选择来源渠道')
      return
    }

    setLoading(true)
    // 模拟上传
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    message.success('上传成功')
    setFileList([])
    setSourceChannel('')
    form.resetFields()
    onSuccess()
  }

  // 关闭弹窗
  const handleCancel = () => {
    setFileList([])
    setSourceChannel('')
    form.resetFields()
    onCancel()
  }

  return (
    <Modal
      title="上传造价文件"
      open={open}
      onCancel={handleCancel}
      onOk={handleUpload}
      okText="开始上传"
      cancelText="取消"
      confirmLoading={loading}
      width={520}
    >
      <div className={styles.content}>
        {/* 文件上传 */}
        <Dragger
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false}
          accept=".gqs,.gcq,.gbq,.xml"
          maxCount={1}
          className={styles.dragger}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此处</p>
          <p className="ant-upload-hint">支持 .gqs .gcq .gbq .xml 格式</p>
        </Dragger>

        {/* 表单 */}
        <Form form={form} layout="vertical" className={styles.form}>
          <Form.Item label="来源渠道" required>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {DRAFT_SOURCE_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setSourceChannel(opt.value)}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${sourceChannel === opt.value ? '#1677ff' : '#d9d9d9'}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: sourceChannel === opt.value ? '#e6f4ff' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="项目名称" name="projectName">
            <Input placeholder="请输入项目名称（可选）" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注（可选）" rows={2} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default UploadFileModal
