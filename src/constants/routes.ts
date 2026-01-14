// src/constants/routes.ts - IA v1.3

/**
 * 应用路由常量
 * 与 IA v1.3 保持同步
 */
export const ROUTES = {
  // 数据采集模块
  COLLECT: {
    ROOT: '/collect',
    DASHBOARD: '/collect/dashboard',
    INGEST: {
      PRICING: '/collect/upload',
      MATERIAL: '/collect/ingest/material',
      BOQ: '/collect/ingest/boq',
    },
    UPLOAD: '/collect/upload',
    DRAFTS: '/collect/drafts',
    MATERIALS: '/collect/materials',
    BOQ_ITEMS: '/collect/boq-items',
    PROJECTS: '/collect/projects',
  },

  // 数据资产模块
  ASSETS: {
    ROOT: '/assets',
    DASHBOARD: '/assets/dashboard',
    MATERIALS: '/assets/materials',
    BOQ_PRICES: '/assets/boq-prices',
    PROJECTS: '/assets/projects',
    INDICATORS: '/assets/indicators',
    GOVERNANCE: '/assets/governance',
    TAGS: '/assets/tags',
    MALL: {
      INFO_PRICES: '/assets/mall/info-prices',
      MARKET_PRICES: '/assets/mall/market-prices',
      PROJECTS: '/assets/mall/projects',
    },
  },

  // 计价模块
  PRICING: {
    ROOT: '/pricing',
    FILES: '/pricing/files',
    TASKS: '/pricing/tasks',
    KNOWLEDGE: '/pricing/knowledge',
    PUSH_LOGS: '/pricing/push-logs',
    COLLABORATION: '/pricing/collaboration',
    ISSUES: '/pricing/issues',
  },

  // 质控模块
  QUALITY: {
    ROOT: '/quality',
    CHECK: {
      FILE_VERIFY: '/quality/check/file-verify',
      MATERIAL_PRICE: '/quality/check/material-price',
      BOQ_PRICE: '/quality/check/boq-price',
      BOQ_DEFECT: '/quality/check/boq-defect',
    },
    MULTI: {
      CLEAR_BID: '/quality/multi/clear-bid',
      SETTLEMENT: '/quality/multi/settlement',
      ESTIMATE_REG: '/quality/multi/estimate-reg',
      INDICATORS: '/quality/multi/indicators',
    },
    REPORTS: '/quality/reports',
    RULES: '/quality/rules',
  },

  // 估算模块
  ESTIMATION: {
    ROOT: '/estimation',
    CREATE: {
      ANALOGY: '/estimation/create/analogy',
      METRIC: '/estimation/create/metric',
      PARAMETRIC: '/estimation/create/parametric',
    },
    LIST: '/estimation/list',
  },
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * 顶部导航模块配置
 */
export const TOP_NAV_MODULES = [
  { key: 'collect', label: '数据采集', path: ROUTES.COLLECT.ROOT },
  { key: 'assets', label: '数据资产', path: ROUTES.ASSETS.ROOT },
  { key: 'pricing', label: '计价', path: ROUTES.PRICING.ROOT },
  { key: 'quality', label: '质控', path: ROUTES.QUALITY.ROOT },
  { key: 'estimation', label: '估算', path: ROUTES.ESTIMATION.ROOT },
] as const;
