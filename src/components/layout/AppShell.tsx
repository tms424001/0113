// src/components/layout/AppShell.tsx - IA v1.3
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { useAppStore } from '../../stores/appStore'
import {
  collectSidebarConfig,
  assetsSidebarConfig,
  pricingSidebarConfig,
  qualitySidebarConfig,
  estimationSidebarConfig,
} from '../../app/sidebar/configs'
import styles from './AppShell.module.css'

const getSidebarConfig = (pathname: string) => {
  if (pathname.startsWith('/collect')) {
    return { config: collectSidebarConfig }
  }
  if (pathname.startsWith('/assets')) {
    return { config: assetsSidebarConfig }
  }
  if (pathname.startsWith('/pricing')) {
    return { config: pricingSidebarConfig }
  }
  if (pathname.startsWith('/quality')) {
    return { config: qualitySidebarConfig }
  }
  if (pathname.startsWith('/estimation')) {
    return { config: estimationSidebarConfig }
  }
  return { config: collectSidebarConfig }
}

export const AppShell: React.FC = () => {
  const location = useLocation()
  const { sidebarCollapsed } = useAppStore()

  const { config } = React.useMemo(
    () => getSidebarConfig(location.pathname),
    [location.pathname]
  )

  return (
    <div className={styles.appShell}>
      <TopNav />
      <div className={styles.body}>
        <aside
          className={styles.sidebar}
          style={{ width: sidebarCollapsed ? 64 : 256 }}
        >
          <Sidebar config={config} />
        </aside>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
