// src/hooks/index.ts
// 统一导出所有 Hooks

// 通用请求 Hook
export {
  useRequest,
  useList,
  useDetail,
  type UseRequestResult,
  type UseRequestOptions,
  type UseListResult,
  type UseListOptions,
  type UseDetailResult,
} from './useRequest'

// 权限 Hook
export {
  usePermission,
  usePermissions,
  useHasAnyPermission,
  useHasAllPermissions,
} from './usePermission'

// Collect 模块 Hooks
export {
  useDraftList,
  useDraftDetail,
  useDraftMutation,
  useDraftJobs,
  useDraftIssues,
  type UseDraftListOptions,
  type UseDraftDetailOptions,
} from './useCollect'

// Pricing 模块 Hooks
export {
  usePricingTaskList,
  usePricingTaskDetail,
  useMappingRecordList,
  useMappingRecordMutation,
  usePricingIssueList,
  usePricingIssueMutation,
  usePushRecordList,
  usePushTask,
  type UsePricingTaskListOptions,
  type UseMappingRecordListOptions,
  type UsePricingIssueListOptions,
  type UsePushRecordListOptions,
} from './usePricing'

// Project 模块 Hooks
export {
  // Project
  useProjectList,
  useProjectDetail,
  useProjectMutation,
  // SubProject
  useSubProjectList,
  useSubProjectDetail,
  useSubProjectMutation,
  // Unit
  useUnitList,
  useUnitDetail,
  useUnitMutation,
  // PricingFile
  usePricingFileList,
  usePricingFileDetail,
  // Material
  useMaterialList,
  useMaterialDetail,
  // BOQItem
  useBOQItemList,
  useBOQItemDetail,
  // Index
  useIndexList,
  useIndexDetail,
  // Types
  type UseProjectListOptions,
  type UseSubProjectListOptions,
  type UseUnitListOptions,
  type UsePricingFileListOptions,
  type UseMaterialListOptions,
  type UseBOQItemListOptions,
  type UseIndexListOptions,
} from './useProject'

// PR 模块 Hooks
export {
  usePRList,
  usePRDetail,
  usePRMutation,
  usePRActions,
  usePRReviews,
  usePRComments,
  usePRDiff,
  type UsePRListOptions,
} from './usePR'
