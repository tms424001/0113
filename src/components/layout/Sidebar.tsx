// src/components/layout/Sidebar.tsx
import React, { useMemo, useState } from 'react'
import { Menu, Badge, Select } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import type {
  SidebarConfig,
  SidebarNode,
  SidebarGroup,
  SidebarLeafItem,
} from '../../app/sidebar/types'
import { useAppStore } from '../../stores/appStore'
import styles from './Sidebar.module.css'

interface SidebarProps {
  config: SidebarConfig
  nodesByWorkspace?: Record<string, SidebarNode[]>
  badges?: Record<string, number>
  onWorkspaceChange?: (workspace: string) => void
}

type MenuItem = Required<MenuProps>['items'][number]

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  nodesByWorkspace,
  badges = {},
  onWorkspaceChange,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { hasPermission, sidebarCollapsed } = useAppStore()

  const [currentWorkspace, setCurrentWorkspace] = useState(
    config.workspace?.current || 'personal'
  )

  const currentNodes = useMemo(() => {
    if (config.mode === 'workspace' && nodesByWorkspace) {
      return nodesByWorkspace[currentWorkspace] || config.nodes
    }
    return config.nodes
  }, [config, nodesByWorkspace, currentWorkspace])

  const filterByPermission = (nodes: SidebarNode[]): SidebarNode[] => {
    return nodes
      .filter((node) => {
        if (node.type === 'divider') return true
        if (node.permissionKey && !hasPermission(node.permissionKey)) {
          return false
        }
        return true
      })
      .map((node) => {
        if (node.type === 'group') {
          const filteredChildren = node.children.filter(
            (child) => !child.permissionKey || hasPermission(child.permissionKey)
          )
          if (filteredChildren.length === 0 && node.hideWhenEmpty !== false) {
            return null
          }
          return { ...node, children: filteredChildren }
        }
        return node
      })
      .filter(Boolean) as SidebarNode[]
  }

  const filteredNodes = useMemo(() => filterByPermission(currentNodes), [currentNodes, hasPermission])

  const convertToMenuItems = (nodes: SidebarNode[]): MenuItem[] => {
    return nodes.map((node) => {
      if (node.type === 'divider') {
        return { type: 'divider', key: node.key }
      }

      if (node.type === 'group') {
        return {
          key: node.key,
          label: node.label,
          icon: node.icon,
          children: node.children.map((child) => ({
            key: child.key,
            label: (
              <span className={styles.menuItemLabel}>
                <span>{child.label}</span>
                {child.badgeKey && badges[child.badgeKey] ? (
                  <Badge count={badges[child.badgeKey]} size="small" />
                ) : null}
              </span>
            ),
            icon: child.icon,
          })),
        }
      }

      const item = node as SidebarLeafItem
      return {
        key: item.key,
        label: (
          <span className={styles.menuItemLabel}>
            <span>{item.label}</span>
            {item.badgeKey && badges[item.badgeKey] ? (
              <Badge count={badges[item.badgeKey]} size="small" />
            ) : null}
          </span>
        ),
        icon: item.icon,
      }
    })
  }

  const menuItems = useMemo(() => convertToMenuItems(filteredNodes), [filteredNodes, badges])

  const findPathByKey = (key: string, nodes: SidebarNode[]): string | null => {
    for (const node of nodes) {
      if (node.type === 'item' && node.key === key) {
        return node.path
      }
      if (node.type === 'group') {
        for (const child of node.children) {
          if (child.key === key) {
            return child.path
          }
        }
      }
    }
    return null
  }

  const findKeyByPath = (path: string, nodes: SidebarNode[]): string | null => {
    for (const node of nodes) {
      if (node.type === 'item') {
        if (node.path === path) return node.key
        if (node.matchPaths?.some((p) => path.startsWith(p))) return node.key
      }
      if (node.type === 'group') {
        for (const child of node.children) {
          if (child.path === path) return child.key
          if (child.matchPaths?.some((p) => path.startsWith(p))) return child.key
        }
      }
    }
    for (const node of nodes) {
      if (node.type === 'item' && path.startsWith(node.path)) return node.key
      if (node.type === 'group') {
        for (const child of node.children) {
          if (path.startsWith(child.path)) return child.key
        }
      }
    }
    return null
  }

  const selectedKey = useMemo(
    () => findKeyByPath(location.pathname, filteredNodes),
    [location.pathname, filteredNodes]
  )

  const getDefaultOpenKeys = (nodes: SidebarNode[]) => {
    return nodes
      .filter((node): node is SidebarGroup => node.type === 'group' && node.defaultOpen === true)
      .map((node) => node.key)
  }

  const [openKeys, setOpenKeys] = React.useState<string[]>(() => getDefaultOpenKeys(filteredNodes))

  // 当 config 变化时（切换模块），重置 openKeys
  React.useEffect(() => {
    setOpenKeys(getDefaultOpenKeys(filteredNodes))
  }, [config.defaultPath])

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const path = findPathByKey(key, filteredNodes)
    if (path) {
      navigate(path)
    }
  }

  const handleWorkspaceChange = (value: string) => {
    setCurrentWorkspace(value)
    onWorkspaceChange?.(value)
    const option = config.workspace?.options.find((o) => o.key === value)
    if (option?.defaultPath) {
      navigate(option.defaultPath)
    }
  }

  return (
    <div className={styles.sidebar} data-collapsed={sidebarCollapsed}>
      {config.header && (
        <div className={styles.header}>
          <h3 className={styles.title}>{config.header.title}</h3>
          {config.header.description && (
            <p className={styles.description}>{config.header.description}</p>
          )}
        </div>
      )}

      {config.mode === 'workspace' && config.workspace && (
        <div className={styles.workspaceSwitch}>
          <Select
            value={currentWorkspace}
            onChange={handleWorkspaceChange}
            style={{ width: '100%' }}
            options={config.workspace.options
              .filter((o) => !o.permissionKey || hasPermission(o.permissionKey))
              .map((o) => ({ value: o.key, label: o.label }))}
          />
        </div>
      )}

      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={menuItems}
        onClick={handleMenuClick}
        inlineCollapsed={sidebarCollapsed}
        className={styles.menu}
      />
    </div>
  )
}

export default Sidebar
