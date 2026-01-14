// src/pages/collect/DraftsPage/components/PushToProjectModal.tsx
// 推送到我的项目弹窗组件

import { useState, useEffect, useMemo } from 'react'
import {
  Modal,
  Form,
  DatePicker,
  Cascader,
  Select,
  Table,
  InputNumber,
  Radio,
  Descriptions,
  Tag,
  message,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DraftDTO } from '@/types/draft'
import { DRAFT_SOURCE_OPTIONS } from '@/types/draft'
import { COMPILATION_PHASE_OPTIONS } from '@/types/project'
import { REGION_OPTIONS } from '@/constants/region'
import styles from './PushToProjectModal.module.css'

const { Text } = Typography

/**
 * 单项工程规模数据
 */
interface SubProjectScale {
  subProjectId: string
  subProjectName: string
  buildingArea: number
  isIncluded: boolean
}

/**
 * 推送表单数据
 */
interface PushFormData {
  materialPriceDate: any  // dayjs object
  region: string[]
  compilationPhase: string
}

/**
 * 组件 Props
 */
interface PushToProjectModalProps {
  /** 是否显示 */
  open: boolean
  /** 当前草稿数据 */
  draft: DraftDTO | null
  /** 关闭回调 */
  onClose: () => void
  /** 推送成功回调 */
  onSuccess: (projectId: string) => void
}

/**
 * 模拟获取单项工程列表
 */
function getMockSubProjects(draftId: string): SubProjectScale[] {
  // 实际应从 API 获取
  return [
    { subProjectId: 'sub_001', subProjectName: '地下室', buildingArea: 20257.92, isIncluded: true },
    { subProjectId: 'sub_002', subProjectName: '1#楼', buildingArea: 5074.09, isIncluded: true },
    { subProjectId: 'sub_003', subProjectName: '2#楼', buildingArea: 10108.50, isIncluded: true },
    { subProjectId: 'sub_004', subProjectName: '3#楼', buildingArea: 10037.74, isIncluded: true },
    { subProjectId: 'sub_005', subProjectName: '4#楼', buildingArea: 5056.30, isIncluded: true },
    { subProjectId: 'sub_006', subProjectName: '大门', buildingArea: 42.90, isIncluded: false },
    { subProjectId: 'sub_007', subProjectName: '总平', buildingArea: 0, isIncluded: false },
  ]
}

/**
 * 推送到我的项目弹窗
 */
export const PushToProjectModal = ({
  open,
  draft,
  onClose,
  onSuccess,
}: PushToProjectModalProps) => {
  const [form] = Form.useForm<PushFormData>()
  const [loading, setLoading] = useState(false)
  const [subProjects, setSubProjects] = useState<SubProjectScale[]>([])

  // 加载单项工程数据
  useEffect(() => {
    if (open && draft) {
      const data = getMockSubProjects(draft.id)
      setSubProjects(data)
      form.resetFields()
    }
  }, [open, draft, form])

  // 计算合计建筑面积（仅计入的）
  const totalBuildingArea = useMemo(() => {
    return subProjects
      .filter((s) => s.isIncluded)
      .reduce((sum, s) => sum + (s.buildingArea || 0), 0)
  }, [subProjects])

  // 更新单项工程数据
  const handleSubProjectChange = (
    subProjectId: string,
    field: 'buildingArea' | 'isIncluded',
    value: number | boolean
  ) => {
    setSubProjects((prev) =>
      prev.map((s) =>
        s.subProjectId === subProjectId ? { ...s, [field]: value } : s
      )
    )
  }

  // 提交推送
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      
      setLoading(true)

      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 800))

      const params = {
        draftId: draft?.id,
        basicInfo: {
          materialPriceDate: values.materialPriceDate?.format('YYYY-MM-DD'),
          region: {
            province: values.region?.[0],
            city: values.region?.[1],
            district: values.region?.[2],
          },
          compilationPhase: values.compilationPhase,
        },
        buildingScale: subProjects.map((s) => ({
          subProjectId: s.subProjectId,
          subProjectName: s.subProjectName,
          buildingArea: s.buildingArea,
          isIncluded: s.isIncluded,
        })),
      }

      console.log('推送参数:', params)

      // 模拟返回项目 ID
      const projectId = `project_${Date.now()}`
      
      message.success('推送成功')
      onSuccess(projectId)
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // 单项工程表格列配置
  const columns: ColumnsType<SubProjectScale> = [
    {
      title: '单项工程',
      dataIndex: 'subProjectName',
      key: 'subProjectName',
      width: 180,
    },
    {
      title: '建筑面积(㎡)',
      dataIndex: 'buildingArea',
      key: 'buildingArea',
      width: 150,
      render: (value, record) => (
        <InputNumber
          value={value}
          min={0}
          precision={2}
          style={{ width: '100%' }}
          onChange={(v) =>
            handleSubProjectChange(record.subProjectId, 'buildingArea', v || 0)
          }
        />
      ),
    },
    {
      title: '是否计入',
      dataIndex: 'isIncluded',
      key: 'isIncluded',
      width: 140,
      render: (value, record) => (
        <Radio.Group
          value={value}
          onChange={(e) =>
            handleSubProjectChange(record.subProjectId, 'isIncluded', e.target.value)
          }
        >
          <Radio value={true}>计入</Radio>
          <Radio value={false}>不计入</Radio>
        </Radio.Group>
      ),
    },
  ]

  if (!draft) return null

  return (
    <Modal
      title="推送到我的项目"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="确认推送"
      cancelText="取消"
      confirmLoading={loading}
      width={680}
      destroyOnClose
    >
      {/* 项目信息（只读） */}
      <div className={styles.projectInfo}>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="项目名称" span={2}>
            {draft.projectName}
          </Descriptions.Item>
          <Descriptions.Item label="总金额">
            {draft.amount
              ? `${(draft.amount / 10000).toLocaleString('zh-CN', {
                  minimumFractionDigits: 2,
                })} 万元`
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="来源">
            <Tag
              color={
                DRAFT_SOURCE_OPTIONS.find((o) => o.value === draft.source)?.color
              }
            >
              {DRAFT_SOURCE_OPTIONS.find((o) => o.value === draft.source)?.label}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 基础补录表单 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>基础补录（必填）</div>
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="materialPriceDate"
            label="材料价时间"
            rules={[{ required: true, message: '请选择材料价时间' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="选择材料价格基准日期"
            />
          </Form.Item>

          <Form.Item
            name="region"
            label="工程地点"
            rules={[{ required: true, message: '请选择工程地点' }]}
          >
            <Cascader
              options={REGION_OPTIONS}
              placeholder="选择省/市/区"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="compilationPhase"
            label="编制阶段"
            rules={[{ required: true, message: '请选择编制阶段' }]}
          >
            <Select
              placeholder="选择编制阶段"
              options={COMPILATION_PHASE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </Form.Item>
        </Form>
      </div>

      {/* 建设规模 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>建设规模</div>
        <Table
          rowKey="subProjectId"
          columns={columns}
          dataSource={subProjects}
          pagination={false}
          size="small"
          scroll={{ y: 240 }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>合计</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>
                    {totalBuildingArea.toLocaleString('zh-CN', {
                      minimumFractionDigits: 2,
                    })} ㎡
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text type="secondary">仅统计"计入"项</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Modal>
  )
}

export default PushToProjectModal