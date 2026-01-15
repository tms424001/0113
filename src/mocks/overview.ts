// src/mocks/overview.ts
// 总览页面 Mock 数据

import type { TodoItem } from '@/pages/collect/OverviewPage/components/TodoList'
import type { SourceData } from '@/pages/collect/OverviewPage/components/SourceChart'
import type { RecentProjectDTO } from '@/pages/collect/OverviewPage/components/RecentProjects'

/**
 * 统计数据
 */
interface StatsData {
  projects: { total: number; canSubmit: number; editing: number }
  materials: { total: number; approved: number; pending: number }
  boqs: { total: number; approved: number; pending: number }
}

/**
 * 总览页面数据
 */
interface OverviewData {
  stats: StatsData
  todoItems: TodoItem[]
  sourceData: SourceData[]
  sourceTotal: number
  recentProjects: RecentProjectDTO[]
}

/**
 * 获取总览页面 Mock 数据
 */
export function getMockOverviewData(): OverviewData {
  // 统计数据
  const stats: StatsData = {
    projects: { total: 25, canSubmit: 6, editing: 19 },
    materials: { total: 156, approved: 120, pending: 36 },
    boqs: { total: 89, approved: 65, pending: 24 },
  }

  // 待处理事项
  const todoItems: TodoItem[] = [
    {
      id: '1',
      type: 'incomplete',
      title: '项目补录不足',
      description: '3个项目的基本信息不完整，需要补充',
      path: '/collect/my/projects?filter=incomplete',
    },
    {
      id: '2',
      type: 'mapping',
      title: '材料待映射',
      description: '12条材料记录需要进行标准化映射',
      path: '/collect/my/materials?filter=unmapped',
    },
    {
      id: '3',
      type: 'rejected',
      title: '入库被退回',
      description: 'PR-2024-0156 被退回，原因：材料价格异常',
      path: '/pr?filter=rejected',
    },
    {
      id: '4',
      type: 'pending',
      title: '入库待审批',
      description: 'PR-2024-0158 正在审批中',
      path: '/pr?filter=pending',
    },
  ]

  // 项目来源分布
  const sourceData: SourceData[] = [
    { source: 'pricing', label: '计价', count: 12, percent: 48, color: '#1890ff' },
    { source: 'quality', label: '质控', count: 6, percent: 24, color: '#fa8c16' },
    { source: 'estimate', label: '估算', count: 5, percent: 20, color: '#722ed1' },
    { source: 'collect', label: '采集', count: 2, percent: 8, color: '#13c2c2' },
  ]
  const sourceTotal = 25

  // 最近项目
  const recentProjects: RecentProjectDTO[] = [
    {
      id: 'p1',
      projectName: '某市政道路改造工程',
      subProjectCount: 3,
      uploadTime: '2024-01-15',
      source: 'pricing',
      amount: 1256.78,
      completion: 85,
      status: 'canSubmit',
    },
    {
      id: 'p2',
      projectName: '某住宅小区建设项目',
      subProjectCount: 5,
      uploadTime: '2024-01-14',
      source: 'quality',
      amount: 3421.50,
      completion: 92,
      status: 'submitted',
    },
    {
      id: 'p3',
      projectName: '某办公楼装修工程',
      uploadTime: '2024-01-13',
      source: 'estimate',
      amount: 456.32,
      completion: 60,
      status: 'editing',
    },
    {
      id: 'p4',
      projectName: '某学校综合楼新建工程',
      subProjectCount: 2,
      uploadTime: '2024-01-12',
      source: 'collect',
      amount: 2180.00,
      completion: 78,
      status: 'canSubmit',
    },
    {
      id: 'p5',
      projectName: '某医院门诊楼扩建项目',
      subProjectCount: 4,
      uploadTime: '2024-01-11',
      source: 'pricing',
      amount: 5678.90,
      completion: 45,
      status: 'editing',
    },
  ]

  return {
    stats,
    todoItems,
    sourceData,
    sourceTotal,
    recentProjects,
  }
}
