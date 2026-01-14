// src/mocks/prDetail.ts
// PR 详情 Mock 数据

import type { PRStatus, ReviewLevel } from '@/types/pr'

/**
 * 单项工程
 */
export interface SubProject {
  id: string
  subProjectName: string
  buildingArea?: number
  structureType?: string
  aboveGroundFloors?: number
  undergroundFloors?: number
  buildingHeight?: number
  amount?: number
}

/**
 * 校核结果项
 */
export interface CheckResultItem {
  id: string
  type: 'warning' | 'info' | 'error'
  category: string
  message: string
  target?: string
}

/**
 * 审批记录
 */
export interface ReviewRecord {
  id: string
  action: 'submit' | 'approve' | 'reject' | 'return' | 'withdraw'
  level: ReviewLevel
  operator: string
  operateTime: string
  comment?: string
}

/**
 * 补录数据
 */
export interface SupplementData {
  basic: {
    region?: string[]
    projectCategory?: string
    compilationPhase?: string
    constructionNature?: string
  }
  compilation: {
    materialPriceDate?: string
    pricingBasis?: string
  }
}

/**
 * PR 详情 DTO
 */
export interface PRDetailDTO {
  id: string
  title: string
  projectId: string
  projectName: string
  amount: number
  buildingArea?: number
  status: PRStatus
  currentLevel?: ReviewLevel
  completeness: number
  applicant: string
  applyTime: string
  targetSpace: string
  reviewer?: string
  reviewTime?: string
  reviewComment?: string
  updatedAt: string
  supplementData: SupplementData
  subProjects: SubProject[]
  checkResults: CheckResultItem[]
  reviewHistory: ReviewRecord[]
}

/**
 * 生成 Mock PR 详情
 */
function generateMockPRDetail(id: string): PRDetailDTO {
  const projectNames = [
    '惠民科技展示中心项目配套建筑',
    '琪县国家储备林建设项目',
    '新津区某幼儿园项目',
    '西部某基地项目',
    '成都市公共卫生应急病房评审项目',
  ]

  const projectName = projectNames[Math.floor(Math.random() * projectNames.length)]

  return {
    id,
    title: `${projectName} - 入库申请`,
    projectId: `project_${id}`,
    projectName,
    amount: 83070000,
    buildingArea: 45521.32,
    status: 'reviewing',
    currentLevel: 'level1',
    completeness: 85,
    applicant: '张三',
    applyTime: '2026-01-10 14:30:00',
    targetSpace: '企业项目库',
    updatedAt: '2026-01-10 14:30:00',
    supplementData: {
      basic: {
        region: ['四川省', '成都市', '金牛区'],
        projectCategory: 'civil',
        compilationPhase: 'budget',
        constructionNature: 'new',
      },
      compilation: {
        materialPriceDate: '2025年12月',
        pricingBasis: '四川省建设工程工程量清单计价定额（2020）',
      },
    },
    subProjects: [
      {
        id: 'sub_001',
        subProjectName: '地下室',
        buildingArea: 20257.45,
        structureType: 'frame_shear',
        aboveGroundFloors: 0,
        undergroundFloors: 2,
        buildingHeight: -8.5,
        amount: 35680000,
      },
      {
        id: 'sub_002',
        subProjectName: '1#楼',
        buildingArea: 5074.23,
        structureType: 'frame',
        aboveGroundFloors: 4,
        undergroundFloors: 0,
        buildingHeight: 16.8,
        amount: 12350000,
      },
      {
        id: 'sub_003',
        subProjectName: '2#楼',
        buildingArea: 8456.78,
        structureType: 'frame',
        aboveGroundFloors: 6,
        undergroundFloors: 0,
        buildingHeight: 21.6,
        amount: 18900000,
      },
      {
        id: 'sub_004',
        subProjectName: '3#楼',
        buildingArea: 6892.34,
        structureType: 'frame',
        aboveGroundFloors: 5,
        undergroundFloors: 0,
        buildingHeight: 18.0,
        amount: 14200000,
      },
      {
        id: 'sub_005',
        subProjectName: '大门及围墙',
        buildingArea: 840.52,
        structureType: undefined,
        aboveGroundFloors: 1,
        undergroundFloors: 0,
        buildingHeight: 3.5,
        amount: 1940000,
      },
    ],
    checkResults: [
      {
        id: 'check_001',
        type: 'warning',
        category: '单方造价',
        message: '2#楼单方造价 2235元/㎡，高于同类型平均值 1850元/㎡',
        target: '2#楼',
      },
      {
        id: 'check_002',
        type: 'info',
        category: '结构类型',
        message: '大门及围墙未填写结构类型',
        target: '大门及围墙',
      },
      {
        id: 'check_003',
        type: 'info',
        category: '建筑高度',
        message: '地下室建筑高度为负值，请确认是否正确',
        target: '地下室',
      },
    ],
    reviewHistory: [
      {
        id: 'review_001',
        action: 'submit',
        level: 'level1',
        operator: '张三',
        operateTime: '2026-01-10 14:30:00',
        comment: '请审批',
      },
    ],
  }
}

/**
 * Mock 数据缓存
 */
const mockDetailCache: Record<string, PRDetailDTO> = {}

/**
 * Mock API: 获取 PR 详情
 */
export function getMockPRDetail(id: string): PRDetailDTO | null {
  if (!mockDetailCache[id]) {
    mockDetailCache[id] = generateMockPRDetail(id)
  }
  return mockDetailCache[id]
}
