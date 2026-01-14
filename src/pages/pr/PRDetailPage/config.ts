// src/pages/pr/PRDetailPage/config.ts
// PR 详情页面配置

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
