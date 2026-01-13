// src/App.tsx
import { RouterProvider } from 'react-router-dom'
import { ErrorBoundary } from './app/ErrorBoundary'
import { Providers } from './app/Providers'
import { router } from './app/routes'
import './styles/global.css'
import './styles/antd-overrides.css'

function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  )
}

export default App
