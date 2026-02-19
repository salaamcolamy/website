import { NextRequest } from 'next/server'
import { getCartDeliveryRates } from '@/lib/shopify/delivery'
import { isShopifyConfigured } from '@/lib/shopify/client'
import { isAdvancedShippingConfigured } from '@/lib/advanced-shipping/client'

export interface ShippingRatesBody {
  cartId: string
  address: {
    address1: string
    address2?: string
    city: string
    province: string
    countryCode: string
    zip: string
    firstName: string
    lastName: string
    phone?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isShopifyConfigured()) {
      console.error('[Shipping API] Shopify not configured')
      return Response.json(
        { shippingCost: 0, currencyCode: 'MYR', options: [], error: 'Shopify not configured. Please check your Shopify settings.' },
        { status: 200 }
      )
    }

    const body = (await req.json()) as ShippingRatesBody
    const { cartId, address } = body

    if (!cartId || !address) {
      console.error('[Shipping API] Missing required fields', { hasCartId: !!cartId, hasAddress: !!address })
      return Response.json(
        { error: 'Missing cartId or address. Please ensure your cart is loaded and address is complete.' },
        { status: 400 }
      )
    }

    // Validate cart ID format
    if (!cartId.startsWith('gid://shopify/Cart')) {
      console.error('[Shipping API] Invalid cart ID format', { cartId })
      return Response.json(
        { error: 'Invalid cart. Please refresh the page and try again.', debug: { cause: 'invalid_cart_id' } },
        { status: 400 }
      )
    }

    // Cart ID must include secret key or Shopify will reject mutations (e.g. "Cart not found")
    if (!cartId.includes('key=')) {
      console.error('[Shipping API] Cart ID missing secret key (key=)')
      return Response.json(
        {
          shippingCost: 0,
          currencyCode: 'MYR',
          options: [],
          error: 'Cart session invalid. Please refresh the page, add items from the shop again, then try checkout.',
          debug: { cause: 'invalid_cart_id' },
        },
        { status: 200 }
      )
    }

    const { address1, address2, city, province, countryCode, zip, firstName, lastName, phone } = address
    if (!address1?.trim() || !city?.trim() || !province?.trim() || !countryCode?.trim() || !zip?.trim() || !firstName?.trim() || !lastName?.trim()) {
      console.error('[Shipping API] Missing required address fields', { address1: !!address1, city: !!city, province: !!province, countryCode: !!countryCode, zip: !!zip, firstName: !!firstName, lastName: !!lastName })
      return Response.json(
        { error: 'Missing required address fields. Please fill in all address fields.' },
        { status: 400 }
      )
    }

    // Log detailed information for debugging multiple products (6-pack + 24-pack)
    console.log('[Shipping API] Calculating shipping for cart:', { 
      cartId: cartId.substring(0, 50) + '...',
      province, 
      city, 
      zip,
      advancedShippingConfigured: isAdvancedShippingConfigured(),
      note: 'For multiple products (6-pack + 24-pack), Shopify will sum weights automatically'
    })

    const result = await getCartDeliveryRates(cartId, {
      address1: address1.trim(),
      address2: address2?.trim(),
      city: city.trim(),
      province: province.trim(),
      countryCode: (countryCode?.trim().toUpperCase().slice(0, 2)) || 'MY',
      zip: zip.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
    })

    if (result.error) {
      console.warn('[Shipping API] No rates or error:', result.error, { province, city, zip })
    }
    console.log('[Shipping API] Result:', {
      shippingCost: result.shippingCost,
      optionsCount: result.options?.length || 0,
      hasError: !!result.error,
    })

    return Response.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('[Shipping API] Unexpected error:', error)
    return Response.json(
      {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: error instanceof Error ? `Server error: ${error.message}` : 'Failed to get shipping rates. Please try again.',
      },
      { status: 200 }
    )
  }
}
