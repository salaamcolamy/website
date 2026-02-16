import { NextRequest } from 'next/server'
import { withSecurity } from '@/lib/security'
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
} from '@/lib/shopify/queries/cart'

async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    let cart

    if (req.method === 'POST' && action === 'create') {
      cart = await createCart()
    } else if (req.method === 'GET') {
      const cartId = searchParams.get('id')
      if (!cartId) return Response.json({ error: 'Cart ID required' }, { status: 400 })
      cart = await getCart(cartId)
    } else if (req.method === 'POST' && action === 'add') {
      const { cartId, variantId, quantity } = await req.json()
      if (!cartId || !variantId) return Response.json({ error: 'Missing required fields' }, { status: 400 })
      cart = await addToCart(cartId, variantId, quantity || 1)
    } else if (req.method === 'POST' && action === 'update') {
      const { cartId, lineId, quantity } = await req.json()
      if (!cartId || !lineId || quantity === undefined) return Response.json({ error: 'Missing required fields' }, { status: 400 })
      cart = await updateCartLine(cartId, lineId, quantity)
    } else if (req.method === 'POST' && action === 'remove') {
      const { cartId, lineIds } = await req.json()
      if (!cartId || !lineIds) return Response.json({ error: 'Missing required fields' }, { status: 400 })
      cart = await removeFromCart(cartId, lineIds)
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 })
    }

    return new Response(JSON.stringify(cart), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    )
  }
}

export const POST = withSecurity(handler)
export const GET = withSecurity(handler)
