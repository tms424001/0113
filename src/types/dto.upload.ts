// src/types/dto.upload.ts
// 采集上传模块 DTO 类型定义

// ============================================================================
// 文件解析状态
// ============================================================================

export type ParseStatus = 'pending' | 'parsing' | 'success' | 'failed'

// ============================================================================
// 工程树节点（解析结果预览）
// ============================================================================

export interface ParsedProjectTreeNode {
  id: string
  name: string
  type: 'project' | 'subProject' | 'unit'
  amount?: number
  children?: ParsedProjectTreeNode[]
}

// ============================================================================
// 上传文件响应
// ============================================================================

export interface UploadFileResponse {
  fileId: string
  fileName: string
  fileSize: number
  format: string              // 识别的格式代码
  formatName: string          // 格式中文名
  parseStatus: ParseStatus
}

// ============================================================================
// 解析状态响应
// ============================================================================

export interface ParseStatusResponse {
  status: ParseStatus
  progress: number            // 0-100
  result?: ParseResult
  error?: ParseError
}

export interface ParseResult {
  projectName: string         // 识别的项目名
  subProjectCount: number     // 单项工程数
  unitCount: number           // 单位工程数
  totalAmount: number         // 总金额（万元）
  structure: ParsedProjectTreeNode[]  // 工程结构预览
}

export interface ParseError {
  code: string
  message: string
}

// ============================================================================
// 已上传文件（前端状态）
// ============================================================================

export interface UploadedFile {
  fileId: string
  fileName: string
  fileSize: number
  format: string
  formatName: string
  parseStatus: ParseStatus
  parseProgress: number
  parseResult?: ParseResult
  error?: string
  uploadProgress?: number     // 上传进度 0-100
}

// ============================================================================
// 基本信息
// ============================================================================

export interface RegionInfo {
  province: string
  city: string
  district: string
}

export type PricingType = 'list' | 'quota'
export type CompositePriceType = 'full' | 'partial'

export interface BasicInfo {
  projectName: string
  region: RegionInfo
  pricingType: PricingType
  compositePriceType: CompositePriceType
}

// ============================================================================
// 开始分析请求/响应
// ============================================================================

export interface StartAnalysisRequest {
  projectName: string
  region: RegionInfo
  pricingType: PricingType
  compositePriceType: CompositePriceType
}

export interface StartAnalysisResponse {
  fileId: string
  status: 'analyzing'
  redirectUrl: string         // 跳转到标准化分析页
}

// ============================================================================
// 文件格式信息
// ============================================================================

export interface FileFormatInfo {
  code: string                // 格式代码
  name: string                // 格式名称
  software: string            // 软件名称
  extensions: string[]        // 文件扩展名
}
