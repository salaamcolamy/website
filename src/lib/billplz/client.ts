/**
 * Billplz API Client
 * Docs: https://www.billplz.com/api
 */

import '@/lib/env-validator'

import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'
import { logger } from '@/lib/logger'

interface BillplzConfig {
  apiKey: string
  collectionId: string
  isSandbox?: boolean
}

interface CreateBillParams {
  email: string
  name: string
  amount: number // in cents (RM10.00 = 1000)
  description: string
  callbackUrl: string
  redirectUrl: string
  reference_1_label?: string
  reference_1?: string
  reference_2_label?: string
  reference_2?: string
  bankCode?: string // FPX bank code for direct payment gateway
}

interface BillplzBill {
  id: string
  collection_id: string
  paid: boolean
  state: 'due' | 'paid' | 'deleted'
  amount: number
  paid_amount: number
  due_at: string
  email: string
  mobile: string | null
  name: string
  url: string
  reference_1_label: string | null
  reference_1: string | null
  reference_2_label: string | null
  reference_2: string | null
  redirect_url: string
  callback_url: string
  description: string
}

interface CreateBillResponse {
  id: string
  collection_id: string
  paid: boolean
  state: string
  amount: number
  paid_amount: number
  due_at: string
  email: string
  mobile: string | null
  name: string
  url: string
  reference_1_label: string | null
  reference_1: string | null
  reference_2_label: string | null
  reference_2: string | null
  redirect_url: string
  callback_url: string
  description: string
}

interface GetBillResponse extends BillplzBill {
  paid_at: string | null
}

class BillplzClient {
  private client: AxiosInstance
  private collectionId: string

  constructor(config: BillplzConfig) {
    const baseURL = config.isSandbox
      ? 'https://www.billplz-sandbox.com/api/v3'
      : 'https://www.billplz.com/api/v3'

    logger.debug('Initializing Billplz client', {
      baseURL,
      isSandbox: config.isSandbox,
      collectionId: config.collectionId,
      hasApiKey: !!config.apiKey,
    })

    this.client = axios.create({
      baseURL,
      auth: {
        username: config.apiKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000, // 30 second timeout
    })

    this.collectionId = config.collectionId
  }

  async createBill(params: CreateBillParams): Promise<CreateBillResponse> {
    try {
      logger.debug('Creating Billplz bill', {
        email: params.email,
        name: params.name,
        amount: params.amount,
        collectionId: this.collectionId,
        callbackUrl: params.callbackUrl,
        redirectUrl: params.redirectUrl,
      })

      const formData = new URLSearchParams({
        collection_id: this.collectionId,
        email: params.email,
        name: params.name,
        amount: String(params.amount),
        description: params.description,
        callback_url: params.callbackUrl,
        redirect_url: params.redirectUrl,
      })

      // If bankCode is provided, use it for direct payment gateway (bypass Billplz payment selection page)
      if (params.bankCode) {
        formData.append('reference_1_label', 'Bank Code')
        formData.append('reference_1', params.bankCode)
      } else {
        // Use existing reference fields if provided
        if (params.reference_1_label) formData.append('reference_1_label', params.reference_1_label)
        if (params.reference_1) formData.append('reference_1', params.reference_1)
      }
      
      if (params.reference_2_label) formData.append('reference_2_label', params.reference_2_label)
      if (params.reference_2) formData.append('reference_2', params.reference_2)

      const response = await this.client.post('/bills', formData.toString())
      
      logger.debug('Billplz API response received', {
        status: response.status,
        hasId: !!response.data?.id,
        hasUrl: !!response.data?.url,
      })
      
      // Validate response has required fields
      if (!response.data?.id) {
        logger.error('Invalid Billplz response: missing bill ID', { response: response.data })
        throw new Error('Invalid response from Billplz: missing bill ID')
      }
      if (!response.data?.url) {
        logger.error('Invalid Billplz response: missing payment URL', { response: response.data })
        throw new Error('Invalid response from Billplz: missing payment URL')
      }
      
      logger.info('Billplz bill created successfully', { billId: response.data.id })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        const responseData = error.response?.data
        
        logger.error('Billplz API error', error, {
          statusCode,
          responseData,
          url: error.config?.url,
          method: error.config?.method,
        })
        
        // Billplz API returns errors in different formats
        let errorMessage = 'Unknown error'
        if (typeof responseData === 'string') {
          errorMessage = responseData
        } else if (responseData?.error) {
          errorMessage = typeof responseData.error === 'string' 
            ? responseData.error 
            : JSON.stringify(responseData.error)
        } else if (responseData?.message) {
          errorMessage = responseData.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        // Provide more context for common errors
        if (statusCode === 401) {
          errorMessage = 'Authentication failed. Please check your Billplz API credentials.'
        } else if (statusCode === 404) {
          errorMessage = 'Collection not found. Please check your Billplz Collection ID.'
        } else if (statusCode === 422) {
          errorMessage = `Validation error: ${errorMessage}`
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          errorMessage = 'Cannot connect to Billplz API. Please check your internet connection.'
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = 'Request to Billplz API timed out. Please try again.'
        }
        
        throw new Error(`Billplz API Error (${statusCode || 'Network'}): ${errorMessage}`)
      }
      
      logger.error('Unexpected error creating Billplz bill', error)
      throw error
    }
  }

  async getBill(billId: string): Promise<GetBillResponse> {
    try {
      const response = await this.client.get(`/bills/${billId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data
        const errMsg = typeof errData?.error === 'string' ? errData.error : (typeof errData === 'string' ? errData : error.message)
        throw new Error(`Billplz API Error: ${errMsg}`)
      }
      throw error
    }
  }

  async deleteBill(billId: string): Promise<void> {
    try {
      await this.client.delete(`/bills/${billId}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Billplz API Error: ${error.response?.data?.error || error.message}`)
      }
      throw error
    }
  }

  verifyCallback(signature: string, params: Record<string, string>): boolean {
    const xSignatureKey = process.env.BILLPLZ_XSIGNATURE_KEY
    if (!xSignatureKey) return false

    const sortedKeys = Object.keys(params).sort()
    const signatureString = sortedKeys.map((key) => `${key}${params[key]}`).join('|')
    const hash = crypto.createHmac('sha256', xSignatureKey).update(signatureString).digest('hex')
    return hash === signature
  }
}

let billplzClient: BillplzClient | null = null

export function getBillplzClient(): BillplzClient {
  if (!billplzClient) {
    const apiKey = process.env.BILLPLZ_API_KEY
    const collectionId = process.env.BILLPLZ_COLLECTION_ID
    const isSandbox = process.env.BILLPLZ_SANDBOX === 'true'

    logger.debug('Initializing Billplz client', {
      hasApiKey: !!apiKey,
      hasCollectionId: !!collectionId,
      isSandbox,
    })

    if (!apiKey) {
      logger.error('BILLPLZ_API_KEY is not configured')
      throw new Error('Billplz API key is not configured. Please set BILLPLZ_API_KEY in your environment variables.')
    }

    if (!collectionId) {
      logger.error('BILLPLZ_COLLECTION_ID is not configured')
      throw new Error('Billplz Collection ID is not configured. Please set BILLPLZ_COLLECTION_ID in your environment variables.')
    }

    try {
      billplzClient = new BillplzClient({ apiKey, collectionId, isSandbox })
      logger.info('Billplz client initialized successfully')
    } catch (error) {
      logger.error('Failed to initialize Billplz client', error)
      throw error
    }
  }
  return billplzClient
}

export function isBillplzConfigured(): boolean {
  return !!(process.env.BILLPLZ_API_KEY && process.env.BILLPLZ_COLLECTION_ID)
}

export type { CreateBillParams, BillplzBill, CreateBillResponse, GetBillResponse }
