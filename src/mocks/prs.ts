// src/mocks/prs.ts
// PR 入库申请 Mock 数据

import type { PRDTO, PRStatus, ReviewLevel } from '@/types/pr'

/**
 * 生成随机 PR 数据
 */
function generateMockPR(index: number, isMyPR: boolean): PRDTO {
  const statuses: PRStatus[] = isMyPR 
    ? ['draft', 'pending', 'reviewing', 'approved', 'rejected', 'returned']
    : ['pending', 'reviewing']
  
  const projectNames = [
    '惠民科技展示中心项目配套建筑',
    '琪县国家储备林建设项目',
    '新津区某幼儿园项目',
    '西部某基地项目',
    '成都市公共卫生应急病房评审项目',
    '成华区某商业用房及配套设施工程项目',
    '某产业园及配套基础设施建设项目',
    '某绿道公园配套建设项目一标段',
    '成都金牛区某派出所及配套设施项目',
    '温江某学校项目',
    '西南交通大学犀浦校区环境与生物材料交叉技术创新中心',
    '金牛区沙河源街道友联社区商业用地项目',
  ]

  const applicants = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  const reviewers = ['审批员A', '审批员B', '审批员C']
  const targetSpaces = ['企业项目库', '市场数据库']

  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const amount = Math.round(Math.random() * 100000000000) / 100
  const buildingArea = Math.round(Math.random() * 100000 + 5000)
  
  const applyTime = new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString()

  const projectName = projectNames[index % projectNames.length]

  return {
    id: `pr_${String(index + 1).padStart(6, '0')}`,
    title: `${projectName} - 入库申请`,
    projectId: `project_${String(index + 1).padStart(6, '0')}`,
    projectName,
    amount,
    buildingArea,
    status,
    currentLevel: status === 'reviewing' ? (Math.random() > 0.5 ? 'level1' : 'level2') : undefined,
    completeness: Math.floor(Math.random() * 20) + 80, // 80-100
    applicant: isMyPR ? '当前用户' : applicants[Math.floor(Math.random() * applicants.length)],
    applyTime,
    targetSpace: targetSpaces[Math.floor(Math.random() * targetSpaces.length)],
    reviewer: ['approved', 'rejected', 'returned'].includes(status) 
      ? reviewers[Math.floor(Math.random() * reviewers.length)]
      : undefined,
    reviewTime: ['approved', 'rejected', 'returned'].includes(status)
      ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
    reviewComment: status === 'rejected' ? '数据存在异常，请核实后重新提交' 
      : status === 'returned' ? '请补充单项工程的结构类型信息'
      : status === 'approved' ? '审核通过'
      : undefined,
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

/**
 * 生成我发起的 PR 列表
 */
export const mockMyPRs: PRDTO[] = Array.from({ length: 25 }, (_, i) =>
  generateMockPR(i, true)
)

/**
 * 生成待我审批的 PR 列表
 */
export const mockPendingPRs: PRDTO[] = Array.from({ length: 18 }, (_, i) =>
  generateMockPR(i + 100, false)
)

/**
 * Mock API: 获取 PR 列表
 */
export function getMockPRList(params: {
  tab: 'my' | 'pending'
  keyword?: string
  status?: string
  timeRange?: [string, string]
  page: number
  pageSize: number
}): { items: PRDTO[]; total: number; page: number; pageSize: number } {
  let filtered = params.tab === 'my' ? [...mockMyPRs] : [...mockPendingPRs]

  // 关键词筛选
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.projectName.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status)
  }

  // 时间范围筛选
  if (params.timeRange && params.timeRange[0] && params.timeRange[1]) {
    const [start, end] = params.timeRange
    filtered = filtered.filter((p) => {
      const applyTime = new Date(p.applyTime).getTime()
      return applyTime >= new Date(start).getTime() && applyTime <= new Date(end).getTime()
    })
  }

  // 按申请时间倒序
  filtered.sort((a, b) => new Date(b.applyTime).getTime() - new Date(a.applyTime).getTime())

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
 * Mock API: 获取 PR 详情
 */
export function getMockPRDetail(id: string): PRDTO | null {
  return mockMyPRs.find((p) => p.id === id) || mockPendingPRs.find((p) => p.id === id) || null
}

/**
 * Mock API: 撤回 PR
 */
export function withdrawMockPR(id: string): boolean {
  const pr = mockMyPRs.find((p) => p.id === id)
  if (pr && ['pending', 'returned'].includes(pr.status)) {
    pr.status = 'draft'
    pr.updatedAt = new Date().toISOString()
    return true
  }
  return false
}

/**
 * Mock API: 删除 PR
 */
export function deleteMockPR(id: string): boolean {
  const index = mockMyPRs.findIndex((p) => p.id === id)
  if (index > -1 && mockMyPRs[index].status === 'draft') {
    mockMyPRs.splice(index, 1)
    return true
  }
  return false
}

/**
 * Mock API: 审批 PR
 */
export function reviewMockPR(id: string, action: 'approve' | 'reject' | 'return', comment?: string): boolean {
  const pr = mockPendingPRs.find((p) => p.id === id) || mockMyPRs.find((p) => p.id === id)
  if (pr && ['pending', 'reviewing'].includes(pr.status)) {
    pr.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'returned'
    pr.reviewer = '当前用户'
    pr.reviewTime = new Date().toISOString()
    pr.reviewComment = comment
    pr.updatedAt = new Date().toISOString()
    return true
  }
  return false
}