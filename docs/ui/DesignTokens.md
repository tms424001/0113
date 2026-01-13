# DesignTokens v1.1 (AntD + CSS)

## 1. Typography

| Property | Value |
|----------|-------|
| Base font size | 14px |
| Title H1 | 20px |
| Title H2 | 16px |
| Title H3 | 14px |
| Line height | 1.4 - 1.6 |

- Use AntD typography defaults
- **禁止** custom fonts in v1.0

---

## 2. Spacing (8-based)

**Allowed values only**: 4, 8, 12, 16, 24, 32

| Name | Value | Use Case |
|------|-------|----------|
| xs | 4px | 图标与文字间距 |
| sm | 8px | 控件内间距 |
| md | 12px | 表单项间距 |
| lg | 16px | 卡片内边距 |
| xl | 24px | 页面/区块间距 |
| xxl | 32px | 大区块分隔 |

Usage rules:
- Page padding: 24px
- Card padding: 16~24px
- Control gap: 8~12px

---

## 3. Radius & Shadow

| Property | Value |
|----------|-------|
| Card radius | 8px |
| Input/Button radius | 6px |
| Shadows | AntD default |

- **禁止** custom heavy shadows

---

## 4. Colors

### Primary
- Use AntD token (`colorPrimary`)
- **禁止** hardcode per module

### Status Colors (AntD semantic tokens)

| Status | Usage |
|--------|-------|
| Success | 成功/完成 |
| Warning | 警告/注意 |
| Error | 错误/失败 |
| Processing | 处理中 |

### Background

| Element | Color |
|---------|-------|
| Page BG | #F5F7FA (or tokenized) |
| Card BG | #FFFFFF |
| Sidebar hover | rgba(0,0,0,0.04) |
| Sidebar active | #e6f7ff |
| Table row hover | #fafafa |
| Table row selected | #e6f7ff |

---

## 5. AntD Theme Tokens (Allowed Overrides)

Only these tokens may be overridden:
- `colorPrimary`
- `borderRadius`
- `fontSize`
- `colorBgLayout`
- `colorBgContainer`
- `colorText`
- `colorTextSecondary`

**All overrides must be centralized in one theme file.**

---

## 6. CSS Variable Mapping

```css
/* src/styles/tokens.css */
:root {
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-xxl: 32px;

  /* Layout */
  --page-padding: 24px;
  --card-padding: 16px;
  --control-gap: 8px;

  /* Colors */
  --color-bg-page: #F5F7FA;
  --color-bg-card: #FFFFFF;
  --color-bg-sidebar-hover: rgba(0,0,0,0.04);
  --color-bg-sidebar-active: #e6f7ff;
  --color-bg-table-hover: #fafafa;
  --color-bg-table-selected: #e6f7ff;

  /* Radius */
  --radius-card: 8px;
  --radius-input: 6px;

  /* Transition */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
}
```

---

## 7. Theme Configuration

### Theme File Location
`src/styles/theme.ts` — 唯一允许修改 AntD token 的地方

### Example

```ts
// src/styles/theme.ts
import { ThemeConfig } from 'antd'

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    colorBgLayout: '#F5F7FA',
    colorBgContainer: '#FFFFFF',
  },
}
```

### Provider Setup

```tsx
// src/app/providers.tsx
import { ConfigProvider } from 'antd'
import { themeConfig } from '@/styles/theme'

export const Providers = ({ children }) => (
  <ConfigProvider theme={themeConfig}>
    {children}
  </ConfigProvider>
)
```

---

## 8. Usage Examples

### ✅ Correct

```tsx
// 使用 AntD token
<div style={{ padding: token.paddingLG }}>

// 使用 CSS Module
<div className={styles.card}>

// 使用 CSS 变量
<div style={{ padding: 'var(--page-padding)' }}>
```

### ❌ Forbidden

```tsx
// 硬编码数值
<div style={{ padding: 24 }}>

// 硬编码颜色
<div style={{ color: '#1890ff' }}>

// 随机间距值
<div style={{ gap: 10 }}>  // 10 不在允许列表
```

---

## 9. Forbidden

- ❌ No per-module "own theme"
- ❌ No per-page random colors
- ❌ No inline style for tokens (use CSS vars or theme)
- ❌ No spacing values outside allowed list (4,8,12,16,24,32)
- ❌ No custom shadows

---

## 10. Out of Scope (v1.0)

- Dark mode: **NOT supported**, do not implement
- Custom fonts: **NOT allowed**
- Per-module theme variants: **NOT allowed**