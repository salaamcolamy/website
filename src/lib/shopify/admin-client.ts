/**
 * Shopify Admin API Client
 * 
 * Used for operations that require admin access, such as:
 * - Creating/updating customers with email marketing consent
 * - Managing customer subscriptions
 * 
 * Note: Admin API requires different credentials than Storefront API
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN || ''
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''

const endpoint = `https://${domain}/admin/api/2024-10/graphql.json`

type ShopifyAdminResponse<T> = {
  data: T
  errors?: Array<{ message: string; extensions?: { code?: string } }>
}

export async function shopifyAdminFetch<T>({
  query,
  variables = {},
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  if (!domain || !adminAccessToken) {
    throw new Error('Shopify Admin API not configured. Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN')
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    })

    const body: ShopifyAdminResponse<T> = await response.json()

    if (body.errors) {
      const errorMessage = body.errors[0]?.message || 'Shopify Admin API error'
      const errorCode = body.errors[0]?.extensions?.code
      throw new Error(errorCode ? `${errorCode}: ${errorMessage}` : errorMessage)
    }

    return body.data
  } catch (error) {
    console.error('Shopify Admin API error:', error)
    throw error
  }
}

// Helper to check if Admin API is configured
export function isAdminApiConfigured(): boolean {
  return Boolean(domain && adminAccessToken)
}
