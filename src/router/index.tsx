// src/router/index.tsx
// 路由配置文件 - 整合所有页面

import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { Spin } from 'antd'

// ===== 布局组件 =====
import AppShell from '@/components/layout/AppShell'

// ===== 懒加载包装器 =====
const LazyLoad = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense
    fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
        <Spin size="large" tip="加载中..." />
      </div>
    }
  >
    <Component />
  </Suspense>
)

// ===== 采集入口 =====
const CollectUploadPage = lazy(() => import('@/pages/collect/CollectUploadPage'))
const CollectDraftsPage = lazy(() => import('@/pages/collect/DraftsPage'))

// ===== 标准化处理 =====
const StandardizeFilePage = lazy(() => import('@/pages/standardize/StandardizationPage'))

// ===== 数据资产 =====
const AssetsDashboard = lazy(() => import('@/pages/assets/DashboardPage'))
const AssetsMaterials = lazy(() => import('@/pages/assets/MaterialsPage'))
const AssetsBoqPrices = lazy(() => import('@/pages/assets/BoqPricesPage'))
const AssetsProjects = lazy(() => import('@/pages/assets/ProjectsPage'))
const AssetsIndicators = lazy(() => import('@/pages/assets/IndicatorsPage'))
const AssetsGovernance = lazy(() => import('@/pages/assets/GovernancePage'))
const AssetsTags = lazy(() => import('@/pages/assets/TagsPage'))
const AssetsMallInfoPrices = lazy(() => import('@/pages/assets/MallInfoPricesPage'))
const AssetsMallMarketPrices = lazy(() => import('@/pages/assets/MallMarketPricesPage'))
const AssetsMallProjects = lazy(() => import('@/pages/assets/MallProjectsPage'))

// ===== 个人资产 =====
const PersonalProjectsPage = lazy(() => import('@/pages/assets/personal/ProjectsPage'))
const PersonalMaterialsPage = lazy(() => import('@/pages/assets/personal/MaterialsPage'))
const PersonalBOQsPage = lazy(() => import('@/pages/assets/personal/BOQsPage'))

// ===== 计价模块 =====
const PricingFiles = lazy(() => import('@/pages/pricing/FilesPage'))
const PricingTasks = lazy(() => import('@/pages/pricing/TasksPage'))
const PricingKnowledge = lazy(() => import('@/pages/pricing/KnowledgePage'))
const PricingPushLogs = lazy(() => import('@/pages/pricing/PushLogsPage'))
const PricingCollaboration = lazy(() => import('@/pages/pricing/CollaborationPage'))
const PricingIssues = lazy(() => import('@/pages/pricing/IssuesPage'))

// ===== 质控模块 =====
const QualityFileVerify = lazy(() => import('@/pages/quality/FileVerifyPage'))
const QualityMaterialPrice = lazy(() => import('@/pages/quality/MaterialPricePage'))
const QualityBoqPrice = lazy(() => import('@/pages/quality/BoqPricePage'))
const QualityBoqDefect = lazy(() => import('@/pages/quality/BoqDefectPage'))
const QualityClearBid = lazy(() => import('@/pages/quality/ClearBidPage'))
const QualitySettlement = lazy(() => import('@/pages/quality/SettlementPage'))
const QualityEstimateReg = lazy(() => import('@/pages/quality/EstimateRegPage'))
const QualityIndicators = lazy(() => import('@/pages/quality/IndicatorsPage'))
const QualityReports = lazy(() => import('@/pages/quality/ReportsPage'))
const QualityRules = lazy(() => import('@/pages/quality/RulesPage'))

// ===== 估算模块 =====
const EstimationAnalogy = lazy(() => import('@/pages/estimation/AnalogyPage'))
const EstimationMetric = lazy(() => import('@/pages/estimation/MetricPage'))
const EstimationParametric = lazy(() => import('@/pages/estimation/ParametricPage'))
const EstimationList = lazy(() => import('@/pages/estimation/ListPage'))

// ===== PR 入库申请 =====
const PRListPage = lazy(() => import('@/pages/pr/PRListPage'))
const PRDetailPage = lazy(() => import('@/pages/pr/PRDetailPage'))
const PRCreatePage = lazy(() => import('@/pages/pr/PRCreatePage'))

// ===== 路由配置 =====
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      // 默认重定向到草稿箱
      {
        index: true,
        element: <Navigate to="/collect/drafts" replace />,
      },

      // ========== 采集入口 ==========
      {
        path: 'collect',
        children: [
          {
            index: true,
            element: <Navigate to="/collect/upload" replace />,
          },
          {
            path: 'upload',
            element: LazyLoad(CollectUploadPage),
            handle: {
              title: '造价文件采集',
              menuKey: 'collect-upload',
            },
          },
          {
            path: 'ingest/material',
            element: LazyLoad(CollectUploadPage),
            handle: {
              title: '材料数据采集',
              menuKey: 'collect-ingest-material',
            },
          },
          {
            path: 'ingest/boq',
            element: LazyLoad(CollectUploadPage),
            handle: {
              title: '清单数据采集',
              menuKey: 'collect-ingest-boq',
            },
          },
          {
            path: 'materials',
            element: LazyLoad(PersonalMaterialsPage),
            handle: {
              title: '我的材料',
              menuKey: 'collect-materials',
            },
          },
          {
            path: 'drafts',
            element: LazyLoad(CollectDraftsPage),
            handle: {
              title: '我的草稿箱',
              menuKey: 'collect-drafts',
            },
          },
          {
            path: 'projects',
            element: LazyLoad(PersonalProjectsPage),
            handle: {
              title: '我的项目',
              menuKey: 'collect-projects',
            },
          },
          {
            path: 'boq-items',
            element: LazyLoad(PersonalBOQsPage),
            handle: {
              title: '我的清单',
              menuKey: 'collect-boq-items',
            },
          },
        ],
      },

      // ========== 标准化处理 ==========
      {
        path: 'standardize',
        children: [
          {
            path: 'files/:id',
            element: LazyLoad(StandardizeFilePage),
            handle: {
              title: '文件分析',
              menuKey: 'standardize-files',
            },
          },
        ],
      },

      // ========== 数据资产模块 ==========
      {
        path: 'assets',
        children: [
          {
            index: true,
            element: <Navigate to="/assets/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: LazyLoad(AssetsDashboard),
            handle: { title: '数据总览', menuKey: 'assets-dashboard' },
          },
          {
            path: 'materials',
            element: LazyLoad(AssetsMaterials),
            handle: { title: '材料库', menuKey: 'assets-materials' },
          },
          {
            path: 'boq-prices',
            element: LazyLoad(AssetsBoqPrices),
            handle: { title: '清单价格库', menuKey: 'assets-boq-prices' },
          },
          {
            path: 'projects',
            element: LazyLoad(AssetsProjects),
            handle: { title: '项目库', menuKey: 'assets-projects' },
          },
          {
            path: 'indicators',
            element: LazyLoad(AssetsIndicators),
            handle: { title: '指标库', menuKey: 'assets-indicators' },
          },
          {
            path: 'governance',
            element: LazyLoad(AssetsGovernance),
            handle: { title: '数据治理', menuKey: 'assets-governance' },
          },
          {
            path: 'tags',
            element: LazyLoad(AssetsTags),
            handle: { title: '标签管理', menuKey: 'assets-tags' },
          },
          {
            path: 'mall/info-prices',
            element: LazyLoad(AssetsMallInfoPrices),
            handle: { title: '信息价', menuKey: 'assets-mall-info-prices' },
          },
          {
            path: 'mall/market-prices',
            element: LazyLoad(AssetsMallMarketPrices),
            handle: { title: '市场价', menuKey: 'assets-mall-market-prices' },
          },
          {
            path: 'mall/projects',
            element: LazyLoad(AssetsMallProjects),
            handle: { title: '项目案例', menuKey: 'assets-mall-projects' },
          },
        ],
      },

      // ========== 个人资产（我的数据） ==========
      {
        path: 'assets/personal',
        children: [
          {
            index: true,
            element: <Navigate to="/assets/personal/projects" replace />,
          },
          {
            path: 'projects',
            element: LazyLoad(PersonalProjectsPage),
            handle: {
              title: '我的项目',
              menuKey: 'personal-projects',
            },
          },
          {
            path: 'projects/:id/edit',
            element: LazyLoad(PersonalProjectsPage), // 编辑模式
            handle: {
              title: '编辑项目',
              menuKey: 'personal-projects',
            },
          },
          {
            path: 'materials',
            element: LazyLoad(PersonalMaterialsPage),
            handle: {
              title: '我的材料',
              menuKey: 'personal-materials',
            },
          },
          {
            path: 'boqs',
            element: LazyLoad(PersonalBOQsPage),
            handle: {
              title: '我的清单',
              menuKey: 'personal-boqs',
            },
          },
        ],
      },

      // ========== 计价模块 ==========
      {
        path: 'pricing',
        children: [
          {
            index: true,
            element: <Navigate to="/pricing/files" replace />,
          },
          {
            path: 'files',
            element: LazyLoad(PricingFiles),
            handle: { title: '计价文件', menuKey: 'pricing-files' },
          },
          {
            path: 'tasks',
            element: LazyLoad(PricingTasks),
            handle: { title: '计价任务', menuKey: 'pricing-tasks' },
          },
          {
            path: 'knowledge',
            element: LazyLoad(PricingKnowledge),
            handle: { title: '知识库', menuKey: 'pricing-knowledge' },
          },
          {
            path: 'push-logs',
            element: LazyLoad(PricingPushLogs),
            handle: { title: '推送记录', menuKey: 'pricing-push-logs' },
          },
          {
            path: 'collaboration',
            element: LazyLoad(PricingCollaboration),
            handle: { title: '协作', menuKey: 'pricing-collaboration' },
          },
          {
            path: 'issues',
            element: LazyLoad(PricingIssues),
            handle: { title: '问题反馈', menuKey: 'pricing-issues' },
          },
        ],
      },

      // ========== 质控模块 ==========
      {
        path: 'quality',
        children: [
          {
            index: true,
            element: <Navigate to="/quality/check/file-verify" replace />,
          },
          {
            path: 'check/file-verify',
            element: LazyLoad(QualityFileVerify),
            handle: { title: '文件校验', menuKey: 'quality-file-verify' },
          },
          {
            path: 'check/material-price',
            element: LazyLoad(QualityMaterialPrice),
            handle: { title: '材料价格校核', menuKey: 'quality-material-price' },
          },
          {
            path: 'check/boq-price',
            element: LazyLoad(QualityBoqPrice),
            handle: { title: '清单价格校核', menuKey: 'quality-boq-price' },
          },
          {
            path: 'check/boq-defect',
            element: LazyLoad(QualityBoqDefect),
            handle: { title: '清单缺陷检测', menuKey: 'quality-boq-defect' },
          },
          {
            path: 'multi/clear-bid',
            element: LazyLoad(QualityClearBid),
            handle: { title: '清标分析', menuKey: 'quality-clear-bid' },
          },
          {
            path: 'multi/settlement',
            element: LazyLoad(QualitySettlement),
            handle: { title: '结算审核', menuKey: 'quality-settlement' },
          },
          {
            path: 'multi/estimate-reg',
            element: LazyLoad(QualityEstimateReg),
            handle: { title: '概算审查', menuKey: 'quality-estimate-reg' },
          },
          {
            path: 'multi/indicators',
            element: LazyLoad(QualityIndicators),
            handle: { title: '指标分析', menuKey: 'quality-indicators' },
          },
          {
            path: 'reports',
            element: LazyLoad(QualityReports),
            handle: { title: '报告管理', menuKey: 'quality-reports' },
          },
          {
            path: 'rules',
            element: LazyLoad(QualityRules),
            handle: { title: '规则配置', menuKey: 'quality-rules' },
          },
        ],
      },

      // ========== 估算模块 ==========
      {
        path: 'estimation',
        children: [
          {
            index: true,
            element: <Navigate to="/estimation/list" replace />,
          },
          {
            path: 'create/analogy',
            element: LazyLoad(EstimationAnalogy),
            handle: { title: '类比估算', menuKey: 'estimation-analogy' },
          },
          {
            path: 'create/metric',
            element: LazyLoad(EstimationMetric),
            handle: { title: '快速指标匡算', menuKey: 'estimation-metric' },
          },
          {
            path: 'create/parametric',
            element: LazyLoad(EstimationParametric),
            handle: { title: '参数估算', menuKey: 'estimation-parametric' },
          },
          {
            path: 'list',
            element: LazyLoad(EstimationList),
            handle: { title: '估算列表', menuKey: 'estimation-list' },
          },
        ],
      },

      // ========== PR 入库申请 ==========
      {
        path: 'pr',
        children: [
          {
            index: true,
            element: <Navigate to="/pr/list" replace />,
          },
          {
            path: 'list',
            element: LazyLoad(PRListPage),
            handle: {
              title: '入库申请',
              menuKey: 'pr-list',
            },
          },
          {
            path: 'create',
            element: LazyLoad(PRCreatePage),
            handle: {
              title: '发起入库申请',
              menuKey: 'pr-create',
            },
          },
          {
            path: ':id',
            element: LazyLoad(PRDetailPage),
            handle: {
              title: '申请详情',
              menuKey: 'pr-detail',
            },
          },
          {
            path: ':id/edit',
            element: LazyLoad(PRCreatePage),
            handle: {
              title: '编辑申请',
              menuKey: 'pr-edit',
            },
          },
        ],
      },

      // ========== 404 ==========
      {
        path: '*',
        element: <Navigate to="/collect/drafts" replace />,
      },
    ],
  },
]

// 创建路由实例
export const router = createBrowserRouter(routes)

export default router