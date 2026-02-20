import { NextRequest, NextResponse } from 'next/server'
import {
  createAbandonableCheckout,
  createDraftOrder,
  isShopifyAdminConfigured,
  type CreateOrderInput,
} from '@/lib/shopify/admin-client'
import {
  createErrorResponse,
  createNotConfiguredError,
  createValidationError,
} from '@/lib/error-handler'
import { logger } from '@/lib/logger'
import { withSecurity } from '@/lib/security'

async function handler(request: NextRequest) {
  try {
    if (!isShopifyAdminConfigured()) {
      return createNotConfiguredError('Shopify Admin API')
    }

    const body = await request.json()
    const { email, lineItems, billingAddress, shippingAddress, note, tags, customAttributes, shippingLine } = body

    if (!email || !lineItems || !billingAddress || !shippingAddress) {
      return createValidationError('Missing required fields: email, lineItems, billingAddress, or shippingAddress')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return createValidationError('Invalid email format')
    }

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return createValidationError('lineItems must be a non-empty array')
    }
    for (const item of lineItems) {
      if (!item.variantId || typeof item.variantId !== 'string') {
        return createValidationError('Each line item must have a valid variantId')
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 999) {
        return createValidationError('Each line item quantity must be a positive integer (max 999)')
      }
    }

    const orderInput: CreateOrderInput = {
      email, lineItems, billingAddress, shippingAddress, note, tags, customAttributes, shippingLine,
    }

    // 1. Create Shopify checkout — if payment fails, it appears as Abandoned Checkout in Shopify Admin
    let checkoutToken: string | null = null
    try {
      const checkout = await createAbandonableCheckout(orderInput)
      checkoutToken = checkout.token
      logger.info('Shopify checkout created for abandoned tracking', { checkoutToken })
    } catch (checkoutError) {
      // Non-fatal: abandoned checkout tracking is nice-to-have
      logger.error('Failed to create Shopify checkout (non-fatal)', checkoutError)
    }

    // 2. Create draft order — this is used to complete the order after successful payment
    const draftOrder = await createDraftOrder(orderInput)

    return NextResponse.json({
      success: true,
      draftOrderId: draftOrder.id,
      draftOrderName: draftOrder.name,
      checkoutToken,
    })
  } catch (error) {
    return createErrorResponse(error, { endpoint: '/api/orders/create-draft', method: 'POST' })
  }
}

export const POST = withSecurity(handler, { maxRequests: 10, endpoint: 'orders/create-draft' })
