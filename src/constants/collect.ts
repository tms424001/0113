// src/constants/collect.ts
// Collect 模块常量定义 - 严格按照 docs/api/schemas/collect.md §5

import type { DraftType, DraftStatus, DraftSource, JobType, JobState, IssueLevel } from '@/types/dto.collect'

// ============================================================================
// Option 类型定义
// ============================================================================

export interface SelectOption<T = string> {
  value: T
  label: string
}

export interface StatusOption<T = string> extends SelectOption<T> {
  color: 'default' | 'processing' | 'success' | 'error' | 'warning'
}

// ============================================================================
// Draft Type Options (草稿类型)
// ============================================================================

export const DRAFT_TYPE_OPTIONS: SelectOption<DraftType>[] = [
  { value: 'pricing_file', label: '造价文件' },
  { value: 'material_sheet', label: '材料表' },
  { value: 'boq_price_sheet', label: '清单价格表' },
]

/** 草稿类型 value -> label 映射 */
export const DRAFT_TYPE_MAP = Object.fromEntries(
  DRAFT_TYPE_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<DraftType, string>

// ============================================================================
// Draft Status Options (草稿状态)
// ============================================================================

export const DRAFT_STATUS_OPTIONS: StatusOption<DraftStatus>[] = [
  { value: 'draft', label: '草稿', color: 'default' },
  { value: 'processing', label: '处理中', color: 'processing' },
  { value: 'ready', label: '就绪', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
]

/** 草稿状态 value -> label 映射 */
export const DRAFT_STATUS_MAP = Object.fromEntries(
  DRAFT_STATUS_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<DraftStatus, string>

/** 草稿状态 value -> color 映射 */
export const DRAFT_STATUS_COLOR_MAP = Object.fromEntries(
  DRAFT_STATUS_OPTIONS.map((opt) => [opt.value, opt.color])
) as Record<DraftStatus, StatusOption['color']>

// ============================================================================
// Draft Source Options (草稿来源)
// ============================================================================

export const DRAFT_SOURCE_OPTIONS: SelectOption<DraftSource>[] = [
  { value: 'upload', label: '上传' },
  { value: 'import', label: '导入' },
  { value: 'sync', label: '同步' },
]

/** 草稿来源 value -> label 映射 */
export const DRAFT_SOURCE_MAP = Object.fromEntries(
  DRAFT_SOURCE_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<DraftSource, string>

// ============================================================================
// Job Type Options (任务类型)
// ============================================================================

export const JOB_TYPE_OPTIONS: SelectOption<JobType>[] = [
  { value: 'parse', label: '解析' },
  { value: 'normalize', label: '标准化' },
  { value: 'validate', label: '校验' },
]

/** 任务类型 value -> label 映射 */
export const JOB_TYPE_MAP = Object.fromEntries(
  JOB_TYPE_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<JobType, string>

// ============================================================================
// Job State Options (任务状态)
// ============================================================================

export const JOB_STATE_OPTIONS: StatusOption<JobState>[] = [
  { value: 'queued', label: '排队中', color: 'default' },
  { value: 'running', label: '运行中', color: 'processing' },
  { value: 'succeeded', label: '成功', color: 'success' },
  { value: 'failed', label: '失败', color: 'error' },
  { value: 'canceled', label: '已取消', color: 'default' },
]

/** 任务状态 value -> label 映射 */
export const JOB_STATE_MAP = Object.fromEntries(
  JOB_STATE_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<JobState, string>

/** 任务状态 value -> color 映射 */
export const JOB_STATE_COLOR_MAP = Object.fromEntries(
  JOB_STATE_OPTIONS.map((opt) => [opt.value, opt.color])
) as Record<JobState, StatusOption['color']>

// ============================================================================
// Issue Level Options (问题级别)
// ============================================================================

export const ISSUE_LEVEL_OPTIONS: StatusOption<IssueLevel>[] = [
  { value: 'error', label: '错误', color: 'error' },
  { value: 'warning', label: '警告', color: 'warning' },
  { value: 'info', label: '提示', color: 'processing' },
]

/** 问题级别 value -> label 映射 */
export const ISSUE_LEVEL_MAP = Object.fromEntries(
  ISSUE_LEVEL_OPTIONS.map((opt) => [opt.value, opt.label])
) as Record<IssueLevel, string>

/** 问题级别 value -> color 映射 */
export const ISSUE_LEVEL_COLOR_MAP = Object.fromEntries(
  ISSUE_LEVEL_OPTIONS.map((opt) => [opt.value, opt.color])
) as Record<IssueLevel, StatusOption['color']>

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 根据 value 获取 Option
 */
export function getOptionByValue<T extends string>(
  options: SelectOption<T>[],
  value: T
): SelectOption<T> | undefined {
  return options.find((opt) => opt.value === value)
}

/**
 * 根据 value 获取 label
 */
export function getLabelByValue<T extends string>(
  options: SelectOption<T>[],
  value: T,
  defaultLabel = '-'
): string {
  return options.find((opt) => opt.value === value)?.label ?? defaultLabel
}

/**
 * 根据 value 获取 color (仅适用于 StatusOption)
 */
export function getColorByValue<T extends string>(
  options: StatusOption<T>[],
  value: T,
  defaultColor: StatusOption['color'] = 'default'
): StatusOption['color'] {
  return options.find((opt) => opt.value === value)?.color ?? defaultColor
}
