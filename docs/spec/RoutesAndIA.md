# Routes & IA v1.2

## 1. Top Modules (TopNav)

| Path | Module | Description |
|------|--------|-------------|
| /collect | 数据采集 | 采集草稿、文件处理 |
| /standardize | 标准化分析 | 造价文件标准化（Webix TreeTable） |
| /assets | 数据资产 | 个人/企业/市场资产 |
| /pr | PR流程 | 个人数据入库企业 |
| /analysis | 对比分析 | 对比归因（Webix DiffTable） |
| /qc | 质控 | 质量控制 |
| /pricing | 计价 | 套定额、映射、Issue |
| /estimation | 估算 | 估算功能 |

---

## 2. Collect Module (数据采集)

| Path | Page Name | Pattern | Sidebar Mode |
|------|-----------|---------|--------------|
| /collect/drafts | 草稿总览 | P1 List | SimpleNav |
| /collect/pricing-files | 造价文件采集 | P1 List | SimpleNav |
| /collect/materials | 材料数据采集 | P1 List | SimpleNav |
| /collect/boq-prices | 清单价格采集 | P1 List | SimpleNav |

---

## 3. Standardize Module (标准化分析) 🆕

| Path | Page Name | Pattern | Sidebar Mode | 说明 |
|------|-----------|---------|--------------|------|
| /standardize/files | 待分析文件 | P1 List | SimpleNav | 选择文件进入分析 |
| /standardize/files/:id | 文件分析 | Custom (Webix) | SimpleNav | 左树右表标准化 |
| /standardize/files/:id/original | 原样分析 | Custom (Webix) | SimpleNav | 查看原始结构 |

### 标准化分析页面结构 (P5 Custom - Webix)

```
┌─────────────────────────────────────────────────────────┐
│ PageHeader: 文件名 | [保存] [完成标准化]                │
├──────────────────┬──────────────────────────────────────┤
│                  │                                      │
│   左侧树         │         右侧表格                     │
│   (项目结构)     │    (WebixTreeTable)                  │
│                  │                                      │
│   ▶ 分部工程     │    清单/材料/指标数据                │
│     ▶ 分项1      │                                      │
│     ▶ 分项2      │                                      │
│                  │                                      │
├──────────────────┴──────────────────────────────────────┤
│ Tabs: [清单] [材料] [指标] [原样]                       │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Assets Module (数据资产)

### Personal Space

| Path | Page Name | Pattern |
|------|-----------|---------|
| /assets/personal/dashboard | 个人看板 | P2 Dashboard |
| /assets/personal/projects | 我的工程 | P1 List |
| /assets/personal/materials | 我的材料 | P1 List |
| /assets/personal/boqs | 我的清单 | P1 List |
| /assets/personal/indices | 我的指标 | P1 List |

### Enterprise Space

| Path | Page Name | Pattern |
|------|-----------|---------|
| /assets/enterprise/dashboard | 企业看板 | P2 Dashboard |
| /assets/enterprise/projects | 企业工程 | P1 List |
| /assets/enterprise/materials | 企业材料 | P1 List |
| /assets/enterprise/boqs | 企业清单 | P1 List |
| /assets/enterprise/indices | 企业指标 | P1 List |

### Marketplace

| Path | Page Name | Pattern |
|------|-----------|---------|
| /assets/market/dashboard | 市场看板 | P2 Dashboard |
| /assets/market/infoprices | 信息价 | P1 List |
| /assets/market/cases | 市场案例 | P1 List |

**Sidebar Mode**: WorkspaceNav (带空间切换)

---

## 5. PR Module (PR流程) 🆕

| Path | Page Name | Pattern | Sidebar Mode | 说明 |
|------|-----------|---------|--------------|------|
| /pr/list | PR列表 | P1 List | SimpleNav | 我发起的/待我审批的 |
| /pr/create | 创建PR | P3 Form | SimpleNav | 选择数据范围 |
| /pr/:id | PR详情 | P4 Master-Detail | SimpleNav | 审批/补录/校核 |
| /pr/:id/diff | 数据对比 | Custom (Webix) | SimpleNav | 查看数据差异 |

### PR详情页面结构 (P4 Master-Detail)

```
┌─────────────────────────────────────────────────────────┐
│ PageHeader: PR-2024-001 | 状态徽标 | [审批] [驳回]      │
├──────────────────┬──────────────────────────────────────┤
│                  │                                      │
│   数据树         │         详情面板                     │
│                  │                                      │
│   ▶ 造价文件(3)  │   Tab: [基本信息] [补录] [校核]     │
│     └ 文件1      │                                      │
│     └ 文件2      │   补录表单 / 校核问题列表            │
│   ▶ 材料(128)    │                                      │
│   ▶ 清单(456)    │                                      │
│   ▶ 指标(23)     │                                      │
│                  │                                      │
├──────────────────┴──────────────────────────────────────┤
│ 审批记录 / 评论区                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Analysis Module (对比分析) 🆕

| Path | Page Name | Pattern | Sidebar Mode | 说明 |
|------|-----------|---------|--------------|------|
| /analysis/compare | 对比归因 | Custom (Webix) | SimpleNav | 多工程对比 |
| /analysis/reports | 分析报告 | P1 List | SimpleNav | 历史报告 |
| /analysis/reports/:id | 报告详情 | P4 Master-Detail | SimpleNav | 查看报告 |

### 对比归因页面结构 (Webix DiffTable)

```
┌─────────────────────────────────────────────────────────┐
│ PageHeader: 对比归因分析                                │
├─────────────────────────────────────────────────────────┤
│ [选择工程] 已选: 工程A, 工程B, 工程C    [开始对比]     │
├─────────────────────────────────────────────────────────┤
│ Tabs: [清单对比] [材料对比] [指标对比] [综合分析]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   WebixDiffTable                                        │
│   ┌────────┬─────────┬─────────┬─────────┬────────┐    │
│   │ 清单项 │ 工程A   │ 工程B   │ 工程C   │ 偏差   │    │
│   ├────────┼─────────┼─────────┼─────────┼────────┤    │
│   │ 土方   │ 12,000  │ 15,000↑ │ 11,500  │ +25%   │    │
│   │ 钢筋   │ 45,000  │ 44,000  │ 48,000↑ │ +8.8%  │    │
│   └────────┴─────────┴─────────┴─────────┴────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 7. QC Module (质控)

| Path | Page Name | Pattern | Sidebar Mode |
|------|-----------|---------|--------------|
| /qc/rules | 质控规则 | P1 List | SimpleNav |
| /qc/tasks | 质控任务 | P1 List | SimpleNav |
| /qc/tasks/:id | 任务详情 | P4 Master-Detail | SimpleNav |
| /qc/reports | 质控报告 | P1 List | SimpleNav |

---

## 8. Pricing Module (计价)

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

## 9. Route → Permission Mapping

| Route Pattern | Required Permission |
|---------------|---------------------|
| /collect/* | collect.read |
| /collect/*/create | collect.write |
| /standardize/* | standardize.read |
| /standardize/files/:id | standardize.write |
| /assets/personal/* | assets.personal.read |
| /assets/enterprise/* | assets.enterprise.read |
| /assets/market/* | assets.market.read |
| /pr/* | pr.read |
| /pr/create | pr.write |
| /pr/:id (审批) | pr.review |
| /analysis/* | analysis.read |
| /qc/* | qc.read |
| /qc/rules (编辑) | qc.write |
| /pricing/* | pricing.read |
| /pricing/tasks/*/edit | pricing.write |

See /docs/security/Permissions.md for full mapping.

---

## 10. Module → Sidebar Config Files

| Module | Config File |
|--------|-------------|
| Collect | src/app/sidebar/collectSidebar.ts |
| Standardize | src/app/sidebar/standardizeSidebar.ts |
| Assets | src/app/sidebar/assetsSidebar.ts |
| PR | src/app/sidebar/prSidebar.ts |
| Analysis | src/app/sidebar/analysisSidebar.ts |
| QC | src/app/sidebar/qcSidebar.ts |
| Pricing | src/app/sidebar/pricingSidebar.ts |
| Estimation | src/app/sidebar/estimationSidebar.ts |

---

## 11. Cross-Module Navigation Flows

### 采集 → 标准化
```
/collect/drafts → 点击「标准化」→ /standardize/files/:fileId
```

### 标准化 → 个人资产
```
/standardize/files/:id → 完成标准化 → 自动存入 /assets/personal/projects/:projectId
```

### 个人资产 → PR
```
/assets/personal/projects/:id → 点击「提交入库」→ /pr/create?projectId=xxx
```

### PR → 企业资产
```
/pr/:id → 审批通过 + 入库 → 数据出现在 /assets/enterprise/*
```

### 企业资产 → 对比分析
```
/assets/enterprise/projects → 选择多个 → /analysis/compare?ids=a,b,c
```

---

## 12. Route Constants (Updated)

```ts
// src/constants/routes.ts
export const ROUTES = {
  COLLECT: {
    DRAFTS: '/collect/drafts',
    PRICING_FILES: '/collect/pricing-files',
    MATERIALS: '/collect/materials',
    BOQ_PRICES: '/collect/boq-prices',
  },
  STANDARDIZE: {
    FILES: '/standardize/files',
    FILE_DETAIL: (id: string) => `/standardize/files/${id}`,
    FILE_ORIGINAL: (id: string) => `/standardize/files/${id}/original`,
  },
  ASSETS: {
    PERSONAL: {
      DASHBOARD: '/assets/personal/dashboard',
      PROJECTS: '/assets/personal/projects',
      MATERIALS: '/assets/personal/materials',
      BOQS: '/assets/personal/boqs',
      INDICES: '/assets/personal/indices',
    },
    ENTERPRISE: {
      DASHBOARD: '/assets/enterprise/dashboard',
      PROJECTS: '/assets/enterprise/projects',
      MATERIALS: '/assets/enterprise/materials',
      BOQS: '/assets/enterprise/boqs',
      INDICES: '/assets/enterprise/indices',
    },
    MARKET: {
      DASHBOARD: '/assets/market/dashboard',
      INFOPRICES: '/assets/market/infoprices',
      CASES: '/assets/market/cases',
    },
  },
  PR: {
    LIST: '/pr/list',
    CREATE: '/pr/create',
    DETAIL: (id: string) => `/pr/${id}`,
    DIFF: (id: string) => `/pr/${id}/diff`,
  },
  ANALYSIS: {
    COMPARE: '/analysis/compare',
    REPORTS: '/analysis/reports',
    REPORT_DETAIL: (id: string) => `/analysis/reports/${id}`,
  },
  QC: {
    RULES: '/qc/rules',
    TASKS: '/qc/tasks',
    TASK_DETAIL: (id: string) => `/qc/tasks/${id}`,
    REPORTS: '/qc/reports',
  },
  PRICING: {
    TASKS: '/pricing/tasks',
    MAPPING: '/pricing/mapping',
    ISSUES: '/pricing/issues',
    PUSH_RECORDS: '/pricing/push-records',
    CLIENT_SYNC: '/pricing/client-sync',
    FILES: '/pricing/files',
    QTY_BASE: '/pricing/qty-base',
  },
}
```