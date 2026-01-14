# sidebarConfig.ts — 侧边栏配置模板

> 用途：配置驱动的侧边栏，支持权限过滤、Badge 展示、3 种模式。
> 位置：`src/app/sidebar/types.ts` + `src/app/sidebar/{module}Sidebar.ts`

---

## 1. 类型定义

```ts
// src/app/sidebar/types.ts

/**
 * 侧边栏模式
 * - SimpleNav: 简单分组导航（Collect）
 * - WorkspaceNav: 带空间切换的导航（Assets）
 * - WorkflowTree: 带状态徽标的树形导航（Pricing）
 */
export type SidebarMode = 'SimpleNav' | 'WorkspaceNav' | 'WorkflowTree'

/**
 * 侧边栏配置
 */
export interface SidebarConfig {
  /** 模式 */
  mode: SidebarMode
  /** 分组列表 */
  groups: SidebarGroup[]
  /** WorkspaceNav 模式下的空间列表（可选） */
  workspaces?: WorkspaceOption[]
  /** 当前选中的空间 key（WorkspaceNav 模式） */
  activeWorkspace?: string
}

/**
 * 侧边栏分组
 */
export interface SidebarGroup {
  /** 唯一标识 */
  key: string
  /** 分组标题（为空则不显示标题） */
  label?: string
  /** 分组图标（可选） */
  icon?: string
  /** 子菜单项 */
  children: SidebarItem[]
}

/**
 * 侧边栏菜单项
 */
export interface SidebarItem {
  /** 唯一标识（用于高亮判断） */
  key: string
  /** 显示文本 */
  label: string
  /** 路由路径 */
  path: string
  /** 图标（可选） */
  icon?: string
  /** 权限 key（有值则检查权限，无权限隐藏） */
  permission?: string
  /** Badge key（从 uiStore.badgeCounts 读取） */
  badgeKey?: string
  /** 二级子菜单（最多支持 2 级） */
  children?: SidebarSubItem[]
}

/**
 * 二级子菜单项（不再允许嵌套）
 */
export interface SidebarSubItem {
  key: string
  label: string
  path: string
  permission?: string
  badgeKey?: string
}

/**
 * 空间选项（WorkspaceNav 模式）
 */
export interface WorkspaceOption {
  key: string
  label: string
  /** 切换到该空间后的默认路径 */
  defaultPath: string
}
```

---

## 2. Collect 模块配置（SimpleNav）

```ts
// src/app/sidebar/collectSidebar.ts
import type { SidebarConfig } from './types'

export const collectSidebarConfig: SidebarConfig = {
  mode: 'SimpleNav',
  groups: [
    {
      key: 'collect-main',
      label: '数据采集',
      children: [
        {
          key: 'drafts',
          label: '草稿总览',
          path: '/collect/drafts',
          icon: 'FileTextOutlined',
          permission: 'collect.read',
          badgeKey: 'collect.drafts.pending',
        },
        {
          key: 'pricing-files',
          label: '造价文件采集',
          path: '/collect/pricing-files',
          icon: 'FileOutlined',
          permission: 'collect.read',
        },
        {
          key: 'materials',
          label: '材料数据采集',
          path: '/collect/materials',
          icon: 'DatabaseOutlined',
          permission: 'collect.read',
        },
        {
          key: 'boq-prices',
          label: '清单价格采集',
          path: '/collect/boq-prices',
          icon: 'TableOutlined',
          permission: 'collect.read',
        },
      ],
    },
  ],
}
```

---

## 3. Assets 模块配置（WorkspaceNav）

```ts
// src/app/sidebar/assetsSidebar.ts
import type { SidebarConfig } from './types'

export const assetsSidebarConfig: SidebarConfig = {
  mode: 'WorkspaceNav',
  workspaces: [
    { key: 'personal', label: '个人空间', defaultPath: '/assets/personal/dashboard' },
    { key: 'enterprise', label: '企业空间', defaultPath: '/assets/enterprise/dashboard' },
    { key: 'market', label: '市场数据', defaultPath: '/assets/market/dashboard' },
  ],
  activeWorkspace: 'personal', // 默认，实际从 URL 解析
  groups: [
    {
      key: 'assets-main',
      label: '数据资产',
      children: [
        {
          key: 'dashboard',
          label: '数据看板',
          path: '/assets/{workspace}/dashboard', // {workspace} 动态替换
          icon: 'DashboardOutlined',
        },
        {
          key: 'materials',
          label: '材料库',
          path: '/assets/{workspace}/materials',
          icon: 'DatabaseOutlined',
        },
        {
          key: 'boqs',
          label: '清单库',
          path: '/assets/{workspace}/boqs',
          icon: 'OrderedListOutlined',
        },
        {
          key: 'cases',
          label: '案例库',
          path: '/assets/{workspace}/cases',
          icon: 'FolderOutlined',
        },
      ],
    },
    {
      key: 'assets-extra',
      label: '扩展功能',
      children: [
        {
          key: 'indices',
          label: '指标库',
          path: '/assets/{workspace}/indices',
          icon: 'LineChartOutlined',
          permission: 'assets.enterprise.read', // 仅企业空间可见
        },
      ],
    },
  ],
}
```

---

## 4. Pricing 模块配置（WorkflowTree）

```ts
// src/app/sidebar/pricingSidebar.ts
import type { SidebarConfig } from './types'

export const pricingSidebarConfig: SidebarConfig = {
  mode: 'WorkflowTree',
  groups: [
    {
      key: 'pricing-core',
      label: '套定额',
      children: [
        {
          key: 'tasks',
          label: '套定额任务',
          path: '/pricing/tasks',
          icon: 'UnorderedListOutlined',
          permission: 'pricing.read',
          badgeKey: 'pricing.tasks.pending',
        },
        {
          key: 'mapping',
          label: '映射知识库',
          path: '/pricing/mapping',
          icon: 'NodeIndexOutlined',
          permission: 'pricing.read',
        },
        {
          key: 'issues',
          label: 'Issue 工作台',
          path: '/pricing/issues',
          icon: 'BugOutlined',
          permission: 'pricing.read',
          badgeKey: 'pricing.issues.open',
        },
      ],
    },
    {
      key: 'pricing-sync',
      label: '协同与推送',
      children: [
        {
          key: 'push-records',
          label: '推送记录',
          path: '/pricing/push-records',
          icon: 'CloudUploadOutlined',
          permission: 'pricing.read',
        },
        {
          key: 'client-sync',
          label: '客户端协同',
          path: '/pricing/client-sync',
          icon: 'SyncOutlined',
          permission: 'pricing.read',
        },
      ],
    },
    {
      key: 'pricing-advanced',
      label: '高级功能',
      children: [
        {
          key: 'files',
          label: '计价文件',
          path: '/pricing/files',
          icon: 'FileOutlined',
          permission: 'pricing.read',
        },
        {
          key: 'qty-base',
          label: '算力底座',
          path: '/pricing/qty-base',
          icon: 'CloudServerOutlined',
          permission: 'pricing.read',
        },
      ],
    },
  ],
}
```

---

## 5. 模块配置索引

```ts
// src/app/sidebar/index.ts
import { collectSidebarConfig } from './collectSidebar'
import { assetsSidebarConfig } from './assetsSidebar'
import { pricingSidebarConfig } from './pricingSidebar'
import type { SidebarConfig } from './types'

export type ModuleKey = 'collect' | 'assets' | 'pricing' | 'qc' | 'estimation'

export const sidebarConfigs: Record<ModuleKey, SidebarConfig> = {
  collect: collectSidebarConfig,
  assets: assetsSidebarConfig,
  pricing: pricingSidebarConfig,
  qc: collectSidebarConfig, // TODO: 替换为 qcSidebarConfig
  estimation: collectSidebarConfig, // TODO: 替换为 estimationSidebarConfig
}

/**
 * 根据路径前缀获取当前模块
 */
export function getModuleFromPath(pathname: string): ModuleKey {
  if (pathname.startsWith('/collect')) return 'collect'
  if (pathname.startsWith('/assets')) return 'assets'
  if (pathname.startsWith('/pricing')) return 'pricing'
  if (pathname.startsWith('/qc')) return 'qc'
  if (pathname.startsWith('/estimation')) return 'estimation'
  return 'collect' // 默认
}

/**
 * 获取模块的默认入口路径
 */
export const moduleDefaultPaths: Record<ModuleKey, string> = {
  collect: '/collect/drafts',
  assets: '/assets/personal/dashboard',
  pricing: '/pricing/tasks',
  qc: '/qc/rules',
  estimation: '/estimation/projects',
}
```

---

## 6. TopNav 模块配置

```ts
// src/app/topNavConfig.ts
import type { ModuleKey } from './sidebar'

export interface TopNavModule {
  key: ModuleKey
  label: string
  icon?: string
  defaultPath: string
  permission?: string // 无权限则隐藏整个模块
}

export const topNavModules: TopNavModule[] = [
  { key: 'collect', label: '数据采集', icon: 'CloudUploadOutlined', defaultPath: '/collect/drafts' },
  { key: 'assets', label: '数据资产', icon: 'DatabaseOutlined', defaultPath: '/assets/personal/dashboard' },
  { key: 'qc', label: '质量控制', icon: 'SafetyCertificateOutlined', defaultPath: '/qc/rules' },
  { key: 'pricing', label: '套定额', icon: 'CalculatorOutlined', defaultPath: '/pricing/tasks' },
  { key: 'estimation', label: '估算', icon: 'FundOutlined', defaultPath: '/estimation/projects' },
]
```

---

## 7. 使用方式

### AppShellSidebar 组件

```tsx
// src/components/layout/AppShellSidebar.tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import { useAppStore } from '@/stores/appStore'
import { sidebarConfigs, getModuleFromPath } from '@/app/sidebar'
import type { SidebarConfig, SidebarItem } from '@/app/sidebar/types'

export const AppShellSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { permissions } = useAppStore()
  
  // 1. 根据路径获取当前模块
  const moduleKey = getModuleFromPath(pathname)
  const config = sidebarConfigs[moduleKey]
  
  // 2. 过滤无权限的菜单项
  const filteredGroups = filterByPermission(config.groups, permissions)
  
  // 3. 从路径推导 selectedKey 和 openKeys
  const { selectedKey, openKeys } = deriveKeysFromPath(pathname, filteredGroups)
  
  // 4. 渲染
  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      defaultOpenKeys={openKeys}
      items={buildMenuItems(filteredGroups)}
      onClick={({ key }) => {
        const item = findItemByKey(filteredGroups, key)
        if (item) navigate(item.path)
      }}
    />
  )
}

// 权限过滤
function filterByPermission(groups, permissions) {
  return groups.map(group => ({
    ...group,
    children: group.children.filter(item => 
      !item.permission || permissions.includes(item.permission)
    )
  })).filter(group => group.children.length > 0)
}

// 从路径推导高亮 key
function deriveKeysFromPath(pathname, groups) {
  for (const group of groups) {
    for (const item of group.children) {
      if (pathname.startsWith(item.path)) {
        return { selectedKey: item.key, openKeys: [group.key] }
      }
    }
  }
  return { selectedKey: '', openKeys: [] }
}
```

---

## 8. 验收标准

- [ ] 侧边栏内容由配置驱动，不硬编码
- [ ] 点击菜单项可正确跳转
- [ ] 刷新页面后高亮不丢失（从 URL 推导）
- [ ] 无权限的菜单项自动隐藏
- [ ] 切换模块后侧边栏内容自动变化
- [ ] 最多支持 2 级菜单，超出应报错