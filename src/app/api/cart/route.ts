import { NextRequest } from 'next/server'
import { withSecurity, RATE_LIMITS } from '@/lib/security'
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  updateCartBuyerIdentity,
} from '@/lib/shopify/queries/cart'

async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    console.log('[API Cart] Request:', { method: req.method, action, url: req.url })

    let cart

    if (req.method === 'POST' && action === 'create') {
      console.log('[API Cart] Creating cart...')
      cart = await createCart()
      console.log('[API Cart] Cart created:', cart?.id)
    } else if (req.method === 'GET') {
      const cartId = searchParams.get('id')
      if (!cartId) return Response.json({ error: 'Cart ID required' }, { status: 400 })
      console.log('[API Cart] Getting cart:', cartId)
      cart = await getCart(cartId)
      console.log('[API Cart] Cart retrieved:', cart?.id)
    } else if (req.method === 'POST' && action === 'add') {
      const body = await req.json()
      const { cartId, variantId, quantity } = body
      console.log('[API Cart] Adding to cart:', { cartId, variantId, quantity })
      if (!cartId || !variantId) return Response.json({ error: 'Missing required fields', received: { cartId: !!cartId, variantId: !!variantId } }, { status: 400 })
      cart = await addToCart(cartId, variantId, quantity || 1)
      console.log('[API Cart] Item added, cart now has', cart?.items?.length, 'items')
    } else if (req.method === 'POST' && action === 'update') {
      const { cartId, lineId, quantity } = await req.json()
      if (!cartId || !lineId || quantity === undefined) return Response.json({ error: 'Missing required fields' }, { status: 400 })
      cart = await updateCartLine(cartId, lineId, quantity)
    } else if (req.method === 'POST' && action === 'remove') {
      const { cartId, lineIds } = await req.json()
      if (!cartId || !lineIds) return Response.json({ error: 'Missing required fields' }, { status: 400 })
      cart = await removeFromCart(cartId, lineIds)
    } else if (req.method === 'POST' && action === 'buyer-identity') {
      const body = await req.json()
      const { cartId, countryCode } = body
      if (!cartId || !countryCode || typeof countryCode !== 'string') {
        return Response.json({ error: 'Missing cartId or countryCode' }, { status: 400 })
      }
      if (countryCode.length !== 2) {
        return Response.json({ error: 'countryCode must be ISO 3166-1 alpha-2 (e.g. MY)' }, { status: 400 })
      }
      cart = await updateCartBuyerIdentity(cartId, countryCode.toUpperCase())
    } else {
      return Response.json({ error: 'Invalid action', method: req.method, action }, { status: 400 })
    }

    if (!cart) {
      console.error('[API Cart] No cart returned from operation')
      return Response.json({ error: 'Cart operation returned null' }, { status: 500 })
    }

    return Response.json(cart, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[API Cart] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal error'
    const errorStack = error instanceof Error ? error.stack : undefined
    return Response.json(
      { 
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

export const POST = withSecurity(handler, { maxRequests: RATE_LIMITS.cart, endpoint: 'cart' })
export const GET = withSecurity(handler, { maxRequests: RATE_LIMITS.cart, endpoint: 'cart' })
