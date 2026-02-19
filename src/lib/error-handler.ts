/**
 * Secure Error Handler
 * Handles errors safely without exposing sensitive information to clients
 */

import { NextResponse } from 'next/server'

interface ErrorLogContext {
  endpoint?: string
  method?: string
  userId?: string
  requestId?: string
  [key: string]: any
}

/**
 * Log error details server-side only
 */
export function logError(
  error: unknown,
  context?: ErrorLogContext
): void {
  if (process.env.NODE_ENV === 'development' || process.env.ENABLE_ERROR_LOGGING === 'true') {
    console.error('=== ERROR DETAILS ===')
    if (context) {
      console.error('Context:', context)
    }
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
      console.error('Name:', error.name)
    } else {
      console.error('Error:', error)
    }
    console.error('===================')
  }
}

/**
 * Get user-friendly error message without exposing internals
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const lowerMessage = error.message.toLowerCase()
    
    // Preserve user-friendly error messages (especially from Billplz)
    if (lowerMessage.includes('billplz api error')) {
      // Extract the actual error message after "Billplz API Error (XXX): "
      const match = error.message.match(/Billplz API Error \([^)]+\): (.+)/i)
      if (match && match[1]) {
        return match[1]
      }
      // If it's a user-friendly message, return it
      if (lowerMessage.includes('authentication failed') || 
          lowerMessage.includes('collection not found') ||
          lowerMessage.includes('validation error') ||
          lowerMessage.includes('cannot connect') ||
          lowerMessage.includes('timed out')) {
        return error.message
      }
    }
    
    // Preserve validation errors and user-facing messages
    if (lowerMessage.includes('validation error') ||
        lowerMessage.includes('missing required') ||
        lowerMessage.includes('invalid') ||
        lowerMessage.includes('unable to determine')) {
      return error.message
    }
    
    // Hide technical details for other errors
    const technicalPhrases = [
      'graphql', 'query', 'mutation', 'fetch', 'axios',
      'shopify', 'api error', 'http error',
      'network', 'timeout', 'econnrefused', 'enotfound',
    ]
    const isTechnical = technicalPhrases.some(phrase => lowerMessage.includes(phrase))
    if (isTechnical) {
      return 'An error occurred while processing your request. Please try again.'
    }
    return error.message
  }
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Create a safe error response for API routes
 */
export function createErrorResponse(
  error: unknown,
  context?: ErrorLogContext,
  statusCode: number = 500
): NextResponse {
  logError(error, context)
  const safeMessage = getSafeErrorMessage(error)
  return NextResponse.json(
    { success: false, error: safeMessage },
    { status: statusCode }
  )
}

/**
 * API Error class for controlled error responses
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Validation error response (400 Bad Request)
 */
export function createValidationError(message: string): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400 }
  )
}

/**
 * Not configured error response (503)
 */
export function createNotConfiguredError(service: string): NextResponse {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${service} is not configured. Please check your environment variables.`)
  }
  return NextResponse.json(
    { success: false, error: 'Service temporarily unavailable. Please try again later.' },
    { status: 503 }
  )
}
