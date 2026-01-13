// src/app/Providers.tsx
import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { themeConfig } from '../styles/theme'

interface ProvidersProps {
  children: ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      {children}
    </ConfigProvider>
  )
}

export default Providers
