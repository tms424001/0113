# StandardizationPage — Golden Example v1.0

> 标准化分析是平台核心能力：造价文件的多维度指标展示与分析
> 采用 Webix TreeTable 实现左树右表交互，四个 Tab 展示不同维度数据

---

## A. Page Intent

**用户目标**：对采集的造价文件进行标准化分析，从原样预览、经济指标、工程量指标、工料机指标四个维度查看和分析数据。

**Pattern**: P5 Custom (Webix TreeTable)

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Tabs: [原样预览] [工程经济指标] [主要工程量指标] [工料机指标]           │
├──────────────────┬──────────────────────────────────────────────────────┤
│ 工程列表      <  │ 📁 金周路站TOD综合开发项目                          │
│                  │ ┌─────────────────────────────────────────────────┐  │
│ ☑ 金周路站TOD... │ │ 项目 [搜索]     展开层次 [0 ]  维度 [归集后 ▼] │  │
│   ☑ 地下室       │ │                                                 │  │
│     ☑ 建筑与装饰 │ │ [工具栏按钮...]           [导出 EXCEL]          │  │
│     ☑ 给排水工程 │ ├─────────────────────────────────────────────────┤  │
│     ☐ 消防工程   │ │                                                 │  │
│     ☐ 通风空调   │ │     WebixTreeTable (右侧主表格)                 │  │
│     ...          │ │     树形结构 + 多列数据                         │  │
│   ☐ 1#楼         │ │                                                 │  │
│   ☐ 2#楼         │ │     每个 Tab 的列配置不同                       │  │
│   ...            │ │                                                 │  │
│   ☐ 西大门       │ │                                                 │  │
│   ☐ 总平         │ │                                                 │  │
│                  │ │                                                 │  │
│ [■■■■■■■■□□]     │ └─────────────────────────────────────────────────┘  │
│ [▶ 开始分析]     │ 📎 附加信息                                         │
└──────────────────┴──────────────────────────────────────────────────────┘
```

---

## B. 左侧工程列表树（三层结构）

```
项目 (Project)
  └── 单项工程 (SubProject)
        └── 单位工程 (Unit)
```

**示例**:
```
☑ 金周路站TOD综合开发项目
  ☑ 地下室
    ☑ 建筑与装饰工程
    ☑ 给排水工程
    ☐ 消防工程
    ☐ 通风空调工程
    ☐ 强电工程
    ☐ 弱电智能化工程
    ...
  ☐ 1#楼
  ☐ 2#楼
  ...
  ☐ 11#楼公交场站
  ☐ 西大门
  ☐ 总平
  ☐ 地下连接通道
  ☐ 甲供暂估价
  ☐ 土石方地基处理及边坡
```

**行为**:
- 复选框控制是否纳入分析范围
- 点击节点 → 右侧表格显示该节点下的数据
- 支持多选（勾选多个单位工程）
- 底部显示进度条 + 「开始分析」按钮

---

## C. Route

```
/standardize/files/:id                      # 标准化分析主页
/standardize/files/:id?tab=original         # 原样预览
/standardize/files/:id?tab=economic         # 工程经济指标
/standardize/files/:id?tab=quantity         # 主要工程量指标
/standardize/files/:id?tab=material         # 工料机指标
```

---

## D. 四个 Tab 详细配置

### Tab 1: 原样预览

**维度**: 无切换

**树结构**: 分部分项 → 子项（如：分部分项 → 给水系统 → 污废水系统...）

**列配置**:
```ts
const originalColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40, template: '{common.checkbox()}' },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'buildingArea', header: '建设规模(建筑面积)(M2)', width: 180 },
  { id: 'unitPrice', header: '单方造价', width: 100 },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'compositePrice', header: '综合单价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100 },
  { id: 'parentRatio', header: '占上级比(%)', width: 100 },
]
```

---

### Tab 2: 工程经济指标

**维度切换**: `归集后` (下拉选择)

**树结构**: 分部分项与单价措施 → 其他/给排水系统/消防系统...

**列配置**:
```ts
const economicColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40 },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'buildingArea', header: '建设规模(建筑面积)(M2)', width: 180 },
  { id: 'unitPrice', header: '单方造价', width: 100 },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'quantity', header: '工程量', width: 100 },
  { id: 'compositePrice', header: '综合单价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100 },
  { id: 'specialScale', header: '特殊规模', width: 100 },
  { id: 'specialUnit', header: '特殊单位', width: 80 },
  { id: 'specialUnitPrice', header: '特殊单价', width: 100 },
  { id: 'remark', header: '备注', width: 120 },
]
```

---

### Tab 3: 主要工程量指标

**维度切换**: `工程量树` (下拉选择)

**树结构**: 按工程分类编码组织
```
01 房屋建筑与装饰工程
  └── 0104 砌筑工程
        ├── 010401 砌砖体
        └── 010402 砌块砌体
  └── 0105 混凝土及钢筋混凝土工程
  └── 0106 金属结构工程
  └── 0108 门窗工程
  └── 0109 屋面及防水工程
  └── 0110 保温、隔热、防腐工程
  └── 0111 楼地面装饰工程
  └── 0112 墙、柱面装饰与隔断、幕墙工程
  └── 0113 天棚工程
  └── 0114 油漆、涂料、裱糊工程
  └── 0115 其他装饰工程
  └── 0116 措施项目
03 通用安装工程
其他
未归类
```

**列配置**:
```ts
const quantityColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40 },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'quantity', header: '工程量', width: 100 },
  { id: 'compositePrice', header: '综合单价', width: 100 },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'buildingArea', header: '建设规模(建筑面积)(M2)', width: 180 },
  { id: 'unitContent', header: '单位含量', width: 100 },
  { id: 'unitCost', header: '单位造价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100 },
  { id: 'parentRatio', header: '占上级比(%)', width: 100 },
]
```

---

### Tab 4: 工料机指标

**维度切换**: `材料树` (下拉选择)

**树结构**: 按材料分类组织
```
材料及设备
  └── 01 黑色、有色金属及制品
        ├── 0101 线材及其制品
        ├── 0103 型材
        ├── 0105 板材
        └── 0107 金属原材
  └── 02 橡胶、塑料及棉麻制品
  └── 03 五金制品
  └── 04 水泥、砖瓦灰砂石
  └── 05 竹木材及其制品
  └── 06 玻璃与玻璃制品
  └── 07 墙砖、地砖、地板、地毯类材料
  └── 10 龙骨、龙骨配件
  └── 11 门窗、门窗框料及楼梯制品
  └── 12 装饰线条、装饰件、栏杆、扶手及其他
  └── 13 涂料及防腐、防水材料
  └── 14 油品、化工原料及胶粘材料
  └── 15 绝热（保温）、耐火材料
  └── 17 管材
  └── 18 管件及管道通用器材
  └── 19 阀门、法兰及其垫片
  └── 21 洁具及燃气器具
  ...
```

**列配置**:
```ts
const materialColumns: TreeTableColumn[] = [
  { id: 'checkbox', header: '', width: 40 },
  { id: 'name', header: '项目', fillspace: true, template: '{common.treetable()} #name#' },
  { id: 'unit', header: '单位', width: 60 },
  { id: 'quantity', header: '数量', width: 100 },
  { id: 'avgPrice', header: '平均价格', width: 100 },
  { id: 'amount', header: '金额(元)', width: 120, format: 'money' },
  { id: 'unitContent', header: '单位含量', width: 100 },
  { id: 'unitCost', header: '单方造价', width: 100 },
  { id: 'totalRatio', header: '占总比(%)', width: 100 },
]
```

---

## E. Data Contract

### 工程列表树

```ts
// 获取工程列表树（左侧）
GET /api/pricing-files/:id/project-tree
Response: {
  tree: ProjectTreeNode[]
}

interface ProjectTreeNode {
  id: string
  name: string
  type: 'project' | 'subProject' | 'unit'
  parentId?: string
  children?: ProjectTreeNode[]
  checked?: boolean           // 是否勾选
}
```

### Tab 数据

```ts
// 原样预览数据
GET /api/pricing-files/:id/original
Query: { unitIds?: string[] }  // 勾选的单位工程ID
Response: {
  items: OriginalDataRow[]
  summary: { totalAmount: number; buildingArea: number }
}

interface OriginalDataRow {
  id: string
  name: string
  parentId?: string
  level: number
  amount?: number
  buildingArea?: number
  unitPrice?: number
  unit?: string
  compositePrice?: number
  totalRatio?: number
  parentRatio?: number
}

// 工程经济指标数据
GET /api/pricing-files/:id/economic-indices
Query: { unitIds?: string[]; dimension?: string }
Response: {
  items: EconomicIndexRow[]
  summary: { ... }
}

interface EconomicIndexRow {
  id: string
  name: string
  parentId?: string
  level: number
  amount?: number
  buildingArea?: number
  unitPrice?: number
  unit?: string
  quantity?: number
  compositePrice?: number
  totalRatio?: number
  specialScale?: number
  specialUnit?: string
  specialUnitPrice?: number
  remark?: string
}

// 主要工程量指标数据
GET /api/pricing-files/:id/quantity-indices
Query: { unitIds?: string[]; dimension?: string }
Response: {
  items: QuantityIndexRow[]
  summary: { ... }
}

interface QuantityIndexRow {
  id: string
  code: string               // 工程分类编码，如 010401
  name: string
  parentId?: string
  level: number
  unit?: string
  quantity?: number
  compositePrice?: number
  amount?: number
  buildingArea?: number
  unitContent?: number       // 单位含量
  unitCost?: number          // 单位造价
  totalRatio?: number
  parentRatio?: number
}

// 工料机指标数据
GET /api/pricing-files/:id/material-indices
Query: { unitIds?: string[]; dimension?: string }
Response: {
  items: MaterialIndexRow[]
  summary: { ... }
}

interface MaterialIndexRow {
  id: string
  code: string               // 材料分类编码，如 0101
  name: string
  parentId?: string
  level: number
  unit?: string
  quantity?: number
  avgPrice?: number          // 平均价格
  amount?: number
  unitContent?: number       // 单位含量
  unitCost?: number          // 单方造价
  totalRatio?: number
}
```

### 开始分析

```ts
// 开始分析（将选中的数据进行标准化处理）
POST /api/pricing-files/:id/analyze
Body: {
  unitIds: string[]          // 勾选的单位工程
  options?: {
    includeOriginal: boolean
    includeEconomic: boolean
    includeQuantity: boolean
    includeMaterial: boolean
  }
}
Response: {
  taskId: string             // 异步任务ID
  status: 'processing'
}

// 查询分析进度
GET /api/pricing-files/:id/analyze-status
Response: {
  status: 'processing' | 'completed' | 'failed'
  progress: number           // 0-100
  result?: {
    projectId: string        // 存入的工程ID
    stats: { ... }
  }
}
```

---

## F. Permissions

| Action | Permission Key |
|--------|----------------|
| 查看 | standardize.read |
| 勾选/编辑 | standardize.write |
| 开始分析 | standardize.write |
| 导出 EXCEL | standardize.export |

---

## G. 工具栏配置

### 右侧表格上方工具栏

```tsx
interface ToolbarProps {
  // 搜索
  searchValue: string
  onSearch: (value: string) => void
  
  // 展开层次控制
  expandLevel: number         // 0-5
  onExpandLevelChange: (level: number) => void
  
  // 维度切换（不同 Tab 选项不同）
  dimensionOptions?: Array<{ value: string; label: string }>
  dimensionValue?: string
  onDimensionChange?: (value: string) => void
  
  // 导出
  onExport: () => void
}

// 维度选项配置
const DIMENSION_OPTIONS = {
  original: [],  // 原样预览无维度切换
  economic: [
    { value: 'aggregated', label: '归集后' },
    { value: 'original', label: '原始' },
  ],
  quantity: [
    { value: 'quantity_tree', label: '工程量树' },
    { value: 'boq_tree', label: '清单树' },
  ],
  material: [
    { value: 'material_tree', label: '材料树' },
    { value: 'category_tree', label: '分类树' },
  ],
}
```

---

## H. Component Structure

### 1) 左侧工程列表

```tsx
// components/ProjectTreePanel.tsx
interface ProjectTreePanelProps {
  data: ProjectTreeNode[]
  checkedKeys: string[]
  onCheck: (checkedKeys: string[]) => void
  onSelect: (selectedKey: string) => void
  loading?: boolean
}

// 功能
- 三层树结构：项目 → 单项工程 → 单位工程
- 复选框控制勾选状态
- 勾选父节点自动勾选所有子节点
- 底部显示分析进度条
- 「开始分析」按钮

// 样式
- 宽度: 可收起（点击 < 按钮）
- 收起后宽度: 0px（完全隐藏）
- 展开后宽度: 约 200px
```

### 2) 右侧 Tabs

```tsx
// Tabs 配置
const tabs = [
  { key: 'original', label: '原样预览' },
  { key: 'economic', label: '工程经济指标' },
  { key: 'quantity', label: '主要工程量指标' },
  { key: 'material', label: '工料机指标' },
]

// Tab 切换行为
- 保持左侧工程列表勾选状态
- 切换维度选项
- 重新加载对应 Tab 的数据
- URL 同步: ?tab=xxx
```

### 3) WebixTreeTable

```tsx
// 通用的 TreeTable 组件
interface TabTreeTableProps {
  tabKey: 'original' | 'economic' | 'quantity' | 'material'
  data: TreeTableRow[]
  columns: TreeTableColumn[]
  expandLevel: number
  searchValue?: string
  onRowClick?: (row: TreeTableRow) => void
  loading?: boolean
}

// 功能
- 树形展开/收起
- 列排序（点击表头）
- 展开层次控制
- 搜索高亮
- 复选框选择
- 合计行固定在底部
```

### 4) 工具栏

```tsx
// components/Toolbar.tsx
<div className={styles.toolbar}>
  {/* 面包屑 */}
  <span className={styles.breadcrumb}>
    📁 {currentProject.name}
  </span>

  {/* 搜索 */}
  <Input.Search
    placeholder="输入查找关键字"
    value={searchValue}
    onChange={onSearch}
    style={{ width: 200 }}
  />

  {/* 展开层次 */}
  <span>展开层次</span>
  <InputNumber
    min={0}
    max={10}
    value={expandLevel}
    onChange={onExpandLevelChange}
    style={{ width: 60 }}
  />

  {/* 维度切换 */}
  {dimensionOptions && (
    <>
      <span>维度</span>
      <Select
        value={dimensionValue}
        onChange={onDimensionChange}
        options={dimensionOptions}
        style={{ width: 120 }}
      />
    </>
  )}

  {/* 其他工具按钮 */}
  <div className={styles.toolButtons}>
    {/* 图标按钮组... */}
  </div>

  {/* 导出 */}
  <Button icon={<ExportOutlined />} onClick={onExport}>
    EXCEL
  </Button>
</div>
```

### 5) 附加信息面板

```tsx
// 底部附加信息
<div className={styles.footer}>
  📎 附加信息
  {/* 展开后显示项目相关的附加信息 */}
</div>
```

---

## I. Page Store

```ts
// src/stores/standardizePageStore.ts
interface StandardizePageState {
  // 文件信息
  fileId: string | null
  fileInfo: PricingFileDTO | null
  
  // 左侧工程树
  projectTree: ProjectTreeNode[]
  checkedUnitIds: string[]       // 勾选的单位工程ID
  selectedNodeId: string | null  // 当前点击的节点
  leftPanelCollapsed: boolean    // 左侧面板是否收起
  
  // Tab 状态
  activeTab: 'original' | 'economic' | 'quantity' | 'material'
  
  // 工具栏状态
  searchValue: string
  expandLevel: number
  dimension: string              // 当前维度
  
  // Tab 数据
  originalData: OriginalDataRow[]
  economicData: EconomicIndexRow[]
  quantityData: QuantityIndexRow[]
  materialData: MaterialIndexRow[]
  
  // 加载状态
  loading: boolean
  analyzing: boolean
  analyzeProgress: number
  
  // Actions
  setFileId: (id: string) => void
  setCheckedUnitIds: (ids: string[]) => void
  setSelectedNode: (id: string) => void
  toggleLeftPanel: () => void
  setActiveTab: (tab: string) => void
  setSearchValue: (value: string) => void
  setExpandLevel: (level: number) => void
  setDimension: (dimension: string) => void
  loadTabData: () => Promise<void>
  startAnalyze: () => Promise<void>
}
```

---

## J. Interaction Rules

### 左侧工程树
```
1. 进入页面 → 加载工程树 → 默认全部勾选
2. 点击复选框 → 更新 checkedUnitIds → 右侧表格重新加载数据
3. 点击收起按钮(<) → 隐藏左侧面板 → 右侧表格扩展
4. 点击节点 → 高亮该节点（不影响勾选状态）
```

### Tab 切换
```
1. 点击 Tab → 切换 activeTab → URL 同步 ?tab=xxx
2. 切换时 → 重置搜索条件 → 切换维度选项 → 加载新 Tab 数据
3. 维度切换 → 重新加载当前 Tab 数据
```

### 工具栏操作
```
1. 搜索 → 前端过滤 + 高亮匹配项
2. 展开层次 → 控制树形表格展开深度
3. 维度切换 → 请求新维度数据
4. 导出 EXCEL → 下载当前 Tab 数据
```

### 开始分析
```
1. 点击「开始分析」→ 确认勾选范围 → 提交分析任务
2. 显示进度条 → 轮询分析状态
3. 分析完成 → 数据存入个人资产库 → 提示成功
```

---

## K. States

### Loading
- 工程树加载中：左侧显示 Skeleton
- 表格数据加载中：表格区域显示 Loading

### Empty
- 未勾选任何单位工程：显示「请在左侧勾选需要分析的单位工程」

### Error
- API 错误：显示错误信息 + 重试按钮

### Analyzing
- 分析进行中：底部进度条 + 禁用「开始分析」按钮

---

## L. Code Skeleton

```tsx
// src/pages/standardize/StandardizationPage/index.tsx
import { useParams, useSearchParams } from 'react-router-dom'
import { Tabs, Button, Checkbox, Tree, InputNumber, Select, Input } from 'antd'
import { WebixTreeTable } from '@/components/webix'
import { useStandardizePageStore } from '@/stores/standardizePageStore'
import { usePermission } from '@/hooks/usePermission'
import {
  originalColumns,
  economicColumns,
  quantityColumns,
  materialColumns,
  DIMENSION_OPTIONS,
} from './config'
import styles from './StandardizationPage.module.css'

export const StandardizationPage = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') || 'original') as TabKey

  const canWrite = usePermission('standardize.write')
  const canExport = usePermission('standardize.export')

  const {
    projectTree,
    checkedUnitIds,
    setCheckedUnitIds,
    leftPanelCollapsed,
    toggleLeftPanel,
    searchValue,
    setSearchValue,
    expandLevel,
    setExpandLevel,
    dimension,
    setDimension,
    originalData,
    economicData,
    quantityData,
    materialData,
    loading,
    analyzing,
    analyzeProgress,
    startAnalyze,
  } = useStandardizePageStore()

  // 获取当前 Tab 的数据和列配置
  const getTabConfig = () => {
    switch (activeTab) {
      case 'original':
        return { data: originalData, columns: originalColumns, dimensions: [] }
      case 'economic':
        return { data: economicData, columns: economicColumns, dimensions: DIMENSION_OPTIONS.economic }
      case 'quantity':
        return { data: quantityData, columns: quantityColumns, dimensions: DIMENSION_OPTIONS.quantity }
      case 'material':
        return { data: materialData, columns: materialColumns, dimensions: DIMENSION_OPTIONS.material }
    }
  }

  const tabConfig = getTabConfig()

  return (
    <div className={styles.page}>
      {/* 左侧工程列表面板 */}
      <div className={cn(styles.leftPanel, { [styles.collapsed]: leftPanelCollapsed })}>
        <div className={styles.panelHeader}>
          <span>工程列表</span>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={toggleLeftPanel}
          />
        </div>

        <Tree
          checkable
          treeData={projectTree}
          checkedKeys={checkedUnitIds}
          onCheck={(keys) => setCheckedUnitIds(keys as string[])}
          className={styles.projectTree}
        />

        <div className={styles.panelFooter}>
          {/* 进度条 */}
          {analyzing && (
            <Progress percent={analyzeProgress} size="small" />
          )}
          
          {/* 开始分析按钮 */}
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={startAnalyze}
            loading={analyzing}
            disabled={!canWrite || checkedUnitIds.length === 0}
            block
          >
            开始分析
          </Button>
        </div>
      </div>

      {/* 右侧主内容区 */}
      <div className={styles.mainContent}>
        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setSearchParams({ tab: key })}
          items={[
            { key: 'original', label: '原样预览' },
            { key: 'economic', label: '工程经济指标' },
            { key: 'quantity', label: '主要工程量指标' },
            { key: 'material', label: '工料机指标' },
          ]}
        />

        {/* 工具栏 */}
        <div className={styles.toolbar}>
          <span className={styles.breadcrumb}>
            📁 {fileInfo?.name}
          </span>

          <Input.Search
            placeholder="输入查找关键字"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 180 }}
          />

          <span>展开层次</span>
          <InputNumber
            min={0}
            max={10}
            value={expandLevel}
            onChange={setExpandLevel}
            style={{ width: 60 }}
          />

          {tabConfig.dimensions.length > 0 && (
            <>
              <span>维度</span>
              <Select
                value={dimension}
                onChange={setDimension}
                options={tabConfig.dimensions}
                style={{ width: 120 }}
              />
            </>
          )}

          <div className={styles.spacer} />

          {canExport && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              EXCEL
            </Button>
          )}
        </div>

        {/* 树形表格 */}
        <div className={styles.tableContainer}>
          <WebixTreeTable
            data={tabConfig.data}
            columns={tabConfig.columns}
            expandLevel={expandLevel}
            searchValue={searchValue}
            loading={loading}
          />
        </div>

        {/* 附加信息 */}
        <div className={styles.footer}>
          📎 附加信息
        </div>
      </div>
    </div>
  )
}
```

---

## M. Styles

```css
/* src/pages/standardize/StandardizationPage/StandardizationPage.module.css */
.page {
  display: flex;
  height: calc(100vh - 48px);  /* 减去 TopNav 高度 */
}

.leftPanel {
  width: 200px;
  flex-shrink: 0;
  background: var(--color-bg-card);
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
}

.leftPanel.collapsed {
  width: 0;
  overflow: hidden;
}

.panelHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
}

.projectTree {
  flex: 1;
  overflow: auto;
  padding: var(--spacing-sm);
}

.panelFooter {
  padding: var(--spacing-md);
  border-top: 1px solid #e8e8e8;
}

.mainContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--color-bg-card);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-bottom: 1px solid #e8e8e8;
}

.breadcrumb {
  color: rgba(0, 0, 0, 0.65);
}

.spacer {
  flex: 1;
}

.tableContainer {
  flex: 1;
  overflow: hidden;
  padding: var(--spacing-md);
}

.footer {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-top: 1px solid #e8e8e8;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
}

.footer:hover {
  background: var(--color-bg-table-hover);
}
```

---

## N. DoD Checklist

```
## DoD Checklist

- DoD-1: ✅ 勾选工程 → 切换Tab → 查看数据 → 开始分析，流程闭环
- DoD-2: ✅ Loading（树/表格）、Empty（未勾选）、Error（重试）三态实现
- DoD-3: ✅ 所有字段来自 OriginalDataRow/EconomicIndexRow/QuantityIndexRow/MaterialIndexRow
- DoD-4: ✅ 必须勾选至少一个单位工程才能开始分析
- DoD-5: ✅ 左右分栏布局，符合平台规范
```

---

## O. 文件结构

```
src/pages/standardize/StandardizationPage/
├── index.tsx                    # 主页面组件
├── config.ts                    # 列配置、维度选项
├── StandardizationPage.module.css
└── components/
    ├── ProjectTreePanel.tsx     # 左侧工程树
    ├── Toolbar.tsx              # 工具栏
    └── TabContent.tsx           # Tab 内容包装
```