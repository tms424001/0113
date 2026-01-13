// src/constants/env.ts

const getViteEnv = () => ({
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  APP_TITLE: (import.meta.env.VITE_APP_TITLE as string) || '工程造价数字化平台',
  MODE: import.meta.env.MODE as 'development' | 'production' | 'test',
  DEV: import.meta.env.DEV as boolean,
  PROD: import.meta.env.PROD as boolean,
})

export const ENV = getViteEnv()

const requiredEnvVars = ['API_BASE_URL'] as const

export function validateEnv(): void {
  const missing: string[] = []

  for (const key of requiredEnvVars) {
    if (!ENV[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}\n` +
        `Please check your .env file. Using fallback values.`
    )
  }
}

if (ENV.DEV) {
  validateEnv()
}
