# Project Module DTO Schema v1.0

> 工程层级模型：项目 → 单项工程 → 单位工程 → 造价文件
> 材料/清单/指标都必须追溯到工程文件

---

## 1. 工程层级关系

```
Project (项目)
  └── SubProject (单项工程)
        └── Unit (单位工程)
              └── PricingFile (造价文件)
                    ├── Materials (材料)
                    ├── BOQItems (清单)
                    └── Indices (指标)
```

---

## 2. Project (项目)

### ProjectDTO

```ts
interface ProjectDTO {
  id: string
  name: string
  code?: string                    // 项目编号
  type: ProjectType
  status: ProjectStatus
  region?: string                  // 所在地区
  totalAmount?: number             // 总金额（万元）
  buildingArea?: number            // 建筑面积（㎡）
  startDate?: string               // 开工日期
  completionDate?: string          // 竣工日期
  owner?: string                   // 建设单位
  contractor?: string              // 施工单位
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
  // 统计
  stats?: {
    subProjectCount: number
    unitCount: number
    fileCount: number
  }
}

type ProjectType = 'residential' | 'commercial' | 'industrial' | 'infrastructure' | 'municipal' | 'other'
type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
```

### ProjectListQuery

```ts
interface ProjectListQuery {
  page: number
  pageSize: number
  keyword?: string                 // 搜索名称/编号
  type?: ProjectType
  status?: ProjectStatus
  region?: string
  createdAtFrom?: string
  createdAtTo?: string
  sortBy?: 'updatedAt' | 'createdAt' | 'name' | 'totalAmount'
  sortOrder?: 'asc' | 'desc'
}
```

---

## 3. SubProject (单项工程)

### SubProjectDTO

```ts
interface SubProjectDTO {
  id: string
  projectId: string                // 所属项目
  projectName?: string             // 冗余，方便展示
  name: string
  code?: string
  type: SubProjectType
  amount?: number                  // 金额（万元）
  buildingArea?: number
  description?: string
  sortOrder?: number               // 排序
  createdAt: string
  updatedAt: string
  // 统计
  stats?: {
    unitCount: number
    fileCount: number
  }
}

type SubProjectType = 'building' | 'structure' | 'installation' | 'decoration' | 'landscape' | 'other'
```

---

## 4. Unit (单位工程)

### UnitDTO

```ts
interface UnitDTO {
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
  floorCount?: number              // 层数
  structureType?: string           // 结构类型
  description?: string
  sortOrder?: number
  createdAt: string
  updatedAt: string
  // 统计
  stats?: {
    fileCount: number
    materialCount: number
    boqCount: number
  }
}

type UnitType = 'civil' | 'electrical' | 'hvac' | 'plumbing' | 'fire_protection' | 'elevator' | 'other'
```

---

## 5. PricingFile (造价文件)

### PricingFileDTO

```ts
interface PricingFileDTO {
  id: string
  // 层级关联
  projectId: string
  subProjectId: string
  unitId: string
  projectName?: string
  subProjectName?: string
  unitName?: string
  // 基本信息
  name: string
  code?: string
  fileType: PricingFileType
  sourceType: FileSourceType
  status: PricingFileStatus
  // 文件信息
  originalFileName?: string
  fileSize?: number
  fileUrl?: string
  // 金额信息
  totalAmount?: number
  laborAmount?: number
  materialAmount?: number
  machineAmount?: number
  measureAmount?: number
  // 标准化状态
  standardization?: {
    status: 'pending' | 'processing' | 'completed' | 'failed'
    materialCount?: number
    boqCount?: number
    indexCount?: number
    completedAt?: string
  }
  // 元数据
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    name: string
  }
}

type PricingFileType = 'estimate' | 'budget' | 'settlement' | 'final_account'
type FileSourceType = 'upload' | 'import' | 'sync' | 'manual'
type PricingFileStatus = 'draft' | 'standardizing' | 'standardized' | 'approved' | 'archived'
```

---

## 6. Material (材料)

### MaterialDTO

```ts
interface MaterialDTO {
  id: string
  // 追溯关联（必须）
  pricingFileId: string
  unitId: string
  subProjectId: string
  projectId: string
  // 基本信息
  code?: string                    // 材料编码
  name: string
  specification?: string           // 规格型号
  unit: string                     // 单位
  brand?: string                   // 品牌
  // 价格信息
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  // 分类
  category?: string                // 大类
  subCategory?: string             // 小类
  // 标准化
  standardCode?: string            // 标准编码
  standardName?: string            // 标准名称
  isStandardized: boolean
  // 元数据
  sourceRow?: number               // 原文件行号
  createdAt: string
  updatedAt: string
}
```

### MaterialListQuery

```ts
interface MaterialListQuery {
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
```

---

## 7. BOQItem (清单项)

### BOQItemDTO

```ts
interface BOQItemDTO {
  id: string
  // 追溯关联（必须）
  pricingFileId: string
  unitId: string
  subProjectId: string
  projectId: string
  // 基本信息
  code: string                     // 清单编码（如 010101001001）
  name: string
  unit: string
  // 工程量与价格
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  laborPrice?: number
  materialPrice?: number
  machinePrice?: number
  // 层级
  level: number                    // 层级深度
  parentId?: string                // 父级ID（树形结构）
  path?: string                    // 路径（如 1.2.3）
  // 定额关联
  quotaItems?: QuotaItemRef[]
  // 标准化
  standardCode?: string
  isStandardized: boolean
  // 元数据
  sourceRow?: number
  createdAt: string
  updatedAt: string
}

interface QuotaItemRef {
  quotaCode: string
  quotaName: string
  quantity: number
}
```

---

## 8. Index (指标)

### IndexDTO

```ts
interface IndexDTO {
  id: string
  // 追溯关联（必须）
  pricingFileId: string
  unitId: string
  subProjectId: string
  projectId: string
  // 基本信息
  code?: string
  name: string
  category: IndexCategory
  // 指标值
  value: number
  unit: string                     // 如 元/㎡、元/m³
  // 基准数据
  baseQuantity?: number            // 基准量（如面积、体积）
  baseUnit?: string
  // 对比参考
  industryAvg?: number             // 行业平均
  deviation?: number               // 偏差率
  // 元数据
  description?: string
  createdAt: string
  updatedAt: string
}

type IndexCategory = 'cost_per_area' | 'cost_per_volume' | 'material_ratio' | 'labor_ratio' | 'other'
```

---

## 9. Endpoints

### Project

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/projects | 项目列表 |
| GET | /api/projects/:id | 项目详情 |
| POST | /api/projects | 创建项目 |
| PUT | /api/projects/:id | 更新项目 |
| DELETE | /api/projects/:id | 删除项目 |

### SubProject

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/projects/:projectId/sub-projects | 单项工程列表 |
| GET | /api/sub-projects/:id | 单项工程详情 |
| POST | /api/projects/:projectId/sub-projects | 创建单项工程 |
| PUT | /api/sub-projects/:id | 更新单项工程 |
| DELETE | /api/sub-projects/:id | 删除单项工程 |

### Unit

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/sub-projects/:subProjectId/units | 单位工程列表 |
| GET | /api/units/:id | 单位工程详情 |
| POST | /api/sub-projects/:subProjectId/units | 创建单位工程 |

### PricingFile

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/pricing-files | 造价文件列表（可按工程筛选） |
| GET | /api/pricing-files/:id | 造价文件详情 |
| POST | /api/units/:unitId/pricing-files | 上传造价文件到单位工程 |
| POST | /api/pricing-files/:id/standardize | 触发标准化分析 |

### Material / BOQ / Index

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/materials | 材料列表（可按工程筛选） |
| GET | /api/boq-items | 清单列表（可按工程筛选） |
| GET | /api/indices | 指标列表（可按工程筛选） |

---

## 10. Enum Options (UI Display)

```ts
// src/constants/project.ts

export const PROJECT_TYPE_OPTIONS = [
  { value: 'residential', label: '住宅' },
  { value: 'commercial', label: '商业' },
  { value: 'industrial', label: '工业' },
  { value: 'infrastructure', label: '基础设施' },
  { value: 'municipal', label: '市政' },
  { value: 'other', label: '其他' },
]

export const PROJECT_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿', color: 'default' },
  { value: 'in_progress', label: '进行中', color: 'processing' },
  { value: 'completed', label: '已完成', color: 'success' },
  { value: 'archived', label: '已归档', color: 'default' },
]

export const PRICING_FILE_TYPE_OPTIONS = [
  { value: 'estimate', label: '估算' },
  { value: 'budget', label: '预算' },
  { value: 'settlement', label: '结算' },
  { value: 'final_account', label: '决算' },
]

export const PRICING_FILE_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿', color: 'default' },
  { value: 'standardizing', label: '标准化中', color: 'processing' },
  { value: 'standardized', label: '已标准化', color: 'success' },
  { value: 'approved', label: '已审核', color: 'success' },
  { value: 'archived', label: '已归档', color: 'default' },
]

export const INDEX_CATEGORY_OPTIONS = [
  { value: 'cost_per_area', label: '单方造价' },
  { value: 'cost_per_volume', label: '单体造价' },
  { value: 'material_ratio', label: '材料占比' },
  { value: 'labor_ratio', label: '人工占比' },
  { value: 'other', label: '其他' },
]
```

---

## 11. TypeScript File

```ts
// src/types/dto.project.ts
export interface ProjectDTO { ... }
export interface SubProjectDTO { ... }
export interface UnitDTO { ... }
export interface PricingFileDTO { ... }
export interface MaterialDTO { ... }
export interface BOQItemDTO { ... }
export interface IndexDTO { ... }
// ... all types
```