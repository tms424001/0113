# CSS Rules v1.1 (AntD + CSS Modules)

## 1. Default Styling Approach

- Use **CSS Modules** for page/component styles: `*.module.css`
- Minimal global styles only in `src/styles/global.css`
- AntD theme tokens for primary colors & radius

---

## 2. File Structure

```
src/styles/
  global.css              # 仅 body/html 级别重置
  tokens.css              # CSS 变量
  antd-overrides.css      # 唯一允许覆盖 AntD 的地方
  
src/components/
  FilterBar/
    index.tsx
    FilterBar.module.css  # 组件私有样式

src/pages/
  collect/
    DraftOverviewPage/
      index.tsx
      DraftOverviewPage.module.css  # 页面私有样式
```

---

## 3. Naming Conventions

- CSS Modules class names: **camelCase**
- File names: `ComponentName.module.css`

```css
/* ✅ Correct */
.container { }
.filterRow { }
.actionButton { }

/* ❌ Wrong */
.filter-row { }  /* kebab-case */
.FilterRow { }   /* PascalCase */
```

---

## 4. Code Examples

### ✅ Correct Usage

```tsx
// components/FilterBar/FilterBar.module.css
.container {
  display: flex;
  gap: var(--control-gap);
  padding: var(--spacing-lg);
}

.searchInput {
  width: 200px;
}

// components/FilterBar/index.tsx
import styles from './FilterBar.module.css'

<div className={styles.container}>
  <Input className={styles.searchInput} />
</div>
```

### ❌ Forbidden

```tsx
// ❌ 内联样式写 token 值
<div style={{ padding: 16, gap: 8 }}>

// ❌ 硬编码颜色
<div style={{ color: '#1890ff' }}>

// ❌ 全局覆盖 AntD (在组件文件里)
// SomePage.module.css
:global(.ant-btn) { border-radius: 4px; }

// ❌ 随机位置的全局样式
// random-file.css
.ant-table-cell { padding: 8px !important; }
```

---

## 5. Common CSS Patterns

### Flex 布局

```css
.row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.spaceBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### 卡片容器

```css
.card {
  background: var(--color-bg-card);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
}
```

### 表格操作列

```css
.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.actions a {
  white-space: nowrap;
}
```

### 页面容器

```css
.pageContent {
  padding: var(--page-padding);
  background: var(--color-bg-page);
  min-height: 100%;
}
```

---

## 6. AntD Override Rules

### 允许覆盖的场景
- 全局按钮圆角
- 全局表格密度
- 全局弹窗样式

### 覆盖方式优先级

1. **ConfigProvider theme token**（最优先）
2. **src/styles/antd-overrides.css**（次选）
3. **组件内 :global()**（最后手段，需注释原因）

### antd-overrides.css Example

```css
/* src/styles/antd-overrides.css */

/* 全局表格行高调整 */
.ant-table-cell {
  padding: 12px 16px;
}

/* 全局弹窗圆角 */
.ant-modal-content {
  border-radius: var(--radius-card);
}

/* 全局抽屉头部 */
.ant-drawer-header {
  border-bottom: 1px solid #f0f0f0;
}
```

---

## 7. Layout Consistency

- Page padding: use `--page-padding` (24px)
- Card spacing: use `--card-padding` (16px)
- Control gap: use `--control-gap` (8px)

```css
/* ✅ Correct */
.page {
  padding: var(--page-padding);
}

/* ❌ Wrong */
.page {
  padding: 20px;  /* 不在允许的 spacing 列表 */
}
```

---

## 8. Forbidden

- ❌ No global override like `.ant-btn { ... }` in random files
- ❌ No inline styles for tokens (spacing/color) except tiny layout fixes
- ❌ No per-module theming (no "pricing purple theme")
- ❌ No `!important` except in antd-overrides.css
- ❌ No styling in JS files (use CSS Modules)

---

## 9. Quick Reference

| I want to... | Use |
|--------------|-----|
| Style a component | ComponentName.module.css |
| Override AntD globally | src/styles/antd-overrides.css |
| Use spacing value | var(--spacing-lg) or token |
| Use color | var(--color-xxx) or AntD token |
| Reset browser styles | src/styles/global.css |

---

## 10. Checklist Before PR

- [ ] No hardcoded colors
- [ ] No hardcoded spacing (only 4,8,12,16,24,32)
- [ ] CSS Module naming is camelCase
- [ ] No AntD overrides outside antd-overrides.css
- [ ] No inline styles for tokens