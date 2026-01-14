// src/mocks/drafts.ts
// 草稿库 Mock 数据

import type { DraftDTO, DraftSource, DraftStatus } from '@/types/draft'

/**
 * 生成随机草稿数据
 */
function generateMockDraft(index: number): DraftDTO {
  const sources: DraftSource[] = ['collect', 'quality', 'pricing', 'estimate']
  const statuses: DraftStatus[] = ['pending', 'analyzing', 'completed', 'failed']
  const phases = ['招标工程量清单', '招标控制价', '施工图预算', '结算', '概算']
  const formats = ['广联达 GBQ4', '广联达 GBQ5', '斯维尔', '宏业', 'Excel']

  const projectNames = [
    '荷韵金苑项目',
    '某国际智慧物流供应链产业社区',
    '成都某产业用房建设项目',
    '某绿道公园配套建设项目一标段',
    '成都市公共卫生应急病房评审项目',
    '某产业园及配套基础设施建设项目',
    '成都某社区综合体建设项目工程',
    '成都金牛区某派出所及配套设施项目',
    '西部某基地项目',
    '成都某文化建筑图书馆',
    '成华区某商业用房及配套设施工程项目',
    '新津区某幼儿园项目',
    '某创新孵化园及配套设施项目',
    '温江某学校项目',
    '西南交通大学犀浦校区环境与生物材料交叉技术创新中心',
    '金牛区沙河源街道友联社区商业用地项目',
    '惠民科技展示中心项目配套建筑',
    '琪县国家储备林建设项目',
  ]

  const randomDate = new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString()

  return {
    id: `draft_${String(index + 1).padStart(6, '0')}`,
    projectName: projectNames[index % projectNames.length] + (index >= projectNames.length ? `(${Math.floor(index / projectNames.length) + 1})` : ''),
    uploadTime: randomDate,
    source: sources[Math.floor(Math.random() * sources.length)],
    amount: Math.round(Math.random() * 100000000000) / 100, // 0-10亿，精确到分
    status: statuses[Math.floor(Math.random() * statuses.length)],
    compilationPhase: phases[Math.floor(Math.random() * phases.length)],
    fileFormat: formats[Math.floor(Math.random() * formats.length)],
    subProjectCount: Math.floor(Math.random() * 20) + 1,
    createdBy: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
  }
}

/**
 * 生成 Mock 草稿列表
 */
export const mockDrafts: DraftDTO[] = Array.from({ length: 109 }, (_, i) =>
  generateMockDraft(i)
)

/**
 * Mock API: 获取草稿列表
 */
export function getMockDraftList(params: {
  keyword?: string
  source?: string
  status?: string
  uploadTimeRange?: [string, string]
  page: number
  pageSize: number
}): { items: DraftDTO[]; total: number; page: number; pageSize: number } {
  let filtered = [...mockDrafts]

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
 * Mock API: 删除草稿
 */
export function deleteMockDraft(id: string): boolean {
  const index = mockDrafts.findIndex((d) => d.id === id)
  if (index > -1) {
    mockDrafts.splice(index, 1)
    return true
  }
  return false
}

/**
 * Mock API: 批量删除草稿
 */
export function deleteMockDrafts(ids: string[]): number {
  let deleted = 0
  ids.forEach((id) => {
    if (deleteMockDraft(id)) {
      deleted++
    }
  })
  return deleted
}