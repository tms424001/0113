// src/services/upload.ts
// 采集上传模块 API 服务

import { request } from './http'
import type {
  UploadFileResponse,
  ParseStatusResponse,
  StartAnalysisRequest,
  StartAnalysisResponse,
} from '@/types/dto.upload'

const BASE_URL = '/api/pricing-files'

// ============================================================================
// 文件上传 API
// ============================================================================

export const uploadApi = {
  /**
   * 上传造价文件
   * @param file 文件对象
   * @param onProgress 上传进度回调
   */
  uploadFile: async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<UploadFileResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    // 使用 XMLHttpRequest 以支持上传进度
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response.data)
          } catch {
            reject(new Error('解析响应失败'))
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误'))
      })

      xhr.open('POST', `${BASE_URL}/upload`)
      
      // 添加认证头
      const token = localStorage.getItem('token')
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    })
  },

  /**
   * 查询文件解析状态
   */
  getParseStatus: (fileId: string): Promise<ParseStatusResponse> => {
    return request.get(`${BASE_URL}/${fileId}/parse-status`)
  },

  /**
   * 删除已上传的文件
   */
  deleteFile: (fileId: string): Promise<void> => {
    return request.delete(`${BASE_URL}/${fileId}`)
  },

  /**
   * 确认基本信息，开始标准化分析
   */
  startAnalysis: (
    fileId: string,
    data: StartAnalysisRequest
  ): Promise<StartAnalysisResponse> => {
    return request.post(`${BASE_URL}/${fileId}/start-analysis`, data as unknown as Record<string, unknown>)
  },
}

export default uploadApi
