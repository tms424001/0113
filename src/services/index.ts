// src/services/index.ts
// 统一导出所有 API 服务

// HTTP 基础服务
export { request, default as http } from './http'
export type { ApiError, ApiResponse } from './http'

// Collect 模块 API
export { collectApi, default as collectService } from './collect'

// Pricing 模块 API
export { pricingApi, default as pricingService } from './pricing'

// Project 模块 API
export { projectApi, default as projectService } from './project'

// PR 模块 API
export { prApi, default as prService } from './pr'

// Standardize 模块 API
export { standardizeApi, default as standardizeService } from './standardize'

// Upload 模块 API
export { uploadApi, default as uploadService } from './upload'
