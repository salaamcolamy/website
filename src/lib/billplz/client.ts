/**
 * Billplz API Client
 * Docs: https://www.billplz.com/api
 */

import '@/lib/env-validator'

import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'

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

    this.client = axios.create({
      baseURL,
      auth: {
        username: config.apiKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    this.collectionId = config.collectionId
  }

  async createBill(params: CreateBillParams): Promise<CreateBillResponse> {
    try {
      const formData = new URLSearchParams({
        collection_id: this.collectionId,
        email: params.email,
        name: params.name,
        amount: String(params.amount),
        description: params.description,
        callback_url: params.callbackUrl,
        redirect_url: params.redirectUrl,
      })

      if (params.reference_1_label) formData.append('reference_1_label', params.reference_1_label)
      if (params.reference_1) formData.append('reference_1', params.reference_1)
      if (params.reference_2_label) formData.append('reference_2_label', params.reference_2_label)
      if (params.reference_2) formData.append('reference_2', params.reference_2)

      const response = await this.client.post('/bills', formData.toString())
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Billplz API Error (${statusCode}): ${errorMessage}`)
      }
      throw error
    }
  }

  async getBill(billId: string): Promise<GetBillResponse> {
    try {
      const response = await this.client.get(`/bills/${billId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Billplz API Error: ${error.response?.data?.error || error.message}`)
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

    if (!apiKey || !collectionId) {
      throw new Error('Billplz API credentials not configured')
    }

    billplzClient = new BillplzClient({ apiKey, collectionId, isSandbox })
  }
  return billplzClient
}

export function isBillplzConfigured(): boolean {
  return !!(process.env.BILLPLZ_API_KEY && process.env.BILLPLZ_COLLECTION_ID)
}

export type { CreateBillParams, BillplzBill, CreateBillResponse, GetBillResponse }
