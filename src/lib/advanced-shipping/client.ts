/**
 * Advanced Shipping Rules API Client
 * 
 * This client integrates with Advanced Shipping Rules Developer API
 * to fetch shipping rates directly from the app.
 * 
 * API Documentation: https://advancedshippingrules.com/blogs/developer-api
 * 
 * Note: Advanced Shipping app also integrates with Shopify as a carrier service,
 * so rates are automatically available through Shopify's Storefront API.
 * This direct API can be used as a fallback or for custom integrations.
 */

const API_BASE_URL = 'https://api.advancedshippingrules.com'

export interface AdvancedShippingItem {
  /** Product variant ID or SKU */
  id: string
  /** Quantity of items */
  quantity: number
  /** Weight in kg */
  weight?: number
  /** Price per item */
  price?: number
}

export interface AdvancedShippingAddress {
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
}

export interface AdvancedShippingRate {
  handle: string
  title: string
  cost: number
  currencyCode: string
}

export interface AdvancedShippingRequest {
  items: AdvancedShippingItem[]
  destination: AdvancedShippingAddress
}

export interface AdvancedShippingResponse {
  rates: AdvancedShippingRate[]
  error?: string
}

/**
 * Fetches shipping rates from Advanced Shipping Rules API
 * 
 * Requires both App ID and API Key for authentication.
 * App ID serves as username, API Key as password in Basic Auth.
 * 
 * To obtain an App ID, contact Advanced Shipping Rules support.
 * API Key can be found in Advanced Shipping Rules App → Settings → General
 */
export async function getAdvancedShippingRates(
  appId: string,
  apiKey: string,
  request: AdvancedShippingRequest
): Promise<AdvancedShippingResponse> {
  if (!appId || !apiKey) {
    throw new Error('Advanced Shipping App ID and API key are required')
  }

  try {
    // Basic authentication: App ID as username, API Key as password
    const auth = Buffer.from(`${appId}:${apiKey}`).toString('base64')

    const response = await fetch(`${API_BASE_URL}/rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Advanced Shipping API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return {
      rates: data.rates || [],
      error: data.error,
    }
  } catch (error) {
    console.error('[Advanced Shipping API] Error:', error)
    throw error
  }
}

/**
 * Checks if Advanced Shipping API is configured
 * Requires both App ID and API Key
 */
export function isAdvancedShippingConfigured(): boolean {
  return Boolean(process.env.ADVANCED_SHIPPING_APP_ID && process.env.ADVANCED_SHIPPING_API_KEY)
}
