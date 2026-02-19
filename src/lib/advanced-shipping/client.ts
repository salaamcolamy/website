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
 */
export async function getAdvancedShippingRates(
  apiKey: string,
  request: AdvancedShippingRequest
): Promise<AdvancedShippingResponse> {
  if (!apiKey) {
    throw new Error('Advanced Shipping API key is required')
  }

  try {
    // Basic authentication: API key as username, empty password
    const auth = Buffer.from(`${apiKey}:`).toString('base64')

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
 */
export function isAdvancedShippingConfigured(): boolean {
  return Boolean(process.env.ADVANCED_SHIPPING_API_KEY)
}
