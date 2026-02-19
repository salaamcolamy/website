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

    // Determine origin for callback URLs
    let origin = process.env.NEXT_PUBLIC_SITE_URL
    
    if (!origin) {
      // Try to get from request headers
      origin = request.headers.get('origin') || 
               request.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
               request.headers.get('host') ? `https://${request.headers.get('host')}` : null
    }

    if (!origin) {
      logger.error('Unable to determine site origin for Billplz callback URLs', {
        headers: {
          origin: request.headers.get('origin'),
          referer: request.headers.get('referer'),
          host: request.headers.get('host'),
        },
      })
      return createValidationError(
        'Unable to determine site origin. Please configure NEXT_PUBLIC_SITE_URL in your environment variables.'
      )
    }

    // Ensure origin doesn't have trailing slash
    origin = origin.replace(/\/$/, '')
    
    logger.debug('Using origin for Billplz callbacks', { origin })

    const callbackUrl = `${origin}/api/billplz/callback`
    const redirectUrl = `${origin}/api/billplz/callback`
    
    logger.debug('Creating Billplz bill', {
      email,
      name,
      amount: Math.round(verifiedAmount * 100),
      orderId,
      callbackUrl,
      redirectUrl,
    })

    const billplz = getBillplzClient()
    const bill = await billplz.createBill({
      email,
      name,
      amount: Math.round(verifiedAmount * 100),
      description,
      callbackUrl,
      redirectUrl,
      reference_1_label: 'Order ID',
      reference_1: orderId,
      reference_2_label: draftOrderId ? 'Draft Order ID' : 'Phone',
      reference_2: draftOrderId || phone || '',
    })

    logger.info('Billplz bill created successfully', {
      billId: bill.id,
      orderId,
      paymentUrl: bill.url,
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
