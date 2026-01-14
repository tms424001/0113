// src/pages/pr/PRCreatePage/components/StepConfirm.tsx
// 步骤4: 确认提交

import { Card, Descriptions, Table, Alert, Tag, Typography, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { SubProjectData } from './StepSubProjects'
import {
  PROJECT_CATEGORY_OPTIONS,
  CONSTRUCTION_NATURE_OPTIONS,
  TARGET_SPACE_OPTIONS,
  STRUCTURE_TYPE_OPTIONS,
} from '../config'
import { COMPILATION_PHASE_OPTIONS } from '@/types/project'
import styles from './StepConfirm.module.css'

const { Text } = Typography

interface StepConfirmProps {
  projectName: string
  basicInfo: Record<string, any>
  subProjects: SubProjectData[]
}

/**
 * 计算补录完成度
 */
function calculateCompleteness(
  basicInfo: Record<string, any>,
  subProjects: SubProjectData[]
): number {
  const requiredBasicFields = [
    'projectName',
    'projectTime',
    'region',
    'projectCategory',
    'compilationPhase',
    'materialPriceDate',
    'targetSpace',
  ]

  // 基本信息完成度
  const basicFilledCount = requiredBasicFields.filter(
    (f) => basicInfo[f] !== undefined && basicInfo[f] !== null && basicInfo[f] !== ''
  ).length
  const basicCompleteness = (basicFilledCount / requiredBasicFields.length) * 50

  // 单项工程完成度 (结构类型填写率)
  const structureFilledCount = subProjects.filter(
    (s) => s.structureType
  ).length
  const subProjectCompleteness =
    subProjects.length > 0
      ? (structureFilledCount / subProjects.length) * 50
      : 50

  return Math.round(basicCompleteness + subProjectCompleteness)
}

/**
 * 步骤4: 确认提交组件
 */
export const StepConfirm = ({
  projectName,
  basicInfo,
  subProjects,
}: StepConfirmProps) => {
  const completeness = calculateCompleteness(basicInfo, subProjects)

  // 获取选项标签
  const getOptionLabel = (options: { value: string; label: string }[], value: string) => {
    return options.find((o) => o.value === value)?.label || value || '-'
  }

  // 计算总金额和总面积
  const totalAmount = subProjects.reduce((sum, s) => sum + (s.amount || 0), 0)
  const totalArea = subProjects.reduce((sum, s) => sum + (s.buildingArea || 0), 0)

  const columns: ColumnsType<SubProjectData> = [
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
      width: 120,
      align: 'right',
      render: (v) => v?.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) || '-',
    },
    {
      title: '结构类型',
      dataIndex: 'structureType',
      key: 'structureType',
      width: 120,
      render: (v) =>
        v ? (
          getOptionLabel(STRUCTURE_TYPE_OPTIONS, v)
        ) : (
          <Text type="warning">未填写</Text>
        ),
    },
    {
      title: '层数(地上/地下)',
      key: 'floors',
      width: 130,
      render: (_, r) =>
        `${r.aboveGroundFloors ?? '-'} / ${r.undergroundFloors ?? '-'}`,
    },
    {
      title: '金额(万元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (v) =>
        v ? (v / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2 }) : '-',
    },
  ]

  return (
    <div className={styles.container}>
      {/* 补录完成度 */}
      <Card className={styles.completenessCard}>
        <div className={styles.completenessHeader}>
          <Text strong>补录完成度</Text>
          <Text
            strong
            style={{ color: completeness >= 80 ? '#52c41a' : '#faad14' }}
          >
            {completeness}%
          </Text>
        </div>
        <Progress
          percent={completeness}
          showInfo={false}
          strokeColor={completeness >= 80 ? '#52c41a' : '#faad14'}
        />
        {completeness < 80 && (
          <Alert
            type="warning"
            message="补录完成度不足80%，请完善信息后再提交"
            showIcon
            className={styles.alert}
          />
        )}
      </Card>

      {/* 项目信息概览 */}
      <Card title="项目信息" className={styles.card} size="small">
        <Descriptions column={3} size="small">
          <Descriptions.Item label="项目名称" span={3}>
            <Text strong>{basicInfo.projectName || projectName}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="工程地点">
            {basicInfo.region?.join(' ') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="工程分类">
            {getOptionLabel(PROJECT_CATEGORY_OPTIONS, basicInfo.projectCategory)}
          </Descriptions.Item>
          <Descriptions.Item label="编制阶段">
            {getOptionLabel(COMPILATION_PHASE_OPTIONS as any, basicInfo.compilationPhase)}
          </Descriptions.Item>
          <Descriptions.Item label="建设性质">
            {getOptionLabel(CONSTRUCTION_NATURE_OPTIONS, basicInfo.constructionNature)}
          </Descriptions.Item>
          <Descriptions.Item label="材价时间">
            {basicInfo.materialPriceDate?.format?.('YYYY-MM-DD') ||
              basicInfo.materialPriceDate ||
              '-'}
          </Descriptions.Item>
          <Descriptions.Item label="目标空间">
            <Tag color="blue">
              {getOptionLabel(TARGET_SPACE_OPTIONS, basicInfo.targetSpace)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="总金额">
            <Text strong style={{ color: '#1890ff' }}>
              {(totalAmount / 10000).toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
              })}{' '}
              万元
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="总建筑面积">
            {totalArea.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} ㎡
          </Descriptions.Item>
          <Descriptions.Item label="综合单方造价">
            {totalArea > 0
              ? `${Math.round(totalAmount / totalArea).toLocaleString('zh-CN')} 元/㎡`
              : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 单项工程列表 */}
      <Card title="单项工程" className={styles.card} size="small">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={subProjects}
          pagination={false}
          size="small"
        />
      </Card>

      {/* 提交须知 */}
      <Alert
        type="info"
        message="提交须知"
        description={
          <ul className={styles.noticeList}>
            <li>提交后将进入审批流程，请确保信息准确</li>
            <li>审批期间可以撤回申请进行修改</li>
            <li>审批通过后数据将正式入库，不可修改</li>
          </ul>
        }
        showIcon
      />
    </div>
  )
}

export default StepConfirm