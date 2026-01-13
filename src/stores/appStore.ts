// src/stores/appStore.ts
import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AppState {
  user: User | null
  permissions: string[]
  sidebarCollapsed: boolean
  activeModule: string

  setUser: (user: User | null) => void
  clearUser: () => void
  setPermissions: (permissions: string[]) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveModule: (module: string) => void
  hasPermission: (key: string) => boolean
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  permissions: [],
  sidebarCollapsed: false,
  activeModule: 'collect',

  setUser: (user) => set({ user }),

  clearUser: () =>
    set({
      user: null,
      permissions: [],
    }),

  setPermissions: (permissions) => set({ permissions }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setActiveModule: (module) => set({ activeModule: module }),

  hasPermission: (key) => {
    const { permissions } = get()
    if (permissions.length === 0) return true
    return permissions.includes(key)
  },
}))
