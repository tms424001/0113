// src/mocks/pricingCollect.ts
// 造价文件采集 Mock 数据

import type {
  PricingCollectFileDTO,
  PricingRecordDTO,
  PersonalPricingDTO,
  PricingSourceChannel,
  PricingRecordType,
  PricingExtractFileDTO,
} from '@/types/pricingCollect'

/**
 * Mock 造价采集文件列表
 */
export const mockPricingFiles: PricingCollectFileDTO[] = [
  {
    id: 'pf_001',
    fileName: 'XX住宅项目_土建.gqs',
    sourceChannel: 'pricing',
    status: 'completed',
    projectName: 'XX住宅项目',
    fileType: '土建',
    recordCount: 156,
    mappedCount: 142,
    priceDate: '2025-12',
    region: '武汉',
    uploadTime: '2025-12-15 10:30:00',
    uploadBy: '张三',
  },
  {
    id: 'pf_002',
    fileName: 'XX商业综合体_安装.gqs',
    sourceChannel: 'quality',
    status: 'completed',
    projectName: 'XX商业综合体',
    fileType: '安装',
    recordCount: 89,
    mappedCount: 85,
    priceDate: '2025-12',
    region: '武汉',
    uploadTime: '2025-12-14 14:20:00',
    uploadBy: '李四',
  },
  {
    id: 'pf_003',
    fileName: 'XX学校项目_土建.gqs',
    sourceChannel: 'estimation',
    status: 'processing',
    projectName: 'XX学校项目',
    fileType: '土建',
    recordCount: 234,
    mappedCount: 120,
    priceDate: '2025-12',
    region: '成都',
    uploadTime: '2025-12-13 09:15:00',
    uploadBy: '王五',
  },
  {
    id: 'pf_004',
    fileName: 'XX医院项目_安装.gqs',
    sourceChannel: 'collect',
    status: 'pending',
    projectName: 'XX医院项目',
    fileType: '安装',
    recordCount: 178,
    mappedCount: 0,
    priceDate: '2025-11',
    region: '上海',
    uploadTime: '2025-12-12 16:45:00',
    uploadBy: '赵六',
  },
  {
    id: 'pf_005',
    fileName: 'XX办公楼_装饰.gqs',
    sourceChannel: 'pricing',
    status: 'failed',
    projectName: 'XX办公楼',
    fileType: '装饰',
    recordCount: 0,
    mappedCount: 0,
    priceDate: '2025-11',
    region: '武汉',
    uploadTime: '2025-12-11 11:30:00',
    uploadBy: '钱七',
    remark: '文件格式错误',
  },
]

/**
 * Mock 造价记录数据（按文件分组）
 */
const mockPricingRecords: Record<string, PricingRecordDTO[]> = {
  pf_001: [
    {
      id: 'pr_001',
      fileId: 'pf_001',
      source: 'pricing',
      recordType: 'boq',
      code: '010101001001',
      name: '土方开挖',
      specification: '人工挖土方，深度≤1.5m',
      standardCode: '010101001001',
      standardName: '人工挖土方',
      standardSpec: '深度≤1.5m',
      unit: 'm³',
      quantity: 1250.5,
      unitPrice: 45.8,
      totalPrice: 57272.9,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_002',
      fileId: 'pf_001',
      source: 'pricing',
      recordType: 'boq',
      code: '010102001001',
      name: '土方回填',
      specification: '人工回填土方，夯实',
      standardCode: '010102001001',
      standardName: '人工回填土方',
      standardSpec: '夯实',
      unit: 'm³',
      quantity: 856.3,
      unitPrice: 32.5,
      totalPrice: 27829.75,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_003',
      fileId: 'pf_001',
      source: 'pricing',
      recordType: 'material',
      code: 'C001',
      name: 'C30商品混凝土',
      specification: '泵送',
      standardName: '商品混凝土',
      standardSpec: 'C30 泵送',
      unit: 'm³',
      quantity: 2350.0,
      unitPrice: 520.0,
      totalPrice: 1222000.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_004',
      fileId: 'pf_001',
      source: 'pricing',
      recordType: 'material',
      code: 'S001',
      name: 'HRB400螺纹钢',
      specification: 'φ12mm',
      unit: 't',
      quantity: 125.6,
      unitPrice: 3920.0,
      totalPrice: 492352.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'pending',
    },
    {
      id: 'pr_005',
      fileId: 'pf_001',
      source: 'pricing',
      recordType: 'labor',
      code: 'L001',
      name: '普通技工',
      specification: '日工资',
      standardName: '技术工人',
      standardSpec: '普通',
      unit: '工日',
      quantity: 3500.0,
      unitPrice: 280.0,
      totalPrice: 980000.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_006',
      fileId: 'pf_001',
      source: 'pricing',
      recordType: 'machine',
      code: 'M001',
      name: '塔式起重机',
      specification: 'QTZ63',
      unit: '台班',
      quantity: 180.0,
      unitPrice: 1250.0,
      totalPrice: 225000.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'pending',
    },
  ],
  pf_002: [
    {
      id: 'pr_101',
      fileId: 'pf_002',
      source: 'quality',
      recordType: 'boq',
      code: '030101001001',
      name: '给水管道安装',
      specification: 'PPR DN25',
      standardCode: '030101001001',
      standardName: 'PPR给水管安装',
      standardSpec: 'DN25',
      unit: 'm',
      quantity: 2560.0,
      unitPrice: 35.5,
      totalPrice: 90880.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_102',
      fileId: 'pf_002',
      source: 'quality',
      recordType: 'boq',
      code: '030201001001',
      name: '排水管道安装',
      specification: 'PVC DN110',
      standardCode: '030201001001',
      standardName: 'PVC排水管安装',
      standardSpec: 'DN110',
      unit: 'm',
      quantity: 1890.0,
      unitPrice: 48.0,
      totalPrice: 90720.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_103',
      fileId: 'pf_002',
      source: 'quality',
      recordType: 'material',
      code: 'P001',
      name: 'PPR给水管',
      specification: 'DN25 S3.2',
      standardName: 'PPR冷热水管',
      standardSpec: 'DN25',
      unit: 'm',
      quantity: 2800.0,
      unitPrice: 12.8,
      totalPrice: 35840.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'mapped',
    },
    {
      id: 'pr_104',
      fileId: 'pf_002',
      source: 'quality',
      recordType: 'material',
      code: 'P002',
      name: 'PVC排水管',
      specification: 'DN110',
      unit: 'm',
      quantity: 2100.0,
      unitPrice: 18.5,
      totalPrice: 38850.0,
      priceDate: '2025-12',
      region: '武汉',
      mappingStatus: 'pending',
    },
  ],
  pf_003: [
    {
      id: 'pr_201',
      fileId: 'pf_003',
      source: 'estimation',
      recordType: 'boq',
      code: '010501001001',
      name: '现浇混凝土柱',
      specification: 'C30, 矩形柱',
      unit: 'm³',
      quantity: 456.8,
      unitPrice: 680.0,
      totalPrice: 310624.0,
      priceDate: '2025-12',
      region: '成都',
      mappingStatus: 'pending',
    },
    {
      id: 'pr_202',
      fileId: 'pf_003',
      source: 'estimation',
      recordType: 'boq',
      code: '010502001001',
      name: '现浇混凝土梁',
      specification: 'C30, 矩形梁',
      unit: 'm³',
      quantity: 789.2,
      unitPrice: 720.0,
      totalPrice: 568224.0,
      priceDate: '2025-12',
      region: '成都',
      mappingStatus: 'pending',
    },
    {
      id: 'pr_203',
      fileId: 'pf_003',
      source: 'estimation',
      recordType: 'material',
      code: 'C002',
      name: 'C30混凝土',
      specification: '泵送',
      standardName: '商品混凝土',
      standardSpec: 'C30',
      unit: 'm³',
      quantity: 1580.0,
      unitPrice: 510.0,
      totalPrice: 805800.0,
      priceDate: '2025-12',
      region: '成都',
      mappingStatus: 'mapped',
    },
  ],
}

/**
 * Mock 个人造价数据
 */
const mockPersonalPricingData: PersonalPricingDTO[] = []

// 生成个人造价数据
const sources: PricingSourceChannel[] = ['pricing', 'quality', 'estimation', 'collect']
const recordTypes: PricingRecordType[] = ['boq', 'material', 'labor', 'machine', 'measure']
const statuses = ['draft', 'pending', 'approved', 'rejected'] as const
const regions = ['武汉', '成都', '上海', '宜昌']

const pricingItems = [
  { code: '010101001001', name: '土方开挖', spec: '人工挖土方', unit: 'm³', price: 45.8 },
  { code: '010102001001', name: '土方回填', spec: '人工回填', unit: 'm³', price: 32.5 },
  { code: '010501001001', name: '现浇混凝土柱', spec: 'C30矩形柱', unit: 'm³', price: 680.0 },
  { code: '010502001001', name: '现浇混凝土梁', spec: 'C30矩形梁', unit: 'm³', price: 720.0 },
  { code: '010503001001', name: '现浇混凝土板', spec: 'C30', unit: 'm³', price: 650.0 },
  { code: 'C001', name: '商品混凝土', spec: 'C30泵送', unit: 'm³', price: 520.0 },
  { code: 'C002', name: '商品混凝土', spec: 'C35泵送', unit: 'm³', price: 545.0 },
  { code: 'S001', name: 'HRB400螺纹钢', spec: 'φ12mm', unit: 't', price: 3920.0 },
  { code: 'S002', name: 'HRB400螺纹钢', spec: 'φ16mm', unit: 't', price: 3880.0 },
  { code: 'L001', name: '普通技工', spec: '日工资', unit: '工日', price: 280.0 },
  { code: 'L002', name: '高级技工', spec: '日工资', unit: '工日', price: 350.0 },
  { code: 'M001', name: '塔式起重机', spec: 'QTZ63', unit: '台班', price: 1250.0 },
  { code: 'M002', name: '混凝土泵车', spec: '56m', unit: '台班', price: 2800.0 },
]

const fileNames = [
  'XX住宅项目_土建.gqs',
  'XX商业综合体_安装.gqs',
  'XX学校项目_土建.gqs',
  'XX医院项目_安装.gqs',
]

for (let i = 0; i < 100; i++) {
  const item = pricingItems[i % pricingItems.length]
  const priceVariation = (Math.random() - 0.5) * 0.1 // ±5%
  const recordType = i < 50 ? recordTypes[i % 2] : recordTypes[(i % 3) + 2] // 前50条是boq/material，后50条是labor/machine/measure

  mockPersonalPricingData.push({
    id: `pp_${String(i + 1).padStart(3, '0')}`,
    recordType: recordType,
    code: item.code,
    name: item.name,
    specification: item.spec,
    unit: item.unit,
    unitPrice: Math.round(item.price * (1 + priceVariation) * 100) / 100,
    source: sources[i % sources.length],
    sourceFileName: fileNames[i % fileNames.length],
    priceDate: i < 50 ? '2025-12' : '2025-11',
    region: regions[i % regions.length],
    pushStatus: statuses[i % statuses.length],
    relatedProject: i % 3 === 0 ? `项目${Math.floor(i / 3) + 1}` : undefined,
    createdAt: `2025-${i < 50 ? '12' : '11'}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 10))}:${String(i % 60).padStart(2, '0')}:00`,
    updatedAt: `2025-${i < 50 ? '12' : '11'}-${String((i % 28) + 1).padStart(2, '0')} ${String(10 + (i % 8))}:${String((i + 30) % 60).padStart(2, '0')}:00`,
  })
}

/**
 * Mock 造价文件提取列表（用于从造价文件提取数据）
 */
export const mockPricingExtractFiles: PricingExtractFileDTO[] = [
  {
    id: 'pe_001',
    fileName: 'XX住宅项目_土建.gqs',
    projectName: 'XX住宅项目',
    uploadTime: '2025-12-15 10:30:00',
    boqCount: 89,
    materialCount: 45,
    laborCount: 12,
    machineCount: 10,
    extractStatus: 'completed',
  },
  {
    id: 'pe_002',
    fileName: 'XX商业综合体_安装.gqs',
    projectName: 'XX商业综合体',
    uploadTime: '2025-12-14 14:20:00',
    boqCount: 56,
    materialCount: 28,
    laborCount: 8,
    machineCount: 5,
    extractStatus: 'completed',
  },
  {
    id: 'pe_003',
    fileName: 'XX学校项目_土建.gqs',
    projectName: 'XX学校项目',
    uploadTime: '2025-12-13 09:15:00',
    boqCount: 120,
    materialCount: 78,
    laborCount: 20,
    machineCount: 16,
    extractStatus: 'extracting',
  },
  {
    id: 'pe_004',
    fileName: 'XX医院项目_安装.gqs',
    projectName: 'XX医院项目',
    uploadTime: '2025-12-12 16:45:00',
    boqCount: 0,
    materialCount: 0,
    laborCount: 0,
    machineCount: 0,
    extractStatus: 'pending',
  },
]

// ============================================================================
// 查询函数
// ============================================================================

/**
 * 获取造价采集文件列表
 */
export function getMockPricingFiles(params: {
  keyword?: string
  sourceChannel?: string
  page: number
  pageSize: number
}): { items: PricingCollectFileDTO[]; total: number } {
  let filtered = [...mockPricingFiles]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (f) =>
        f.fileName.toLowerCase().includes(kw) ||
        f.projectName?.toLowerCase().includes(kw)
    )
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
 * 获取造价记录列表
 */
export function getMockPricingRecords(
  fileId: string,
  params?: {
    keyword?: string
    recordType?: string
    mappingStatus?: string
  }
): PricingRecordDTO[] {
  let records = mockPricingRecords[fileId] || []

  if (params?.keyword) {
    const kw = params.keyword.toLowerCase()
    records = records.filter(
      (r) =>
        r.name.toLowerCase().includes(kw) ||
        r.code.toLowerCase().includes(kw) ||
        r.specification.toLowerCase().includes(kw)
    )
  }

  if (params?.recordType) {
    records = records.filter((r) => r.recordType === params.recordType)
  }

  if (params?.mappingStatus) {
    records = records.filter((r) => r.mappingStatus === params.mappingStatus)
  }

  return records
}

/**
 * 获取个人造价数据列表
 */
export function getMockPersonalPricingList(params: {
  keyword?: string
  source?: string
  recordType?: string
  status?: string
  region?: string
  page: number
  pageSize: number
}): { items: PersonalPricingDTO[]; total: number } {
  let filtered = [...mockPersonalPricingData]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.code.toLowerCase().includes(kw) ||
        p.specification.toLowerCase().includes(kw)
    )
  }

  if (params.source) {
    filtered = filtered.filter((p) => p.source === params.source)
  }

  if (params.recordType) {
    filtered = filtered.filter((p) => p.recordType === params.recordType)
  }

  if (params.status) {
    filtered = filtered.filter((p) => p.pushStatus === params.status)
  }

  if (params.region) {
    filtered = filtered.filter((p) => p.region.includes(params.region))
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}

/**
 * 获取造价采集统计
 */
export function getMockPricingCollectStats() {
  const totalFiles = mockPricingFiles.length
  const pendingFiles = mockPricingFiles.filter(
    (f) => f.status === 'pending' || f.status === 'processing'
  ).length
  const completedFiles = mockPricingFiles.filter((f) => f.status === 'completed').length

  // 计算总记录数和已映射数
  let totalRecords = 0
  let mappedRecords = 0
  mockPricingFiles.forEach((f) => {
    totalRecords += f.recordCount
    mappedRecords += f.mappedCount
  })

  return {
    totalFiles,
    pendingFiles,
    completedFiles,
    totalRecords,
    mappedRecords,
  }
}

/**
 * 获取造价文件提取列表
 */
export function getMockPricingExtractFiles(params: {
  keyword?: string
  page: number
  pageSize: number
}): { items: PricingExtractFileDTO[]; total: number } {
  let filtered = [...mockPricingExtractFiles]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (f) =>
        f.fileName.toLowerCase().includes(kw) ||
        f.projectName.toLowerCase().includes(kw)
    )
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total }
}
