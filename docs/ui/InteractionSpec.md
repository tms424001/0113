# InteractionSpec v1.0 — 交互一致性规范（强约束）

> 目标：所有模块的 hover / focus / 快捷键 / 弹窗确认 / 抽屉行为保持一致。
> 禁止"每页各写各的交互逻辑"。

---

## 1. 基本交互原则（必须遵守）

1. **主动作唯一**：每页只允许 1 个 Primary CTA（主按钮）
2. **次动作收敛**：次级操作进 More（Dropdown）或二级按钮区
3. **危险操作隔离**：删除/覆盖/不可逆动作必须二次确认
4. **可预期反馈**：任何会改变数据的动作必须有 Toast（成功/失败）+ 列表刷新或局部更新
5. **不做花哨动效**：只允许轻量过渡（150–250ms），禁止复杂动画

---

## 2. Hover / Active / Focus（统一规则）

### 2.1 菜单项（Sidebar）

| State | Style |
|-------|-------|
| Hover | 背景轻微变化 (rgba(0,0,0,0.04))，不改变布局 |
| Active | 统一高亮背景 (#e6f7ff) + 左侧指示条 (2px) |
| Focus | 同 Active |

**禁止**：不同模块使用不同选中样式

### 2.2 表格行（DataTable）

| State | Style |
|-------|-------|
| Hover | 整行高亮 (#fafafa)，不出现"抖动" |
| Selected | 选中背景 (#e6f7ff)，必须可与 hover 区分 |
| Clickable | 鼠标指针为 pointer |

### 2.3 可交互控件 Focus

- 所有 Input/Select/Button 必须有清晰 focus 样式（用 AntD 默认即可）
- Icon-only 按钮必须有 Tooltip 或 aria-label（至少一种）

---

## 3. 键盘快捷键（统一且最小集）

### 3.1 全局

| Key | Action |
|-----|--------|
| `Esc` | 关闭 Drawer/Modal（从上到下优先关闭最上层） |
| `Enter` | 在 FilterBar 中触发 Search（当焦点在筛选区域） |
| `Ctrl/Cmd + K` | （可选）打开全局搜索（v1.0 可不实现） |

### 3.2 Drawer（详情抽屉）

| Key | Action |
|-----|--------|
| `Esc` | 关闭抽屉 |
| `Ctrl/Cmd + S` | （可选）在编辑态触发保存 |

---

## 4. 确认与二次确认（统一规范）

### 4.1 必须二次确认的动作

- Delete（删除）
- Overwrite（覆盖）
- Submit/Publish（提交/发布）
- Bulk operations（批量操作）

### 4.2 确认弹窗文案格式（统一）

```tsx
Modal.confirm({
  title: '删除材料？',                    // 动词 + 对象
  content: '删除后不可恢复，确认继续？',    // 说明影响
  okText: '确认删除',
  okButtonProps: { danger: true },       // 危险操作用红色
  cancelText: '取消',
  onOk: () => handleDelete(id),
})
```

**规则**：
- 标题：动词 + 对象（例：删除材料？）
- 正文：说明影响（不可恢复/将影响哪些数据）
- 按钮：取消 / 确认（确认按钮为危险色仅限 Delete）

---

## 5. 抽屉/弹窗行为（统一）

### 5.1 DetailDrawer

| Behavior | Rule |
|----------|------|
| 打开 | 从右侧滑入（AntD Drawer 默认） |
| 关闭 | **保持列表筛选条件不丢**（filters/pagination/selectedRowId） |
| 编辑态未保存 | 关闭时弹确认（继续编辑 / 放弃修改） |

### 5.2 Modal

- 用于"短流程确认/小表单"
- 复杂详情统一用 Drawer，不在 Modal 里堆长表单

---

## 6. 反馈（Toast/Message）统一规则

### 成功

```tsx
message.success('已保存：XX项目材料清单')  // 一句话 + 关键对象
```

### 失败

```tsx
message.error('保存失败：网络异常，请重试')  // 一句话 + 原因 + 建议
```

### 禁止

```tsx
// ❌ 禁止
message.error('失败')  // 不说明原因
message.error('操作失败')  // 没有具体信息
```

---

## 7. 禁止项（硬禁止）

- ❌ 每个模块自定义不同的 hover/active 视觉体系
- ❌ 在 Sidebar 放业务卡片（卡片放内容区）
- ❌ Drawer/Modal 关闭后丢筛选（除非明确声明）
- ❌ 没有确认的删除操作
- ❌ 失败 Toast 不说明原因

---

## 8. Token Reference

| Interaction State | CSS Variable / Token | Value |
|-------------------|----------------------|-------|
| Sidebar hover bg | --sidebar-hover-bg | rgba(0,0,0,0.04) |
| Sidebar active bg | --sidebar-active-bg | #e6f7ff |
| Table row hover | --table-row-hover | #fafafa |
| Table row selected | --table-row-selected | #e6f7ff |
| Focus ring | AntD default | - |
| Transition fast | --transition-fast | 150ms |
| Transition normal | --transition-normal | 250ms |

---

## 9. Animation Timing

| Scene | Duration | Easing |
|-------|----------|--------|
| Hover 背景变化 | 150ms | ease-out |
| Drawer 滑入/出 | 250ms | ease-in-out |
| Modal 淡入/出 | 200ms | ease |
| Toast 出现 | 150ms | ease-out |

> 禁止使用 >300ms 的动画或任何弹跳/回弹效果