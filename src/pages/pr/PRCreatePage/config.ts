// src/pages/pr/PRCreatePage/config.ts
// PR 创建页面配置

/**
 * 步骤配置
 */
export const stepConfig = [
  { key: 'select', title: '选择项目' },
  { key: 'basic', title: '基本信息' },
  { key: 'subProjects', title: '单项工程' },
  { key: 'confirm', title: '确认提交' },
] as const

/**
 * 工程分类选项
 */
export const PROJECT_CATEGORY_OPTIONS = [
  { value: 'civil', label: '房屋建筑' },
  { value: 'municipal', label: '市政工程' },
  { value: 'landscape', label: '园林绿化' },
  { value: 'decoration', label: '装饰装修' },
  { value: 'installation', label: '安装工程' },
  { value: 'other', label: '其他' },
] as const

/**
 * 编制阶段选项
 */
export const COMPILATION_PHASE_OPTIONS = [
  { value: 'budget_estimate', label: '概算' },
  { value: 'bidding_boq', label: '招标工程量清单' },
  { value: 'max_bid_limit', label: '最高投标限价' },
  { value: 'contract_price', label: '合同价' },
  { value: 'settlement', label: '结算' },
] as const

/**
 * 建设性质选项
 */
export const CONSTRUCTION_NATURE_OPTIONS = [
  { value: 'new', label: '新建' },
  { value: 'expansion', label: '扩建' },
  { value: 'renovation', label: '改建' },
  { value: 'restoration', label: '修缮' },
] as const

/**
 * 结构类型选项
 */
export const STRUCTURE_TYPE_OPTIONS = [
  { value: 'frame', label: '框架结构' },
  { value: 'frame_shear', label: '框剪结构' },
  { value: 'shear_wall', label: '剪力墙结构' },
  { value: 'brick_concrete', label: '砖混结构' },
  { value: 'steel', label: '钢结构' },
  { value: 'wood', label: '木结构' },
  { value: 'other', label: '其他' },
] as const

/**
 * 目标空间选项
 */
export const TARGET_SPACE_OPTIONS = [
  { value: 'enterprise', label: '企业项目库' },
  { value: 'department', label: '部门项目库' },
  { value: 'personal', label: '个人项目库' },
] as const

/**
 * 基本信息表单字段配置
 */
export const basicFormFields = [
  {
    section: '项目基本信息',
    fields: [
      { name: 'projectName', label: '项目名称', type: 'input', required: true, span: 24 },
      { name: 'region', label: '工程地点', type: 'cascader', required: true, span: 12 },
      { name: 'projectTime', label: '项目时间', type: 'date', required: true, span: 12 },
      { name: 'projectCategory', label: '工程分类', type: 'select', required: true, span: 8, options: PROJECT_CATEGORY_OPTIONS },
      { name: 'compilationPhase', label: '编制阶段', type: 'select', required: true, span: 8, options: COMPILATION_PHASE_OPTIONS },
      { name: 'constructionNature', label: '建设性质', type: 'select', required: false, span: 8, options: CONSTRUCTION_NATURE_OPTIONS },
    ],
  },
  {
    section: '编制信息',
    fields: [
      { name: 'materialPriceDate', label: '材价时间', type: 'date', required: true, span: 8 },
      { name: 'pricingBasis', label: '计价依据', type: 'input', required: false, span: 16 },
    ],
  },
  {
    section: '入库设置',
    fields: [
      { name: 'targetSpace', label: '目标空间', type: 'select', required: true, span: 8, options: TARGET_SPACE_OPTIONS },
    ],
  },
] as const
