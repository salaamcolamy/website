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

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify Admin API HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized: Invalid Shopify Admin API token')
      }
      
      throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText}`)
    }

    const body: ShopifyAdminResponse<T> = await response.json()

    if (body.errors) {
      const errorMessage = body.errors[0]?.message || 'Shopify Admin API error'
      const errorCode = body.errors[0]?.extensions?.code
      console.error('Shopify Admin API GraphQL error:', {
        message: errorMessage,
        code: errorCode,
        errors: body.errors,
      })
      throw new Error(errorCode ? `${errorCode}: ${errorMessage}` : errorMessage)
    }

    return body.data
  } catch (error) {
    console.error('Shopify Admin API error:', error)
    // Re-throw to let the caller handle it
    throw error
  }
}

// Helper to check if Admin API is configured
export function isAdminApiConfigured(): boolean {
  return Boolean(domain && adminAccessToken)
}
