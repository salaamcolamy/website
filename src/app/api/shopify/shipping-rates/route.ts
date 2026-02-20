import { NextRequest } from 'next/server'
import { getCartDeliveryRates } from '@/lib/shopify/delivery'
import { isShopifyConfigured } from '@/lib/shopify/client'
import { calculateShipping, type CartItemForShipping } from '@/lib/shipping'

export interface ShippingRatesBody {
  cartId?: string
  cartItems: CartItemForShipping[]
  address: {
    province: string
    city?: string
    zip?: string
    address1?: string
    firstName?: string
    lastName?: string
    phone?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ShippingRatesBody
    const { cartId, cartItems, address } = body

    if (!address?.province) {
      return Response.json(
        { error: 'State/province is required for shipping calculation.' },
        { status: 400 }
      )
    }

    if (!cartItems || cartItems.length === 0) {
      return Response.json(
        { error: 'Cart is empty.' },
        { status: 400 }
      )
    }

    // Try Shopify delivery rates first (uses configured shipping zones)
    if (cartId && isShopifyConfigured()) {
      try {
        console.log('[Shipping API] Fetching Shopify delivery rates:', {
          cartId: cartId.substring(0, 30) + '...',
          province: address.province,
        })

        const shopifyResult = await getCartDeliveryRates(cartId, {
          firstName: address.firstName || 'Customer',
          lastName: address.lastName || '',
          address1: address.address1 || '.',
          city: address.city || '.',
          province: address.province,
          zip: address.zip || '00000',
          countryCode: 'MY',
        })

        if (shopifyResult.shippingCost > 0 && !shopifyResult.error) {
          console.log('[Shipping API] Shopify rate found:', {
            shippingCost: shopifyResult.shippingCost,
            options: shopifyResult.options.map(o => `${o.title}: ${o.estimatedCost.amount}`),
          })

          return Response.json({
            success: true,
            shippingCost: shopifyResult.shippingCost,
            breakdown: {
              region: address.province,
              totalWeightKg: 0,
              baseRate: shopifyResult.shippingCost,
              additionalWeightCharge: 0,
            },
            source: 'shopify',
          }, {
            headers: { 'Cache-Control': 'private, no-store' },
          })
        }

        console.log('[Shipping API] Shopify returned no rate, falling back to local calc:', {
          error: shopifyResult.error,
          debug: shopifyResult.debug?.cause,
        })
      } catch (shopifyError) {
        console.error('[Shipping API] Shopify delivery error, falling back to local calc:', shopifyError)
      }
    }

    // Fallback: local weight-based calculation (matches Shopify shipping zones)
    console.log('[Shipping API] Using local calculation:', {
      province: address.province,
      itemsCount: cartItems.length,
      items: cartItems.map(i => `${i.title} x${i.quantity}`),
    })

    const result = calculateShipping(address.province, cartItems)

    console.log('[Shipping API] Local result:', {
      success: result.success,
      shippingCost: result.shippingCost,
      region: result.breakdown.region,
      totalWeightKg: result.breakdown.totalWeightKg,
    })

    return Response.json({ ...result, source: 'local' }, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    console.error('[Shipping API] Unexpected error:', error)
    return Response.json(
      {
        success: false,
        shippingCost: 0,
        breakdown: { region: 'unknown', totalWeightKg: 0, baseRate: 0, additionalWeightCharge: 0 },
        error: 'Failed to calculate shipping. Please try again.',
      },
      { status: 500 }
    )
  }
}
