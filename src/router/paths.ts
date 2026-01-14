// src/router/paths.ts
// 路由路径常量

/**
 * 路由路径常量
 * 统一管理所有路由路径，避免硬编码
 */
export const PATHS = {
  // ========== 根路径 ==========
  HOME: '/',

  // ========== 采集入口 ==========
  COLLECT: {
    ROOT: '/collect',
    UPLOAD: '/collect/upload',
    MATERIALS: '/collect/materials',
    BOQS: '/collect/boqs',
    DRAFTS: '/collect/drafts',
  },

  // ========== 标准化处理 ==========
  STANDARDIZE: {
    ROOT: '/standardize',
    FILE: (id: string) => `/standardize/files/${id}`,
  },

  // ========== 个人资产 ==========
  PERSONAL: {
    ROOT: '/assets/personal',
    PROJECTS: '/assets/personal/projects',
    PROJECT_EDIT: (id: string) => `/assets/personal/projects/${id}/edit`,
    MATERIALS: '/assets/personal/materials',
    BOQS: '/assets/personal/boqs',
  },

  // ========== 企业资产 ==========
  ENTERPRISE: {
    ROOT: '/assets/enterprise',
    PROJECTS: '/assets/enterprise/projects',
    MATERIALS: '/assets/enterprise/materials',
    BOQS: '/assets/enterprise/boqs',
  },

  // ========== PR 入库申请 ==========
  PR: {
    ROOT: '/pr',
    LIST: '/pr/list',
    CREATE: '/pr/create',
    CREATE_WITH_PROJECT: (projectId: string) => `/pr/create?projectId=${projectId}`,
    DETAIL: (id: string) => `/pr/${id}`,
    EDIT: (id: string) => `/pr/${id}/edit`,
  },
} as const

/**
 * 根据路径判断是否为当前激活路由
 */
export function isActivePath(currentPath: string, targetPath: string): boolean {
  if (targetPath === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(targetPath)
}

/**
 * 获取路由参数
 */
export function getRouteParams(pathname: string, pattern: string): Record<string, string> | null {
  const patternParts = pattern.split('/')
  const pathParts = pathname.split('/')

  if (patternParts.length !== pathParts.length) {
    return null
  }

  const params: Record<string, string> = {}

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const pathPart = pathParts[i]

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = pathPart
    } else if (patternPart !== pathPart) {
      return null
    }
  }

  return params
}

export default PATHS