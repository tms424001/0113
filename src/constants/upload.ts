// src/constants/upload.ts
// 采集上传模块常量定义

import type { FileFormatInfo } from '@/types/dto.upload'

// ============================================================================
// 支持的文件格式
// ============================================================================

export const FILE_FORMATS: FileFormatInfo[] = [
  // 广联达
  { code: 'gbq4', name: 'GBQ4', software: '广联达', extensions: ['gbq4'] },
  { code: 'gbq5', name: 'GBQ5', software: '广联达', extensions: ['gbq5'] },
  { code: 'gbq6', name: 'GBQ6', software: '广联达', extensions: ['gbq6'] },
  { code: 'gbq7', name: 'GBQ7', software: '广联达', extensions: ['gbq7'] },
  { code: 'gsc6', name: 'GSC6', software: '广联达', extensions: ['gsc6'] },
  { code: 'gtb4', name: 'GTB4', software: '广联达', extensions: ['gtb4'] },
  { code: 'gzb4', name: 'GZB4', software: '广联达', extensions: ['gzb4'] },
  { code: 'gbg9', name: 'GBG9', software: '广联达', extensions: ['gbg9'] },

  // 宏业
  { code: 'gcfx', name: 'GCFX', software: '宏业', extensions: ['gcfx'] },
  { code: 'gcfg', name: 'GCFG', software: '宏业', extensions: ['gcfg'] },

  // 同望
  { code: 'ecb', name: 'ECB', software: '同望', extensions: ['ecb'] },
  { code: 'ecp', name: 'ECP', software: '同望', extensions: ['ecp'] },
  { code: 'ecbt', name: 'ECBT', software: '同望', extensions: ['ecbt'] },
  { code: 'ecpt', name: 'ECPT', software: '同望', extensions: ['ecpt'] },

  // 易达
  { code: 'yqgm', name: 'YQGM', software: '易达', extensions: ['yqgm'] },
  { code: 'ypgm', name: 'YPGM', software: '易达', extensions: ['ypgm'] },
  { code: 'ypgs', name: 'YPGS', software: '易达', extensions: ['ypgs'] },
  { code: 'yqgs', name: 'YQGS', software: '易达', extensions: ['yqgs'] },

  // 斯维尔
  { code: 'qdg3', name: 'QDG3', software: '斯维尔', extensions: ['qdg3'] },
  { code: 'qdg4', name: 'QDG4', software: '斯维尔', extensions: ['qdg4'] },
  { code: 'qdy3', name: 'QDY3', software: '斯维尔', extensions: ['qdy3'] },
  { code: 'qdy4', name: 'QDY4', software: '斯维尔', extensions: ['qdy4'] },

  // 博微
  { code: 'sqd8', name: 'SQD8', software: '博微', extensions: ['sqd8'] },
  { code: 'bwpw', name: 'BWPW', software: '博微', extensions: ['bwpw'] },
  { code: 'bwsd7', name: 'BWSD7', software: '博微', extensions: ['bwsd7'] },

  // 新标杆
  { code: 'nxm', name: 'NXM', software: '新标杆', extensions: ['nxm'] },
  { code: 'zjxm', name: 'ZJXM', software: '新标杆', extensions: ['zjxm'] },

  // 纵横
  { code: 'shn', name: 'SHN', software: '纵横', extensions: ['shn'] },

  // 通用格式
  { code: 'xlsx', name: 'Excel', software: '通用', extensions: ['xlsx', 'xls'] },
  { code: 'zip', name: '压缩包', software: '通用', extensions: ['zip', 'rar'] },
]

// ============================================================================
// 支持的文件扩展名（用于上传组件）
// ============================================================================

export const SUPPORTED_EXTENSIONS = FILE_FORMATS.flatMap((f) => f.extensions)

export const ACCEPT_STRING = SUPPORTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')

// ============================================================================
// 计价类型选项
// ============================================================================

export const PRICING_TYPE_OPTIONS = [
  { value: 'list', label: '清单计价' },
  { value: 'quota', label: '定额计价' },
]

// ============================================================================
// 综合单价构成选项
// ============================================================================

export const COMPOSITE_PRICE_TYPE_OPTIONS = [
  { value: 'full', label: '全费用' },
  { value: 'partial', label: '非全费用' },
]

// ============================================================================
// 省市区数据（简化版，实际应从后端获取或使用完整数据）
// ============================================================================

export const REGION_OPTIONS = [
  {
    value: '四川省',
    label: '四川省',
    children: [
      {
        value: '成都市',
        label: '成都市',
        children: [
          { value: '锦江区', label: '锦江区' },
          { value: '青羊区', label: '青羊区' },
          { value: '金牛区', label: '金牛区' },
          { value: '武侯区', label: '武侯区' },
          { value: '成华区', label: '成华区' },
          { value: '龙泉驿区', label: '龙泉驿区' },
          { value: '青白江区', label: '青白江区' },
          { value: '新都区', label: '新都区' },
          { value: '温江区', label: '温江区' },
          { value: '双流区', label: '双流区' },
          { value: '郫都区', label: '郫都区' },
        ],
      },
      {
        value: '绵阳市',
        label: '绵阳市',
        children: [
          { value: '涪城区', label: '涪城区' },
          { value: '游仙区', label: '游仙区' },
          { value: '安州区', label: '安州区' },
        ],
      },
    ],
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' },
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '丰台区', label: '丰台区' },
        ],
      },
    ],
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '黄浦区', label: '黄浦区' },
          { value: '徐汇区', label: '徐汇区' },
          { value: '长宁区', label: '长宁区' },
          { value: '静安区', label: '静安区' },
          { value: '普陀区', label: '普陀区' },
          { value: '浦东新区', label: '浦东新区' },
        ],
      },
    ],
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '天河区', label: '天河区' },
          { value: '越秀区', label: '越秀区' },
          { value: '海珠区', label: '海珠区' },
          { value: '荔湾区', label: '荔湾区' },
          { value: '白云区', label: '白云区' },
        ],
      },
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '福田区', label: '福田区' },
          { value: '罗湖区', label: '罗湖区' },
          { value: '南山区', label: '南山区' },
          { value: '宝安区', label: '宝安区' },
          { value: '龙岗区', label: '龙岗区' },
        ],
      },
    ],
  },
]

// ============================================================================
// 文件大小限制
// ============================================================================

export const MAX_FILE_SIZE_MB = 500

// ============================================================================
// 解析状态轮询间隔（毫秒）
// ============================================================================

export const PARSE_POLL_INTERVAL = 1000

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 根据文件扩展名获取格式信息
 */
export function getFormatByExtension(extension: string): FileFormatInfo | undefined {
  const ext = extension.toLowerCase().replace('.', '')
  return FILE_FORMATS.find((f) => f.extensions.includes(ext))
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

/**
 * 格式化金额（万元）
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
