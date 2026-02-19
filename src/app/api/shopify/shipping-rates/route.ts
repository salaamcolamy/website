import { NextRequest } from 'next/server'
import { getCartDeliveryRates } from '@/lib/shopify/delivery'
import { isShopifyConfigured } from '@/lib/shopify/client'

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
      return Response.json(
        { shippingCost: 0, currencyCode: 'MYR', options: [], error: 'Shopify not configured' },
        { status: 200 }
      )
    }

    const body = (await req.json()) as ShippingRatesBody
    const { cartId, address } = body

    if (!cartId || !address) {
      return Response.json(
        { error: 'Missing cartId or address' },
        { status: 400 }
      )
    }

    const { address1, address2, city, province, countryCode, zip, firstName, lastName, phone } = address
    if (!address1?.trim() || !city?.trim() || !province?.trim() || !countryCode?.trim() || !zip?.trim() || !firstName?.trim() || !lastName?.trim()) {
      return Response.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      )
    }

    const result = await getCartDeliveryRates(cartId, {
      address1: address1.trim(),
      address2: address2?.trim(),
      city: city.trim(),
      province: province.trim(),
      countryCode: countryCode.trim(),
      zip: zip.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
    })

    return Response.json(result, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    return Response.json(
      {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: error instanceof Error ? error.message : 'Failed to get shipping rates',
      },
      { status: 200 }
    )
  }
}
