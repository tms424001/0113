# Definition of Done (DoD) v1.1 — Mandatory Checklist

## Mandatory Checklist (5 Items)

Every UI change MUST satisfy all 5 items.

---

### DoD-1: Main Flow Closure

**Requirements:**
- Primary task completes in **≤3 steps**
- No dead ends; every path has back/close
- Clear navigation flow

**Reference:** /docs/ui/LayoutSpec.md §3

**Check:**
- [ ] User can complete main task without getting stuck
- [ ] All modals/drawers have close mechanism
- [ ] Back navigation works correctly

---

### DoD-2: Required States

**Requirements:**
- **Loading**: skeleton or spinner shown
- **Empty**: message + actionable CTA
- **Error**: message + retry button

**Reference:** /docs/ui/StatesSpec.md

**Check:**
- [ ] Loading state implemented for all async operations
- [ ] Empty state has appropriate CTA (init vs filtered)
- [ ] Error state has retry functionality
- [ ] No layout jump during state transitions

---

### DoD-3: Data Binding Integrity

**Requirements:**
- All fields map to DTO/schema
- No invented/hardcoded data
- Field names match API contract

**Reference:** /docs/api/schemas/{module}.md

**Check:**
- [ ] Every displayed field exists in DTO
- [ ] Column definitions match schema
- [ ] Filter options match enum values
- [ ] No placeholder/dummy data in production code

---

### DoD-4: Validation & Explainability

**Requirements:**
- Validate before submit
- Error message near field with fix hint
- Clear error explanations

**Reference:** /docs/ui/ComponentsSpec.md §5

**Check:**
- [ ] Required fields validated
- [ ] Format validation (email, phone, etc.)
- [ ] Error messages are specific and actionable
- [ ] N/A for read-only pages (mark as ⚠️ N/A)

---

### DoD-5: Platform Consistency

**Requirements:**
- Uses AppShell layout
- Uses standard page pattern (P1-P4)
- One primary action per screen
- Sidebar/badges follow tokens

**Reference:** /docs/ui/LayoutSpec.md §1-4, /docs/ui/DesignTokens.md

**Check:**
- [ ] Page uses correct pattern (P1/P2/P3/P4)
- [ ] Only ONE primary button
- [ ] Consistent spacing and colors
- [ ] Follows interaction specs

---

## Output Format (Required)

Every UI change response MUST end with:

```
## DoD Checklist

- DoD-1: ✅/❌/⚠️N/A (具体说明)
- DoD-2: ✅/❌ (具体说明)
- DoD-3: ✅/❌ (具体说明)
- DoD-4: ✅/❌/⚠️N/A (具体说明)
- DoD-5: ✅/❌ (具体说明)
```

---

## Example Output

```
## DoD Checklist

- DoD-1: ✅ 草稿列表 → 点击行 → 抽屉详情 → 关闭，3步完成
- DoD-2: ✅ DataTable 已配置 loading/empty/error 三态，Empty 有「新建草稿」按钮
- DoD-3: ✅ columns 字段来自 DraftListItem DTO，无自造字段
- DoD-4: ⚠️ N/A 本页无表单提交
- DoD-5: ✅ 使用 AppShell + P1 List 模式，主操作「新建草稿」唯一
```

---

## Failure Handling

If any DoD item is ❌:

1. **说明缺失原因**
2. **提出修复方案**
3. **如缺少外部信息，列出最小需求清单**

Example:
```
- DoD-3: ❌ 缺少 DraftDetail DTO，无法确认详情字段
  → 需要：请提供 /api/collect/drafts/:id 的响应 schema
```

---

## Extended DoD (Optional)

For complex pages, consider additional checks:

### DoD-6: Responsive
- Works at 1024px breakpoint
- Table has horizontal scroll or responsive column hiding

### DoD-7: Accessibility
- Keyboard navigable
- Form fields have associated labels
- Icon-only buttons have tooltips/aria-labels

### DoD-8: Performance
- No one-time render of >100 list items
- Large tables use virtual scrolling
- Images are optimized

---

## Reference Links

| DoD Item | Detailed Spec |
|----------|---------------|
| DoD-1 | /docs/ui/LayoutSpec.md §3 Page Patterns |
| DoD-2 | /docs/ui/StatesSpec.md |
| DoD-3 | /docs/api/schemas/{module}.md |
| DoD-4 | /docs/ui/ComponentsSpec.md §5 DetailDrawer |
| DoD-5 | /docs/ui/LayoutSpec.md §1 AppShell |