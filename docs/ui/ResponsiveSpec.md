# ResponsiveSpec v1.0 — 响应式与缩放策略（桌面优先）

> 目标：即使 v1.0 主要面向桌面，也要保证 1200px 以下不崩、不乱、可用。
> 原则：不追求"移动端最佳体验"，追求"不翻车"。

---

## 1. 断点定义（必须统一）

| Breakpoint | Range | Description |
|------------|-------|-------------|
| XL | >= 1440px | 宽屏桌面 |
| L | 1200 ~ 1439px | 标准桌面 |
| M | 992 ~ 1199px | 小桌面/大平板 |
| S | < 992px | 平板/移动（仅保证可用） |

---

## 2. CSS Breakpoint Variables

```css
/* src/styles/breakpoints.css */
:root {
  --breakpoint-xl: 1440px;
  --breakpoint-l: 1200px;
  --breakpoint-m: 992px;
  --breakpoint-s: 768px;  /* S 的下限，再小不保证 */
}

/* 使用示例 */
@media (max-width: 1199px) { /* M 及以下 */ }
@media (max-width: 991px) { /* S */ }
```

---

## 3. AppShell 响应式规则

### 3.1 Sidebar

| Breakpoint | Behavior |
|------------|----------|
| XL/L | Sidebar 固定 256px |
| M | Sidebar 可 collapse（收起为 64px icon-only） |
| S | Sidebar 为抽屉式（overlay），点击菜单按钮打开 |

### 3.2 TopNav

| Breakpoint | Behavior |
|------------|----------|
| XL/L | 完整展示模块入口 |
| M/S | 模块入口进入 "More" 下拉 |

---

## 4. PageHeader 响应式规则

| Breakpoint | Layout |
|------------|--------|
| XL/L | 标题与主按钮同一行 |
| M/S | 主按钮下移到第二行右侧（仍保持"主按钮唯一"） |

---

## 5. FilterBar 响应式规则

| Breakpoint | Behavior |
|------------|----------|
| XL/L | 筛选项横向排列，超过自动换行 |
| M | 默认显示 1 行筛选，剩余进入"更多筛选"（展开区或 Popover） |
| S | 筛选放入可展开区域（默认收起），防止压缩表格区域 |

---

## 6. DataTable 响应式规则（重点）

### 6.1 列优先级（必须配置）

每列必须定义 priority：

| Priority | Description | Visible At |
|----------|-------------|------------|
| P0 | 必须显示（名称/编码/金额/状态等关键列） | Always |
| P1 | 重要列（常用） | XL/L/M |
| P2 | 可隐藏（辅助信息） | XL/L only |

规则：
- XL：显示 P0/P1/P2
- L：显示 P0/P1（P2 可默认隐藏）
- M/S：只显示 P0（P1/P2 通过"列设置"或"详情抽屉"查看）

### 6.2 Column Priority Example

```ts
const draftColumns: ColumnDef[] = [
  { key: 'name', title: '名称', priority: 'P0', width: 200 },
  { key: 'status', title: '状态', priority: 'P0', width: 100 },
  { key: 'type', title: '类型', priority: 'P1', width: 120 },
  { key: 'projectName', title: '项目', priority: 'P1', width: 150 },
  { key: 'createdBy', title: '创建人', priority: 'P2', width: 100 },
  { key: 'createdAt', title: '创建时间', priority: 'P2', width: 160 },
  { key: 'actions', title: '操作', priority: 'P0', width: 120, fixed: 'right' },
]
```

### 6.3 横向滚动

- 当列很多时允许 x-scroll
- **禁止**：列宽挤压导致文字不可读

---

## 7. DetailDrawer 响应式规则

| Breakpoint | Drawer Width |
|------------|--------------|
| XL | 960px |
| L | 800px |
| M | 720px |
| S | 100% (近全屏) |

---

## 8. useBreakpoint Hook

```ts
// src/hooks/useBreakpoint.ts
type Breakpoint = 'XL' | 'L' | 'M' | 'S'

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('XL')
  
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w >= 1440) setBp('XL')
      else if (w >= 1200) setBp('L')
      else if (w >= 992) setBp('M')
      else setBp('S')
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  return bp
}

// Usage
const bp = useBreakpoint()
const isMobile = bp === 'S'
const sidebarMode = bp === 'S' ? 'drawer' : bp === 'M' ? 'collapsed' : 'fixed'
```

---

## 9. Drawer Width Constants

```ts
// src/constants/layout.ts
export const DRAWER_WIDTH = {
  XL: 960,
  L: 800,
  M: 720,
  S: '100%',
}
```

---

## 10. Quick Reference

| Component | XL/L | M | S |
|-----------|------|---|---|
| Sidebar | 固定 256px | 可收起 64px | 抽屉 |
| TopNav | 完整 | 完整 | More 下拉 |
| PageHeader | 单行 | 单行 | 按钮下移 |
| FilterBar | 横排 | 1行+更多 | 收起 |
| DataTable | 全列 | P0+P1 | 仅 P0 |
| Drawer | 960px | 720px | 全屏 |

---

## 11. Out of Scope (v1.0)

- 移动端原生体验优化
- 触摸手势支持
- 横屏/竖屏切换处理

> v1.0 优先支持桌面端，移动端为降级体验

---

## 12. 禁止项

- ❌ 每个页面自定义不同断点
- ❌ 在小屏把操作按钮挤成一团（优先放 More）
- ❌ 表格列宽挤压到文字不可读
- ❌ 移动端不可滚动查看内容
