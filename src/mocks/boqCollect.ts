// src/mocks/boqCollect.ts
// 清单数据采集 Mock 数据

import type { BOQCollectFileDTO, BOQRecordDTO, BOQPricingFileDTO } from '@/types/boqCollect'
import { BOQSourceChannel, BOQCollectFileStatus, BOQMappingStatus } from '@/types/boqCollect'

/**
 * Mock 清单采集文件列表
 */
export const mockBOQFiles: BOQCollectFileDTO[] = [
  {
    id: 'bf_001',
    fileName: '供应商报价_华润水泥_202512.xlsx',
    sourceChannel: BOQSourceChannel.SUPPLIER_QUOTE,
    uploadTime: '2025-12-15 10:30:00',
    priceDate: '2025-12',
    recordCount: 45,
    mappedCount: 45,
    status: BOQCollectFileStatus.COMPLETED,
    createdBy: '张三',
  },
  {
    id: 'bf_002',
    fileName: '合同价_钢材_202512.xlsx',
    sourceChannel: BOQSourceChannel.CONTRACT_PRICE,
    uploadTime: '2025-12-14 14:20:00',
    priceDate: '2025-12',
    recordCount: 89,
    mappedCount: 75,
    status: BOQCollectFileStatus.COMPLETED,
    createdBy: '李四',
  },
  {
    id: 'bf_003',
    fileName: '其他来源_建材网_202512.xlsx',
    sourceChannel: BOQSourceChannel.OTHER,
    uploadTime: '2025-12-13 09:15:00',
    priceDate: '2025-12',
    recordCount: 156,
    mappedCount: 120,
    status: BOQCollectFileStatus.PROCESSING,
    createdBy: '王五',
  },
  {
    id: 'bf_004',
    fileName: '供应商报价_XX项目_202511.xlsx',
    sourceChannel: BOQSourceChannel.SUPPLIER_QUOTE,
    uploadTime: '2025-12-12 16:45:00',
    priceDate: '2025-11',
    recordCount: 328,
    mappedCount: 280,
    status: BOQCollectFileStatus.COMPLETED,
    createdBy: '赵六',
  },
  {
    id: 'bf_005',
    fileName: '其他来源_市场调研_202511.xlsx',
    sourceChannel: BOQSourceChannel.OTHER,
    uploadTime: '2025-12-11 11:30:00',
    priceDate: '2025-11',
    recordCount: 67,
    mappedCount: 0,
    status: BOQCollectFileStatus.PENDING,
    createdBy: '钱七',
  },
]

/**
 * Mock 清单记录数据
 */
const mockBOQRecordsMap: Record<string, BOQRecordDTO[]> = {
  bf_001: [
    {
      id: 'br_001_1',
      fileId: 'bf_001',
      source: BOQSourceChannel.SUPPLIER_QUOTE,
      code: '010101001001',
      name: '土石方/场地平整',
      specification: '人工平整场地',
      unit: 'm²',
      quantity: 1000,
      unitPrice: 8.5,
      totalPrice: 8500,
      standardCode: '010101001001',
      standardName: '土石方/场地平整',
      standardSpec: '人工平整场地',
      mappingStatus: BOQMappingStatus.MAPPED,
      priceDate: '2025-12',
      region: '武汉',
    },
    {
      id: 'br_001_2',
      fileId: 'bf_001',
      source: BOQSourceChannel.SUPPLIER_QUOTE,
      code: '010101002001',
      name: '土石方/挖土方',
      specification: '挖一般土方',
      unit: 'm³',
      quantity: 500,
      unitPrice: 25.0,
      totalPrice: 12500,
      standardCode: '010101002001',
      standardName: '土石方/挖土方',
      standardSpec: '挖一般土方',
      mappingStatus: BOQMappingStatus.MAPPED,
      priceDate: '2025-12',
      region: '武汉',
    },
    {
      id: 'br_001_3',
      fileId: 'bf_001',
      source: BOQSourceChannel.SUPPLIER_QUOTE,
      code: '010102001001',
      name: '土石方/挖土方',
      specification: '挖沟槽土方',
      unit: 'm³',
      quantity: 200,
      unitPrice: 32.0,
      totalPrice: 6400,
      mappingStatus: BOQMappingStatus.PENDING,
      priceDate: '2025-12',
      region: '武汉',
    },
    {
      id: 'br_001_4',
      fileId: 'bf_001',
      source: BOQSourceChannel.SUPPLIER_QUOTE,
      code: '010103001001',
      name: '土石方/回填土方',
      specification: '回填土方',
      unit: 'm³',
      quantity: 300,
      unitPrice: 18.0,
      totalPrice: 5400,
      standardCode: '010103001001',
      standardName: '土石方/回填土方',
      standardSpec: '回填土方',
      mappingStatus: BOQMappingStatus.MAPPED,
      priceDate: '2025-12',
      region: '武汉',
    },
    {
      id: 'br_001_5',
      fileId: 'bf_001',
      source: BOQSourceChannel.SUPPLIER_QUOTE,
      code: '010201001001',
      name: '砌筑/砖砌体',
      specification: 'MU10烧结普通砖',
      unit: 'm³',
      quantity: 150,
      unitPrice: 380.0,
      totalPrice: 57000,
      standardCode: '010201001001',
      standardName: '砌筑/砖砌体',
      standardSpec: 'MU10烧结普通砖',
      mappingStatus: BOQMappingStatus.MAPPED,
      priceDate: '2025-12',
      region: '武汉',
    },
  ],
  bf_002: [
    {
      id: 'br_002_1',
      fileId: 'bf_002',
      source: BOQSourceChannel.CONTRACT_PRICE,
      code: '010301001001',
      name: '混凝土及钢筋混凝土/现浇混凝土',
      specification: 'C30混凝土',
      unit: 'm³',
      quantity: 800,
      unitPrice: 520.0,
      totalPrice: 416000,
      standardCode: '010301001001',
      standardName: '混凝土及钢筋混凝土/现浇混凝土',
      standardSpec: 'C30混凝土',
      mappingStatus: BOQMappingStatus.MAPPED,
      priceDate: '2025-12',
      region: '武汉',
    },
    {
      id: 'br_002_2',
      fileId: 'bf_002',
      source: BOQSourceChannel.CONTRACT_PRICE,
      code: '010302001001',
      name: '混凝土及钢筋混凝土/钢筋',
      specification: 'HRB400 Φ12',
      unit: 't',
      quantity: 50,
      unitPrice: 4200.0,
      totalPrice: 210000,
      mappingStatus: BOQMappingStatus.PENDING,
      priceDate: '2025-12',
      region: '武汉',
    },
  ],
}

/**
 * 获取清单采集文件列表
 */
export function getMockBOQFiles(params: {
  keyword?: string
  sourceChannel?: string
  page: number
  pageSize: number
}): { items: BOQCollectFileDTO[]; total: number } {
  let filtered = [...mockBOQFiles]

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
 * 获取清单记录列表
 */
export function getMockBOQRecords(fileId: string): BOQRecordDTO[] {
  return mockBOQRecordsMap[fileId] || []
}

/**
 * 获取清单采集统计
 */
export function getMockBOQCollectStats() {
  const totalFiles = mockBOQFiles.length
  const pendingFiles = mockBOQFiles.filter(
    (f) => f.status === BOQCollectFileStatus.PENDING || f.status === BOQCollectFileStatus.PROCESSING
  ).length
  const completedFiles = mockBOQFiles.filter(
    (f) => f.status === BOQCollectFileStatus.COMPLETED
  ).length

  return { totalFiles, pendingFiles, completedFiles }
}

/**
 * Mock 造价文件列表（用于清单提取）
 */
export const mockBOQPricingFiles: BOQPricingFileDTO[] = [
  {
    id: 'bpf_001',
    fileName: 'XX住宅项目_土建.gqs',
    projectName: 'XX住宅项目',
    uploadTime: '2025-12-15 10:30:00',
    boqCount: 256,
    extractStatus: 'completed',
  },
  {
    id: 'bpf_002',
    fileName: 'XX商业综合体_安装.gqs',
    projectName: 'XX商业综合体',
    uploadTime: '2025-12-14 14:20:00',
    boqCount: 189,
    extractStatus: 'completed',
  },
  {
    id: 'bpf_003',
    fileName: 'XX学校项目_土建.gqs',
    projectName: 'XX学校项目',
    uploadTime: '2025-12-13 09:15:00',
    boqCount: 0,
    extractStatus: 'pending',
  },
  {
    id: 'bpf_004',
    fileName: 'XX医院项目_安装.gqs',
    projectName: 'XX医院项目',
    uploadTime: '2025-12-12 16:45:00',
    boqCount: 78,
    extractStatus: 'extracting',
  },
  {
    id: 'bpf_005',
    fileName: 'XX办公楼_装饰.gqs',
    projectName: 'XX办公楼',
    uploadTime: '2025-12-11 11:30:00',
    boqCount: 0,
    extractStatus: 'failed',
  },
]
