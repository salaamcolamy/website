import { NextRequest } from 'next/server'
import { calculateShipping, type CartItemForShipping } from '@/lib/shipping'

export interface ShippingRatesBody {
  cartItems: CartItemForShipping[]
  address: {
    province: string
    city?: string
    zip?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ShippingRatesBody
    const { cartItems, address } = body

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

    console.log('[Shipping API] Calculating shipping (Tranz rate card):', {
      province: address.province,
      city: address.city,
      itemsCount: cartItems.length,
      items: cartItems.map(i => `${i.title} x${i.quantity}`),
    })

    const result = calculateShipping(address.province, cartItems)

    console.log('[Shipping API] Result:', {
      success: result.success,
      shippingCost: result.shippingCost,
      region: result.breakdown.region,
      totalWeightKg: result.breakdown.totalWeightKg,
      error: result.error,
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
        success: false,
        shippingCost: 0,
        breakdown: { region: 'unknown', totalWeightKg: 0, baseRate: 0, additionalWeightCharge: 0, cartonProtection: 0, totalCartons: 0 },
        error: 'Failed to calculate shipping. Please try again.',
      },
      { status: 500 }
    )
  }
}
