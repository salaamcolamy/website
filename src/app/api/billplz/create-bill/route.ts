import { NextRequest, NextResponse } from 'next/server'
import { getBillplzClient, isBillplzConfigured } from '@/lib/billplz/client'
import { isShopifyAdminConfigured, shopifyAdminFetch } from '@/lib/shopify/admin-client'
import {
  createErrorResponse,
  createNotConfiguredError,
  createValidationError,
} from '@/lib/error-handler'
import { logger } from '@/lib/logger'
import { withSecurity } from '@/lib/security'

async function handler(request: NextRequest) {
  try {
    if (!isBillplzConfigured()) {
      return createNotConfiguredError('Billplz Payment Gateway')
    }

    const body = await request.json()
    const { email, name, amount, description, orderId, phone, draftOrderId } = body

    if (!email || !name || !amount || !description || !orderId) {
      return createValidationError('Missing required fields: email, name, amount, description, or orderId')
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > 100000) {
      return createValidationError('Invalid amount: must be a positive number under RM100,000')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return createValidationError('Invalid email format')
    }

    let verifiedAmount = numAmount
    if (draftOrderId && isShopifyAdminConfigured()) {
      try {
        const result = await shopifyAdminFetch<{
          draftOrder: { totalPrice: string } | null
        }>({
          query: `query getDraftOrder($id: ID!) { draftOrder(id: $id) { totalPrice } }`,
          variables: { id: draftOrderId },
        })
        if (result.draftOrder?.totalPrice) {
          const shopifyTotal = parseFloat(result.draftOrder.totalPrice)
          if (Math.abs(shopifyTotal - numAmount) > 0.01) {
            logger.warn('Amount mismatch detected', { clientAmount: numAmount, shopifyAmount: shopifyTotal, orderId })
            verifiedAmount = shopifyTotal
          }
        }
      } catch (error) {
        logger.error('Failed to verify draft order amount', error)
      }
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get('origin') ||
      request.headers.get('referer')?.split('/').slice(0, 3).join('/')

    if (!origin) {
      return createValidationError('Unable to determine site origin. Please configure NEXT_PUBLIC_SITE_URL')
    }

    const billplz = getBillplzClient()
    const bill = await billplz.createBill({
      email,
      name,
      amount: Math.round(verifiedAmount * 100),
      description,
      callbackUrl: `${origin}/api/billplz/callback`,
      redirectUrl: `${origin}/api/billplz/callback`,
      reference_1_label: 'Order ID',
      reference_1: orderId,
      reference_2_label: draftOrderId ? 'Draft Order ID' : 'Phone',
      reference_2: draftOrderId || phone || '',
    })

    return NextResponse.json({
      success: true,
      billId: bill.id,
      paymentUrl: bill.url,
      amount: bill.amount,
    })
  } catch (error) {
    return createErrorResponse(error, { endpoint: '/api/billplz/create-bill', method: 'POST' })
  }
}

export const POST = withSecurity(handler, { maxRequests: 10, endpoint: 'billplz/create-bill' })
