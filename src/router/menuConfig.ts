// src/router/menuConfig.ts
// 菜单配置文件

import type { ReactNode } from 'react'
import {
  CloudUploadOutlined,
  InboxOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  ProjectOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  AuditOutlined,
  BankOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import React from 'react'

/**
 * 菜单项配置
 */
export interface MenuItemConfig {
  key: string
  label: string
  icon?: ReactNode
  path?: string
  children?: MenuItemConfig[]
  /** 是否在菜单中隐藏 */
  hidden?: boolean
  /** 权限标识 */
  permission?: string
}

/**
 * 菜单配置
 */
export const menuConfig: MenuItemConfig[] = [
  // ========== 总览 ==========
  {
    key: 'collect-overview',
    label: '总览',
    icon: React.createElement(AppstoreOutlined),
    path: '/collect/overview',
  },

  // ========== 采集入口 ==========
  {
    key: 'collect',
    label: '采集入口',
    icon: React.createElement(CloudUploadOutlined),
    children: [
      {
        key: 'collect-cost-files',
        label: '造价文件采集',
        icon: React.createElement(FileSearchOutlined),
        path: '/collect/cost-files',
      },
      {
        key: 'collect-materials',
        label: '材料数据采集',
        icon: React.createElement(DatabaseOutlined),
        path: '/collect/materials',
      },
      {
        key: 'collect-boqs',
        label: '清单数据采集',
        icon: React.createElement(UnorderedListOutlined),
        path: '/collect/boqs',
      },
    ],
  },

  // ========== 我的数据 ==========
  {
    key: 'personal',
    label: '我的数据',
    icon: React.createElement(FolderOpenOutlined),
    children: [
      {
        key: 'personal-projects',
        label: '我的项目',
        icon: React.createElement(ProjectOutlined),
        path: '/collect/my/projects',
      },
      {
        key: 'personal-materials',
        label: '我的材料',
        icon: React.createElement(DatabaseOutlined),
        path: '/collect/my/materials',
      },
      {
        key: 'personal-boqs',
        label: '我的清单',
        icon: React.createElement(UnorderedListOutlined),
        path: '/collect/my/boqs',
      },
    ],
  },

  // ========== 企业资产 ==========
  {
    key: 'enterprise',
    label: '企业资产',
    icon: React.createElement(BankOutlined),
    children: [
      {
        key: 'enterprise-projects',
        label: '企业项目库',
        icon: React.createElement(ProjectOutlined),
        path: '/assets/enterprise/projects',
      },
      {
        key: 'enterprise-materials',
        label: '企业材料库',
        icon: React.createElement(DatabaseOutlined),
        path: '/assets/enterprise/materials',
      },
      {
        key: 'enterprise-boqs',
        label: '企业清单库',
        icon: React.createElement(UnorderedListOutlined),
        path: '/assets/enterprise/boqs',
      },
    ],
  },

  // ========== 入库审批 ==========
  {
    key: 'pr',
    label: '入库审批',
    icon: React.createElement(AuditOutlined),
    children: [
      {
        key: 'pr-list',
        label: '入库申请',
        icon: React.createElement(FileTextOutlined),
        path: '/pr/list',
      },
    ],
  },
]

/**
 * 根据路径获取当前菜单选中项
 */
export function getSelectedKeys(pathname: string): string[] {
  // 遍历所有菜单项找到匹配的 key
  for (const menu of menuConfig) {
    if (menu.path === pathname) {
      return [menu.key]
    }
    if (menu.children) {
      for (const child of menu.children) {
        if (child.path && pathname.startsWith(child.path)) {
          return [child.key]
        }
      }
    }
  }

  // 特殊路径匹配
  if (pathname.startsWith('/pr/')) {
    return ['pr-list']
  }
  if (pathname.startsWith('/standardize/')) {
    return ['collect-drafts']
  }

  return []
}

/**
 * 根据路径获取展开的菜单
 */
export function getOpenKeys(pathname: string): string[] {
  for (const menu of menuConfig) {
    if (menu.children) {
      for (const child of menu.children) {
        if (child.path && pathname.startsWith(child.path)) {
          return [menu.key]
        }
      }
    }
  }

  // 特殊路径匹配
  if (pathname.startsWith('/pr/')) {
    return ['pr']
  }
  if (pathname.startsWith('/standardize/') || pathname.startsWith('/collect/')) {
    return ['collect']
  }
  if (pathname.startsWith('/collect/my')) {
    return ['personal']
  }
  if (pathname.startsWith('/assets/enterprise')) {
    return ['enterprise']
  }

  return []
}

/**
 * 获取面包屑配置
 */
export function getBreadcrumbs(pathname: string): { title: string; path?: string }[] {
  const breadcrumbs: { title: string; path?: string }[] = [{ title: '首页', path: '/' }]

  for (const menu of menuConfig) {
    if (menu.children) {
      for (const child of menu.children) {
        if (child.path && pathname.startsWith(child.path)) {
          breadcrumbs.push({ title: menu.label })
          breadcrumbs.push({ title: child.label, path: child.path })
          return breadcrumbs
        }
      }
    }
  }

  // 特殊路径
  if (pathname.startsWith('/pr/create')) {
    breadcrumbs.push({ title: '入库审批' })
    breadcrumbs.push({ title: '发起入库申请' })
  } else if (pathname.match(/^\/pr\/[^/]+$/)) {
    breadcrumbs.push({ title: '入库审批' })
    breadcrumbs.push({ title: '入库申请', path: '/pr/list' })
    breadcrumbs.push({ title: '申请详情' })
  } else if (pathname.startsWith('/standardize/files/')) {
    breadcrumbs.push({ title: '采集入口' })
    breadcrumbs.push({ title: '文件分析' })
  }

  return breadcrumbs
}

export default menuConfig