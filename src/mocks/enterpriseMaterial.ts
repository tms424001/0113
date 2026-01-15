// src/mocks/enterpriseMaterial.ts
// 企业材料库 Mock 数据

import type {
  CategoryNode,
  L3Attribute,
  MaterialListItem,
  MaterialDetail,
  TrendDataPoint,
  SampleItem,
} from '@/pages/assets/enterprise/MaterialsPage/types'

/**
 * 材料分类树 Mock 数据
 */
export const mockCategoryTree: CategoryNode[] = [
  {
    id: 'all',
    name: '全部材料',
    parentId: null,
    level: 0,
    count: 156892,
    children: [
      {
        id: 'civil',
        name: '土建材料',
        parentId: 'all',
        level: 1,
        count: 89562,
        children: [
          {
            id: 'steel',
            name: '钢材',
            parentId: 'civil',
            level: 2,
            count: 23456,
            children: [
              { id: 'rebar', name: '钢筋', parentId: 'steel', level: 3, count: 8956, isLeaf: true },
              { id: 'steel-plate', name: '钢板', parentId: 'steel', level: 3, count: 5623, isLeaf: true },
              { id: 'steel-pipe', name: '钢管', parentId: 'steel', level: 3, count: 4521, isLeaf: true },
              { id: 'profile-steel', name: '型钢', parentId: 'steel', level: 3, count: 4356, isLeaf: true },
            ],
          },
          {
            id: 'cement',
            name: '水泥',
            parentId: 'civil',
            level: 2,
            count: 12345,
            children: [
              { id: 'portland', name: '硅酸盐水泥', parentId: 'cement', level: 3, count: 6789, isLeaf: true },
              { id: 'slag', name: '�ite渣水泥', parentId: 'cement', level: 3, count: 3456, isLeaf: true },
              { id: 'composite', name: '复合水泥', parentId: 'cement', level: 3, count: 2100, isLeaf: true },
            ],
          },
          {
            id: 'concrete',
            name: '混凝土',
            parentId: 'civil',
            level: 2,
            count: 18765,
            isLeaf: true,
          },
          {
            id: 'sand-gravel',
            name: '砂石',
            parentId: 'civil',
            level: 2,
            count: 8956,
            isLeaf: true,
          },
        ],
      },
      {
        id: 'install',
        name: '安装材料',
        parentId: 'all',
        level: 1,
        count: 45678,
        children: [
          { id: 'pipe', name: '管材', parentId: 'install', level: 2, count: 15678, isLeaf: true },
          { id: 'wire', name: '电线电缆', parentId: 'install', level: 2, count: 12345, isLeaf: true },
          { id: 'valve', name: '阀门', parentId: 'install', level: 2, count: 8956, isLeaf: true },
          { id: 'fitting', name: '管件', parentId: 'install', level: 2, count: 8699, isLeaf: true },
        ],
      },
      {
        id: 'decoration',
        name: '装饰材料',
        parentId: 'all',
        level: 1,
        count: 21652,
        children: [
          { id: 'tile', name: '瓷砖', parentId: 'decoration', level: 2, count: 8956, isLeaf: true },
          { id: 'paint', name: '涂料', parentId: 'decoration', level: 2, count: 6789, isLeaf: true },
          { id: 'floor', name: '地板', parentId: 'decoration', level: 2, count: 5907, isLeaf: true },
        ],
      },
    ],
  },
]

/**
 * L3 属性筛选配置
 */
export const mockL3Attributes: Record<string, L3Attribute[]> = {
  rebar: [
    {
      key: 'grade',
      label: '牌号',
      options: [
        { value: 'HRB400', label: 'HRB400' },
        { value: 'HRB500', label: 'HRB500' },
        { value: 'HPB300', label: 'HPB300' },
      ],
    },
    {
      key: 'diameter',
      label: '直径',
      options: [
        { value: '6', label: 'Φ6' },
        { value: '8', label: 'Φ8' },
        { value: '10', label: 'Φ10' },
        { value: '12', label: 'Φ12' },
        { value: '14', label: 'Φ14' },
        { value: '16', label: 'Φ16' },
        { value: '18', label: 'Φ18' },
        { value: '20', label: 'Φ20' },
        { value: '22', label: 'Φ22' },
        { value: '25', label: 'Φ25' },
        { value: '28', label: 'Φ28' },
        { value: '32', label: 'Φ32' },
      ],
    },
    {
      key: 'brand',
      label: '品牌',
      options: [
        { value: 'wugang', label: '武钢' },
        { value: 'egang', label: '鄂钢' },
        { value: 'magang', label: '马钢' },
        { value: 'shagang', label: '沙钢' },
        { value: 'shougang', label: '首钢' },
      ],
    },
    {
      key: 'origin',
      label: '产地',
      options: [
        { value: 'local', label: '本地' },
        { value: 'external', label: '外地' },
      ],
    },
  ],
  concrete: [
    {
      key: 'strength',
      label: '强度等级',
      options: [
        { value: 'C15', label: 'C15' },
        { value: 'C20', label: 'C20' },
        { value: 'C25', label: 'C25' },
        { value: 'C30', label: 'C30' },
        { value: 'C35', label: 'C35' },
        { value: 'C40', label: 'C40' },
        { value: 'C45', label: 'C45' },
        { value: 'C50', label: 'C50' },
      ],
    },
    {
      key: 'type',
      label: '类型',
      options: [
        { value: 'commercial', label: '商品混凝土' },
        { value: 'pumped', label: '泵送混凝土' },
        { value: 'self-compacting', label: '自密实混凝土' },
      ],
    },
  ],
}

/**
 * 生成随机走势数据
 */
const generateTrendData = (basePrice: number): number[] => {
  const data: number[] = []
  let price = basePrice * (0.9 + Math.random() * 0.1)
  for (let i = 0; i < 12; i++) {
    price = price * (0.97 + Math.random() * 0.06)
    data.push(Math.round(price * 100) / 100)
  }
  return data
}

/**
 * 材料列表 Mock 数据
 */
export const mockMaterialList: MaterialListItem[] = [
  {
    id: 'mat-001',
    materialCode: 'MAT-2024-00156',
    materialName: '热轧带肋钢筋',
    specification: 'HRB400 Φ12',
    brand: '武钢',
    unit: 't',
    basePrice: 4100,
    compositePrice: 4250,
    deviationRate: 3.66,
    trendData: generateTrendData(4200),
    sampleCount: 156,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-002',
    materialCode: 'MAT-2024-00157',
    materialName: '热轧带肋钢筋',
    specification: 'HRB400 Φ16',
    brand: '武钢',
    unit: 't',
    basePrice: 4100,
    compositePrice: 4180,
    deviationRate: 1.95,
    trendData: generateTrendData(4150),
    sampleCount: 142,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-003',
    materialCode: 'MAT-2024-00158',
    materialName: '热轧带肋钢筋',
    specification: 'HRB500 Φ20',
    brand: '鄂钢',
    unit: 't',
    basePrice: 4300,
    compositePrice: 4520,
    deviationRate: 5.12,
    trendData: generateTrendData(4400),
    sampleCount: 98,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-004',
    materialCode: 'MAT-2024-00201',
    materialName: '商品混凝土',
    specification: 'C30 泵送',
    brand: '华新',
    unit: 'm³',
    basePrice: 480,
    compositePrice: 495,
    deviationRate: 3.13,
    trendData: generateTrendData(490),
    sampleCount: 234,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-005',
    materialCode: 'MAT-2024-00202',
    materialName: '商品混凝土',
    specification: 'C35 泵送',
    brand: '华新',
    unit: 'm³',
    basePrice: 510,
    compositePrice: 528,
    deviationRate: 3.53,
    trendData: generateTrendData(520),
    sampleCount: 189,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-006',
    materialCode: 'MAT-2024-00301',
    materialName: 'P.O42.5 硅酸盐水泥',
    specification: '袋装',
    brand: '华新',
    unit: 't',
    basePrice: 520,
    compositePrice: 545,
    deviationRate: 4.81,
    trendData: generateTrendData(535),
    sampleCount: 312,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-007',
    materialCode: 'MAT-2024-00302',
    materialName: 'P.O42.5 硅酸盐水泥',
    specification: '散装',
    brand: '华新',
    unit: 't',
    basePrice: 480,
    compositePrice: 498,
    deviationRate: 3.75,
    trendData: generateTrendData(490),
    sampleCount: 278,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-008',
    materialCode: 'MAT-2024-00401',
    materialName: '中砂',
    specification: '机制砂 细度模数2.6-3.0',
    brand: '-',
    unit: 'm³',
    basePrice: 125,
    compositePrice: 132,
    deviationRate: 5.6,
    trendData: generateTrendData(130),
    sampleCount: 156,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-009',
    materialCode: 'MAT-2024-00402',
    materialName: '碎石',
    specification: '5-25mm 连续级配',
    brand: '-',
    unit: 'm³',
    basePrice: 98,
    compositePrice: 105,
    deviationRate: 7.14,
    trendData: generateTrendData(102),
    sampleCount: 145,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
  {
    id: 'mat-010',
    materialCode: 'MAT-2024-00501',
    materialName: 'PPR给水管',
    specification: 'DN20 S3.2',
    brand: '金德',
    unit: 'm',
    basePrice: 8.5,
    compositePrice: 9.2,
    deviationRate: 8.24,
    trendData: generateTrendData(9),
    sampleCount: 89,
    status: 'approved',
    region: '武汉市',
    period: '2025-12',
    priceStage: '控制价',
  },
]

/**
 * 材料详情 Mock 数据
 */
export const getMockMaterialDetail = (id: string): MaterialDetail | null => {
  const item = mockMaterialList.find((m) => m.id === id)
  if (!item) return null

  return {
    id: item.id,
    materialCode: item.materialCode,
    materialName: item.materialName,
    specification: item.specification,
    brand: item.brand,
    origin: '本地',
    unit: item.unit,
    status: item.status,
    region: item.region,
    period: item.period,
    priceStage: item.priceStage,
    basePrice: item.basePrice,
    compositePrice: item.compositePrice,
    deviationRate: item.deviationRate,
    cvRate: 8.5,
    priceMin: item.compositePrice * 0.92,
    priceMax: item.compositePrice * 1.08,
    sampleCount: item.sampleCount,
    attributes: {
      grade: 'HRB400',
      diameter: '12',
      brand: 'wugang',
      origin: 'local',
    },
  }
}

/**
 * 历史趋势 Mock 数据
 */
export const getMockTrendHistory = (id: string): TrendDataPoint[] => {
  const item = mockMaterialList.find((m) => m.id === id)
  if (!item) return []

  const periods = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  ]

  return periods.map((period, index) => ({
    period,
    price: item.trendData[index] || item.compositePrice,
  }))
}

/**
 * 样本溯源 Mock 数据
 */
export const getMockSampleList = (id: string): SampleItem[] => {
  return [
    {
      id: 'sample-001',
      sourceName: '武汉市信息价',
      sourceType: 'info_price',
      price: 4200,
      weight: 40,
      date: '2025-12-01',
    },
    {
      id: 'sample-002',
      sourceName: '供应商A报价',
      sourceType: 'market',
      price: 4280,
      weight: 30,
      date: '2025-12-05',
    },
    {
      id: 'sample-003',
      sourceName: '供应商B报价',
      sourceType: 'market',
      price: 4320,
      weight: 20,
      date: '2025-12-08',
    },
    {
      id: 'sample-004',
      sourceName: '企业历史价',
      sourceType: 'enterprise',
      price: 4180,
      weight: 10,
      date: '2025-11-15',
    },
  ]
}

/**
 * 统计数据
 */
export const mockStatistics = {
  totalCount: 156892,
  monthlyUpdated: 2345,
}

/**
 * 地区选项
 */
export const mockRegionOptions = [
  { value: '420100', label: '武汉市' },
  { value: '420200', label: '黄石市' },
  { value: '420300', label: '十堰市' },
  { value: '420500', label: '宜昌市' },
  { value: '420600', label: '襄阳市' },
  { value: '420700', label: '鄂州市' },
  { value: '420800', label: '荆门市' },
  { value: '420900', label: '孝感市' },
  { value: '421000', label: '荆州市' },
  { value: '421100', label: '黄冈市' },
]

/**
 * 阶段选项
 */
export const mockPriceStageOptions = [
  { value: '', label: '全部阶段' },
  { value: 'control', label: '控制价' },
  { value: 'bid', label: '招标价' },
  { value: 'market', label: '市场价' },
]

/**
 * 来源选项
 */
export const mockSourceTypeOptions = [
  { value: '', label: '全部来源' },
  { value: 'info_price', label: '信息价' },
  { value: 'market', label: '市场采集' },
  { value: 'enterprise', label: '企业自定义' },
]
