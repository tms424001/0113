# 造价数据平台 - 数据流转规格说明书

> 版本: v1.0
> 更新日期: 2026-01-14
> 文档状态: 正式发布

---

## 1. 概述

### 1.1 文档目的

本文档定义造价数据平台的核心数据流转架构，包括：
- 系统后台核心配置模块
- 企业管理端配置能力
- 用户端数据采集与分析流程
- 数据入库与资产化流程

### 1.2 系统定位

造价数据平台是一个面向工程造价行业的数据资产管理系统，核心价值在于：
- **数据标准化**：通过标准树体系实现造价数据的规范化归集
- **智能套定额**：基于清单-定额映射实现智能匹配
- **数据资产化**：将零散造价文件转化为可查询、可分析的企业数据资产

---

## 2. 系统架构

### 2.1 三层架构

```
┌─────────────────────────────────────────────────────────────┐
│                     系统后台（运营端）                       │
│                     核心配置 & 护城河                        │
└─────────────────────────────────────────────────────────────┘
                              ↓ 映射
┌─────────────────────────────────────────────────────────────┐
│                     企业管理端                               │
│                     企业级配置                               │
└─────────────────────────────────────────────────────────────┘
                              ↓ 使用
┌─────────────────────────────────────────────────────────────┐
│                     用户操作端                               │
│                     数据采集 & 分析                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 数据空间划分

| 空间 | 归属 | 用途 |
|------|------|------|
| 草稿箱 | 个人 | 临时存储采集的造价文件 |
| 个人资产 | 个人 | 已分析的个人数据 |
| 企业资产库 | 企业 | 审核入库的企业级数据资产 |
| 市场数据库 | 平台 | 脱敏后的行业基准数据 |

---

## 3. 系统后台核心模块

### 3.1 模块清单

| 模块 | 重要性 | 说明 |
|------|--------|------|
| 材料树配置 | ⭐⭐⭐ | 标准材料分类体系 |
| 清单树配置 | ⭐⭐⭐ | 标准清单分类体系 |
| 指标树配置 | ⭐⭐⭐ | 标准指标分类体系 |
| 清单-定额映射 | ⭐⭐⭐ | 智能套定额核心 |
| 动态字段配置 | ⭐⭐ | 按分类配置补录字段 |
| 分类体系配置 | ⭐⭐ | 项目/单项/单位分类 |

### 3.2 材料树配置

#### 3.2.1 树形结构

```
材料及设备
├── 01 黑色、有色金属及制品
│   ├── 0101 线材及其制品
│   ├── 0103 型材
│   ├── 0105 板材
│   └── 0107 金属原材
├── 02 橡胶、塑料及棉麻制品
├── 03 五金制品
├── 04 水泥、砖瓦灰砂石
├── 05 竹木材及其制品
├── 06 玻璃与玻璃制品
├── 07 墙砖、地砖、地板、地毯类材料
├── 10 龙骨、龙骨配件
├── 11 门窗、门窗框料及楼梯制品
├── 12 装饰线条、装饰件、栏杆、扶手及其他
├── 13 涂料及防腐、防水材料
├── 14 油品、化工原料及胶粘材料
├── 15 绝热（保温）、耐火材料
├── 17 管材
├── 18 管件及管道通用器材
├── 19 阀门、法兰及其垫片
├── 21 洁具及燃气器具
└── ...
```

#### 3.2.2 节点数据结构

```ts
interface MaterialTreeNode {
  id: string
  code: string                    // 分类编码，如 "0101"
  name: string                    // 分类名称
  parentId: string | null
  level: number                   // 层级 1-4
  sortOrder: number
  
  // 归集规则
  matchRules?: {
    keywords: string[]            // 关键词匹配
    specifications: string[]      // 规格匹配
    excludeKeywords: string[]     // 排除关键词
  }
  
  // 统计配置
  aggregation?: {
    priceMethod: 'avg' | 'weighted_avg' | 'max' | 'min'
    quantityMethod: 'sum'
  }
  
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

### 3.3 清单树配置

#### 3.3.1 树形结构

```
工程分类
├── 01 房屋建筑与装饰工程
│   ├── 0104 砌筑工程
│   │   ├── 010401 砌砖体
│   │   └── 010402 砌块砌体
│   ├── 0105 混凝土及钢筋混凝土工程
│   ├── 0106 金属结构工程
│   ├── 0108 门窗工程
│   ├── 0109 屋面及防水工程
│   ├── 0110 保温、隔热、防腐工程
│   ├── 0111 楼地面装饰工程
│   ├── 0112 墙、柱面装饰与隔断、幕墙工程
│   ├── 0113 天棚工程
│   ├── 0114 油漆、涂料、裱糊工程
│   ├── 0115 其他装饰工程
│   └── 0116 措施项目
├── 02 仿古建筑工程
├── 03 通用安装工程
├── 04 市政工程
├── 05 园林绿化工程
└── ...
```

#### 3.3.2 节点数据结构

```ts
interface BOQTreeNode {
  id: string
  code: string                    // 分类编码，如 "010401"
  name: string
  parentId: string | null
  level: number
  sortOrder: number
  
  // 归集规则
  matchRules?: {
    boqCodes: string[]            // 清单编码匹配（前缀）
    keywords: string[]
    excludeKeywords: string[]
  }
  
  // 关联定额（智能套定额）
  linkedQuotas?: {
    quotaId: string
    quotaCode: string
    matchWeight: number           // 匹配权重
  }[]
  
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

### 3.4 指标树配置

#### 3.4.1 树形结构

```
经济指标
├── 分部分项与单价措施
│   ├── 其他
│   ├── 给排水系统
│   ├── 消防系统
│   ├── 供配电系统
│   ├── 辅助项目/配合项目
│   ├── 脚手架工程
│   └── 未归类
├── 总价措施
├── 其他项目
│   ├── 规费
│   └── 税金
└── 非规范项目
```

#### 3.4.2 节点数据结构

```ts
interface IndexTreeNode {
  id: string
  code: string
  name: string
  parentId: string | null
  level: number
  sortOrder: number
  
  // 指标计算配置
  calculation?: {
    formula: string               // 计算公式
    baseField: string             // 基准字段（如 buildingArea）
    unit: string                  // 单位（如 元/m²）
  }
  
  // 基准值配置（用于偏离预警）
  benchmark?: {
    min: number
    max: number
    avg: number
    source: string                // 数据来源
    updateDate: string
  }
  
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

### 3.5 清单-定额映射配置

#### 3.5.1 映射规则

```ts
interface BOQQuotaMapping {
  id: string
  
  // 清单匹配条件
  boqCondition: {
    codePrefix?: string           // 清单编码前缀
    nameKeywords?: string[]       // 名称关键词
    unit?: string                 // 单位
    specifications?: string[]     // 规格特征
  }
  
  // 映射的定额
  quotas: Array<{
    quotaId: string
    quotaCode: string             // 定额编码
    quotaName: string
    quotaLibrary: string          // 定额库（如 "2020四川定额"）
    
    // 匹配条件
    condition?: {
      quantityRange?: [number, number]
      specifications?: string[]
    }
    
    // 消耗量系数
    consumptionFactor?: number
    
    priority: number              // 优先级
  }>
  
  // 地区适用范围
  regions?: string[]
  
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

#### 3.5.2 智能套定额流程

```
清单项
  ↓
1. 编码匹配：按清单编码前缀匹配
  ↓
2. 名称匹配：关键词 + 规格特征
  ↓
3. 单位校验：确保单位一致或可转换
  ↓
4. 多定额选择：按优先级排序
  ↓
5. 人工确认/自动确认
  ↓
定额项（含消耗量）
```

### 3.6 动态字段配置

#### 3.6.1 配置结构

```ts
interface DynamicFieldConfig {
  id: string
  
  // 适用分类
  category: {
    type: 'project' | 'subProject' | 'unit'
    categoryCode: string          // 分类编码
    categoryName: string
  }
  
  // 字段列表
  fields: Array<{
    key: string
    label: string
    type: 'input' | 'number' | 'select' | 'date' | 'cascader' | 'textarea'
    required: boolean
    placeholder?: string
    
    // select/cascader 的选项
    options?: Array<{ value: string; label: string }>
    optionsSource?: string        // 动态选项来源
    
    // 数值类型的配置
    numberConfig?: {
      min?: number
      max?: number
      precision?: number
      unit?: string
    }
    
    // 校验规则
    rules?: Array<{
      type: 'required' | 'range' | 'pattern' | 'custom'
      message: string
      value?: unknown
    }>
    
    // 用途标记
    usage: ('estimate' | 'quality' | 'statistics')[]
    
    sortOrder: number
  }>
  
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}
```

#### 3.6.2 分类示例配置

```ts
// 项目分类 - 住宅类字段
const residentialProjectFields: DynamicFieldConfig = {
  id: 'cfg_project_residential',
  category: {
    type: 'project',
    categoryCode: 'residential',
    categoryName: '住宅',
  },
  fields: [
    { key: 'plotRatio', label: '容积率', type: 'number', required: true, usage: ['estimate'] },
    { key: 'households', label: '总户数', type: 'number', required: false, usage: ['estimate', 'statistics'] },
    { key: 'propertyType', label: '物业类型', type: 'select', required: true, 
      options: [
        { value: 'high_rise', label: '高层' },
        { value: 'multi_storey', label: '多层' },
        { value: 'villa', label: '别墅' },
      ],
      usage: ['estimate', 'quality'] 
    },
    { key: 'greenRate', label: '绿化率(%)', type: 'number', required: false, usage: ['statistics'] },
  ],
  isEnabled: true,
}

// 单项分类 - 主体结构字段
const structureSubProjectFields: DynamicFieldConfig = {
  id: 'cfg_subproject_structure',
  category: {
    type: 'subProject',
    categoryCode: 'structure',
    categoryName: '主体结构',
  },
  fields: [
    { key: 'structureType', label: '结构类型', type: 'select', required: true,
      options: [
        { value: 'frame', label: '框架结构' },
        { value: 'shear_wall', label: '剪力墙结构' },
        { value: 'frame_shear', label: '框架剪力墙' },
        { value: 'frame_tube', label: '框架核心筒' },
        { value: 'steel', label: '钢结构' },
        { value: 'masonry', label: '砖混结构' },
      ],
      usage: ['estimate', 'quality']
    },
    { key: 'seismicGrade', label: '抗震等级', type: 'select', required: true,
      options: [
        { value: '1', label: '一级' },
        { value: '2', label: '二级' },
        { value: '3', label: '三级' },
        { value: '4', label: '四级' },
      ],
      usage: ['estimate']
    },
    { key: 'floorHeight', label: '标准层高(m)', type: 'number', required: false, usage: ['estimate'] },
  ],
  isEnabled: true,
}

// 单位分类 - 土建字段
const civilUnitFields: DynamicFieldConfig = {
  id: 'cfg_unit_civil',
  category: {
    type: 'unit',
    categoryCode: 'civil',
    categoryName: '土建',
  },
  fields: [
    { key: 'foundationType', label: '基础类型', type: 'select', required: false,
      options: [
        { value: 'independent', label: '独立基础' },
        { value: 'strip', label: '条形基础' },
        { value: 'raft', label: '筏板基础' },
        { value: 'pile', label: '桩基础' },
      ],
      usage: ['estimate']
    },
    { key: 'wallMaterial', label: '外墙材料', type: 'select', required: false,
      options: [
        { value: 'paint', label: '涂料' },
        { value: 'tile', label: '外墙砖' },
        { value: 'dry_hanging', label: '干挂石材' },
        { value: 'curtain_wall', label: '幕墙' },
      ],
      usage: ['estimate']
    },
    { key: 'roofType', label: '屋面类型', type: 'select', required: false,
      options: [
        { value: 'flat', label: '平屋面' },
        { value: 'slope', label: '坡屋面' },
      ],
      usage: ['estimate']
    },
    { key: 'windowType', label: '窗户类型', type: 'select', required: false,
      options: [
        { value: 'plastic_steel', label: '塑钢窗' },
        { value: 'broken_bridge', label: '断桥铝' },
        { value: 'aluminum_alloy', label: '铝合金' },
      ],
      usage: ['estimate']
    },
  ],
  isEnabled: true,
}
```

---

## 4. 企业管理端配置

### 4.1 企业科目树映射

#### 4.1.1 映射原理

```
系统标准树                    企业科目树
    │                            │
    │                            │
材料及设备 ─────────映射──────→ 企业材料分类
├── 01 黑色金属    ═══════════→ ├── A 钢材类
├── 02 橡胶塑料    ═══════════→ ├── B 化工材料
├── 03 五金制品    ═══════════→ ├── C 五金
└── ...                         └── ...
```

#### 4.1.2 映射数据结构

```ts
interface EnterpriseTreeMapping {
  id: string
  enterpriseId: string
  
  // 映射类型
  treeType: 'material' | 'boq' | 'index'
  
  // 映射规则
  mappings: Array<{
    standardNodeId: string        // 标准树节点ID
    standardNodeCode: string
    standardNodeName: string
    
    enterpriseNodeId: string      // 企业自定义节点ID
    enterpriseNodeCode: string
    enterpriseNodeName: string
    
    // 合并规则（多个标准节点 → 一个企业节点）
    mergeStrategy?: 'first' | 'sum' | 'avg'
  }>
  
  // 企业自定义树结构
  enterpriseTree: EnterpriseTreeNode[]
  
  isEnabled: boolean
  createdAt: string
  updatedAt: string
}

interface EnterpriseTreeNode {
  id: string
  code: string
  name: string
  parentId: string | null
  level: number
  sortOrder: number
  
  // 映射的标准节点（可多个）
  mappedStandardNodes: string[]
}
```

### 4.2 企业配置项

| 配置项 | 说明 |
|--------|------|
| 材料科目树映射 | 自定义材料分类维度 |
| 清单科目树映射 | 自定义清单分类维度 |
| 指标科目树映射 | 自定义指标分类维度 |
| 补录字段扩展 | 企业额外需要的补录字段 |
| 审批流程配置 | PR 审批级别和条件 |
| 数据权限配置 | 部门/角色数据可见范围 |

---

## 5. 数据流转流程

### 5.1 整体流程图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                用户操作流程                                      │
│                                                                                  │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐            │
│  │ 1.上传   │ ───→ │ 2.解析   │ ───→ │ 3.归集   │ ───→ │ 4.分析   │            │
│  │ 造价文件 │      │ 识别格式 │      │ 标准化   │      │ 四维度   │            │
│  └──────────┘      └──────────┘      └──────────┘      └──────────┘            │
│                                                              │                   │
│                          ┌───────────────────────────────────┤                   │
│                          │                                   │                   │
│                          ▼                                   ▼                   │
│                 ┌──────────────┐                    ┌──────────────┐            │
│                 │ 5.直接使用   │                    │ 6.入库PR     │            │
│                 │ 质控/清标等  │                    │ 补录信息     │            │
│                 └──────────────┘                    └──────┬───────┘            │
│                                                            │                     │
│                                                            ▼                     │
│                                                   ┌──────────────┐              │
│                                                   │ 7.审核       │              │
│                                                   │ 一级/二级    │              │
│                                                   └──────┬───────┘              │
│                                                          │                       │
│                                                          ▼                       │
│                                                 ┌──────────────┐                │
│                                                 │ 8.企业资产库 │                │
│                                                 └──────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 阶段详解

#### 5.2.1 上传阶段

**输入**: 造价文件（广联达/斯维尔/宏业/博微等格式）

**处理**:
1. 识别文件格式
2. 提取基本信息（项目名称、编制阶段等）
3. 存入草稿箱

**输出**: 草稿记录

**必填信息**（仅4项）:
- 项目名称（自动识别）
- 工程地点（省/市/区）
- 计价类型
- 综合单价构成

#### 5.2.2 解析阶段

**处理**:
1. 解析文件结构（单项工程、单位工程）
2. 提取清单数据
3. 提取材料数据
4. 计算指标数据

**输出**: 结构化的原始数据

#### 5.2.3 归集阶段

**处理**:
1. **材料归集**: 原始材料 → 按材料树分类归集
2. **清单归集**: 原始清单 → 按清单树分类归集
3. **指标归集**: 计算数据 → 按指标树分类归集

**归集算法**:
```ts
function aggregateMaterial(rawMaterial: RawMaterial, materialTree: MaterialTreeNode[]): AggregatedMaterial {
  // 1. 遍历材料树节点
  for (const node of materialTree) {
    // 2. 匹配规则检查
    if (matchMaterialToNode(rawMaterial, node)) {
      return {
        ...rawMaterial,
        categoryId: node.id,
        categoryCode: node.code,
        categoryName: node.name,
        categoryPath: getNodePath(node),
      }
    }
  }
  
  // 3. 未匹配归入"未归类"
  return {
    ...rawMaterial,
    categoryId: 'uncategorized',
    categoryCode: '99',
    categoryName: '未归类',
  }
}
```

#### 5.2.4 分析阶段

**四个分析维度**:

| Tab | 维度 | 数据来源 | 切换选项 |
|-----|------|----------|----------|
| 原样预览 | 原始结构 | 解析数据 | 无 |
| 工程经济指标 | 经济维度 | 指标归集 | 归集后/原始 |
| 主要工程量指标 | 工程量维度 | 清单归集 | 工程量树/清单树 |
| 工料机指标 | 材料维度 | 材料归集 | 材料树/分类树 |

**维度切换原理**:
```ts
// 用户看到的是企业映射后的科目树
function getDimensionTree(
  treeType: 'material' | 'boq' | 'index',
  dimension: string,
  enterpriseId: string
): TreeNode[] {
  // 1. 获取企业映射配置
  const mapping = getEnterpriseMapping(enterpriseId, treeType)
  
  // 2. 如果有企业自定义映射，返回企业树
  if (mapping && mapping.isEnabled) {
    return mapping.enterpriseTree
  }
  
  // 3. 否则返回系统标准树
  return getStandardTree(treeType)
}
```

#### 5.2.5 直接使用场景

以下场景**无需补录**，直接使用归集后数据:

| 场景 | 使用数据 | 说明 |
|------|----------|------|
| 质控 | 归集后材料+清单+指标 | 价格偏离检查 |
| 清标 | 归集后清单 | 清单对比分析 |
| 对比分析 | 归集后指标 | 多工程横向对比 |
| 智能套定额 | 归集后清单 | 清单→定额匹配 |

#### 5.2.6 入库补录阶段

**触发条件**: 用户发起 PR 入库申请

**补录内容**（动态字段，按分类加载）:

```
┌─────────────────────────────────────────────────────────────────┐
│                        补录信息                                  │
│                                                                  │
│  项目基本信息                                                    │
│  ├── 通用字段: 项目时间、工程地点、工程分类、编制阶段...        │
│  └── 分类字段: 根据工程分类动态加载                             │
│      ├── 住宅: 容积率、户数、物业类型...                        │
│      ├── 商业: 商业类型、商业层数...                            │
│      └── 工业: 生产类型、耐火等级...                            │
│                                                                  │
│  单项工程概况（每个单项）                                        │
│  ├── 通用字段: 建筑面积、结构类型、层数...                      │
│  └── 分类字段: 根据单项分类动态加载                             │
│      ├── 主体结构: 抗震等级、层高...                            │
│      ├── 装饰装修: 装修档次...                                  │
│      └── 机电安装: 空调形式...                                  │
│                                                                  │
│  单位工程特征（每个单位）                                        │
│  ├── 通用字段: 专业类型                                         │
│  └── 分类字段: 根据单位分类动态加载                             │
│      ├── 土建: 基础类型、外墙材料、屋面类型...                  │
│      ├── 水电: 给水方式、配电形式...                            │
│      └── 暖通: 空调类型、通风方式...                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**补录完整度计算**:
```ts
function calculateCompleteness(supplementData: SupplementData, fieldConfig: DynamicFieldConfig[]): number {
  const requiredFields = fieldConfig
    .flatMap(c => c.fields)
    .filter(f => f.required)
  
  const filledCount = requiredFields.filter(f => {
    const value = getFieldValue(supplementData, f.key)
    return value !== null && value !== undefined && value !== ''
  }).length
  
  return Math.round((filledCount / requiredFields.length) * 100)
}

// 补录完整度 >= 80% 才能提交
const canSubmit = completeness >= 80
```

#### 5.2.7 审核阶段

**审核流程**:
```
提交 PR
    ↓
一级审核（数据审核员）
├── 检查补录完整度
├── 检查智能校核结果
├── 审批决策: 通过 / 驳回 / 退回修改
│   ├── 通过 → 金额 > 100万 ? 进入二级 : 直接入库
│   ├── 驳回 → 结束
│   └── 退回修改 → 返回补录
    ↓
二级审核（高级审核员，可选）
├── 复核数据准确性
├── 审批决策: 通过 / 驳回
│   ├── 通过 → 入库
│   └── 驳回 → 返回一级
    ↓
入库执行
├── 数据写入企业资产库
├── 更新统计数据
└── 发送通知
```

#### 5.2.8 企业资产库

**存储内容**:
- 完整补录信息
- 归集后材料数据
- 归集后清单数据
- 归集后指标数据
- 原始造价文件引用

**使用场景**:
- 估算基准数据
- 质控规则参照
- 市场分析报告
- 企业数据统计

---

## 6. 智能套定额流程

### 6.1 流程图

```
┌──────────────────────────────────────────────────────────────────┐
│                      智能套定额流程                               │
│                                                                   │
│  ┌─────────────┐                                                  │
│  │  清单项     │                                                  │
│  │  - 编码     │                                                  │
│  │  - 名称     │                                                  │
│  │  - 单位     │                                                  │
│  │  - 工程量   │                                                  │
│  └──────┬──────┘                                                  │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 1: 查找映射规则                                        │ │
│  │ SELECT * FROM boq_quota_mapping                             │ │
│  │ WHERE boq_code_prefix MATCH '010401%'                       │ │
│  │   AND region IN ('四川', '全国')                            │ │
│  │ ORDER BY priority DESC                                      │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 2: 条件过滤                                            │ │
│  │ - 规格特征匹配                                              │ │
│  │ - 工程量范围检查                                            │ │
│  │ - 单位兼容性检查                                            │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 3: 匹配结果排序                                        │ │
│  │ - 编码匹配度                                                │ │
│  │ - 名称相似度                                                │ │
│  │ - 历史使用频率                                              │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 4: 输出推荐定额                                        │ │
│  │ ┌─────────────────────────────────────────────────────────┐ │ │
│  │ │ 推荐1 (置信度 95%): AA0001 现浇混凝土柱 [2020四川定额]  │ │ │
│  │ │ 推荐2 (置信度 78%): AA0002 现浇混凝土梁 [2020四川定额]  │ │ │
│  │ │ 推荐3 (置信度 65%): AA0003 其他混凝土 [2020四川定额]    │ │ │
│  │ └─────────────────────────────────────────────────────────┘ │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Step 5: 用户确认 / 自动确认                                 │ │
│  │ - 置信度 > 90%: 可自动确认                                  │ │
│  │ - 置信度 < 90%: 需人工确认                                  │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────┐                                                  │
│  │  定额项     │                                                  │
│  │  - 定额编码 │                                                  │
│  │  - 定额名称 │                                                  │
│  │  - 消耗量   │                                                  │
│  │  - 单价     │                                                  │
│  └─────────────┘                                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 匹配算法

```ts
interface QuotaMatchResult {
  quotaId: string
  quotaCode: string
  quotaName: string
  quotaLibrary: string
  confidence: number              // 置信度 0-100
  matchFactors: {
    codeMatch: number             // 编码匹配度
    nameMatch: number             // 名称匹配度
    unitMatch: number             // 单位匹配度
    historyMatch: number          // 历史使用匹配度
  }
}

function matchQuotaForBOQ(
  boqItem: BOQItem,
  mappingRules: BOQQuotaMapping[],
  historyData: QuotaUsageHistory[]
): QuotaMatchResult[] {
  const candidates: QuotaMatchResult[] = []
  
  for (const rule of mappingRules) {
    // 1. 编码匹配
    const codeMatch = calculateCodeMatch(boqItem.code, rule.boqCondition.codePrefix)
    if (codeMatch < 0.5) continue
    
    // 2. 名称匹配
    const nameMatch = calculateNameMatch(boqItem.name, rule.boqCondition.nameKeywords)
    
    // 3. 单位匹配
    const unitMatch = calculateUnitMatch(boqItem.unit, rule.quotas[0].unit)
    
    // 4. 历史使用匹配
    const historyMatch = calculateHistoryMatch(rule.quotas[0].quotaCode, historyData)
    
    // 5. 计算综合置信度
    const confidence = 
      codeMatch * 0.4 +
      nameMatch * 0.3 +
      unitMatch * 0.2 +
      historyMatch * 0.1
    
    for (const quota of rule.quotas) {
      candidates.push({
        quotaId: quota.quotaId,
        quotaCode: quota.quotaCode,
        quotaName: quota.quotaName,
        quotaLibrary: quota.quotaLibrary,
        confidence: Math.round(confidence * 100),
        matchFactors: { codeMatch, nameMatch, unitMatch, historyMatch },
      })
    }
  }
  
  // 按置信度排序
  return candidates.sort((a, b) => b.confidence - a.confidence)
}
```

---

## 7. API 接口规范

### 7.1 标准树接口

```ts
// 获取材料树
GET /api/admin/trees/material
Response: {
  tree: MaterialTreeNode[]
  version: string
  lastUpdated: string
}

// 获取清单树
GET /api/admin/trees/boq
Response: {
  tree: BOQTreeNode[]
  version: string
  lastUpdated: string
}

// 获取指标树
GET /api/admin/trees/index
Response: {
  tree: IndexTreeNode[]
  version: string
  lastUpdated: string
}

// 获取清单-定额映射
GET /api/admin/mappings/boq-quota
Query: { region?: string; quotaLibrary?: string }
Response: {
  mappings: BOQQuotaMapping[]
  total: number
}
```

### 7.2 企业配置接口

```ts
// 获取企业科目树映射
GET /api/enterprise/:enterpriseId/tree-mappings/:treeType
Response: EnterpriseTreeMapping

// 更新企业科目树映射
PUT /api/enterprise/:enterpriseId/tree-mappings/:treeType
Body: EnterpriseTreeMapping
Response: EnterpriseTreeMapping

// 获取动态字段配置
GET /api/enterprise/:enterpriseId/field-configs
Query: { category?: string; categoryCode?: string }
Response: {
  configs: DynamicFieldConfig[]
}
```

### 7.3 数据归集接口

```ts
// 执行数据归集
POST /api/pricing-files/:fileId/aggregate
Body: {
  aggregateTypes: ('material' | 'boq' | 'index')[]
}
Response: {
  taskId: string
  status: 'processing'
}

// 获取归集结果
GET /api/pricing-files/:fileId/aggregated-data
Query: { 
  type: 'material' | 'boq' | 'index'
  dimension?: string
  unitIds?: string[]
}
Response: {
  tree: AggregatedTreeNode[]
  summary: { totalAmount: number; itemCount: number }
}
```

### 7.4 智能套定额接口

```ts
// 批量匹配定额
POST /api/quota-matching/batch
Body: {
  boqItems: Array<{
    id: string
    code: string
    name: string
    unit: string
    quantity: number
  }>
  quotaLibrary: string
  region: string
}
Response: {
  results: Array<{
    boqItemId: string
    recommendations: QuotaMatchResult[]
  }>
}

// 确认定额匹配
POST /api/quota-matching/confirm
Body: {
  matches: Array<{
    boqItemId: string
    quotaId: string
    quotaCode: string
    consumptionFactor?: number
  }>
}
Response: { success: boolean }
```

---

## 8. 数据模型

### 8.1 ER 图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  MaterialTree   │     │    BOQTree      │     │   IndexTree     │
│─────────────────│     │─────────────────│     │─────────────────│
│ id              │     │ id              │     │ id              │
│ code            │     │ code            │     │ code            │
│ name            │     │ name            │     │ name            │
│ parentId        │     │ parentId        │     │ parentId        │
│ matchRules      │     │ matchRules      │     │ calculation     │
└────────┬────────┘     │ linkedQuotas    │     │ benchmark       │
         │              └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │  ┌────────────────────┼───────────────────────┘
         │  │                    │
         ▼  ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EnterpriseTreeMapping                         │
│─────────────────────────────────────────────────────────────────│
│ id | enterpriseId | treeType | mappings | enterpriseTree        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        PricingFile                               │
│─────────────────────────────────────────────────────────────────│
│ id | projectName | uploadTime | source | status | ...           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ AggregatedMaterial│ │  AggregatedBOQ  │   │ AggregatedIndex │
│─────────────────│   │─────────────────│   │─────────────────│
│ categoryId      │   │ categoryId      │   │ categoryId      │
│ categoryCode    │   │ categoryCode    │   │ categoryCode    │
│ amount          │   │ amount          │   │ value           │
│ quantity        │   │ quantity        │   │ unit            │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PullRequest                                │
│─────────────────────────────────────────────────────────────────│
│ id | fileId | supplementData | status | reviewHistory | ...     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EnterpriseAsset                              │
│─────────────────────────────────────────────────────────────────│
│ id | prId | enterpriseId | projectInfo | materials | boqs | ... │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 核心实体定义

详见 `/docs/api/schemas/` 目录下的 Schema 定义文件。

---

## 9. 附录

### 9.1 术语表

| 术语 | 说明 |
|------|------|
| 材料树 | 标准材料分类体系，用于材料数据归集 |
| 清单树 | 标准清单分类体系，用于清单数据归集 |
| 指标树 | 标准指标分类体系，用于指标数据归集 |
| 归集 | 将原始数据按标准树分类汇总的过程 |
| 映射 | 企业自定义科目树与标准树的对应关系 |
| 智能套定额 | 根据清单自动匹配对应定额的功能 |
| 补录 | 入库时补充完善工程信息的过程 |
| PR | Pull Request，数据入库申请 |

### 9.2 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-01-14 | 初始版本 |

---

*文档结束*