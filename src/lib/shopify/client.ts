const domain = process.env.SHOPIFY_STORE_DOMAIN || ''
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''

const endpoint = `https://${domain}/api/2026-01/graphql.json`

type ShopifyResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags,
  revalidate,
}: {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
  /** Revalidate cached response after N seconds. Use so Shopify product changes show up. */
  revalidate?: number
}): Promise<T> {
  try {
    const nextOptions: { tags?: string[]; revalidate?: number } = {}
    if (tags?.length) nextOptions.tags = tags
    if (revalidate != null) nextOptions.revalidate = revalidate

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(Object.keys(nextOptions).length > 0 && { next: nextOptions }),
    })

    const body: ShopifyResponse<T> = await response.json()

    if (body.errors?.length) {
      const first = body.errors[0]?.message || 'Shopify API error'
      console.error('[Shopify] GraphQL errors:', JSON.stringify(body.errors, null, 2))
      throw new Error(first)
    }

    return body.data
  } catch (error) {
    console.error('[Shopify] fetch error:', error)
    throw error
  }
}

// Helper to check if Shopify is configured
export function isShopifyConfigured(): boolean {
  return Boolean(domain && storefrontAccessToken)
}

/**
 * Cart with delivery groups (for type safety when using cartQueryWithCarrierRates).
 */
export interface CartWithDeliveryGroups {
  id?: string
  cost?: { subtotalAmount?: { amount: string; currencyCode: string }; totalAmount?: { amount: string; currencyCode: string } }
  deliveryGroups?: {
    edges?: Array<{
      node: {
        deliveryOptions: Array<{ handle: string; title: string; estimatedCost: { amount: string; currencyCode: string } }>
        selectedDeliveryOption?: { handle: string; title?: string; estimatedCost?: { amount: string; currencyCode: string } } | null
      }
    }>
    nodes?: Array<{
      deliveryOptions: Array<{ handle: string; title: string; estimatedCost: { amount: string; currencyCode: string } }>
      selectedDeliveryOption?: { handle: string } | null
    }>
  }
}

/**
 * Fetches cart with delivery groups using @defer and withCarrierRates: true
 * to include carrier-calculated rates. Parses multipart/mixed response.
 */
export async function cartQueryWithCarrierRates(cartId: string): Promise<CartWithDeliveryGroups | null> {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        ...DeliveryGroups @defer
      }
    }
    fragment DeliveryGroups on Cart {
      deliveryGroups(first: 5, withCarrierRates: true) {
        edges {
          node {
            deliveryOptions {
              handle
              title
              estimatedCost { amount currencyCode }
            }
            selectedDeliveryOption { handle }
          }
        }
      }
    }
  `
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables: { cartId } }),
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('multipart/mixed')) {
      const json = await response.json()
      if (json.errors?.length) {
        console.warn('[Shopify] cartQueryWithCarrierRates errors:', json.errors)
        return null
      }
      return json.data?.cart ?? null
    }

    const text = await response.text()
    const boundaryMatch = contentType.match(/boundary=([^;]+)/)
    const boundary = boundaryMatch ? boundaryMatch[1].trim() : 'graphql'
    const parts = text.split(`--${boundary}`).filter((p) => p.trim() && !p.trim().startsWith('--'))

    let cart: CartWithDeliveryGroups = {}
    for (const part of parts) {
      const jsonMatch = part.match(/\{[\s\S]*\}/)
      if (!jsonMatch) continue
      try {
        const chunk = JSON.parse(jsonMatch[0])
        if (chunk.data?.cart) {
          cart = { ...cart, ...chunk.data.cart }
        }
        if (chunk.incremental?.length) {
          for (const inc of chunk.incremental) {
            const path = inc.path as string[]
            const d = inc.data as Record<string, unknown>
            if (path?.length === 1 && path[0] === 'cart' && d?.deliveryGroups) {
              cart.deliveryGroups = d.deliveryGroups as CartWithDeliveryGroups['deliveryGroups']
            }
          }
        }
      } catch (_) {
        // skip unparseable part
      }
    }
    return Object.keys(cart).length ? cart : null
  } catch (err) {
    console.warn('[Shopify] cartQueryWithCarrierRates failed:', err)
    return null
  }
}
