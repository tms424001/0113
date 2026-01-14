# CollectUploadPage — Golden Example v1.0

> 采集上传是数据入口：上传造价文件 → 自动解析 → 进入标准化分析
> 只需最少必要信息，无需补录完整工程信息

---

## A. Page Intent

**用户目标**：快速上传造价文件，系统自动解析后进入标准化分析。

**Pattern**: P3 Form (简化版)

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ PageHeader: 上传造价文件                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                                                                 │   │
│   │            🔼 拖拽文件到此处，或点击选择文件                    │   │
│   │                                                                 │   │
│   │   支持格式: gbq4, gsc6, gtb4, gcfx, ecp, ecbt, ypgm, qdg3...   │   │
│   │   支持混合格式上传，系统自动识别                                │   │
│   │                                                                 │   │
│   │                      [选择文件]                                 │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   已上传文件                                                            │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ 📄 金爵巷_套定额.CJZ          2MB    ✅ 解析成功    [删除]      │   │
│   │    → 广联达 GBQ4 格式 | 单项工程 10个 | 总金额 5,057.75万       │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   基本信息（自动识别，可修改）                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  项目名称     [金爵巷_套定额                              ]     │   │
│   │                                                                 │   │
│   │  工程地点 *   [四川省    ▼] [成都市    ▼] [锦江区    ▼]        │   │
│   │                                                                 │   │
│   │  计价类型 *   [清单计价  ▼]    综合单价构成  [非全费用  ▼]     │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                                          [取消]  [▶ 开始分析]          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## B. Route

```
/collect/upload                    # 上传页面
/collect/upload?from=quality       # 从质控模块进入
/collect/upload?from=clearing      # 从清标模块进入
```

---

## C. 支持的文件格式

### 计价软件格式

| 软件 | 支持格式 |
|------|----------|
| 广联达 | gbq4, gsc6, gtb4, gzb4, gbg9, gbq5, gbq6, gbq7 |
| 宏业 | gcfx, gcfg |
| 同望 | ecb, ecp, ecbt, ecpt |
| 易达 | yqgm, ypgm, ypgs, yqgs |
| 斯维尔 | qdg3, qdg4, qdy4, qdy3 |
| 博微 | sqd8, bwpw, bwsd7 |
| 新标杆 | nxm, zjxm |
| 纵横 | shn |

### 通用格式

| 格式 | 说明 |
|------|------|
| xlsx/xls | 自编清单、模板导入 |
| rar/zip | 压缩包（自动解压识别） |

---

## D. Data Contract

### 上传文件

```ts
// 上传文件
POST /api/pricing-files/upload
Content-Type: multipart/form-data
Body: {
  file: File
}
Response: {
  fileId: string
  fileName: string
  fileSize: number
  format: string              // 识别的格式
  formatName: string          // 格式中文名
  parseStatus: 'pending' | 'parsing' | 'success' | 'failed'
}

// 查询解析状态
GET /api/pricing-files/:fileId/parse-status
Response: {
  status: 'pending' | 'parsing' | 'success' | 'failed'
  progress: number            // 0-100
  result?: {
    projectName: string       // 识别的项目名
    subProjectCount: number   // 单项工程数
    unitCount: number         // 单位工程数
    totalAmount: number       // 总金额
    structure: ProjectTreeNode[]  // 工程结构预览
  }
  error?: {
    code: string
    message: string
  }
}
```

### 确认并开始分析

```ts
// 确认基本信息，开始标准化分析
POST /api/pricing-files/:fileId/start-analysis
Body: {
  projectName: string
  region: {
    province: string
    city: string
    district: string
  }
  pricingType: 'list' | 'quota'           // 清单计价 | 定额计价
  compositePriceType: 'full' | 'partial'  // 全费用 | 非全费用
}
Response: {
  fileId: string
  status: 'analyzing'
  redirectUrl: string         // 跳转到标准化分析页
}
```

---

## E. 字段说明

### 必填字段（仅4个）

| 字段 | 说明 | 来源 |
|------|------|------|
| 项目名称 | 工程项目名称 | 自动识别，可修改 |
| 工程地点 | 省/市/区三级 | 必须手动选择 |
| 计价类型 | 清单计价/定额计价 | 自动识别，可修改 |
| 综合单价构成 | 全费用/非全费用 | 默认非全费用 |

### 为什么这么少？

```
✅ 采集阶段只需要「能解析」的最少信息
✅ 质控/清标/对比 不需要完整工程信息
✅ 只有入库 PR 时才需要补录完整信息（地点、建设单位、设计参数等）
```

---

## F. Component Structure

### 1) 上传区域

```tsx
// components/UploadZone.tsx
interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>
  accept: string              // 支持的格式
  maxSize?: number            // 最大文件大小 MB
  loading?: boolean
}

// 功能
- 拖拽上传
- 点击选择
- 格式校验
- 大小校验
- 上传进度
```

### 2) 文件列表

```tsx
// components/FileList.tsx
interface FileListProps {
  files: UploadedFile[]
  onDelete: (fileId: string) => void
}

interface UploadedFile {
  fileId: string
  fileName: string
  fileSize: number
  format: string
  formatName: string
  parseStatus: 'pending' | 'parsing' | 'success' | 'failed'
  parseResult?: {
    projectName: string
    subProjectCount: number
    totalAmount: number
  }
  error?: string
}

// 展示
- 文件名 + 大小
- 解析状态（进度条/成功/失败）
- 解析结果摘要（格式、单项工程数、总金额）
- 删除按钮
```

### 3) 基本信息表单

```tsx
// components/BasicInfoForm.tsx
interface BasicInfoFormProps {
  initialValues?: {
    projectName?: string
    pricingType?: string
  }
  onValuesChange: (values: BasicInfo) => void
}

// 字段
- 项目名称: Input（自动填充，可编辑）
- 工程地点: Cascader（省/市/区）
- 计价类型: Select（清单计价/定额计价）
- 综合单价构成: Select（全费用/非全费用）
```

---

## G. Page Store

```ts
// src/stores/collectUploadPageStore.ts
interface CollectUploadPageState {
  // 上传的文件
  files: UploadedFile[]
  
  // 当前选中的文件（用于填写基本信息）
  selectedFileId: string | null
  
  // 基本信息表单
  basicInfo: {
    projectName: string
    region: { province: string; city: string; district: string }
    pricingType: 'list' | 'quota'
    compositePriceType: 'full' | 'partial'
  }
  
  // 状态
  uploading: boolean
  analyzing: boolean
  
  // Actions
  uploadFile: (file: File) => Promise<void>
  deleteFile: (fileId: string) => void
  setBasicInfo: (info: Partial<BasicInfo>) => void
  startAnalysis: () => Promise<void>
}
```

---

## H. Interaction Flow

```
1. 用户拖拽/选择文件
   ↓
2. 文件上传 → 显示上传进度
   ↓
3. 上传完成 → 自动开始解析 → 显示解析进度
   ↓
4. 解析成功 → 显示解析结果（格式、单项数、金额）
           → 自动填充项目名称
   ↓
5. 用户填写/确认基本信息（地点、计价类型）
   ↓
6. 点击「开始分析」
   ↓
7. 跳转到 /standardize/files/:fileId
```

---

## I. States

### Uploading
```tsx
<FileItem>
  <FileName>金爵巷_套定额.CJZ</FileName>
  <Progress percent={45} status="active" />
</FileItem>
```

### Parsing
```tsx
<FileItem>
  <FileName>金爵巷_套定额.CJZ</FileName>
  <Tag color="processing">解析中...</Tag>
  <Progress percent={70} status="active" />
</FileItem>
```

### Success
```tsx
<FileItem>
  <FileName>金爵巷_套定额.CJZ</FileName>
  <Tag color="success">✅ 解析成功</Tag>
  <ParseSummary>
    广联达 GBQ4 格式 | 单项工程 10个 | 总金额 5,057.75万
  </ParseSummary>
</FileItem>
```

### Failed
```tsx
<FileItem>
  <FileName>损坏的文件.xlsx</FileName>
  <Tag color="error">❌ 解析失败</Tag>
  <ErrorMessage>文件格式无法识别，请检查文件是否完整</ErrorMessage>
  <Button>重新上传</Button>
</FileItem>
```

---

## J. Code Skeleton

```tsx
// src/pages/collect/CollectUploadPage/index.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, message } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@/components/ui/PageContainer'
import { UploadZone } from './components/UploadZone'
import { FileList } from './components/FileList'
import { BasicInfoForm } from './components/BasicInfoForm'
import { useCollectUploadPageStore } from '@/stores/collectUploadPageStore'
import styles from './CollectUploadPage.module.css'

const SUPPORTED_FORMATS = '.gbq4,.gsc6,.gtb4,.gcfx,.ecp,.ypgm,.qdg3,.xlsx,.xls,.rar,.zip'

export const CollectUploadPage = () => {
  const navigate = useNavigate()
  const {
    files,
    basicInfo,
    setBasicInfo,
    uploadFile,
    deleteFile,
    startAnalysis,
    uploading,
    analyzing,
  } = useCollectUploadPageStore()

  // 是否可以开始分析
  const canStart = files.some(f => f.parseStatus === 'success') &&
                   basicInfo.region.province &&
                   basicInfo.pricingType

  const handleStartAnalysis = async () => {
    try {
      const result = await startAnalysis()
      navigate(result.redirectUrl)
    } catch (error) {
      message.error('启动分析失败，请重试')
    }
  }

  return (
    <PageContainer title="上传造价文件">
      {/* 上传区域 */}
      <UploadZone
        onUpload={uploadFile}
        accept={SUPPORTED_FORMATS}
        maxSize={500}
        loading={uploading}
      />

      {/* 已上传文件列表 */}
      {files.length > 0 && (
        <FileList
          files={files}
          onDelete={deleteFile}
        />
      )}

      {/* 基本信息表单 */}
      {files.some(f => f.parseStatus === 'success') && (
        <BasicInfoForm
          initialValues={{
            projectName: files.find(f => f.parseStatus === 'success')?.parseResult?.projectName,
          }}
          onValuesChange={setBasicInfo}
        />
      )}

      {/* 操作按钮 */}
      <div className={styles.actions}>
        <Button onClick={() => navigate(-1)}>取消</Button>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleStartAnalysis}
          loading={analyzing}
          disabled={!canStart}
        >
          开始分析
        </Button>
      </div>
    </PageContainer>
  )
}
```

---

## K. DoD Checklist

```
## DoD Checklist

- DoD-1: ✅ 拖拽/选择上传 → 自动解析 → 填写基本信息 → 开始分析，流程闭环
- DoD-2: ✅ Uploading/Parsing/Success/Failed 四态完整
- DoD-3: ✅ 只需 4 个必填字段，无冗余信息
- DoD-4: ✅ 支持多种计价软件格式，自动识别
- DoD-5: ✅ 解析成功后自动填充项目名称
```

---

## L. 与后续流程的关系

```
采集上传页                    标准化分析页              后续作业
┌──────────┐                 ┌──────────┐            ┌──────────┐
│ 上传文件 │ ──开始分析──→  │ 四Tab查看│ ──直接用──→ │ 质控     │
│ 解析预览 │                 │ 分析数据 │            │ 清标     │
│ 基本信息 │                 │          │            │ 对比     │
└──────────┘                 └──────────┘            └──────────┘
     │                                                    │
     │                                                    │
     │                       ┌──────────┐            ┌──────────┐
     └─────── 或直接 ──────→ │ 入库 PR  │ ──补录──→ │ 企业资产 │
                             │ (此时补录)│            │          │
                             └──────────┘            └──────────┘
```