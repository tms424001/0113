// src/pages/pr/PRDetailPage/components/BasicInfoCard.tsx
// 基本信息卡片组件

import { Card, Descriptions, Tag, Progress, Typography } from 'antd'
import type { PRDetailDTO } from '@/mocks/prDetail'
import { PR_STATUS_OPTIONS } from '@/types/pr'
import { COMPILATION_PHASE_OPTIONS } from '@/types/project'
import { PROJECT_CATEGORY_OPTIONS, CONSTRUCTION_NATURE_OPTIONS } from '../config'
import styles from './BasicInfoCard.module.css'

const { Text } = Typography

interface BasicInfoCardProps {
  data: PRDetailDTO
}

/**
 * 基本信息卡片
 */
export const BasicInfoCard = ({ data }: BasicInfoCardProps) => {
  const statusOption = PR_STATUS_OPTIONS.find((o) => o.value === data.status)
  const categoryOption = PROJECT_CATEGORY_OPTIONS.find(
    (o) => o.value === data.supplementData.basic.projectCategory
  )
  const phaseOption = COMPILATION_PHASE_OPTIONS.find(
    (o) => o.value === data.supplementData.basic.compilationPhase
  )
  const natureOption = CONSTRUCTION_NATURE_OPTIONS.find(
    (o) => o.value === data.supplementData.basic.constructionNature
  )

  return (
    <Card title="基本信息" className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Text strong className={styles.projectName}>
            {data.projectName}
          </Text>
          <Tag color={statusOption?.color}>{statusOption?.label}</Tag>
        </div>
        
        <div className={styles.completeness}>
          <div className={styles.completenessLabel}>
            <Text type="secondary">补录完成度</Text>
            <Text strong style={{ color: data.completeness >= 80 ? '#52c41a' : '#faad14' }}>
              {data.completeness}%
            </Text>
          </div>
          <Progress
            percent={data.completeness}
            showInfo={false}
            strokeColor={data.completeness >= 80 ? '#52c41a' : '#faad14'}
            size="small"
          />
        </div>
      </div>

      <Descriptions column={3} size="small" className={styles.descriptions}>
        <Descriptions.Item label="申请人">{data.applicant}</Descriptions.Item>
        <Descriptions.Item label="申请时间">{data.applyTime}</Descriptions.Item>
        <Descriptions.Item label="目标空间">{data.targetSpace}</Descriptions.Item>
        
        <Descriptions.Item label="工程地点">
          {data.supplementData.basic.region?.join(' ') || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="工程分类">
          {categoryOption?.label || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="编制阶段">
          {phaseOption?.label || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="建设性质">
          {natureOption?.label || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="材价时间">
          {data.supplementData.compilation.materialPriceDate || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="计价依据">
          {data.supplementData.compilation.pricingBasis || '-'}
        </Descriptions.Item>

        <Descriptions.Item label="总金额">
          <Text strong style={{ color: '#1890ff' }}>
            {(data.amount / 10000).toLocaleString('zh-CN', { minimumFractionDigits: 2 })} 万元
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="建筑面积">
          {data.buildingArea?.toLocaleString('zh-CN', { minimumFractionDigits: 2 })} ㎡
        </Descriptions.Item>
        <Descriptions.Item label="单方造价">
          {data.buildingArea && data.amount
            ? `${Math.round(data.amount / data.buildingArea).toLocaleString('zh-CN')} 元/㎡`
            : '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default BasicInfoCard