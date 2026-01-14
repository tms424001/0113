// src/types/dto.project.ts
// Project 模块 DTO 定义 - 严格按照 docs/api/schemas/Project.md
// 工程层级：项目 → 单项工程 → 单位工程 → 造价文件 → 材料/清单/指标

// ============================================================================
// Type Aliases
// ============================================================================

export type ProjectType = 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'municipal' | 'other'
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type SubProjectType = 'building' | 'structure' | 'installation' | 'decoration' | 'landscape' | 'other'
export type UnitType = 'civil' | 'electrical' | 'hvac' | 'plumbing' | 'fire_protection' | 'elevator' | 'other'
export type PricingFileType = 'estimate' | 'budget' | 'settlement' | 'final_account'
export type FileSourceType = 'upload' | 'import' | 'sync' | 'manual'
export type PricingFileStatus = 'draft' | 'standardizing' | 'standardized' | 'approved' | 'archived'
export type StandardizationStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type IndexCategory = 'cost_per_area' | 'cost_per_volume' | 'material_ratio' | 'labor_ratio' | 'other'

// ============================================================================
// Project (项目)
// ============================================================================

export interface ProjectDTO {
  id: string
  name: string
  code?: string
  type: ProjectType
  status: ProjectStatus
  region?: string
  totalAmount?: number
  buildingArea?: number
  startDate?: string
  completionDate?: string
  owner?: string
  contractor?: string
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
  stats?: {
    subProjectCount: number
    unitCount: number
    fileCount: number
  }
}

export interface ProjectListQuery {
  page: number
  pageSize: number
  keyword?: string
  type?: ProjectType
  status?: ProjectStatus
  region?: string
  createdAtFrom?: string
  createdAtTo?: string
  sortBy?: 'updatedAt' | 'createdAt' | 'name' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}

export interface ProjectListResponse {
  items: ProjectDTO[]
  page: number
  pageSize: number
  total: number
}

export interface CreateProjectPayload {
  name: string
  code?: string
  type: ProjectType
  region?: string
  totalAmount?: number
  buildingArea?: number
  startDate?: string
  completionDate?: string
  owner?: string
  contractor?: string
  description?: string
  tags?: string[]
}

export interface UpdateProjectPayload {
  name?: string
  code?: string
  type?: ProjectType
  status?: ProjectStatus
  region?: string
  totalAmount?: number
  buildingArea?: number
  startDate?: string
  completionDate?: string
  owner?: string
  contractor?: string
  description?: string
  tags?: string[]
}

// ============================================================================
// SubProject (单项工程)
// ============================================================================

export interface SubProjectDTO {
  id: string
  projectId: string
  projectName?: string
  name: string
  code?: string
  type: SubProjectType
  amount?: number
  buildingArea?: number
  description?: string
  sortOrder?: number
  createdAt: string
  updatedAt: string
  stats?: {
    unitCount: number
    fileCount: number
  }
}

export interface SubProjectListQuery {
  projectId: string
  page: number
  pageSize: number
  keyword?: string
  type?: SubProjectType
  sortBy?: 'sortOrder' | 'createdAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface SubProjectListResponse {
  items: SubProjectDTO[]
  page: number
  pageSize: number
  total: number
}

export interface CreateSubProjectPayload {
  name: string
  code?: string
  type: SubProjectType
  amount?: number
  buildingArea?: number
  description?: string
  sortOrder?: number
}

export interface UpdateSubProjectPayload {
  name?: string
  code?: string
  type?: SubProjectType
  amount?: number
  buildingArea?: number
  description?: string
  sortOrder?: number
}

// ============================================================================
// Unit (单位工程)
// ============================================================================

export interface UnitDTO {
  id: string
  projectId: string
  subProjectId: string
  projectName?: string
  subProjectName?: string
  name: string
  code?: string
  type: UnitType
  amount?: number
  buildingArea?: number
  floorCount?: number
  structureType?: string
  description?: string
  sortOrder?: number
  createdAt: string
  updatedAt: string
  stats?: {
    fileCount: number
    materialCount: number
    boqCount: number
  }
}

export interface UnitListQuery {
  subProjectId: string
  page: number
  pageSize: number
  keyword?: string
  type?: UnitType
  sortBy?: 'sortOrder' | 'createdAt' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface UnitListResponse {
  items: UnitDTO[]
  page: number
  pageSize: number
  total: number
}

export interface CreateUnitPayload {
  name: string
  code?: string
  type: UnitType
  amount?: number
  buildingArea?: number
  floorCount?: number
  structureType?: string
  description?: string
  sortOrder?: number
}

export interface UpdateUnitPayload {
  name?: string
  code?: string
  type?: UnitType
  amount?: number
  buildingArea?: number
  floorCount?: number
  structureType?: string
  description?: string
  sortOrder?: number
}

// ============================================================================
// PricingFile (造价文件)
// ============================================================================

export interface PricingFileDTO {
  id: string
  projectId: string
  subProjectId: string
  unitId: string
  projectName?: string
  subProjectName?: string
  unitName?: string
  name: string
  code?: string
  fileType: PricingFileType
  sourceType: FileSourceType
  status: PricingFileStatus
  originalFileName?: string
  fileSize?: number
  fileUrl?: string
  totalAmount?: number
  laborAmount?: number
  materialAmount?: number
  machineAmount?: number
  measureAmount?: number
  standardization?: {
    status: StandardizationStatus
    materialCount?: number
    boqCount?: number
    indexCount?: number
    completedAt?: string
  }
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
}

export interface PricingFileListQuery {
  page: number
  pageSize: number
  keyword?: string
  projectId?: string
  subProjectId?: string
  unitId?: string
  fileType?: PricingFileType
  status?: PricingFileStatus
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}

export interface PricingFileListResponse {
  items: PricingFileDTO[]
  page: number
  pageSize: number
  total: number
}

// ============================================================================
// Material (材料)
// ============================================================================

export interface MaterialDTO {
  id: string
  pricingFileId: string
  unitId: string
  subProjectId: string
  projectId: string
  code?: string
  name: string
  specification?: string
  unit: string
  brand?: string
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  category?: string
  subCategory?: string
  standardCode?: string
  standardName?: string
  isStandardized: boolean
  sourceRow?: number
  createdAt: string
  updatedAt: string
}

export interface MaterialListQuery {
  page: number
  pageSize: number
  keyword?: string
  projectId?: string
  unitId?: string
  pricingFileId?: string
  category?: string
  isStandardized?: boolean
  sortBy?: 'name' | 'totalPrice' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface MaterialListResponse {
  items: MaterialDTO[]
  page: number
  pageSize: number
  total: number
}

// ============================================================================
// BOQItem (清单项)
// ============================================================================

export interface QuotaItemRef {
  quotaCode: string
  quotaName: string
  quantity: number
}

export interface BOQItemDTO {
  id: string
  pricingFileId: string
  unitId: string
  subProjectId: string
  projectId: string
  code: string
  name: string
  unit: string
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  laborPrice?: number
  materialPrice?: number
  machinePrice?: number
  level: number
  parentId?: string
  path?: string
  quotaItems?: QuotaItemRef[]
  standardCode?: string
  isStandardized: boolean
  sourceRow?: number
  createdAt: string
  updatedAt: string
}

export interface BOQItemListQuery {
  page: number
  pageSize: number
  keyword?: string
  projectId?: string
  unitId?: string
  pricingFileId?: string
  parentId?: string
  isStandardized?: boolean
  sortBy?: 'code' | 'totalPrice' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface BOQItemListResponse {
  items: BOQItemDTO[]
  page: number
  pageSize: number
  total: number
}

// ============================================================================
// Index (指标)
// ============================================================================

export interface IndexDTO {
  id: string
  pricingFileId: string
  unitId: string
  subProjectId: string
  projectId: string
  code?: string
  name: string
  category: IndexCategory
  value: number
  unit: string
  baseQuantity?: number
  baseUnit?: string
  industryAvg?: number
  deviation?: number
  description?: string
  createdAt: string
  updatedAt: string
}

export interface IndexListQuery {
  page: number
  pageSize: number
  keyword?: string
  projectId?: string
  unitId?: string
  pricingFileId?: string
  category?: IndexCategory
  sortBy?: 'name' | 'value' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface IndexListResponse {
  items: IndexDTO[]
  page: number
  pageSize: number
  total: number
}
