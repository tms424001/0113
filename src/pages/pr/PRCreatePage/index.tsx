// src/pages/pr/PRCreatePage/index.tsx
// PR 创建/编辑页面

import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { Steps, Button, Card, Space, message, Modal } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { stepConfig } from './config'
import { StepSelectProject } from './components/StepSelectProject'
import { StepBasicInfo } from './components/StepBasicInfo'
import { StepSubProjects } from './components/StepSubProjects'
import type { SubProjectData } from './components/StepSubProjects'
import { StepConfirm } from './components/StepConfirm'
import styles from './PRCreatePage.module.css'

/**
 * Mock 单项工程数据
 */
const getMockSubProjects = (): SubProjectData[] => [
  {
    id: 'sub_001',
    subProjectName: '地下室',
    buildingArea: 20257.92,
    structureType: 'frame_shear',
    aboveGroundFloors: 0,
    undergroundFloors: 2,
    buildingHeight: 8.4,
    amount: 156890000,
  },
  {
    id: 'sub_002',
    subProjectName: '1#楼（商业）',
    buildingArea: 5074.09,
    structureType: undefined,
    aboveGroundFloors: 4,
    undergroundFloors: 0,
    buildingHeight: 18.6,
    amount: 89760000,
  },
  {
    id: 'sub_003',
    subProjectName: '2#楼（办公）',
    buildingArea: 10108.50,
    structureType: 'frame_shear',
    aboveGroundFloors: 12,
    undergroundFloors: 0,
    buildingHeight: 48.2,
    amount: 198450000,
  },
  {
    id: 'sub_004',
    subProjectName: '3#楼（公寓）',
    buildingArea: 10037.74,
    structureType: 'shear_wall',
    aboveGroundFloors: 18,
    undergroundFloors: 0,
    buildingHeight: 56.8,
    amount: 245670000,
  },
  {
    id: 'sub_005',
    subProjectName: '4#楼（公寓）',
    buildingArea: 5056.30,
    structureType: undefined,
    aboveGroundFloors: 18,
    undergroundFloors: 0,
    buildingHeight: 56.8,
    amount: 123450000,
  },
  {
    id: 'sub_006',
    subProjectName: '大门及围墙',
    buildingArea: 42.90,
    amount: 8900000,
  },
  {
    id: 'sub_007',
    subProjectName: '室外总平',
    buildingArea: 0,
    amount: 7584600,
  },
]

/**
 * PR 创建/编辑页面
 */
export const PRCreatePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id } = useParams<{ id: string }>()

  const isEdit = !!id
  const projectIdFromUrl = searchParams.get('projectId')

  // 状态
  const [currentStep, setCurrentStep] = useState(projectIdFromUrl ? 1 : 0)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [subProjects, setSubProjects] = useState<SubProjectData[]>([])
  const [submitting, setSubmitting] = useState(false)

  // 表单
  const [basicForm] = Form.useForm()

  // 初始化：如果从 URL 带了 projectId，直接跳到第二步
  useEffect(() => {
    if (projectIdFromUrl) {
      // 模拟加载项目数据
      setSelectedProject({
        id: projectIdFromUrl,
        projectName: '金牛区沙河源街道友联社区商业用地项目',
      })
      setSubProjects(getMockSubProjects())
      // 设置默认表单值
      basicForm.setFieldsValue({
        projectName: '金牛区沙河源街道友联社区商业用地项目',
        region: ['四川省', '成都市', '金牛区'],
        targetSpace: 'enterprise',
      })
    }
  }, [projectIdFromUrl, basicForm])

  // 返回
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate(-1)
    }
  }, [currentStep, navigate])

  // 下一步
  const handleNext = useCallback(async () => {
    if (currentStep === 0) {
      // 步骤1：验证是否选择了项目
      if (!selectedProject) {
        message.warning('请选择一个项目')
        return
      }
      // 加载单项工程数据
      setSubProjects(getMockSubProjects())
      basicForm.setFieldsValue({
        projectName: selectedProject.projectName,
        targetSpace: 'enterprise',
      })
    } else if (currentStep === 1) {
      // 步骤2：验证基本信息表单
      try {
        await basicForm.validateFields()
      } catch {
        message.warning('请完善必填信息')
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }, [currentStep, selectedProject, basicForm])

  // 提交
  const handleSubmit = useCallback(async () => {
    setSubmitting(true)

    try {
      // 模拟提交
      await new Promise((resolve) => setTimeout(resolve, 1000))

      message.success('提交成功，已进入审批流程')
      navigate('/pr/list')
    } catch (error) {
      message.error('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }, [navigate])

  // 保存草稿
  const handleSaveDraft = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      message.success('已保存为草稿')
    } catch {
      message.error('保存失败')
    }
  }, [])

  // 取消
  const handleCancel = useCallback(() => {
    Modal.confirm({
      title: '确认离开',
      content: '离开后未保存的内容将丢失，是否确认离开？',
      okText: '确认离开',
      cancelText: '继续编辑',
      onOk: () => navigate('/pr/list'),
    })
  }, [navigate])

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepSelectProject
            selectedProjectId={selectedProject?.id}
            onSelect={setSelectedProject}
          />
        )
      case 1:
        return <StepBasicInfo form={basicForm} />
      case 2:
        return (
          <StepSubProjects
            subProjects={subProjects}
            onChange={setSubProjects}
          />
        )
      case 3:
        return (
          <StepConfirm
            projectName={selectedProject?.projectName || ''}
            basicInfo={basicForm.getFieldsValue()}
            subProjects={subProjects}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={styles.page}>
      {/* 页面头部 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            className={styles.backButton}
          >
            {isEdit ? '返回' : '取消'}
          </Button>
          <h1 className={styles.title}>
            {isEdit ? '编辑入库申请' : '发起入库申请'}
          </h1>
        </div>
        <Space>
          <Button onClick={handleSaveDraft}>保存草稿</Button>
        </Space>
      </div>

      {/* 步骤条 */}
      <Card className={styles.stepsCard}>
        <Steps
          current={currentStep}
          items={stepConfig.map((s) => ({ title: s.title }))}
        />
      </Card>

      {/* 步骤内容 */}
      <div className={styles.content}>{renderStepContent()}</div>

      {/* 底部操作栏 */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <Button onClick={handleBack} disabled={currentStep === 0 && !projectIdFromUrl}>
            {currentStep === 0 ? '取消' : '上一步'}
          </Button>
          <Space>
            {currentStep < stepConfig.length - 1 ? (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit} loading={submitting}>
                提交申请
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  )
}

export default PRCreatePage