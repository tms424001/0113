// src/components/layout/TopNav.tsx
import React from 'react'
import { Menu, Avatar, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore'
import { ROUTES } from '../../constants/routes'
import styles from './TopNav.module.css'

const MODULE_TABS = [
  { key: 'collect', label: '数据采集', path: ROUTES.COLLECT.DASHBOARD },
  { key: 'assets', label: '数据资产', path: ROUTES.ASSETS.DASHBOARD },
  { key: 'pricing', label: '计价', path: ROUTES.PRICING.FILES },
  { key: 'quality', label: '质控', path: ROUTES.QUALITY.CHECK.FILE_VERIFY },
  { key: 'estimation', label: '估算', path: ROUTES.ESTIMATION.LIST },
]

export const TopNav: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, sidebarCollapsed, toggleSidebar, clearUser } = useAppStore()

  const activeModule = React.useMemo(() => {
    const path = location.pathname
    if (path.startsWith('/collect')) return 'collect'
    if (path.startsWith('/assets')) return 'assets'
    if (path.startsWith('/pricing')) return 'pricing'
    if (path.startsWith('/qc')) return 'qc'
    if (path.startsWith('/estimation')) return 'estimation'
    return 'collect'
  }, [location.pathname])

  const handleModuleClick: MenuProps['onClick'] = ({ key }) => {
    const tab = MODULE_TABS.find((t) => t.key === key)
    if (tab) {
      navigate(tab.path)
    }
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      clearUser()
      localStorage.removeItem('access_token')
      navigate('/login')
    } else if (key === 'settings') {
      navigate('/settings')
    }
  }

  return (
    <header className={styles.topNav}>
      <div className={styles.left}>
        <button className={styles.collapseBtn} onClick={toggleSidebar}>
          {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <div className={styles.logo}>工程造价数字化平台</div>
      </div>

      <nav className={styles.center}>
        <Menu
          mode="horizontal"
          selectedKeys={[activeModule]}
          items={MODULE_TABS.map((tab) => ({
            key: tab.key,
            label: tab.label,
          }))}
          onClick={handleModuleClick}
          className={styles.moduleMenu}
        />
      </nav>

      <div className={styles.right}>
        <button className={styles.iconBtn}>
          <BellOutlined />
        </button>
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
        >
          <Space className={styles.userInfo}>
            <Avatar size="small" icon={<UserOutlined />} src={user?.avatar} />
            <span className={styles.userName}>{user?.name || '用户'}</span>
          </Space>
        </Dropdown>
      </div>
    </header>
  )
}

export default TopNav
