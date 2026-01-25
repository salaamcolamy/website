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

    if (body.errors) {
      throw new Error(body.errors[0]?.message || 'Shopify API error')
    }

    return body.data
  } catch (error) {
    console.error('Shopify fetch error:', error)
    throw error
  }
}

// Helper to check if Shopify is configured
export function isShopifyConfigured(): boolean {
  return Boolean(domain && storefrontAccessToken)
}
