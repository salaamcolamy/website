import { NextRequest, NextResponse } from 'next/server'
import { getBillplzClient } from '@/lib/billplz/client'
import { isShopifyAdminConfigured, completeDraftOrder, markOrderAsPaid, type ShopifyOrder } from '@/lib/shopify/admin-client'
import { logger } from '@/lib/logger'
import crypto from 'crypto'

const DRAFT_ORDER_PREFIX = 'gid://shopify/DraftOrder/'

function parseReference2(reference2: string | null): { orderId: string; draftOrderId: string | null } {
  if (!reference2 || typeof reference2 !== 'string') return { orderId: 'unknown', draftOrderId: null }
  const pipe = reference2.indexOf('|')
  if (pipe > 0) {
    const draftOrderId = reference2.slice(0, pipe).trim()
    const orderId = reference2.slice(pipe + 1).trim() || 'unknown'
    return {
      orderId,
      draftOrderId: draftOrderId.startsWith(DRAFT_ORDER_PREFIX) ? draftOrderId : null,
    }
  }
  return {
    orderId: reference2,
    draftOrderId: reference2.startsWith(DRAFT_ORDER_PREFIX) ? reference2 : null,
  }
}

async function completeShopifyOrderFromDraft(draftOrderId: string, amount: string): Promise<ShopifyOrder> {
  const order = await completeDraftOrder(draftOrderId)
  await markOrderAsPaid(order.id, amount)
  logger.info('Shopify order created and marked paid', { shopifyOrderId: order.id, shopifyOrderName: order.name })
  return order
}

function verifyXSignature(formData: FormData, signature: string): boolean {
  const xSignatureKey = process.env.BILLPLZ_XSIGNATURE_KEY
  if (!xSignatureKey) {
    logger.error('XSignature key not configured - rejecting callback for security')
    return false
  }

  try {
    const fields: Record<string, string> = {}
    formData.forEach((value, key) => { fields[key] = value.toString() })

    const sortedKeys = Object.keys(fields).sort()
    const signatureString = sortedKeys.map(key => `${key}${fields[key]}`).join('|')

    const computed = crypto.createHmac('sha256', xSignatureKey).update(signatureString).digest('hex')
    return computed === signature
  } catch (error) {
    logger.error('Signature verification error', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const billId = formData.get('id') as string
    const paid = formData.get('paid') as string
    const state = formData.get('state') as string
    const reference1 = (formData.get('reference_1') as string) || ''
    const reference2 = (formData.get('reference_2') as string) || ''
    const signature = request.headers.get('x-signature') || ''

    const { orderId, draftOrderId } = parseReference2(reference2 || reference1)
    logger.debug('Billplz callback received', { orderId, draftOrderId: !!draftOrderId, paid, state })

    const isValid = verifyXSignature(formData, signature)
    if (!isValid) {
      logger.error('Invalid or missing signature in Billplz callback')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (!orderId || orderId === 'unknown') {
      logger.error('No order ID in Billplz callback', { reference_1: reference1, reference_2: reference2 })
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })
    }

    if (paid === 'true' && state === 'paid') {
      logger.info('Payment successful', { orderId, billId, hasDraftOrderId: !!draftOrderId })
      try {
        if (isShopifyAdminConfigured() && draftOrderId) {
          // Happy path: draft order was created at checkout, now complete it
          await completeShopifyOrderFromDraft(draftOrderId, (formData.get('paid_amount') as string) || '0')
          logger.info('Order completed in Shopify via draft order', { orderId, draftOrderId })
        } else if (isShopifyAdminConfigured()) {
          // Fallback: no draft order — try to get bill details and complete from Billplz data
          logger.warn('Payment paid but no draftOrderId — attempting to create order from bill data', { orderId, billId })
          try {
            const billplz = getBillplzClient()
            const bill = await billplz.getBill(billId)
            // Re-parse in case reference_2 has a draft order ID we missed
            const reparsed = parseReference2(bill.reference_2 || bill.reference_1)
            if (reparsed.draftOrderId) {
              await completeShopifyOrderFromDraft(reparsed.draftOrderId, String(bill.paid_amount ?? bill.amount ?? 0))
              logger.info('Order completed via re-parsed draft order ID', { orderId, draftOrderId: reparsed.draftOrderId })
            } else {
              logger.error('No draft order ID found — Shopify order cannot be created. Check checkout flow.', { orderId, billId })
            }
          } catch (billError) {
            logger.error('Failed to retrieve bill for fallback order creation', billError)
          }
        }
      } catch (error) {
        logger.error('Error processing successful payment', error, { orderId, draftOrderId })
      }
    } else {
      logger.info('Payment failed or incomplete', { orderId, state, paid })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Billplz callback error', error)
    return NextResponse.json({ success: true, error: 'Processed with errors' })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const allParams: Record<string, string> = {}
    searchParams.forEach((value, key) => { allParams[key] = value })

    let billplzId = searchParams.get('billplz[id]')
    if (!billplzId) {
      billplzId = searchParams.get('billplz_id') || searchParams.get('id')
    }

    const billplzPaid = searchParams.get('billplz[paid]') || searchParams.get('billplz_paid') || searchParams.get('paid')

    let orderId: string | null = null
    let isTestMode = false

    if (!billplzId) {
      for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('billplz[SC') && key.endsWith(']')) {
          orderId = key.substring(8, key.length - 1)
          isTestMode = value === 'test'
          break
        }
      }
    }

    if (isTestMode && orderId) {
      const baseUrl = request.nextUrl.origin
      return NextResponse.redirect(`${baseUrl}/en/order-confirmation?orderId=${orderId}&paid=${billplzPaid === 'true'}`)
    }

    if (billplzId) {
      try {
        const billplz = getBillplzClient()
        const bill = await billplz.getBill(billplzId)

        const { orderId, draftOrderId } = parseReference2(bill.reference_2 || bill.reference_1)
        let finalOrderId = orderId

        if (bill.paid && isShopifyAdminConfigured() && draftOrderId) {
          try {
            const shopifyOrder = await completeShopifyOrderFromDraft(draftOrderId, String(bill.paid_amount ?? bill.amount ?? 0))
            // Use Shopify's real order name (e.g. #1001) as the customer-facing order ID
            if (shopifyOrder.name) {
              finalOrderId = shopifyOrder.name
            }
          } catch (orderError) {
            logger.error('Error completing order on redirect', orderError)
          }
        }

        const baseUrl = request.nextUrl.origin
        return NextResponse.redirect(`${baseUrl}/en/order-confirmation?orderId=${encodeURIComponent(finalOrderId)}&paid=${bill.paid}`)
      } catch (error) {
        logger.error('Error processing bill redirect', error)
      }
    } else {
      const possibleOrderId = Object.keys(allParams).find(key => key.startsWith('SC')) || allParams.orderId
      if (possibleOrderId) {
        const baseUrl = request.nextUrl.origin
        return NextResponse.redirect(`${baseUrl}/en/order-confirmation?orderId=${possibleOrderId}`)
      }
    }

    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(`${baseUrl}/en`)
  } catch (error) {
    logger.error('Billplz redirect error', error)
    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(`${baseUrl}/en`)
  }
}
