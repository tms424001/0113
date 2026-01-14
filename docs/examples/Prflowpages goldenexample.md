# PR Flow Pages — Golden Example v1.0

> PR 流程是数据质量的保障：个人数据 → 补录完善 → 智能校核 → 审批 → 企业库
> **补录只在 PR 发起时进行**，采集和标准化分析阶段不需要补录

---

## A. 业务流程

```
采集上传 → 标准化分析 → 质控/清标/对比（直接用）
                │
                └──→ 发起入库 PR（此时才补录）→ 审核 → 企业资产
```

**关键点**：
- ✅ 采集上传：只需基本信息（地点、计价类型）
- ✅ 标准化分析：直接使用，无需补录
- ✅ 质控/清标/对比：直接使用分析数据
- ✅ **PR 发起时**：补录完整工程信息（用于估算和数据质量）

---

## B. 页面清单

| 页面 | 路由 | 角色 | Pattern |
|------|------|------|---------|
| PR 发起页（含补录） | /pr/create | 个人用户 | P3 Form (多步向导) |
| PR 审核页 | /pr/:id | 审核员 | P4 Master-Detail |

---

# Part 1: PR 发起页（含补录向导）

## 1.1 Page Intent

**用户目标**：从个人资产中选择数据，补录完整工程信息，发起入库审批。

**向导步骤**：
```
① 选择数据 → ② 基本信息 → ③ 单项概况 → ④ 单位特征 → ⑤ 确认提交
```

---

## 1.2 Layout

### Step 1: 选择数据

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Steps: ① 选择数据 → ② 基本信息 → ③ 单项概况 → ④ 单位特征 → ⑤ 确认提交│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  选择要入库的数据                                                       │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  来源工程: [选择工程]  已选: 金爵巷_套定额                        │  │
│  │                                                                   │  │
│  │  数据范围:                                                        │  │
│  │  ☑ 造价文件 (3个)                                                 │  │
│  │  ☑ 材料数据 (8,932条)                                             │  │
│  │  ☑ 清单数据 (12,580条)                                            │  │
│  │  ☑ 指标数据 (156条)                                               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                                                      [下一步 →]         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 2: 基本信息（补录）

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Steps: ① 选择数据 → ② 基本信息 → ③ 单项概况 → ④ 单位特征 → ⑤ 确认提交│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐                                                       │
│  │ ≡            │  项目基本信息                                         │
│  │ ● 基本信息   │  ┌─────────────────────────────────────────────────┐  │
│  │ ○ 编制信息   │  │ 项目名称 *    [金爵巷_套定额                  ] │  │
│  │ ○ 规划信息   │  │                                                 │  │
│  └──────────────┘  │ 工程地点 *    [四川省 ▼] [成都市 ▼] [锦江区 ▼] │  │
│                    │                                                 │  │
│                    │ 工程分类 *    [居住建筑            ▼]           │  │
│                    │                                                 │  │
│                    │ 编制阶段 *    [招标工程量清单      ▼]           │  │
│                    │                                                 │  │
│                    │ 计价类型 *    [清单计价            ▼]           │  │
│                    │                                                 │  │
│                    │ 建设性质 *    [新建                ▼]           │  │
│                    └─────────────────────────────────────────────────┘  │
│                                                                         │
│                    编制信息                                             │
│                    ┌─────────────────────────────────────────────────┐  │
│                    │ 计价依据      [国标13清单 ▼] [2020四川定额 ▼]   │  │
│                    │                                                 │  │
│                    │ 材料价取定期  [2025-01-01        📅]            │  │
│                    │                                                 │  │
│                    │ 综合单价构成  [非全费用          ▼]             │  │
│                    └─────────────────────────────────────────────────┘  │
│                                                                         │
│                    规划信息（选填）                                     │
│                    ┌─────────────────────────────────────────────────┐  │
│                    │ 总投资(万元)  [                    ]            │  │
│                    │                                                 │  │
│                    │ 项目层级      [                  ▼]             │  │
│                    │                                                 │  │
│                    │ 海拔高度      [                    ]            │  │
│                    └─────────────────────────────────────────────────┘  │
│                                                                         │
│  完整度: ████████░░ 80%                    [← 上一步]  [下一步 →]       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 3: 单项概况（用于估算）

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Steps: ① 选择数据 → ② 基本信息 → ③ 单项概况 → ④ 单位特征 → ⑤ 确认提交│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  单项工程概况（用于估算调用）                                           │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │     单项工程     │ 建设规模(m²) │ 结构类型 │ 地上层数 │ 地下层数 │  │
│  ├──────────────────┼──────────────┼──────────┼──────────┼──────────┤  │
│  │ 📂 地下室        │ [20257.92  ] │ [框架 ▼] │ [0     ] │ [2     ] │  │
│  │ 📂 1#楼          │ [5074.09   ] │ [剪力墙▼]│ [18    ] │ [2     ] │  │
│  │ 📂 2#楼          │ [10108.50  ] │ [剪力墙▼]│ [26    ] │ [2     ] │  │
│  │ 📂 3#楼          │ [10037.74  ] │ [剪力墙▼]│ [26    ] │ [2     ] │  │
│  │ 📂 4#楼          │ [5056.30   ] │ [剪力墙▼]│ [18    ] │ [2     ] │  │
│  │ 📂 大门          │ [42.90     ] │ [框架 ▼] │ [1     ] │ [0     ] │  │
│  │ 📂 人防工程      │ [0         ] │ [    ▼]  │ [0     ] │ [1     ] │  │
│  │ 📂 总平          │ [0         ] │ [    ▼]  │ [      ] │ [      ] │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  💡 提示：建设规模已从文件解析，请核对并补充结构信息                    │
│                                                                         │
│  完整度: ████████░░ 85%                    [← 上一步]  [下一步 →]       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 4: 单位特征（用于估算）

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Steps: ① 选择数据 → ② 基本信息 → ③ 单项概况 → ④ 单位特征 → ⑤ 确认提交│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  当前单项: 1#楼 ▼                                                       │
│                                                                         │
│  单位工程特征（用于估算调用）                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │     单位工程         │ 基础类型 │ 外墙材料 │ 屋面类型 │ 窗户类型 │  │
│  ├──────────────────────┼──────────┼──────────┼──────────┼──────────┤  │
│  │ 建筑与装饰工程       │ [筏板 ▼] │ [涂料 ▼] │ [平屋面▼]│ [铝合金▼]│  │
│  │ 给排水工程           │ [    ▼]  │ [    ▼]  │ [    ▼]  │ [    ▼]  │  │
│  │ 消防工程             │ [    ▼]  │ [    ▼]  │ [    ▼]  │ [    ▼]  │  │
│  │ 通风空调工程         │ [    ▼]  │ [    ▼]  │ [    ▼]  │ [    ▼]  │  │
│  │ 强电工程             │ [    ▼]  │ [    ▼]  │ [    ▼]  │ [    ▼]  │  │
│  │ 弱电智能化工程       │ [    ▼]  │ [    ▼]  │ [    ▼]  │ [    ▼]  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  💡 提示：单位特征用于估算时的参数匹配，建议填写建筑与装饰工程即可      │
│                                                                         │
│  完整度: █████████░ 90%                    [← 上一步]  [下一步 →]       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 5: 确认提交

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Steps: ① 选择数据 → ② 基本信息 → ③ 单项概况 → ④ 单位特征 → ⑤ 确认提交│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  数据概览                                                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ 项目名称: 金爵巷_套定额                                           │  │
│  │ 工程地点: 四川省成都市锦江区                                      │  │
│  │ 总金额:   50,577.45 万元                                          │  │
│  │ 数据范围: 3个造价文件 | 12,580条清单 | 8,932条材料 | 156条指标    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  智能校核结果                                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  ┌────────┐                                                       │  │
│  │  │  92分  │   ✅ 通过: 148   ⚠️ 警告: 6   ❌ 异常: 2             │  │
│  │  └────────┘                                                       │  │
│  │                                                                   │  │
│  │  异常项:                                                          │  │
│  │  • ❌ 钢筋单价偏离行业均值 +45%                                   │  │
│  │  • ❌ 发现 2 条与企业库重复数据                                   │  │
│  │                                                                   │  │
│  │  警告项:                                                          │  │
│  │  • ⚠️ 混凝土单价偏离行业均值 +22%                                 │  │
│  │  • ⚠️ 单方造价偏离同类项目 +18%                                   │  │
│  │  ...                                                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  补录完整度: ██████████ 92%  ✅ 满足提交要求（≥80%）                   │
│                                                                         │
│                              [← 上一步]  [保存草稿]  [▶ 提交审核]       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Route

```
/pr/create                           # PR 发起页
/pr/create?step=1                    # Step 1: 选择数据
/pr/create?step=2                    # Step 2: 基本信息
/pr/create?step=3                    # Step 3: 单项概况
/pr/create?step=4                    # Step 4: 单位特征
/pr/create?step=5                    # Step 5: 确认提交
/pr/create?projectId=xxx             # 从资产页跳转，预选工程
```

---

## 1.4 Data Contract

### 创建 PR

```ts
// 创建 PR（草稿）
POST /api/prs
Body: {
  title: string
  sourceProjectId: string
  dataScope: {
    includePricingFiles: boolean
    includeMaterials: boolean
    includeBoqItems: boolean
    includeIndices: boolean
  }
}
Response: PullRequestDTO

// 更新补录信息
PUT /api/prs/:id/supplement
Body: SupplementData
Response: PullRequestDTO

// 提交审核
POST /api/prs/:id/submit
Response: PullRequestDTO
```

### 补录数据结构

```ts
interface SupplementData {
  // Step 2: 基本信息
  basicInfo: {
    projectName: string
    region: [string, string, string]    // 省/市/区
    projectCategory: string             // 工程分类
    compilationPhase: string            // 编制阶段
    pricingType: string                 // 计价类型
    constructionNature: string          // 建设性质
  }
  
  // Step 2: 编制信息
  compilationInfo: {
    pricingBasis?: string               // 计价依据
    materialPriceDate?: string          // 材料价取定期
    priceComposition?: string           // 综合单价构成
  }
  
  // Step 2: 规划信息（选填）
  planningInfo?: {
    totalInvestment?: number            // 总投资(万元)
    projectLevel?: string               // 项目层级
    altitude?: number                   // 海拔高度
  }
  
  // Step 3: 单项概况
  subProjects: Array<{
    subProjectId: string
    buildingArea: number                // 建设规模(m²)
    structureType: string               // 结构类型
    aboveGroundFloors: number           // 地上层数
    undergroundFloors: number           // 地下层数
  }>
  
  // Step 4: 单位特征
  units: Array<{
    unitId: string
    foundationType?: string             // 基础类型
    wallMaterial?: string               // 外墙材料
    roofType?: string                   // 屋面类型
    windowType?: string                 // 窗户类型
  }>
}
```

---

## 1.5 补录字段配置

```ts
// src/pages/pr/PRCreatePage/config.ts

// 基本信息字段
export const basicInfoFields: FormField[] = [
  { key: 'projectName', label: '项目名称', type: 'input', required: true },
  { key: 'region', label: '工程地点', type: 'cascader', options: REGION_OPTIONS, required: true },
  { key: 'projectCategory', label: '工程分类', type: 'select', options: PROJECT_CATEGORY_OPTIONS, required: true },
  { key: 'compilationPhase', label: '编制阶段', type: 'select', options: COMPILATION_PHASE_OPTIONS, required: true },
  { key: 'pricingType', label: '计价类型', type: 'select', options: PRICING_TYPE_OPTIONS, required: true },
  { key: 'constructionNature', label: '建设性质', type: 'select', options: CONSTRUCTION_NATURE_OPTIONS, required: true },
]

// 编制信息字段
export const compilationInfoFields: FormField[] = [
  { key: 'pricingBasis', label: '计价依据', type: 'select', options: PRICING_BASIS_OPTIONS },
  { key: 'materialPriceDate', label: '材料价取定期', type: 'date' },
  { key: 'priceComposition', label: '综合单价构成', type: 'select', options: PRICE_COMPOSITION_OPTIONS },
]

// 单项概况列
export const subProjectColumns = [
  { key: 'name', title: '单项工程', fixed: true },
  { key: 'buildingArea', title: '建设规模(m²)', type: 'number', required: true },
  { key: 'structureType', title: '结构类型', type: 'select', options: STRUCTURE_TYPE_OPTIONS, required: true },
  { key: 'aboveGroundFloors', title: '地上层数', type: 'number' },
  { key: 'undergroundFloors', title: '地下层数', type: 'number' },
]

// 单位特征列
export const unitFeatureColumns = [
  { key: 'name', title: '单位工程', fixed: true },
  { key: 'foundationType', title: '基础类型', type: 'select', options: FOUNDATION_TYPE_OPTIONS },
  { key: 'wallMaterial', title: '外墙材料', type: 'select', options: WALL_MATERIAL_OPTIONS },
  { key: 'roofType', title: '屋面类型', type: 'select', options: ROOF_TYPE_OPTIONS },
  { key: 'windowType', title: '窗户类型', type: 'select', options: WINDOW_TYPE_OPTIONS },
]

// 选项配置
export const PROJECT_CATEGORY_OPTIONS = [
  { value: 'residential', label: '居住建筑' },
  { value: 'commercial', label: '商业建筑' },
  { value: 'industrial', label: '工业建筑' },
  { value: 'public', label: '公共建筑' },
]

export const COMPILATION_PHASE_OPTIONS = [
  { value: 'estimate', label: '估算' },
  { value: 'budget', label: '概算' },
  { value: 'bidding', label: '招标工程量清单' },
  { value: 'contract', label: '合同价' },
  { value: 'settlement', label: '结算' },
  { value: 'final', label: '决算' },
]

export const STRUCTURE_TYPE_OPTIONS = [
  { value: 'frame', label: '框架结构' },
  { value: 'shear_wall', label: '剪力墙结构' },
  { value: 'frame_shear', label: '框架剪力墙' },
  { value: 'steel', label: '钢结构' },
  { value: 'masonry', label: '砖混结构' },
]

export const CONSTRUCTION_NATURE_OPTIONS = [
  { value: 'new', label: '新建' },
  { value: 'expansion', label: '扩建' },
  { value: 'renovation', label: '改建' },
  { value: 'restoration', label: '修缮' },
]
```

---

## 1.6 完整度计算

```ts
// 计算补录完整度 (0-100)
function calculateCompleteness(data: SupplementData): number {
  let score = 0
  const weights = {
    basicInfo: 40,         // 基本信息占 40%
    subProjects: 35,       // 单项概况占 35%
    units: 25,             // 单位特征占 25%
  }
  
  // 基本信息完整度
  const basicRequired = ['projectName', 'region', 'projectCategory', 'compilationPhase', 'pricingType', 'constructionNature']
  const basicFilled = basicRequired.filter(key => !!data.basicInfo[key]).length
  score += (basicFilled / basicRequired.length) * weights.basicInfo
  
  // 单项概况完整度
  const subProjectsFilled = data.subProjects.filter(sp => sp.buildingArea && sp.structureType).length
  score += (subProjectsFilled / data.subProjects.length) * weights.subProjects
  
  // 单位特征完整度（至少填写一个）
  const unitsFilled = data.units.filter(u => u.foundationType || u.wallMaterial).length
  score += (unitsFilled > 0 ? 1 : 0) * weights.units
  
  return Math.round(score)
}

// 补录完整度 >= 80% 才能提交
const canSubmit = completenessScore >= 80
```

---

## 1.7 Page Store

```ts
// src/stores/prCreatePageStore.ts
interface PRCreatePageState {
  // 步骤
  currentStep: 1 | 2 | 3 | 4 | 5
  
  // Step 1: 选择数据
  sourceProjectId: string | null
  sourceProject: ProjectDTO | null
  dataScope: {
    includePricingFiles: boolean
    includeMaterials: boolean
    includeBoqItems: boolean
    includeIndices: boolean
  }
  
  // Step 2-4: 补录数据
  supplementData: SupplementData
  
  // Step 5: 校核结果
  validationResult: ValidationResult | null
  
  // 状态
  completenessScore: number
  loading: boolean
  submitting: boolean
  
  // Actions
  setStep: (step: number) => void
  setSourceProject: (project: ProjectDTO) => void
  setDataScope: (scope: Partial<DataScope>) => void
  updateSupplementData: (data: Partial<SupplementData>) => void
  runValidation: () => Promise<void>
  saveDraft: () => Promise<void>
  submit: () => Promise<void>
}
```

---

## 1.8 Component Structure

```
src/pages/pr/PRCreatePage/
├── index.tsx                    # 主页面
├── config.ts                    # 字段配置
├── PRCreatePage.module.css
└── components/
    ├── StepSelectData.tsx       # Step 1: 选择数据
    ├── StepBasicInfo.tsx        # Step 2: 基本信息
    ├── StepSubProjects.tsx      # Step 3: 单项概况
    ├── StepUnitFeatures.tsx     # Step 4: 单位特征
    ├── StepConfirm.tsx          # Step 5: 确认提交
    ├── CompletenessBar.tsx      # 完整度进度条
    └── ValidationResultPanel.tsx # 校核结果面板
```

---

# Part 2: PR 审核页

## 2.1 Page Intent

**用户目标**：审核员查看 PR 数据，检查校核结果，审批通过或驳回。

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ PageHeader: PR-2024-001 | 待审核 | [通过] [驳回] [要求修改]             │
├─────────────────────────────────────────────────────────────────────────┤
│ 基本信息: 申请人 | 来源工程 | 提交时间 | 数据范围                       │
├──────────────────┬──────────────────────────────────────────────────────┤
│                  │                                                      │
│   数据范围       │   Tab: [补录信息] [智能校核] [数据预览] [审批记录]  │
│                  │                                                      │
│   📁 造价文件(3) │   ┌────────────────────────────────────────────────┐ │
│   📦 材料(8932)  │   │ 智能校核结果                                   │ │
│   📋 清单(12580) │   │                                                │ │
│   📊 指标(156)   │   │ ┌────────┐                                     │ │
│                  │   │ │  92分  │  ✅ 148  ⚠️ 6  ❌ 2                 │ │
│   点击查看详情   │   │ └────────┘                                     │ │
│                  │   │                                                │ │
│                  │   │ 异常项:                                        │ │
│                  │   │ • ❌ 钢筋单价偏离 +45%                         │ │
│                  │   │ • ❌ 重复数据 2 条                             │ │
│                  │   └────────────────────────────────────────────────┘ │
│                  │                                                      │
├──────────────────┴──────────────────────────────────────────────────────┤
│ 评论区: 添加审核意见...                                    [发送]       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 智能校核规则

```ts
// src/constants/validation.ts

export const validationRules: ValidationRule[] = [
  // 材料价格偏离度
  {
    id: 'material_price_deviation',
    category: 'price_deviation',
    name: '材料价格偏离度检查',
    description: '检查材料单价是否偏离行业均值过大',
    threshold: { warning: 0.2, error: 0.3 },
  },
  
  // 清单价格偏离度
  {
    id: 'boq_price_deviation',
    category: 'price_deviation',
    name: '清单价格偏离度检查',
    description: '检查清单综合单价是否偏离行业均值过大',
    threshold: { warning: 0.2, error: 0.3 },
  },
  
  // 造价指标偏离度
  {
    id: 'index_deviation',
    category: 'price_deviation',
    name: '造价指标偏离度检查',
    description: '检查单方造价等指标是否偏离同类项目',
    threshold: { warning: 0.15, error: 0.25 },
  },
  
  // 重复数据检查
  {
    id: 'duplicate_check',
    category: 'duplicate_check',
    name: '重复数据检查',
    description: '检查是否与企业库已有数据重复',
  },
]
```

---

## 2.3 审批操作

```ts
// 审批接口
POST /api/prs/:id/review
Body: {
  action: 'approve' | 'reject' | 'request_change'
  comment?: string
}
Response: PullRequestDTO

// 入库接口（审批通过后）
POST /api/prs/:id/merge
Response: {
  success: true
  targetProjectId: string
}
```

---

## 2.4 审批流程

```
一级审批 (数据审核员)
├── 检查补录完整性
├── 查看智能校核结果
├── 决策：
│   ├── 通过 → 如需二级 → 进入二级审批
│   │        → 不需二级 → 直接通过，可执行入库
│   ├── 驳回 → 退回给申请人修改
│   └── 要求修改 → 申请人补充信息后重新提交

二级审批 (高级审核员，金额>100万自动开启)
├── 复核数据准确性
├── 决策：
│   ├── 通过 → 可执行入库
│   └── 驳回 → 退回一级审批
```

---

## 2.5 Permissions

| Action | Permission Key | 说明 |
|--------|----------------|------|
| 查看 PR | pr.read | - |
| 发起 PR | pr.write | 个人用户 |
| 一级审批 | pr.review.level1 | 数据审核员 |
| 二级审批 | pr.review.level2 | 高级审核员 |
| 执行入库 | pr.merge | 审批通过后 |

---

## 2.6 Component Structure

```
src/pages/pr/PRDetailPage/
├── index.tsx                    # 主页面
├── PRDetailPage.module.css
└── components/
    ├── PRBasicInfo.tsx          # 基本信息区
    ├── DataScopePanel.tsx       # 左侧数据范围
    ├── SupplementInfoTab.tsx    # 补录信息 Tab
    ├── ValidationResultTab.tsx  # 智能校核 Tab
    ├── DataPreviewTab.tsx       # 数据预览 Tab
    ├── ReviewHistoryTab.tsx     # 审批记录 Tab
    ├── ReviewActions.tsx        # 审批操作按钮
    └── CommentSection.tsx       # 评论区
```

---

## G. DoD Checklist

```
## DoD Checklist (PR 发起页)

- DoD-1: ✅ 选择数据 → 补录信息(5步) → 校核 → 提交，流程完整
- DoD-2: ✅ Loading/Empty/Error 三态实现
- DoD-3: ✅ 字段来自 SupplementData 类型定义
- DoD-4: ✅ 补录完整度 < 80% 禁止提交
- DoD-5: ✅ 5 步向导，符合平台规范

## DoD Checklist (PR 审核页)

- DoD-1: ✅ 查看数据 → 查看校核 → 审批，流程闭环
- DoD-2: ✅ Loading/Empty/Error 三态实现
- DoD-3: ✅ 字段来自 PullRequestDTO/ValidationResult
- DoD-4: ✅ 驳回时必须填写原因
- DoD-5: ✅ Master-Detail 模式，主操作唯一
```