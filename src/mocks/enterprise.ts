// src/mocks/enterprise.ts
// 企业资产 Mock 数据

import type {
  EnterpriseProjectDTO,
  EnterpriseMaterialDTO,
  EnterpriseBOQDTO,
  EnterpriseProjectStatus,
} from '@/types/enterprise'

/**
 * 生成随机企业项目数据
 */
function generateMockEnterpriseProject(index: number): EnterpriseProjectDTO {
  const projectNames = [
    '成都市某商业综合体项目',
    '天府新区产业园建设项目',
    '高新区科技研发中心',
    '武侯区某学校新建项目',
    '锦江区城市更新改造项目',
    '青羊区医疗中心项目',
    '金牛区某安置房项目',
    '成华区某写字楼项目',
    '龙泉驿区产业基地项目',
    '双流区某物流中心项目',
    '温江区某养老社区项目',
    '郫都区某创业园项目',
  ]

  const categories = ['residential', 'commercial', 'office', 'industrial', 'public']
  const phases = ['bidding_control', 'budget', 'settlement']
  const statuses: EnterpriseProjectStatus[] = ['active', 'active', 'active', 'archived']
  const approvers = ['张经理', '李总监', '王主任', '刘工']
  const cities = ['成都市']
  const districts = ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '高新区', '天府新区']

  const amount = Math.round(Math.random() * 200000000000) / 100 + 50000000
  const buildingArea = Math.round(Math.random() * 150000) + 10000
  const unitPrice = Math.round(amount / buildingArea)

  return {
    id: `ep_${String(index + 1).padStart(6, '0')}`,
    projectName: projectNames[index % projectNames.length] + (index >= projectNames.length ? `(${Math.floor(index / projectNames.length) + 1})` : ''),
    region: {
      province: '四川省',
      city: cities[0],
      district: districts[Math.floor(Math.random() * districts.length)],
    },
    projectCategory: categories[Math.floor(Math.random() * categories.length)],
    compilationPhase: phases[Math.floor(Math.random() * phases.length)],
    amount,
    buildingArea,
    unitPrice,
    materialPriceDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    approvedTime: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    approvedBy: approvers[Math.floor(Math.random() * approvers.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    referenceCount: Math.floor(Math.random() * 50),
    subProjectCount: Math.floor(Math.random() * 10) + 1,
    unitCount: Math.floor(Math.random() * 30) + 5,
    qualityScore: Math.floor(Math.random() * 30) + 70,
  }
}

/**
 * 生成随机企业材料数据
 */
function generateMockEnterpriseMaterial(index: number): EnterpriseMaterialDTO {
  const materials = [
    { code: 'C30', name: '商品混凝土C30', unit: 'm³', spec: 'C30，坍落度160-180mm' },
    { code: 'HRB400-12', name: '钢筋HRB400 Φ12', unit: 't', spec: 'HRB400，Φ12mm' },
    { code: 'HRB400-16', name: '钢筋HRB400 Φ16', unit: 't', spec: 'HRB400，Φ16mm' },
    { code: 'HRB400-20', name: '钢筋HRB400 Φ20', unit: 't', spec: 'HRB400，Φ20mm' },
    { code: 'MU10', name: '烧结普通砖MU10', unit: '千块', spec: 'MU10，240×115×53mm' },
    { code: 'M5', name: '预拌砂浆M5', unit: 'm³', spec: 'M5，干混砂浆' },
    { code: 'PC32.5', name: '普通硅酸盐水泥P.C32.5', unit: 't', spec: 'P.C32.5' },
    { code: 'SAND-M', name: '中砂', unit: 'm³', spec: '细度模数2.3-3.0' },
  ]

  const mat = materials[index % materials.length]
  const basePrice = [450, 4200, 4150, 4100, 380, 320, 420, 95][index % materials.length]
  const priceWithTax = basePrice * (1 + Math.random() * 0.2 - 0.1)

  return {
    id: `em_${String(index + 1).padStart(6, '0')}`,
    materialCode: mat.code,
    materialName: mat.name,
    specification: mat.spec,
    unit: mat.unit,
    priceWithTax: Math.round(priceWithTax * 100) / 100,
    priceWithoutTax: Math.round(priceWithTax / 1.13 * 100) / 100,
    supplier: ['中建材料', '华西建材', '成都建材', ''][Math.floor(Math.random() * 4)] || undefined,
    priceDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
    sourceProjectCount: Math.floor(Math.random() * 30) + 5,
    dataCount: Math.floor(Math.random() * 200) + 50,
    status: Math.random() > 0.2 ? 'active' : 'outdated',
  }
}

/**
 * 生成随机企业清单数据
 */
function generateMockEnterpriseBOQ(index: number): EnterpriseBOQDTO {
  const boqs = [
    { code: '010101001', name: '挖基坑土方', unit: 'm³' },
    { code: '010101002', name: '挖沟槽土方', unit: 'm³' },
    { code: '010102001', name: '回填土方', unit: 'm³' },
    { code: '010201001', name: '钢筋混凝土灌注桩', unit: 'm³' },
    { code: '010301001', name: '砖基础', unit: 'm³' },
    { code: '010401001', name: '现浇混凝土柱', unit: 'm³' },
    { code: '010401002', name: '现浇混凝土梁', unit: 'm³' },
    { code: '010401003', name: '现浇混凝土板', unit: 'm³' },
    { code: '010501001', name: '砌块墙', unit: 'm³' },
    { code: '010601001', name: '外墙抹灰', unit: '㎡' },
  ]

  const boq = boqs[index % boqs.length]
  const basePrice = [35, 38, 25, 850, 420, 1200, 1150, 1100, 380, 45][index % boqs.length]
  const avgPrice = basePrice * (1 + Math.random() * 0.3)

  return {
    id: `eb_${String(index + 1).padStart(6, '0')}`,
    boqCode: boq.code,
    boqName: boq.name,
    unit: boq.unit,
    avgUnitPrice: Math.round(avgPrice * 100) / 100,
    minUnitPrice: Math.round(avgPrice * 0.7 * 100) / 100,
    maxUnitPrice: Math.round(avgPrice * 1.3 * 100) / 100,
    sourceProjectCount: Math.floor(Math.random() * 40) + 10,
    dataCount: Math.floor(Math.random() * 500) + 100,
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
}

// 生成 Mock 数据
export const mockEnterpriseProjects: EnterpriseProjectDTO[] = Array.from(
  { length: 86 },
  (_, i) => generateMockEnterpriseProject(i)
)

export const mockEnterpriseMaterials: EnterpriseMaterialDTO[] = Array.from(
  { length: 120 },
  (_, i) => generateMockEnterpriseMaterial(i)
)

export const mockEnterpriseBOQs: EnterpriseBOQDTO[] = Array.from(
  { length: 150 },
  (_, i) => generateMockEnterpriseBOQ(i)
)

/**
 * Mock API: 获取企业项目列表
 */
export function getMockEnterpriseProjectList(params: {
  keyword?: string
  projectCategory?: string
  compilationPhase?: string
  status?: string
  timeRange?: [string, string]
  page: number
  pageSize: number
}): { items: EnterpriseProjectDTO[]; total: number } {
  let filtered = [...mockEnterpriseProjects]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter((p) => p.projectName.toLowerCase().includes(kw))
  }

  if (params.projectCategory) {
    filtered = filtered.filter((p) => p.projectCategory === params.projectCategory)
  }

  if (params.compilationPhase) {
    filtered = filtered.filter((p) => p.compilationPhase === params.compilationPhase)
  }

  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status)
  }

  if (params.timeRange?.[0] && params.timeRange?.[1]) {
    const [start, end] = params.timeRange
    filtered = filtered.filter((p) => {
      const t = new Date(p.approvedTime).getTime()
      return t >= new Date(start).getTime() && t <= new Date(end).getTime()
    })
  }

  filtered.sort((a, b) => new Date(b.approvedTime).getTime() - new Date(a.approvedTime).getTime())

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}

/**
 * Mock API: 获取企业材料列表
 */
export function getMockEnterpriseMaterialList(params: {
  keyword?: string
  status?: string
  page: number
  pageSize: number
}): { items: EnterpriseMaterialDTO[]; total: number } {
  let filtered = [...mockEnterpriseMaterials]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (m) =>
        m.materialName.toLowerCase().includes(kw) ||
        m.materialCode.toLowerCase().includes(kw)
    )
  }

  if (params.status) {
    filtered = filtered.filter((m) => m.status === params.status)
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}

/**
 * Mock API: 获取企业清单列表
 */
export function getMockEnterpriseBOQList(params: {
  keyword?: string
  page: number
  pageSize: number
}): { items: EnterpriseBOQDTO[]; total: number } {
  let filtered = [...mockEnterpriseBOQs]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.boqName.toLowerCase().includes(kw) ||
        b.boqCode.toLowerCase().includes(kw)
    )
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}

/**
 * Mock API: 获取统计数据
 */
export function getMockEnterpriseStats() {
  return {
    projectCount: mockEnterpriseProjects.length,
    totalAmount: mockEnterpriseProjects.reduce((sum, p) => sum + p.amount, 0),
    totalArea: mockEnterpriseProjects.reduce((sum, p) => sum + p.buildingArea, 0),
    materialCount: mockEnterpriseMaterials.length,
    boqCount: mockEnterpriseBOQs.length,
    avgQualityScore: Math.round(
      mockEnterpriseProjects.reduce((sum, p) => sum + p.qualityScore, 0) /
        mockEnterpriseProjects.length
    ),
  }
}