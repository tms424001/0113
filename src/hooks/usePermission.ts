// src/hooks/usePermission.ts
// 权限检查 Hook

import { useMemo } from 'react'
import { useAppStore } from '@/stores/appStore'

// ============================================================================
// usePermission - 单个权限检查
// ============================================================================

/**
 * 单个权限检查 Hook
 * 
 * @param key 权限 key，如 'collect.read', 'pr.write'
 * @returns 是否有权限
 * 
 * @example
 * ```tsx
 * const canEdit = usePermission('collect.write')
 * 
 * return (
 *   <Button disabled={!canEdit}>编辑</Button>
 * )
 * ```
 */
export function usePermission(key: string): boolean {
  const permissions = useAppStore((state) => state.permissions)

  return useMemo(() => {
    if (!permissions || permissions.length === 0) {
      return false
    }

    // 支持通配符，如 'admin.*' 匹配所有 admin 权限
    if (permissions.includes('*')) {
      return true
    }

    // 精确匹配
    if (permissions.includes(key)) {
      return true
    }

    // 通配符匹配，如 'collect.*' 匹配 'collect.read'
    const parts = key.split('.')
    for (let i = parts.length - 1; i > 0; i--) {
      const wildcardKey = parts.slice(0, i).join('.') + '.*'
      if (permissions.includes(wildcardKey)) {
        return true
      }
    }

    return false
  }, [permissions, key])
}

// ============================================================================
// usePermissions - 多个权限检查
// ============================================================================

/**
 * 多个权限检查 Hook
 * 
 * @param keys 权限 key 数组
 * @returns 权限映射对象
 * 
 * @example
 * ```tsx
 * const perms = usePermissions(['collect.read', 'collect.write', 'pr.review'])
 * 
 * return (
 *   <>
 *     {perms['collect.read'] && <ViewButton />}
 *     {perms['collect.write'] && <EditButton />}
 *     {perms['pr.review'] && <ReviewButton />}
 *   </>
 * )
 * ```
 */
export function usePermissions(keys: string[]): Record<string, boolean> {
  const permissions = useAppStore((state) => state.permissions)

  return useMemo(() => {
    const result: Record<string, boolean> = {}

    for (const key of keys) {
      // 支持通配符
      if (permissions?.includes('*')) {
        result[key] = true
        continue
      }

      // 精确匹配
      if (permissions?.includes(key)) {
        result[key] = true
        continue
      }

      // 通配符匹配
      const parts = key.split('.')
      let matched = false
      for (let i = parts.length - 1; i > 0; i--) {
        const wildcardKey = parts.slice(0, i).join('.') + '.*'
        if (permissions?.includes(wildcardKey)) {
          matched = true
          break
        }
      }
      result[key] = matched
    }

    return result
  }, [permissions, keys])
}

// ============================================================================
// useHasAnyPermission - 是否有任一权限
// ============================================================================

/**
 * 检查是否有任一权限
 * 
 * @param keys 权限 key 数组
 * @returns 是否有任一权限
 * 
 * @example
 * ```tsx
 * const canAccess = useHasAnyPermission(['collect.read', 'collect.write'])
 * 
 * if (!canAccess) return <NoPermission />
 * ```
 */
export function useHasAnyPermission(keys: string[]): boolean {
  const perms = usePermissions(keys)
  return Object.values(perms).some(Boolean)
}

// ============================================================================
// useHasAllPermissions - 是否有所有权限
// ============================================================================

/**
 * 检查是否有所有权限
 * 
 * @param keys 权限 key 数组
 * @returns 是否有所有权限
 * 
 * @example
 * ```tsx
 * const canManage = useHasAllPermissions(['pr.write', 'pr.review'])
 * ```
 */
export function useHasAllPermissions(keys: string[]): boolean {
  const perms = usePermissions(keys)
  return Object.values(perms).every(Boolean)
}

export default usePermission
