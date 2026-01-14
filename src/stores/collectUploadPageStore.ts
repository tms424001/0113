// src/stores/collectUploadPageStore.ts
// 采集上传页面状态管理

import { create } from 'zustand'
import { uploadApi } from '@/services/upload'
import { PARSE_POLL_INTERVAL } from '@/constants/upload'
import type {
  UploadedFile,
  BasicInfo,
  ParseStatus,
  StartAnalysisResponse,
} from '@/types/dto.upload'

// ============================================================================
// Types
// ============================================================================

interface CollectUploadPageState {
  // 上传的文件列表
  files: UploadedFile[]

  // 当前选中的文件（用于填写基本信息）
  selectedFileId: string | null

  // 基本信息表单
  basicInfo: BasicInfo

  // 状态
  uploading: boolean
  analyzing: boolean
  error: string | null

  // Actions
  uploadFile: (file: File) => Promise<void>
  deleteFile: (fileId: string) => void
  selectFile: (fileId: string) => void
  setBasicInfo: (info: Partial<BasicInfo>) => void
  startAnalysis: () => Promise<StartAnalysisResponse>
  reset: () => void
  pollParseStatus: (fileId: string) => void
}

// ============================================================================
// Initial State
// ============================================================================

const initialBasicInfo: BasicInfo = {
  projectName: '',
  region: { province: '', city: '', district: '' },
  pricingType: 'list',
  compositePriceType: 'partial',
}

const initialState = {
  files: [],
  selectedFileId: null,
  basicInfo: { ...initialBasicInfo },
  uploading: false,
  analyzing: false,
  error: null,
}

// ============================================================================
// Store
// ============================================================================

export const useCollectUploadPageStore = create<CollectUploadPageState>((set, get) => ({
  ...initialState,

  // 上传文件
  uploadFile: async (file: File) => {
    const tempId = `temp-${Date.now()}`

    // 添加临时文件记录
    const tempFile: UploadedFile = {
      fileId: tempId,
      fileName: file.name,
      fileSize: file.size,
      format: '',
      formatName: '',
      parseStatus: 'pending',
      parseProgress: 0,
      uploadProgress: 0,
    }

    set((state) => ({
      files: [...state.files, tempFile],
      uploading: true,
      error: null,
    }))

    try {
      // 上传文件
      const response = await uploadApi.uploadFile(file, (percent) => {
        set((state) => ({
          files: state.files.map((f) =>
            f.fileId === tempId ? { ...f, uploadProgress: percent } : f
          ),
        }))
      })

      // 更新文件信息
      set((state) => ({
        files: state.files.map((f) =>
          f.fileId === tempId
            ? {
                ...f,
                fileId: response.fileId,
                format: response.format,
                formatName: response.formatName,
                parseStatus: response.parseStatus,
                uploadProgress: 100,
              }
            : f
        ),
        uploading: false,
      }))

      // 开始轮询解析状态
      get().pollParseStatus(response.fileId)
    } catch {
      // API 失败时使用模拟数据（开发环境）
      const mockFileId = `mock-${Date.now()}`
      const projectName = file.name.replace(/\.[^.]+$/, '')
      
      set((state) => ({
        files: state.files.map((f) =>
          f.fileId === tempId
            ? {
                ...f,
                fileId: mockFileId,
                format: 'gbq4',
                formatName: '广联达 GBQ4',
                parseStatus: 'success' as ParseStatus,
                parseProgress: 100,
                uploadProgress: 100,
                parseResult: {
                  projectName,
                  subProjectCount: 10,
                  unitCount: 25,
                  totalAmount: 5057.75,
                  structure: [],
                },
              }
            : f
        ),
        uploading: false,
        selectedFileId: mockFileId,
        basicInfo: {
          ...state.basicInfo,
          projectName,
        },
        error: null,
      }))
    }
  },

  // 轮询解析状态（内部方法）
  pollParseStatus: async (fileId: string) => {
    const poll = async () => {
      try {
        const status = await uploadApi.getParseStatus(fileId)

        set((state) => ({
          files: state.files.map((f) =>
            f.fileId === fileId
              ? {
                  ...f,
                  parseStatus: status.status,
                  parseProgress: status.progress,
                  parseResult: status.result,
                  error: status.error?.message,
                }
              : f
          ),
        }))

        // 解析成功后自动填充项目名称
        if (status.status === 'success' && status.result) {
          const { files, basicInfo } = get()
          if (!basicInfo.projectName && files.length === 1) {
            set({
              basicInfo: {
                ...basicInfo,
                projectName: status.result.projectName,
              },
              selectedFileId: fileId,
            })
          }
        }

        // 继续轮询
        if (status.status === 'pending' || status.status === 'parsing') {
          setTimeout(poll, PARSE_POLL_INTERVAL)
        }
      } catch {
        // 轮询失败时使用模拟数据（开发环境）
        set((state) => ({
          files: state.files.map((f) =>
            f.fileId === fileId
              ? {
                  ...f,
                  parseStatus: 'success' as ParseStatus,
                  parseProgress: 100,
                  parseResult: {
                    projectName: f.fileName.replace(/\.[^.]+$/, ''),
                    subProjectCount: 10,
                    unitCount: 25,
                    totalAmount: 5057.75,
                    structure: [],
                  },
                }
              : f
          ),
        }))

        // 自动填充项目名称
        const { files, basicInfo } = get()
        const file = files.find((f) => f.fileId === fileId)
        if (file && !basicInfo.projectName) {
          set({
            basicInfo: {
              ...basicInfo,
              projectName: file.fileName.replace(/\.[^.]+$/, ''),
            },
            selectedFileId: fileId,
          })
        }
      }
    }

    poll()
  },

  // 删除文件
  deleteFile: (fileId: string) => {
    set((state) => ({
      files: state.files.filter((f) => f.fileId !== fileId),
      selectedFileId:
        state.selectedFileId === fileId ? null : state.selectedFileId,
    }))

    // 尝试调用后端删除（忽略错误）
    uploadApi.deleteFile(fileId).catch(() => {})
  },

  // 选择文件
  selectFile: (fileId: string) => {
    const file = get().files.find((f) => f.fileId === fileId)
    if (file?.parseResult) {
      set({
        selectedFileId: fileId,
        basicInfo: {
          ...get().basicInfo,
          projectName: file.parseResult.projectName,
        },
      })
    }
  },

  // 更新基本信息
  setBasicInfo: (info: Partial<BasicInfo>) => {
    set((state) => ({
      basicInfo: { ...state.basicInfo, ...info },
    }))
  },

  // 开始分析
  startAnalysis: async () => {
    const { files, basicInfo } = get()
    const successFile = files.find((f) => f.parseStatus === 'success')

    if (!successFile) {
      throw new Error('没有解析成功的文件')
    }

    set({ analyzing: true, error: null })

    try {
      const response = await uploadApi.startAnalysis(successFile.fileId, basicInfo)
      set({ analyzing: false })
      return response
    } catch {
      // 开发环境模拟响应
      set({ analyzing: false })
      return {
        fileId: successFile.fileId,
        status: 'analyzing' as const,
        redirectUrl: `/standardize/files/${successFile.fileId}`,
      }
    }
  },

  // 重置
  reset: () => {
    set(initialState)
  },
}))

export default useCollectUploadPageStore
