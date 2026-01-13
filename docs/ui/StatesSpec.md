# StatesSpec v1.0 — Loading / Empty / Error 统一状态规范

> 目标：把 DoD 里的三态"落成统一组件与统一文案规则"，避免每页各写各的空态/报错。

---

## 1. 统一状态组件（强制复用）

平台必须提供 3 个可复用组件：
- `PageStateLoading`
- `PageStateEmpty`
- `PageStateError`

统一用于：
- 列表区（表格）
- 详情区（Drawer 内容）
- 表单区（提交/加载）

---

## 2. Loading 规范

### Rules
- 列表 Loading：Table loading 或 Skeleton（统一一种即可）
- Drawer Loading：Skeleton + 标题占位
- **禁止**：Loading 时页面抖动/布局跳变明显（保持骨架高度）

### Component Interface

```ts
interface PageStateLoadingProps {
  type?: 'table' | 'drawer' | 'card'
  rows?: number  // for table skeleton, default 5
}
```

### Usage

```tsx
// 表格加载
<PageStateLoading type="table" rows={10} />

// 抽屉加载
<PageStateLoading type="drawer" />

// 卡片加载
<PageStateLoading type="card" />
```

---

## 3. Empty 规范（必须可行动）

### Rules
Empty 状态必须包含：
- **标题**：一句话说明"暂无数据"
- **描述**：说明可能原因（尚未导入/筛选无结果）
- **CTA**：至少一个可执行按钮

### 区分两类 Empty（必须支持）

| Type | Description | CTA |
|------|-------------|-----|
| `init` | 初始化无数据 | 新增/导入 |
| `filtered` | 筛选后无结果 | 清空筛选（必须有） |

### Component Interface

```ts
interface PageStateEmptyProps {
  type: 'init' | 'filtered'
  title?: string
  description?: string
  onCreate?: () => void      // init 类型的 CTA
  onClearFilter?: () => void // filtered 类型的 CTA
  extra?: ReactNode          // 额外操作
}
```

### Default Copy

```ts
// src/constants/stateMessages.ts
export const EMPTY_MESSAGES = {
  init: {
    title: '暂无数据',
    description: '点击下方按钮创建第一条记录',
  },
  filtered: {
    title: '无匹配结果',
    description: '当前筛选条件下没有数据，试试调整筛选条件',
  },
}
```

### Usage

```tsx
// 初始无数据
<PageStateEmpty
  type="init"
  onCreate={() => navigate('/create')}
/>

// 筛选无结果
<PageStateEmpty
  type="filtered"
  onClearFilter={() => resetFilters()}
/>
```

---

## 4. Error 规范（必须可恢复）

### Rules
Error 状态必须包含：
- **标题**：发生错误
- **描述**：错误原因（若有 message）
- **操作**：Retry（必须有）
- **辅助**：复制错误信息/查看日志（可选，v1.0 可不做）

### Component Interface

```ts
interface PageStateErrorProps {
  code?: number | 'network'
  message?: string
  onRetry: () => void   // 必须
  onBack?: () => void   // 可选，返回上一级
}
```

### Usage

```tsx
<PageStateError
  code={error.code}
  message={error.message}
  onRetry={refetch}
/>
```

---

## 5. 错误类型映射（最重要）

### 5.1 权限错误（403）

```ts
{
  title: '无权限访问',
  description: '您没有访问此页面的权限，请联系管理员',
  actions: ['返回上一级', '切换空间']
}
```

### 5.2 未登录（401）

```ts
{
  title: '登录已过期',
  description: '请重新登录',
  actions: ['重新登录']  // 跳转登录页
}
```

### 5.3 不存在（404）

```ts
{
  title: '资源不存在',
  description: '该记录可能已被删除',
  actions: ['返回列表']
}
```

### 5.4 后端异常（5xx）

```ts
{
  title: '服务暂时不可用',
  description: '请稍后重试',
  actions: ['重试']
}
```

### 5.5 网络错误（Network）

```ts
{
  title: '网络连接异常',
  description: '请检查网络后重试',
  actions: ['重试']
}
```

### Default Error Config

```ts
// src/constants/stateMessages.ts
export const ERROR_MESSAGES: Record<number | 'network', { title: string; description: string }> = {
  401: { title: '登录已过期', description: '请重新登录' },
  403: { title: '无权限访问', description: '请联系管理员开通权限' },
  404: { title: '资源不存在', description: '该记录可能已被删除' },
  500: { title: '服务暂时不可用', description: '请稍后重试' },
  network: { title: '网络连接异常', description: '请检查网络后重试' },
}
```

---

## 6. 错误提示展示位置（统一）

| Error Type | Display Location |
|------------|------------------|
| 列表请求失败 | 显示在表格区域（不弹窗打断） |
| 保存/提交失败 | Toast 提示 + 表单顶部错误摘要（可选） |
| 字段校验失败 | 字段旁错误（不使用 Toast 替代） |

---

## 7. Visual Specs

| Component | Icon | Icon Size | Title Size | Description Size |
|-----------|------|-----------|------------|------------------|
| Empty-Init | inbox | 48px | 16px | 14px |
| Empty-Filtered | search | 48px | 16px | 14px |
| Error | warning | 48px | 16px | 14px |

Layout:
- 垂直居中
- 最大宽度 400px
- 元素间距 16px
- CTA 按钮距描述 24px

---

## 8. Complete Usage Example

```tsx
const DraftList = () => {
  const { data, loading, error, refetch } = useDraftList(filters)
  const hasFilters = Object.values(filters).some(v => v !== undefined)

  // Loading state
  if (loading) {
    return <PageStateLoading type="table" rows={10} />
  }
  
  // Error state
  if (error) {
    return (
      <PageStateError 
        code={error.code} 
        message={error.message} 
        onRetry={refetch} 
      />
    )
  }

  // Empty state
  if (data.total === 0) {
    return (
      <PageStateEmpty
        type={hasFilters ? 'filtered' : 'init'}
        onCreate={() => navigate('/collect/drafts/create')}
        onClearFilter={() => setFilters({})}
      />
    )
  }

  // Data state
  return <DataTable ... />
}
```

---

## 9. 禁止项

- ❌ Empty 没有 CTA
- ❌ Error 没有 Retry
- ❌ 用 Toast 代替页面错误态
- ❌ 不同页面使用不同的空态/错误态样式
- ❌ Loading 时布局跳变
