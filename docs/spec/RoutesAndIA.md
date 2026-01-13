# Routes & IA v1.1

## 1. Top Modules (TopNav)

| Path | Module | Description |
|------|--------|-------------|
| /collect | 数据采集 | 采集草稿、文件处理 |
| /assets | 数据资产 | 个人/企业/市场资产 |
| /qc | 质控 | 质量控制 |
| /pricing | 计价 | 套定额、映射、Issue |
| /estimation | 估算 | 估算功能 |

---

## 2. Collect Module

| Path | Page Name | Pattern | Sidebar Mode |
|------|-----------|---------|--------------|
| /collect/drafts | 草稿总览 | P1 List | SimpleNav |
| /collect/pricing-files | 造价文件采集 | P1 List | SimpleNav |
| /collect/materials | 材料数据采集 | P1 List | SimpleNav |
| /collect/boq-prices | 清单价格采集 | P1 List | SimpleNav |

---

## 3. Assets Module

### Personal Space

| Path | Page Name | Pattern |
|------|-----------|---------|
| /assets/personal/dashboard | 个人看板 | P2 Dashboard |
| /assets/personal/materials | 我的材料 | P1 List |
| /assets/personal/boqs | 我的清单 | P1 List |
| /assets/personal/cases | 我的案例 | P1 List |

### Enterprise Space

| Path | Page Name | Pattern |
|------|-----------|---------|
| /assets/enterprise/dashboard | 企业看板 | P2 Dashboard |
| /assets/enterprise/materials | 企业材料 | P1 List |
| /assets/enterprise/boqs | 企业清单 | P1 List |
| /assets/enterprise/cases | 企业案例 | P1 List |
| /assets/enterprise/indices | 指标库 | P1 List |

### Marketplace

| Path | Page Name | Pattern |
|------|-----------|---------|
| /assets/market/dashboard | 市场看板 | P2 Dashboard |
| /assets/market/infoprices | 信息价 | P1 List |
| /assets/market/cases | 市场案例 | P1 List |

**Sidebar Mode**: WorkspaceNav (带空间切换)

---

## 4. Pricing Module

| Path | Page Name | Pattern | Sidebar Mode |
|------|-----------|---------|--------------|
| /pricing/tasks | 套定额任务 | P1 List | WorkflowTree |
| /pricing/mapping | 映射知识库 | P1 List | WorkflowTree |
| /pricing/push-records | 推送记录 | P1 List | WorkflowTree |
| /pricing/issues | Issue 工作台 | P4 Master-Detail | WorkflowTree |
| /pricing/client-sync | 客户端协同 | P1 List | WorkflowTree |
| /pricing/files | 计价文件 | P1 List | WorkflowTree |
| /pricing/qty-base | 算力底座 | P2 Dashboard | WorkflowTree |

---

## 5. Route → Permission Mapping

| Route Pattern | Required Permission |
|---------------|---------------------|
| /collect/* | collect.read |
| /collect/*/create | collect.write |
| /collect/*/edit | collect.write |
| /assets/personal/* | assets.personal.read |
| /assets/enterprise/* | assets.enterprise.read |
| /assets/market/* | assets.market.read |
| /pricing/* | pricing.read |
| /pricing/tasks/*/edit | pricing.write |
| /pricing/mapping | pricing.write |

See /docs/security/Permissions.md for full mapping.

---

## 6. Module → Sidebar Config Files

| Module | Config File |
|--------|-------------|
| Collect | src/app/sidebar/collectSidebar.ts |
| Assets | src/app/sidebar/assetsSidebar.ts |
| Pricing | src/app/sidebar/pricingSidebar.ts |
| QC | src/app/sidebar/qcSidebar.ts |
| Estimation | src/app/sidebar/estimationSidebar.ts |

---

## 7. Workspace Switching (Assets Module)

路由结构：`/assets/{space}/{resource}`

| Space | 切换方式 | Permission |
|-------|----------|------------|
| personal | 默认 | 登录即可 |
| enterprise | Sidebar 顶部下拉选择企业 | enterprise.member |
| market | Sidebar Tab 切换 | market.access |

Space 切换时：
- 保持当前 resource（如 materials）
- 清空筛选条件
- URL 变为 `/assets/{newSpace}/{currentResource}`

---

## 8. Navigation Flows

### Collect → Pricing 流转
草稿总览 → 点击「提交套价」→ /pricing/tasks?draftId=xxx

### List → Detail 流转
/pricing/tasks → 点击行 → DetailDrawer(id) 或 /pricing/tasks/{id}

### Breadcrumb Rules
- 一级模块不显示面包屑
- 二级页面：模块名 / 页面名
- 详情页：模块名 / 列表页名 / 详情ID

---

## 9. Route Rules (Non-negotiable)

- ✅ Must follow this dictionary; **no new routes without updating this file**
- ✅ URL drives sidebar active state
- ✅ Page title must match route name
- ✅ All routes must be registered in `src/app/routes.ts`
- ❌ Do not hardcode route strings; use constants

---

## 10. Route Constants

```ts
// src/constants/routes.ts
export const ROUTES = {
  COLLECT: {
    DRAFTS: '/collect/drafts',
    PRICING_FILES: '/collect/pricing-files',
    MATERIALS: '/collect/materials',
    BOQ_PRICES: '/collect/boq-prices',
  },
  ASSETS: {
    PERSONAL: {
      DASHBOARD: '/assets/personal/dashboard',
      MATERIALS: '/assets/personal/materials',
      // ...
    },
    // ...
  },
  PRICING: {
    TASKS: '/pricing/tasks',
    MAPPING: '/pricing/mapping',
    ISSUES: '/pricing/issues',
    // ...
  },
}
```
