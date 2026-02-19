import { NextResponse } from 'next/server'
import { isShopifyConfigured } from '@/lib/shopify/client'

export async function GET() {
  try {
    const configured = isShopifyConfigured()
    return NextResponse.json({ configured })
  } catch (error) {
    console.error('[API] Error checking Shopify config:', error)
    return NextResponse.json({ configured: false }, { status: 500 })
  }
}
