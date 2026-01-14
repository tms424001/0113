# Webix Integration Guide v1.0

> Webix 用于两个核心场景：标准化分析（TreeTable）、对比归因（DiffTable）
> 本文档定义集成规范和封装方式

---

## 1. 使用场景

| 场景 | 组件 | Webix 功能 |
|------|------|-----------|
| **标准化分析** | WebixTreeTable | TreeTable (左树右表) |
| **对比归因** | WebixDiffTable | DataTable + 差异高亮 |
| **原样分析** | WebixSpreadsheet | Spreadsheet (只读) |

---

## 2. 安装与配置

### 2.1 安装

```bash
npm install @xbs/webix-pro
# 或使用 GPL 版本
npm install webix
```

### 2.2 License 配置

```ts
// src/components/webix/webixLicense.ts
import webix from 'webix'

// Pro 版本需要 License
export function initWebixLicense() {
  // @ts-ignore
  webix.license = 'YOUR_LICENSE_KEY'
}

// 在应用入口调用
// initWebixLicense()
```

### 2.3 样式导入

```ts
// src/components/webix/index.ts
import 'webix/webix.css'
// 自定义覆盖样式
import './webix-overrides.css'
```

---

## 3. 封装规范

### 3.1 目录结构

```
src/components/webix/
├── index.ts                  # 统一导出
├── webixLicense.ts           # License 管理
├── webix-overrides.css       # 样式覆盖
├── WebixTreeTable/
│   ├── index.tsx
│   ├── WebixTreeTable.module.css
│   └── types.ts
├── WebixDiffTable/
│   ├── index.tsx
│   ├── WebixDiffTable.module.css
│   └── types.ts
└── WebixSpreadsheet/
    ├── index.tsx
    └── types.ts
```

### 3.2 基础封装模式

```tsx
// src/components/webix/useWebix.ts
import { useRef, useEffect } from 'react'
import webix from 'webix'

export function useWebix<T extends webix.ui.baseview>(
  config: webix.ui.baseviewConfig,
  deps: unknown[] = []
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const webixRef = useRef<T | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 销毁旧实例
    if (webixRef.current) {
      webixRef.current.destructor()
    }

    // 创建新实例
    webixRef.current = webix.ui({
      ...config,
      container: containerRef.current,
    }) as T

    return () => {
      if (webixRef.current) {
        webixRef.current.destructor()
        webixRef.current = null
      }
    }
  }, deps)

  return { containerRef, webixRef }
}
```

---

## 4. WebixTreeTable (标准化分析)

### 4.1 Props Interface

```ts
// src/components/webix/WebixTreeTable/types.ts

export interface WebixTreeTableProps {
  /** 树形数据 */
  data: TreeTableNode[]
  /** 列配置 */
  columns: TreeTableColumn[]
  /** 选中行回调 */
  onSelect?: (item: TreeTableNode) => void
  /** 展开/收起回调 */
  onToggle?: (id: string, isOpen: boolean) => void
  /** 数据修改回调 */
  onChange?: (id: string, field: string, value: unknown) => void
  /** 是否只读 */
  readonly?: boolean
  /** 高度 */
  height?: number | string
  /** 加载状态 */
  loading?: boolean
}

export interface TreeTableNode {
  id: string
  /** 树形层级 */
  $level?: number
  $parent?: string
  $count?: number
  open?: boolean
  /** 业务数据 */
  [key: string]: unknown
}

export interface TreeTableColumn {
  id: string
  header: string
  width?: number
  minWidth?: number
  fillspace?: boolean
  /** 是否为树形列 */
  template?: string | ((obj: TreeTableNode) => string)
  /** 编辑器类型 */
  editor?: 'text' | 'number' | 'select' | 'date'
  /** 下拉选项 */
  options?: Array<{ id: string; value: string }>
  /** 格式化 */
  format?: (value: unknown) => string
  /** CSS 类 */
  css?: string
}
```

### 4.2 组件实现

```tsx
// src/components/webix/WebixTreeTable/index.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import webix from 'webix'
import type { WebixTreeTableProps, TreeTableNode } from './types'
import styles from './WebixTreeTable.module.css'

export interface WebixTreeTableRef {
  /** 获取 Webix 实例 */
  getInstance: () => webix.ui.treetable | null
  /** 刷新数据 */
  refresh: (data: TreeTableNode[]) => void
  /** 展开全部 */
  expandAll: () => void
  /** 收起全部 */
  collapseAll: () => void
  /** 获取选中项 */
  getSelected: () => TreeTableNode | null
}

export const WebixTreeTable = forwardRef<WebixTreeTableRef, WebixTreeTableProps>(
  ({ data, columns, onSelect, onToggle, onChange, readonly = false, height = 600, loading }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const webixRef = useRef<webix.ui.treetable | null>(null)

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      getInstance: () => webixRef.current,
      refresh: (newData) => {
        if (webixRef.current) {
          webixRef.current.clearAll()
          webixRef.current.parse(newData)
        }
      },
      expandAll: () => webixRef.current?.openAll(),
      collapseAll: () => webixRef.current?.closeAll(),
      getSelected: () => {
        const id = webixRef.current?.getSelectedId()
        return id ? webixRef.current?.getItem(id) : null
      },
    }))

    useEffect(() => {
      if (!containerRef.current) return

      // 构建 Webix 配置
      const config: webix.ui.treetableConfig = {
        view: 'treetable',
        container: containerRef.current,
        height: typeof height === 'number' ? height : undefined,
        columns: columns.map(col => ({
          id: col.id,
          header: col.header,
          width: col.width,
          minWidth: col.minWidth,
          fillspace: col.fillspace,
          template: col.id === columns[0]?.id ? '{common.treetable()} #value#' : col.template,
          editor: readonly ? undefined : col.editor,
          options: col.options,
          format: col.format,
          css: col.css,
        })),
        data: data,
        select: 'row',
        editable: !readonly,
        on: {
          onSelectChange: function() {
            if (onSelect) {
              const id = this.getSelectedId()
              if (id) onSelect(this.getItem(id))
            }
          },
          onAfterOpen: function(id: string) {
            if (onToggle) onToggle(id, true)
          },
          onAfterClose: function(id: string) {
            if (onToggle) onToggle(id, false)
          },
          onAfterEditStop: function(state: unknown, editor: { row: string; column: string }) {
            if (onChange) {
              const item = this.getItem(editor.row)
              onChange(editor.row, editor.column, item[editor.column])
            }
          },
        },
      }

      webixRef.current = webix.ui(config) as webix.ui.treetable

      return () => {
        if (webixRef.current) {
          webixRef.current.destructor()
          webixRef.current = null
        }
      }
    }, []) // 仅初始化一次

    // 数据更新
    useEffect(() => {
      if (webixRef.current && data) {
        webixRef.current.clearAll()
        webixRef.current.parse(data)
      }
    }, [data])

    return (
      <div className={styles.container}>
        {loading && <div className={styles.loading}>加载中...</div>}
        <div ref={containerRef} className={styles.webixContainer} />
      </div>
    )
  }
)

WebixTreeTable.displayName = 'WebixTreeTable'
```

### 4.3 使用示例

```tsx
// 标准化分析页面使用
import { WebixTreeTable, WebixTreeTableRef } from '@/components/webix'

const StandardizationPage = () => {
  const treeTableRef = useRef<WebixTreeTableRef>(null)
  
  const columns = [
    { id: 'name', header: '名称', fillspace: true },
    { id: 'code', header: '编码', width: 150 },
    { id: 'quantity', header: '工程量', width: 100, editor: 'number' },
    { id: 'unit', header: '单位', width: 80 },
    { id: 'unitPrice', header: '单价', width: 100 },
    { id: 'totalPrice', header: '合价', width: 120 },
  ]

  return (
    <WebixTreeTable
      ref={treeTableRef}
      data={treeData}
      columns={columns}
      onSelect={(item) => setSelectedItem(item)}
      onChange={(id, field, value) => handleUpdate(id, field, value)}
      height="calc(100vh - 200px)"
    />
  )
}
```

---

## 5. WebixDiffTable (对比归因)

### 5.1 Props Interface

```ts
// src/components/webix/WebixDiffTable/types.ts

export interface WebixDiffTableProps {
  /** 对比数据集 */
  datasets: DiffDataset[]
  /** 列配置（公共列） */
  columns: DiffColumn[]
  /** 差异高亮配置 */
  diffConfig?: DiffConfig
  /** 选中行回调 */
  onSelect?: (item: DiffRow) => void
  /** 高度 */
  height?: number | string
}

export interface DiffDataset {
  id: string
  name: string          // 数据集名称（如工程名）
  data: DiffRow[]
}

export interface DiffRow {
  id: string
  matchKey: string      // 用于匹配的 key（如清单编码）
  [key: string]: unknown
}

export interface DiffColumn {
  id: string
  header: string
  width?: number
  /** 是否参与差异对比 */
  comparable?: boolean
  /** 差异阈值（百分比） */
  threshold?: number
  format?: (value: unknown) => string
}

export interface DiffConfig {
  /** 高亮颜色 */
  highlightColor?: string
  /** 差异阈值（默认 5%） */
  defaultThreshold?: number
  /** 显示差异值 */
  showDiffValue?: boolean
}
```

### 5.2 组件实现要点

```tsx
// 对比表格的核心逻辑
// 1. 按 matchKey 对齐多个数据集
// 2. 计算差异值
// 3. 超出阈值的单元格高亮

export const WebixDiffTable: React.FC<WebixDiffTableProps> = ({
  datasets,
  columns,
  diffConfig,
  onSelect,
  height = 600,
}) => {
  // 1. 合并数据集
  const mergedData = useMemo(() => {
    return mergeDatasets(datasets, columns)
  }, [datasets])

  // 2. 构建动态列（每个数据集一组列）
  const dynamicColumns = useMemo(() => {
    return buildDynamicColumns(datasets, columns, diffConfig)
  }, [datasets, columns])

  // 3. 渲染 Webix DataTable
  // ...
}
```

---

## 6. 样式覆盖

```css
/* src/components/webix/webix-overrides.css */

/* 统一字体 */
.webix_view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
}

/* 表头样式 */
.webix_ss_header td {
  background: #fafafa;
  border-color: #e8e8e8;
  font-weight: 500;
}

/* 选中行 */
.webix_cell.webix_row_select {
  background: var(--color-bg-table-selected, #e6f7ff);
}

/* hover 行 */
.webix_cell:hover {
  background: var(--color-bg-table-hover, #fafafa);
}

/* 差异高亮 */
.diff-highlight {
  background: #fff7e6 !important;
}

.diff-highlight-severe {
  background: #fff1f0 !important;
}

/* 树形图标 */
.webix_tree_open, .webix_tree_close {
  width: 16px;
  height: 16px;
}
```

---

## 7. 性能优化

### 7.1 大数据量处理

```ts
// 开启虚拟滚动
const config = {
  view: 'treetable',
  // ...
  datafetch: 50,        // 每次加载条数
  loadahead: 100,       // 预加载条数
  dynamic: true,        // 动态加载
}
```

### 7.2 按需渲染

```ts
// 仅渲染可视区域
const config = {
  view: 'datatable',
  // ...
  prerender: false,     // 禁用预渲染
  rowHeight: 40,        // 固定行高
}
```

---

## 8. 与 React 集成注意事项

### 8.1 生命周期

```tsx
// ✅ 正确：在 useEffect 中初始化和销毁
useEffect(() => {
  webixRef.current = webix.ui(config)
  return () => webixRef.current?.destructor()
}, [])

// ❌ 错误：在 render 中直接创建
return <div>{webix.ui(config)}</div>
```

### 8.2 数据更新

```tsx
// ✅ 正确：使用 Webix API 更新数据
useEffect(() => {
  webixRef.current?.clearAll()
  webixRef.current?.parse(newData)
}, [newData])

// ❌ 错误：重新创建实例
useEffect(() => {
  webixRef.current?.destructor()
  webixRef.current = webix.ui({ ...config, data: newData })
}, [newData])
```

### 8.3 事件处理

```tsx
// ✅ 正确：使用 useCallback 避免重复绑定
const handleSelect = useCallback((item) => {
  setSelected(item)
}, [])

// 在配置中使用
on: {
  onSelectChange: () => handleSelect(this.getSelectedItem())
}
```

---

## 9. 禁止事项

- ❌ 在页面中直接使用 `webix.ui()`，必须通过封装组件
- ❌ 在多处重复定义相同的 Webix 配置
- ❌ 忘记在组件卸载时销毁 Webix 实例
- ❌ 混用 Webix 样式类和自定义样式类
- ❌ 在 Webix 事件回调中直接修改 React state（需要用 ref 或 callback）

---

## 10. TypeScript 类型补充

```ts
// src/types/webix.d.ts
// 如果 @types/webix 不完整，可以在这里补充

declare namespace webix.ui {
  interface treetable extends baseview {
    openAll(): void
    closeAll(): void
    getSelectedId(): string | null
    getItem(id: string): unknown
    clearAll(): void
    parse(data: unknown[]): void
  }
}
```