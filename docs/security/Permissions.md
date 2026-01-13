# Permissions v1.1

## 1. Roles

| Role | Description |
|------|-------------|
| admin | 系统管理员，全部权限 |
| editor | 编辑者，可读写 |
| viewer | 查看者，只读 |

---

## 2. Permission Keys

### Collect Module

| Key | Description |
|-----|-------------|
| collect.read | 查看采集数据 |
| collect.write | 创建/编辑草稿 |
| collect.delete | 删除草稿 |
| collect.runJobs | 运行解析/标准化任务 |
| collect.export | 导出数据 |

### Assets Module

| Key | Description |
|-----|-------------|
| assets.personal.read | 查看个人资产 |
| assets.personal.write | 编辑个人资产 |
| assets.enterprise.read | 查看企业资产 |
| assets.enterprise.write | 编辑企业资产 |
| assets.market.read | 查看市场数据 |

### Pricing Module

| Key | Description |
|-----|-------------|
| pricing.read | 查看计价数据 |
| pricing.write | 创建/编辑任务 |
| pricing.delete | 删除任务 |
| pricing.mapping | 执行映射操作 |
| pricing.push | 推送数据 |
| pricing.issues.resolve | 解决 Issue |

### QC Module

| Key | Description |
|-----|-------------|
| qc.read | 查看质控数据 |
| qc.write | 编辑质控规则 |

### Estimation Module

| Key | Description |
|-----|-------------|
| estimation.read | 查看估算数据 |
| estimation.write | 创建/编辑估算 |

---

## 3. Role → Permissions Matrix

### Collect

| Permission | admin | editor | viewer |
|------------|-------|--------|--------|
| collect.read | ✅ | ✅ | ✅ |
| collect.write | ✅ | ✅ | ❌ |
| collect.delete | ✅ | ❌ | ❌ |
| collect.runJobs | ✅ | ✅ | ❌ |
| collect.export | ✅ | ✅ | ✅ |

### Pricing

| Permission | admin | editor | viewer |
|------------|-------|--------|--------|
| pricing.read | ✅ | ✅ | ✅ |
| pricing.write | ✅ | ✅ | ❌ |
| pricing.delete | ✅ | ❌ | ❌ |
| pricing.mapping | ✅ | ✅ | ❌ |
| pricing.push | ✅ | ✅ | ❌ |
| pricing.issues.resolve | ✅ | ✅ | ❌ |

---

## 4. Route → Permission Mapping

### Collect Module

| Route | Required Permission |
|-------|---------------------|
| /collect/drafts | collect.read |
| /collect/drafts/create | collect.write |
| /collect/drafts/:id/edit | collect.write |
| /collect/pricing-files | collect.read |
| /collect/materials | collect.read |
| /collect/boq-prices | collect.read |

### Assets Module

| Route | Required Permission |
|-------|---------------------|
| /assets/personal/* | assets.personal.read |
| /assets/enterprise/* | assets.enterprise.read |
| /assets/market/* | assets.market.read |

### Pricing Module

| Route | Required Permission |
|-------|---------------------|
| /pricing/tasks | pricing.read |
| /pricing/tasks/:id/edit | pricing.write |
| /pricing/mapping | pricing.read |
| /pricing/issues | pricing.read |
| /pricing/push-records | pricing.read |

---

## 5. Action → Permission Mapping

### Collect Module

| Page | Action | Permission | No Permission Handling |
|------|--------|------------|------------------------|
| 草稿列表 | 新建草稿 | collect.write | 隐藏按钮 |
| 草稿列表 | 删除 | collect.delete | 禁用 + tooltip |
| 草稿详情 | 编辑 | collect.write | 禁用按钮 |
| 草稿详情 | 运行任务 | collect.runJobs | 禁用按钮 |
| 草稿详情 | 导出 | collect.export | 隐藏按钮 |

### Pricing Module

| Page | Action | Permission | No Permission Handling |
|------|--------|------------|------------------------|
| 任务列表 | 新建任务 | pricing.write | 隐藏按钮 |
| 任务列表 | 删除 | pricing.delete | 禁用 + tooltip |
| 映射详情 | 确认映射 | pricing.mapping | 禁用按钮 |
| 映射详情 | 推送 | pricing.push | 禁用按钮 |
| Issue 列表 | 解决 | pricing.issues.resolve | 禁用按钮 |

---

## 6. UI Rules

### Sidebar
- No permission → **hide sidebar item**
- Use `permission` field in SidebarConfig

### Buttons
- Read-only → **disable** with reason tooltip
- No permission at all → **hide**

### API 403 Response
- Render StatesSpec "No Permission" error state
- Show "返回上一级" or "联系管理员" action

---

## 7. Implementation

### usePermission Hook

```ts
// src/hooks/usePermission.ts
export function usePermission(key: string): boolean {
  const { permissions } = useAppStore()
  return permissions.includes(key)
}

export function usePermissions(keys: string[]): Record<string, boolean> {
  const { permissions } = useAppStore()
  return Object.fromEntries(keys.map(k => [k, permissions.includes(k)]))
}
```

### Usage Example

```tsx
// 隐藏无权限的按钮
const canWrite = usePermission('collect.write')

{canWrite && (
  <Button type="primary" onClick={handleCreate}>
    新建草稿
  </Button>
)}

// 禁用无权限的按钮
const canDelete = usePermission('collect.delete')

<Tooltip title={!canDelete ? '无删除权限，请联系管理员' : undefined}>
  <Button 
    danger 
    disabled={!canDelete} 
    onClick={handleDelete}
  >
    删除
  </Button>
</Tooltip>
```

### Sidebar Permission Filtering

```ts
// 在 SidebarConfig 里过滤
const visibleItems = items.filter(item => 
  !item.permission || permissions.includes(item.permission)
)
```

---

## 8. Permission Data Flow

### Login Response

```ts
// POST /api/auth/login 响应
{
  "user": {
    "id": "user_001",
    "name": "张三",
    "role": "editor"
  },
  "permissions": ["collect.read", "collect.write", "pricing.read", "pricing.write"]
}
```

### App Store

```ts
// src/stores/appStore.ts
interface AppState {
  user: User | null
  permissions: string[]
  setUser: (user: User, permissions: string[]) => void
  clearUser: () => void
}
```

### Page Refresh

- Call `GET /api/auth/me` to restore user & permissions
- Or restore from secure storage (if policy allows)

---

## 9. NoPermission Component

```tsx
// src/components/ui/NoPermissionPage.tsx
interface NoPermissionPageProps {
  title?: string
  description?: string
  backPath?: string
}

<NoPermissionPage 
  title="无访问权限"
  description="您没有访问此页面的权限，请联系管理员"
  backPath="/dashboard"
/>
```