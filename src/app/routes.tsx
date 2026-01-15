// src/app/routes.tsx - IA v1.3
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { AppShell } from '../components/layout'
import { ROUTES } from '../constants/routes'

const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Spin size="large" />
  </div>
)

// Collect Pages
const CollectDashboard = lazy(() => import('../pages/collect/DashboardPage'))
const CollectIngestPricing = lazy(() => import('../pages/collect/IngestPricingPage'))
const CollectIngestMaterial = lazy(() => import('../pages/collect/MaterialCollectPage'))
const CollectIngestBoq = lazy(() => import('../pages/collect/IngestBoqPage'))
const CollectDrafts = lazy(() => import('../pages/collect/DraftsPage'))
const CollectMaterials = lazy(() => import('../pages/assets/personal/MaterialsPage'))
const CollectBoqItems = lazy(() => import('../pages/collect/BoqItemsPage'))
const CollectProjects = lazy(() => import('../pages/assets/personal/ProjectsPage'))
const CollectUpload = lazy(() => import('../pages/collect/CollectUploadPage'))

// Assets Pages
const AssetsDashboard = lazy(() => import('../pages/assets/DashboardPage'))
const AssetsMaterials = lazy(() => import('../pages/assets/MaterialsPage'))
const AssetsBoqPrices = lazy(() => import('../pages/assets/BoqPricesPage'))
const AssetsProjects = lazy(() => import('../pages/assets/ProjectsPage'))
const AssetsIndicators = lazy(() => import('../pages/assets/IndicatorsPage'))
const AssetsGovernance = lazy(() => import('../pages/assets/GovernancePage'))
const AssetsTags = lazy(() => import('../pages/assets/TagsPage'))
const AssetsMallInfoPrices = lazy(() => import('../pages/assets/MallInfoPricesPage'))
const AssetsMallMarketPrices = lazy(() => import('../pages/assets/MallMarketPricesPage'))
const AssetsMallProjects = lazy(() => import('../pages/assets/MallProjectsPage'))
const AssetsPersonalProjects = lazy(() => import('../pages/assets/personal/ProjectsPage'))

// Pricing Pages
const PricingFiles = lazy(() => import('../pages/pricing/FilesPage'))
const PricingTasks = lazy(() => import('../pages/pricing/TasksPage'))
const PricingKnowledge = lazy(() => import('../pages/pricing/KnowledgePage'))
const PricingPushLogs = lazy(() => import('../pages/pricing/PushLogsPage'))
const PricingCollaboration = lazy(() => import('../pages/pricing/CollaborationPage'))
const PricingIssues = lazy(() => import('../pages/pricing/IssuesPage'))

// Quality Pages
const QualityFileVerify = lazy(() => import('../pages/quality/FileVerifyPage'))
const QualityMaterialPrice = lazy(() => import('../pages/quality/MaterialPricePage'))
const QualityBoqPrice = lazy(() => import('../pages/quality/BoqPricePage'))
const QualityBoqDefect = lazy(() => import('../pages/quality/BoqDefectPage'))
const QualityClearBid = lazy(() => import('../pages/quality/ClearBidPage'))
const QualitySettlement = lazy(() => import('../pages/quality/SettlementPage'))
const QualityEstimateReg = lazy(() => import('../pages/quality/EstimateRegPage'))
const QualityIndicators = lazy(() => import('../pages/quality/IndicatorsPage'))
const QualityReports = lazy(() => import('../pages/quality/ReportsPage'))
const QualityRules = lazy(() => import('../pages/quality/RulesPage'))

// Estimation Pages
const EstimationAnalogy = lazy(() => import('../pages/estimation/AnalogyPage'))
const EstimationMetric = lazy(() => import('../pages/estimation/MetricPage'))
const EstimationParametric = lazy(() => import('../pages/estimation/ParametricPage'))
const EstimationList = lazy(() => import('../pages/estimation/ListPage'))

// Standardize Pages
const StandardizationPage = lazy(() => import('../pages/standardize/StandardizationPage'))

// PR Pages
const PRListPage = lazy(() => import('../pages/pr/PRListPage'))
const PRDetailPage = lazy(() => import('../pages/pr/PRDetailPage'))
const PRCreatePage = lazy(() => import('../pages/pr/PRCreatePage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={ROUTES.COLLECT.DASHBOARD} replace /> },

      // Collect Module
      { path: 'collect/dashboard', element: <Suspense fallback={<PageLoading />}><CollectDashboard /></Suspense> },
      { path: 'collect/ingest/pricing', element: <Suspense fallback={<PageLoading />}><CollectIngestPricing /></Suspense> },
      { path: 'collect/ingest/material', element: <Suspense fallback={<PageLoading />}><CollectIngestMaterial /></Suspense> },
      { path: 'collect/ingest/boq', element: <Suspense fallback={<PageLoading />}><CollectIngestBoq /></Suspense> },
      { path: 'collect/drafts', element: <Suspense fallback={<PageLoading />}><CollectDrafts /></Suspense> },
      { path: 'collect/materials', element: <Suspense fallback={<PageLoading />}><CollectMaterials /></Suspense> },
      { path: 'collect/boq-items', element: <Suspense fallback={<PageLoading />}><CollectBoqItems /></Suspense> },
      { path: 'collect/projects', element: <Suspense fallback={<PageLoading />}><CollectProjects /></Suspense> },
      { path: 'collect/upload', element: <Suspense fallback={<PageLoading />}><CollectUpload /></Suspense> },

      // Assets Module
      { path: 'assets/dashboard', element: <Suspense fallback={<PageLoading />}><AssetsDashboard /></Suspense> },
      { path: 'assets/materials', element: <Suspense fallback={<PageLoading />}><AssetsMaterials /></Suspense> },
      { path: 'assets/boq-prices', element: <Suspense fallback={<PageLoading />}><AssetsBoqPrices /></Suspense> },
      { path: 'assets/projects', element: <Suspense fallback={<PageLoading />}><AssetsProjects /></Suspense> },
      { path: 'assets/indicators', element: <Suspense fallback={<PageLoading />}><AssetsIndicators /></Suspense> },
      { path: 'assets/governance', element: <Suspense fallback={<PageLoading />}><AssetsGovernance /></Suspense> },
      { path: 'assets/tags', element: <Suspense fallback={<PageLoading />}><AssetsTags /></Suspense> },
      { path: 'assets/mall/info-prices', element: <Suspense fallback={<PageLoading />}><AssetsMallInfoPrices /></Suspense> },
      { path: 'assets/mall/market-prices', element: <Suspense fallback={<PageLoading />}><AssetsMallMarketPrices /></Suspense> },
      { path: 'assets/mall/projects', element: <Suspense fallback={<PageLoading />}><AssetsMallProjects /></Suspense> },
      // 个人资产路由已移至 /collect/my/*

      // Pricing Module
      { path: 'pricing/files', element: <Suspense fallback={<PageLoading />}><PricingFiles /></Suspense> },
      { path: 'pricing/tasks', element: <Suspense fallback={<PageLoading />}><PricingTasks /></Suspense> },
      { path: 'pricing/knowledge', element: <Suspense fallback={<PageLoading />}><PricingKnowledge /></Suspense> },
      { path: 'pricing/push-logs', element: <Suspense fallback={<PageLoading />}><PricingPushLogs /></Suspense> },
      { path: 'pricing/collaboration', element: <Suspense fallback={<PageLoading />}><PricingCollaboration /></Suspense> },
      { path: 'pricing/issues', element: <Suspense fallback={<PageLoading />}><PricingIssues /></Suspense> },

      // Quality Module
      { path: 'quality/check/file-verify', element: <Suspense fallback={<PageLoading />}><QualityFileVerify /></Suspense> },
      { path: 'quality/check/material-price', element: <Suspense fallback={<PageLoading />}><QualityMaterialPrice /></Suspense> },
      { path: 'quality/check/boq-price', element: <Suspense fallback={<PageLoading />}><QualityBoqPrice /></Suspense> },
      { path: 'quality/check/boq-defect', element: <Suspense fallback={<PageLoading />}><QualityBoqDefect /></Suspense> },
      { path: 'quality/multi/clear-bid', element: <Suspense fallback={<PageLoading />}><QualityClearBid /></Suspense> },
      { path: 'quality/multi/settlement', element: <Suspense fallback={<PageLoading />}><QualitySettlement /></Suspense> },
      { path: 'quality/multi/estimate-reg', element: <Suspense fallback={<PageLoading />}><QualityEstimateReg /></Suspense> },
      { path: 'quality/multi/indicators', element: <Suspense fallback={<PageLoading />}><QualityIndicators /></Suspense> },
      { path: 'quality/reports', element: <Suspense fallback={<PageLoading />}><QualityReports /></Suspense> },
      { path: 'quality/rules', element: <Suspense fallback={<PageLoading />}><QualityRules /></Suspense> },

      // Estimation Module
      { path: 'estimation/create/analogy', element: <Suspense fallback={<PageLoading />}><EstimationAnalogy /></Suspense> },
      { path: 'estimation/create/metric', element: <Suspense fallback={<PageLoading />}><EstimationMetric /></Suspense> },
      { path: 'estimation/create/parametric', element: <Suspense fallback={<PageLoading />}><EstimationParametric /></Suspense> },
      { path: 'estimation/list', element: <Suspense fallback={<PageLoading />}><EstimationList /></Suspense> },

      // Standardize Module
      { path: 'standardize/files/:id', element: <Suspense fallback={<PageLoading />}><StandardizationPage /></Suspense> },

      // PR Module
      { path: 'pr', element: <Suspense fallback={<PageLoading />}><PRListPage /></Suspense> },
      { path: 'pr/list', element: <Suspense fallback={<PageLoading />}><PRListPage /></Suspense> },
      { path: 'pr/create', element: <Suspense fallback={<PageLoading />}><PRCreatePage /></Suspense> },
      { path: 'pr/:id', element: <Suspense fallback={<PageLoading />}><PRDetailPage /></Suspense> },
      { path: 'pr/:id/edit', element: <Suspense fallback={<PageLoading />}><PRCreatePage /></Suspense> },

      // Fallback redirects
      { path: 'collect', element: <Navigate to={ROUTES.COLLECT.DASHBOARD} replace /> },
      { path: 'assets', element: <Navigate to={ROUTES.ASSETS.DASHBOARD} replace /> },
      { path: 'pricing', element: <Navigate to={ROUTES.PRICING.FILES} replace /> },
      { path: 'quality', element: <Navigate to={ROUTES.QUALITY.CHECK.FILE_VERIFY} replace /> },
      { path: 'estimation', element: <Navigate to={ROUTES.ESTIMATION.LIST} replace /> },
    ],
  },
])
