// src/mocks/projects.ts
// 我的项目 Mock 数据

import type { ProjectDTO, ProjectSource, ProjectStatus } from '@/types/project'

/**
 * 生成随机项目数据
 */
function generateMockProject(index: number): ProjectDTO {
  const sources: ProjectSource[] = ['collect', 'quality', 'pricing', 'estimate']
  const statuses: ProjectStatus[] = ['draft', 'ready', 'submitted', 'approved']
  const phases = ['招标工程量清单', '招标控制价', '施工图预算', '结算', '概算']
  const provinces = ['四川省', '重庆市', '云南省', '贵州省']
  const cities = ['成都市', '重庆市', '昆明市', '贵阳市']

  const projectNames = [
    '惠民科技展示中心项目配套建筑',
    '琪县国家储备林建设项目',
    '新津区某幼儿园项目',
    '西部某基地项目',
    '成都市公共卫生生应急病房评审项目',
    '成华区某商业用房及配套设施工程项目',
    '某产业园及配套基础设施建设项目',
    '某绿道公园配套建设项目一标段',
    '成都金牛区某派出所及配套设施项目',
    '某国际智慧物流供应链产业社区',
    '温江某学校项目',
    '西南交通大学犀浦校区环境与生物材料交叉技术创新中心',
    '金牛区沙河源街道友联社区商业用地项目',
    '成都某产业用房建设项目',
    '成都某社区综合体建设项目工程',
    '成都某文化建筑图书馆',
  ]

  const randomDate = new Date(
    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
  ).toISOString()

  const amount = Math.round(Math.random() * 100000000000) / 100
  const buildingArea = Math.round(Math.random() * 100000 + 5000)
  const subProjectCount = Math.floor(Math.random() * 15) + 1
  const unitCount = subProjectCount * (Math.floor(Math.random() * 5) + 2)

  return {
    id: `project_${String(index + 1).padStart(6, '0')}`,
    projectName: projectNames[index % projectNames.length] + (index >= projectNames.length ? `(${Math.floor(index / projectNames.length) + 1})` : ''),
    uploadTime: randomDate,
    source: sources[Math.floor(Math.random() * sources.length)],
    amount,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    compilationPhase: phases[Math.floor(Math.random() * phases.length)],
    region: {
      province: provinces[Math.floor(Math.random() * provinces.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      district: '锦江区',
    },
    subProjectCount,
    unitCount,
    buildingArea,
    unitPrice: amount > 0 && buildingArea > 0 ? Math.round(amount / buildingArea / 100) : 0,
    completeness: Math.floor(Math.random() * 60) + 40, // 40-100
    createdBy: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

/**
 * 生成 Mock 项目列表
 */
export const mockProjects: ProjectDTO[] = Array.from({ length: 68 }, (_, i) =>
  generateMockProject(i)
)

/**
 * Mock API: 获取项目列表
 */
export function getMockProjectList(params: {
  keyword?: string
  source?: string
  status?: string
  uploadTimeRange?: [string, string]
  page: number
  pageSize: number
}): { items: ProjectDTO[]; total: number; page: number; pageSize: number } {
  let filtered = [...mockProjects]

  // 关键词筛选
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter((d) =>
      d.projectName.toLowerCase().includes(keyword)
    )
  }

  // 来源筛选
  if (params.source) {
    filtered = filtered.filter((d) => d.source === params.source)
  }

  // 状态筛选
  if (params.status) {
    filtered = filtered.filter((d) => d.status === params.status)
  }

  // 时间范围筛选
  if (params.uploadTimeRange && params.uploadTimeRange[0] && params.uploadTimeRange[1]) {
    const [start, end] = params.uploadTimeRange
    filtered = filtered.filter((d) => {
      const uploadTime = new Date(d.uploadTime).getTime()
      return uploadTime >= new Date(start).getTime() && uploadTime <= new Date(end).getTime()
    })
  }

  // 按上传时间倒序
  filtered.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())

  // 分页
  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return {
    items,
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

/**
 * Mock API: 删除项目
 */
export function deleteMockProject(id: string): boolean {
  const index = mockProjects.findIndex((d) => d.id === id)
  if (index > -1) {
    mockProjects.splice(index, 1)
    return true
  }
  return false
}

/**
 * Mock API: 批量删除项目
 */
export function deleteMockProjects(ids: string[]): number {
  let deleted = 0
  ids.forEach((id) => {
    if (deleteMockProject(id)) {
      deleted++
    }
  })
  return deleted
}

/**
 * Mock API: 获取项目详情
 */
export function getMockProjectDetail(id: string): ProjectDTO | null {
  return mockProjects.find((p) => p.id === id) || null
}