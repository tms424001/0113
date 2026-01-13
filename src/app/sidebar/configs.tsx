// src/app/sidebar/configs.tsx - IA v1.3
import {
  DashboardOutlined,
  UploadOutlined,
  FileTextOutlined,
  InboxOutlined,
  DatabaseOutlined,
  ShopOutlined,
  AuditOutlined,
  BranchesOutlined,
  FileSearchOutlined,
  DiffOutlined,
  BarChartOutlined,
  SettingOutlined,
  BulbOutlined,
  CalculatorOutlined,
  FundProjectionScreenOutlined,
  UnorderedListOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import type { SidebarConfig } from './types'
import { ROUTES } from '../../constants/routes'

/**
 * 数据采集模块侧边栏配置
 */
export const collectSidebarConfig: SidebarConfig = {
  mode: 'simple',
  defaultPath: ROUTES.COLLECT.DASHBOARD,
  nodes: [
    {
      type: 'item',
      key: 'collect-dashboard',
      label: '总览',
      icon: <DashboardOutlined />,
      path: ROUTES.COLLECT.DASHBOARD,
    },
    { type: 'divider', key: 'collect-divider-1' },
    {
      type: 'group',
      key: 'collect-ingest',
      label: '采集入口',
      icon: <UploadOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'collect-ingest-pricing',
          label: '造价文件采集',
          path: ROUTES.COLLECT.INGEST.PRICING,
        },
        {
          type: 'item',
          key: 'collect-ingest-material',
          label: '材料数据采集',
          path: ROUTES.COLLECT.INGEST.MATERIAL,
        },
        {
          type: 'item',
          key: 'collect-ingest-boq',
          label: '清单数据采集',
          path: ROUTES.COLLECT.INGEST.BOQ,
        },
      ],
    },
    {
      type: 'group',
      key: 'collect-my',
      label: '我的采集',
      icon: <InboxOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'collect-drafts',
          label: '草稿箱',
          path: ROUTES.COLLECT.DRAFTS,
          badgeKey: 'drafts',
        },
        {
          type: 'item',
          key: 'collect-materials',
          label: '材料库',
          path: ROUTES.COLLECT.MATERIALS,
        },
        {
          type: 'item',
          key: 'collect-boq-items',
          label: '清单库',
          path: ROUTES.COLLECT.BOQ_ITEMS,
        },
        {
          type: 'item',
          key: 'collect-projects',
          label: '案例库',
          path: ROUTES.COLLECT.PROJECTS,
        },
      ],
    },
  ],
}

/**
 * 数据资产模块侧边栏配置
 */
export const assetsSidebarConfig: SidebarConfig = {
  mode: 'simple',
  defaultPath: ROUTES.ASSETS.DASHBOARD,
  nodes: [
    {
      type: 'group',
      key: 'assets-enterprise',
      label: '企业库',
      icon: <DatabaseOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'assets-dashboard',
          label: '看板',
          icon: <DashboardOutlined />,
          path: ROUTES.ASSETS.DASHBOARD,
        },
        {
          type: 'item',
          key: 'assets-materials',
          label: '材料价格库',
          path: ROUTES.ASSETS.MATERIALS,
        },
        {
          type: 'item',
          key: 'assets-boq-prices',
          label: '清单价格库',
          path: ROUTES.ASSETS.BOQ_PRICES,
        },
        {
          type: 'item',
          key: 'assets-projects',
          label: '案例库',
          path: ROUTES.ASSETS.PROJECTS,
        },
        {
          type: 'item',
          key: 'assets-indicators',
          label: '指标库',
          path: ROUTES.ASSETS.INDICATORS,
        },
      ],
    },
    {
      type: 'group',
      key: 'assets-governance',
      label: '数据治理',
      icon: <AuditOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'assets-governance-publish',
          label: '入库与发布',
          path: ROUTES.ASSETS.GOVERNANCE,
          permissionKey: 'assets:governance',
        },
        {
          type: 'item',
          key: 'assets-tags',
          label: '标签与分类',
          path: ROUTES.ASSETS.TAGS,
          permissionKey: 'assets:governance',
        },
      ],
    },
    {
      type: 'group',
      key: 'assets-mall',
      label: '数据商城',
      icon: <ShopOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'assets-mall-info-prices',
          label: '信息价',
          path: ROUTES.ASSETS.MALL.INFO_PRICES,
        },
        {
          type: 'item',
          key: 'assets-mall-market-prices',
          label: '清单市场价',
          path: ROUTES.ASSETS.MALL.MARKET_PRICES,
        },
        {
          type: 'item',
          key: 'assets-mall-projects',
          label: '案例工程',
          path: ROUTES.ASSETS.MALL.PROJECTS,
        },
      ],
    },
  ],
}

/**
 * 计价模块侧边栏配置
 */
export const pricingSidebarConfig: SidebarConfig = {
  mode: 'simple',
  defaultPath: ROUTES.PRICING.FILES,
  nodes: [
    {
      type: 'group',
      key: 'pricing-files',
      label: '计价文件',
      icon: <FileTextOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'pricing-files-list',
          label: '文件列表',
          path: ROUTES.PRICING.FILES,
        },
      ],
    },
    {
      type: 'group',
      key: 'pricing-quota',
      label: '智能套定额',
      icon: <BranchesOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'pricing-tasks',
          label: '套定额任务',
          path: ROUTES.PRICING.TASKS,
        },
        {
          type: 'item',
          key: 'pricing-knowledge',
          label: '映射知识库',
          path: ROUTES.PRICING.KNOWLEDGE,
        },
        {
          type: 'item',
          key: 'pricing-push-logs',
          label: '推送记录',
          path: ROUTES.PRICING.PUSH_LOGS,
        },
      ],
    },
    {
      type: 'group',
      key: 'pricing-issue',
      label: 'Issue协同',
      icon: <LinkOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'pricing-collaboration',
          label: '客户端协同',
          path: ROUTES.PRICING.COLLABORATION,
        },
        {
          type: 'item',
          key: 'pricing-issues',
          label: 'Issue工作台',
          path: ROUTES.PRICING.ISSUES,
          badgeKey: 'issues',
        },
      ],
    },
  ],
}

/**
 * 质控模块侧边栏配置
 */
export const qualitySidebarConfig: SidebarConfig = {
  mode: 'simple',
  defaultPath: ROUTES.QUALITY.CHECK.FILE_VERIFY,
  nodes: [
    {
      type: 'group',
      key: 'quality-single',
      label: '单文件检查',
      icon: <FileSearchOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'quality-file-verify',
          label: '文件校核',
          path: ROUTES.QUALITY.CHECK.FILE_VERIFY,
          matchPaths: ['/quality/check/file-verify/'],
        },
        {
          type: 'item',
          key: 'quality-material-price',
          label: '材料价格检查',
          path: ROUTES.QUALITY.CHECK.MATERIAL_PRICE,
          matchPaths: ['/quality/check/material-price/'],
        },
        {
          type: 'item',
          key: 'quality-boq-price',
          label: '清单价格检查',
          path: ROUTES.QUALITY.CHECK.BOQ_PRICE,
          matchPaths: ['/quality/check/boq-price/'],
        },
        {
          type: 'item',
          key: 'quality-boq-defect',
          label: '清单缺陷检查',
          path: ROUTES.QUALITY.CHECK.BOQ_DEFECT,
          matchPaths: ['/quality/check/boq-defect/'],
        },
      ],
    },
    {
      type: 'group',
      key: 'quality-multi',
      label: '多文件对比',
      icon: <DiffOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'quality-clear-bid',
          label: '清标分析',
          path: ROUTES.QUALITY.MULTI.CLEAR_BID,
        },
        {
          type: 'item',
          key: 'quality-settlement',
          label: '结算复核',
          path: ROUTES.QUALITY.MULTI.SETTLEMENT,
        },
        {
          type: 'item',
          key: 'quality-estimate-reg',
          label: '概算回归',
          path: ROUTES.QUALITY.MULTI.ESTIMATE_REG,
        },
        {
          type: 'item',
          key: 'quality-indicators',
          label: '指标对比',
          path: ROUTES.QUALITY.MULTI.INDICATORS,
        },
      ],
    },
    {
      type: 'group',
      key: 'quality-manage',
      label: '管理',
      icon: <SettingOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'quality-reports',
          label: '报告中心',
          path: ROUTES.QUALITY.REPORTS,
        },
        {
          type: 'item',
          key: 'quality-rules',
          label: '质控规则',
          path: ROUTES.QUALITY.RULES,
          permissionKey: 'quality:rules',
        },
      ],
    },
  ],
}

/**
 * 估算模块侧边栏配置
 */
export const estimationSidebarConfig: SidebarConfig = {
  mode: 'simple',
  defaultPath: ROUTES.ESTIMATION.LIST,
  nodes: [
    {
      type: 'group',
      key: 'estimation-create',
      label: '新建估算',
      icon: <CalculatorOutlined />,
      defaultOpen: true,
      children: [
        {
          type: 'item',
          key: 'estimation-analogy',
          label: '智能类比估算',
          icon: <BulbOutlined />,
          path: ROUTES.ESTIMATION.CREATE.ANALOGY,
        },
        {
          type: 'item',
          key: 'estimation-metric',
          label: '快速指标匡算',
          icon: <BarChartOutlined />,
          path: ROUTES.ESTIMATION.CREATE.METRIC,
        },
        {
          type: 'item',
          key: 'estimation-parametric',
          label: '参数化模型估算',
          icon: <FundProjectionScreenOutlined />,
          path: ROUTES.ESTIMATION.CREATE.PARAMETRIC,
        },
      ],
    },
    { type: 'divider', key: 'estimation-divider-1' },
    {
      type: 'item',
      key: 'estimation-list',
      label: '我的估算',
      icon: <UnorderedListOutlined />,
      path: ROUTES.ESTIMATION.LIST,
    },
  ],
}
