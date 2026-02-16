/**
 * Production-Safe Logger
 */

function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

function isVerboseLoggingEnabled(): boolean {
  return process.env.ENABLE_VERBOSE_LOGGING === 'true'
}

export const logger = {
  debug: (message: string, context?: Record<string, any>): void => {
    if (isDevelopment() || isVerboseLoggingEnabled()) {
      console.debug(`[DEBUG] ${message}`, context || '')
    }
  },
  info: (message: string, context?: Record<string, any>): void => {
    if (isDevelopment() || isVerboseLoggingEnabled()) {
      console.info(`[INFO] ${message}`, context || '')
    }
  },
  warn: (message: string, context?: Record<string, any>): void => {
    if (isDevelopment() || isVerboseLoggingEnabled()) {
      console.warn(`[WARN] ${message}`, context || '')
    }
  },
  error: (message: string, error?: unknown, context?: Record<string, any>): void => {
    if (isDevelopment() || isVerboseLoggingEnabled()) {
      console.error(`[ERROR] ${message}`, { error, context })
    } else {
      console.error(`[ERROR] ${message}`)
    }
  },
  success: (message: string, context?: Record<string, any>): void => {
    if (isDevelopment() || isVerboseLoggingEnabled()) {
      console.log(`[OK] ${message}`, context || '')
    }
  },
  step: (message: string, context?: Record<string, any>): void => {
    if (isDevelopment() || isVerboseLoggingEnabled()) {
      console.log(`[STEP] ${message}`, context || '')
    }
  },
}

export function logAPIRequest(method: string, endpoint: string, data?: any): void {
  if (isDevelopment() || isVerboseLoggingEnabled()) {
    console.log(`[API] ${method} ${endpoint}`, data || '')
  }
}

export function logAPIResponse(endpoint: string, success: boolean, data?: any): void {
  if (isDevelopment() || isVerboseLoggingEnabled()) {
    const icon = success ? '[OK]' : '[FAIL]'
    console.log(`${icon} Response from ${endpoint}`, data || '')
  }
}

export function logPayment(operation: string, orderId?: string): void {
  if (isDevelopment() || isVerboseLoggingEnabled()) {
    console.log(`[PAYMENT] ${operation}`, orderId ? `Order: ${orderId}` : '')
  }
}
