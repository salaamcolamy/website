import { NextRequest, NextResponse } from 'next/server'
import {
  createDraftOrder,
  isShopifyAdminConfigured,
  type CreateOrderInput,
} from '@/lib/shopify/admin-client'
import {
  createErrorResponse,
  createNotConfiguredError,
  createValidationError,
} from '@/lib/error-handler'
import { withSecurity } from '@/lib/security'
import { getShopifyPromoDiscountCodes } from '@/lib/shopify/promoDiscountCodes'

const SALAAM_SUHAIL_CODE = 'SALAAMSUHAIL'

async function handler(request: NextRequest) {
  try {
    if (!isShopifyAdminConfigured()) {
      return createNotConfiguredError('Shopify Admin API')
    }

    const body = await request.json()
    const {
      email,
      lineItems,
      billingAddress,
      shippingAddress,
      note,
      tags,
      customAttributes,
      shippingLine,
      discountCodes,
    } = body

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

    const normalizedDiscountCodes = Array.isArray(discountCodes)
      ? discountCodes.filter((code) => typeof code === 'string').map((code) => code.trim()).filter(Boolean)
      : getShopifyPromoDiscountCodes()
    const normalizedUpperDiscountCodes = normalizedDiscountCodes.map((code) => code.toUpperCase())
    const hasSalaamSuhailCode = normalizedUpperDiscountCodes.includes(SALAAM_SUHAIL_CODE)

    const orderInput: CreateOrderInput = {
      email,
      lineItems,
      billingAddress,
      shippingAddress,
      note,
      tags,
      customAttributes,
      shippingLine,
      acceptAutomaticDiscounts: true,
      discountCodes: normalizedDiscountCodes.filter((code) => code.toUpperCase() !== SALAAM_SUHAIL_CODE),
      appliedDiscountPercent: hasSalaamSuhailCode ? 10 : undefined,
      appliedDiscountTitle: hasSalaamSuhailCode ? SALAAM_SUHAIL_CODE : undefined,
    }

    // Create draft order — completed after successful payment, tagged if payment fails
    const draftOrder = await createDraftOrder(orderInput)

    return NextResponse.json({
      success: true,
      draftOrderId: draftOrder.id,
      draftOrderName: draftOrder.name,
    })
  } catch (error) {
    return createErrorResponse(error, { endpoint: '/api/orders/create-draft', method: 'POST' })
  }
}

export const POST = withSecurity(handler, { maxRequests: 10, endpoint: 'orders/create-draft' })
