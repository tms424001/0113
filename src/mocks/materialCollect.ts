// src/mocks/materialCollect.ts
// 材料采集 Mock 数据

import type {
  MaterialCollectFileDTO,
  MaterialRecordDTO,
  PersonalMaterialDTO,
  MaterialSourceChannel,
} from '@/types/materialCollect'

/**
 * Mock 材料采集文件列表
 */
const mockMaterialFiles: MaterialCollectFileDTO[] = [
  {
    id: 'file_001',
    fileName: '供应商报价_华润水泥_202512.xlsx',
    sourceChannel: 'supplier',
    status: 'completed',
    recordCount: 45,
    priceDate: '2025-12',
    region: '武汉',
    uploadTime: '2025-12-15 10:30:00',
    uploadBy: '张三',
  },
  {
    id: 'file_002',
    fileName: '认质认价_钢材_202512.xlsx',
    sourceChannel: 'certified',
    status: 'completed',
    recordCount: 89,
    priceDate: '2025-12',
    region: '武汉',
    uploadTime: '2025-12-10 14:20:00',
    uploadBy: '李四',
  },
  {
    id: 'file_003',
    fileName: '网站价格_建材网_202512.xlsx',
    sourceChannel: 'website',
    status: 'processing',
    recordCount: 156,
    priceDate: '2025-12',
    region: '武汉',
    uploadTime: '2025-12-08 09:15:00',
    uploadBy: '王五',
  },
  {
    id: 'file_004',
    fileName: '财评价_XX项目_202511.xlsx',
    sourceChannel: 'finance',
    status: 'completed',
    recordCount: 328,
    priceDate: '2025-11',
    region: '武汉',
    uploadTime: '2025-11-28 16:45:00',
    uploadBy: '张三',
  },
  {
    id: 'file_005',
    fileName: '其他来源_市场调研_202511.xlsx',
    sourceChannel: 'other',
    status: 'pending',
    recordCount: 67,
    priceDate: '2025-11',
    region: '武汉',
    uploadTime: '2025-11-20 11:30:00',
    uploadBy: '李四',
  },
]

/**
 * Mock 材料记录
 */
const mockMaterialRecords: Record<string, MaterialRecordDTO[]> = {
  file_001: [
    {
      id: 'rec_001',
      fileId: 'file_001',
      source: 'supplier',
      name: 'P.O42.5 散装水泥',
      specification: '散装',
      standardName: '普通硅酸盐水泥',
      standardSpec: 'P.O42.5 散装',
      unit: 't',
      price: 485,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'rec_002',
      fileId: 'file_001',
      source: 'supplier',
      name: 'P.O42.5 袋装水泥',
      specification: '50kg/袋',
      standardName: '普通硅酸盐水泥',
      standardSpec: 'P.O42.5 袋装',
      unit: 't',
      price: 520,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'rec_003',
      fileId: 'file_001',
      source: 'supplier',
      name: 'C30商品混凝土',
      specification: '泵送',
      unit: 'm³',
      price: 520,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'pending',
    },
    {
      id: 'rec_004',
      fileId: 'file_001',
      source: 'supplier',
      name: 'C35商品混凝土',
      specification: '泵送',
      standardName: '商品混凝土',
      standardSpec: 'C35 泵送',
      unit: 'm³',
      price: 545,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'rec_005',
      fileId: 'file_001',
      source: 'supplier',
      name: '中砂（河砂）',
      specification: '细度模数2.3-3.0',
      unit: 'm³',
      price: 135,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'pending',
    },
  ],
  file_002: [
    {
      id: 'rec_101',
      fileId: 'file_002',
      source: 'certified',
      name: 'HPB300 φ6 盘圆',
      specification: 'φ6mm',
      standardName: 'HPB300盘圆',
      standardSpec: 'φ6mm',
      unit: 't',
      price: 3850,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'rec_102',
      fileId: 'file_002',
      source: 'certified',
      name: 'HRB400 φ12 螺纹钢',
      specification: 'φ12mm',
      standardName: 'HRB400螺纹钢',
      standardSpec: 'φ12mm',
      unit: 't',
      price: 3920,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'rec_103',
      fileId: 'file_002',
      source: 'certified',
      name: 'HRB400 φ16 螺纹钢',
      specification: 'φ16mm',
      standardName: 'HRB400螺纹钢',
      standardSpec: 'φ16mm',
      unit: 't',
      price: 3880,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'rec_104',
      fileId: 'file_002',
      source: 'certified',
      name: 'Q235B热轧H型钢',
      specification: '200×200×8×12',
      unit: 't',
      price: 4250,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'pending',
    },
  ],
}

/**
 * Mock 个人材料数据
 */
const mockPersonalMaterials: PersonalMaterialDTO[] = []

// 生成个人材料数据
const sources: MaterialSourceChannel[] = ['supplier', 'certified', 'website', 'finance', 'other']
const statuses = ['draft', 'pending', 'approved', 'rejected'] as const
const regions = ['武汉', '宜昌', '成都', '上海']
const materialNames = [
  { name: 'HPB300盘圆', spec: 'φ6mm', unit: 't', price: 3850 },
  { name: 'HRB400螺纹钢', spec: 'φ12mm', unit: 't', price: 3920 },
  { name: 'HRB400螺纹钢', spec: 'φ16mm', unit: 't', price: 3880 },
  { name: '普通硅酸盐水泥', spec: 'P.O42.5 散装', unit: 't', price: 485 },
  { name: '普通硅酸盐水泥', spec: 'P.O42.5 袋装', unit: 't', price: 520 },
  { name: '商品混凝土', spec: 'C30 泵送', unit: 'm³', price: 520 },
  { name: '商品混凝土', spec: 'C35 泵送', unit: 'm³', price: 545 },
  { name: '中砂', spec: '细度模数2.3-3.0', unit: 'm³', price: 135 },
  { name: '碎石', spec: '5-25mm连续级配', unit: 'm³', price: 98 },
  { name: '热轧H型钢', spec: 'Q235B 200×200', unit: 't', price: 4250 },
  { name: '镀锌方管', spec: '40×40×2.5', unit: 'm', price: 28.5 },
  { name: 'PVC排水管', spec: 'DN110', unit: 'm', price: 18.5 },
  { name: 'PPR给水管', spec: 'DN25', unit: 'm', price: 12.8 },
  { name: '电线', spec: 'BV-2.5mm²', unit: 'm', price: 3.2 },
  { name: '电缆', spec: 'YJV-3×16+1×10', unit: 'm', price: 68 },
]

for (let i = 0; i < 120; i++) {
  const mat = materialNames[i % materialNames.length]
  const priceVariation = (Math.random() - 0.5) * 0.1 // ±5%
  mockPersonalMaterials.push({
    id: `pm_${String(i + 1).padStart(3, '0')}`,
    materialName: mat.name,
    specification: mat.spec,
    unit: mat.unit,
    price: Math.round(mat.price * (1 + priceVariation) * 100) / 100,
    source: sources[i % sources.length],
    priceDate: i < 60 ? '2025-12' : '2025-11',
    region: regions[i % regions.length],
    pushStatus: statuses[i % statuses.length],
    relatedProject: i % 3 === 0 ? `项目${Math.floor(i / 3) + 1}` : undefined,
    createdAt: `2025-${i < 60 ? '12' : '11'}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 10))}:${String(i % 60).padStart(2, '0')}:00`,
  })
}

/**
 * 获取材料采集文件列表
 */
export function getMockMaterialFiles(params: {
  keyword?: string
  sourceChannel?: string
  page: number
  pageSize: number
}): { items: MaterialCollectFileDTO[]; total: number } {
  let filtered = [...mockMaterialFiles]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter((f) => f.fileName.toLowerCase().includes(kw))
  }

  if (params.sourceChannel) {
    filtered = filtered.filter((f) => f.sourceChannel === params.sourceChannel)
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}

/**
 * 获取材料记录列表
 */
export function getMockMaterialRecords(fileId: string): MaterialRecordDTO[] {
  return mockMaterialRecords[fileId] || []
}

/**
 * 获取个人材料列表
 */
export function getMockPersonalMaterialList(params: {
  keyword?: string
  source?: string
  status?: string
  region?: string
  page: number
  pageSize: number
}): { items: PersonalMaterialDTO[]; total: number } {
  let filtered = [...mockPersonalMaterials]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (m) =>
        m.materialName.toLowerCase().includes(kw) ||
        m.specification.toLowerCase().includes(kw)
    )
  }

  if (params.source) {
    filtered = filtered.filter((m) => m.source === params.source)
  }

  if (params.status) {
    filtered = filtered.filter((m) => m.pushStatus === params.status)
  }

  if (params.region) {
    const regionFilter = params.region
    filtered = filtered.filter((m) => m.region.includes(regionFilter))
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}

/**
 * 获取材料采集统计
 */
export function getMockMaterialCollectStats() {
  return {
    totalFiles: mockMaterialFiles.length,
    pendingFiles: mockMaterialFiles.filter((f) => f.status === 'pending').length,
    completedFiles: mockMaterialFiles.filter((f) => f.status === 'completed').length,
  }
}
