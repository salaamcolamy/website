/**
 * Shopify cart delivery: set shipping address and fetch delivery options (rates by zone).
 * Uses Storefront API cartDeliveryAddressesReplace + cart.deliveryGroups.deliveryOptions.
 * 
 * IMPORTANT - Matching Shipping Zones:
 * To ensure shipping prices match your Shopify backend zones exactly:
 * 
 * 1. Check your Shopify Admin → Settings → Shipping → Shipping zones
 *    - Note the exact province/state format used (ISO codes like "10" or names like "Selangor")
 * 
 * 2. Check browser console logs when testing checkout:
 *    - Look for "[Shopify Delivery] Shopify recognized address" logs
 *    - Compare "sentProvinceCode" vs "recognizedProvinceCode"
 *    - If they don't match, update mapStateToShopifyProvinceCode() accordingly
 * 
 * 3. Common formats:
 *    - ISO 3166-2 codes: "01" (Johor), "10" (Selangor), "14" (Kuala Lumpur)
 *    - Province names: "Johor", "Selangor", "Kuala Lumpur"
 * 
 * 4. If zones use names instead of codes:
 *    - Update mapStateToShopifyProvinceCode() to return province names
 *    - Remove ISO code mapping, use stateToProvinceName mapping instead
 */

import { shopifyFetch, isShopifyConfigured } from './client'

export interface DeliveryAddressInput {
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

/**
 * Maps Malaysian state names to Shopify's expected province codes/names.
 * Shopify shipping zones typically use province names, not ISO codes.
 * This mapping ensures exact match with Shopify backend shipping zones.
 * 
 * IMPORTANT: Shopify Admin shipping zones usually use province names like:
 * "Selangor", "Johor", "Kuala Lumpur", etc. (not ISO codes like "10", "01")
 */
function mapStateToShopifyProvinceCode(stateName: string): string {
  // Shopify shipping zones typically use province names, not ISO codes
  // Map state names to match exactly what's configured in Shopify Admin
  const stateToProvinceName: Record<string, string> = {
    // Normalize variations to match Shopify's exact format
    'Wilayah Persekutuan': 'Kuala Lumpur', // Shopify uses "Kuala Lumpur" not "Wilayah Persekutuan"
    'Pulau Pinang': 'Penang', // Shopify typically uses "Penang"
    // All other states use their exact names as-is
    'Johor': 'Johor',
    'Kedah': 'Kedah',
    'Kelantan': 'Kelantan',
    'Melaka': 'Melaka',
    'Negeri Sembilan': 'Negeri Sembilan',
    'Pahang': 'Pahang',
    'Perak': 'Perak',
    'Perlis': 'Perlis',
    'Sabah': 'Sabah',
    'Sarawak': 'Sarawak',
    'Selangor': 'Selangor',
    'Terengganu': 'Terengganu',
    'Kuala Lumpur': 'Kuala Lumpur',
    'Labuan': 'Labuan',
    'Putrajaya': 'Putrajaya',
  }
  
  // Return normalized province name (Shopify zones use names, not codes)
  return stateToProvinceName[stateName] || stateName
}

export interface DeliveryOption {
  handle: string
  title: string
  estimatedCost: { amount: string; currencyCode: string }
}

export interface CartDeliveryRatesResult {
  shippingCost: number
  currencyCode: string
  options: DeliveryOption[]
  error?: string
}

/**
 * Replaces the cart's delivery address and returns available delivery options with costs.
 * Use this to get zone-based shipping rates from Shopify for the customer's address.
 */
export async function getCartDeliveryRates(
  cartId: string,
  address: DeliveryAddressInput
): Promise<CartDeliveryRatesResult> {
  if (!isShopifyConfigured()) {
    return { shippingCost: 0, currencyCode: 'MYR', options: [] }
  }

  const mutation = `
    mutation cartDeliveryAddressesReplace($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
      cartDeliveryAddressesReplace(cartId: $cartId, addresses: $addresses) {
        userErrors { message code field }
        cart {
          id
          deliveryGroups(first: 5) {
            nodes {
              id
              deliveryAddress {
                provinceCode
                province
                countryCodeV2
              }
              deliveryOptions {
                handle
                title
                estimatedCost {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `

  type ReplacePayload = {
    cartDeliveryAddressesReplace: {
      userErrors: Array<{ message: string; code?: string; field?: string[] }>
      cart: {
        id: string
        deliveryGroups: {
          nodes: Array<{
            id: string
            deliveryAddress: {
              provinceCode: string | null
              province: string | null
              countryCodeV2: string
            } | null
            deliveryOptions: Array<{
              handle: string
              title: string
              estimatedCost: { amount: string; currencyCode: string }
            }>
          }>
        }
      } | null
    }
  }

  try {
    // Map state name to Shopify's expected province code
    // IMPORTANT: Check your Shopify Admin → Settings → Shipping → Shipping zones
    // to see what format your zones use (ISO codes like "10" or names like "Selangor")
    const provinceCode = mapStateToShopifyProvinceCode(address.province)
    
    console.log('[Shopify Delivery] Sending province name:', provinceCode, 'for state:', address.province)
    
    // Shopify's provinceCode field can accept province names (e.g., "Selangor", "Johor")
    // Shipping zones in Shopify Admin are typically configured with province names, not ISO codes
    // Use normalized province name in provinceCode field
    const data = await shopifyFetch<ReplacePayload>({
      query: mutation,
      variables: {
        cartId,
        addresses: [
          {
            selected: true,
            oneTimeUse: true,
            address: {
              deliveryAddress: {
                address1: address.address1,
                address2: address.address2 || undefined,
                city: address.city,
                // Use normalized province name - Shopify zones use names like "Selangor", not codes like "10"
                // The provinceCode field accepts province names for Malaysia
                provinceCode: provinceCode, // This is now the normalized province name (e.g., "Selangor", "Kuala Lumpur")
                countryCode: address.countryCode,
                zip: address.zip,
                firstName: address.firstName,
                lastName: address.lastName,
                phone: address.phone || undefined,
              },
            },
          },
        ],
      },
      cache: 'no-store',
    })

    const payload = data.cartDeliveryAddressesReplace
    if (payload.userErrors?.length) {
      const msg = payload.userErrors.map((e) => e.message).join('; ')
      console.error('[Shopify Delivery] User errors:', payload.userErrors)
      return { shippingCost: 0, currencyCode: 'MYR', options: [], error: msg }
    }

    const cart = payload.cart
    if (!cart?.deliveryGroups?.nodes?.length) {
      console.warn('[Shopify Delivery] No delivery groups found for address:', {
        province: address.province,
        provinceCode: provinceCode,
        city: address.city,
        zip: address.zip,
      })
      return { 
        shippingCost: 0, 
        currencyCode: 'MYR', 
        options: [], 
        error: `No delivery options available for ${address.province} (sent as "${provinceCode}"). Check Shopify Admin → Settings → Shipping → Shipping zones to verify province name matches.` 
      }
    }

    const firstGroup = cart.deliveryGroups.nodes[0]
    const options = firstGroup?.deliveryOptions ?? []
    
    // Log the delivery address that Shopify recognized for debugging
    // This helps verify if Shopify normalized our province code/name
    if (firstGroup.deliveryAddress) {
      const recognizedProvince = firstGroup.deliveryAddress.province || firstGroup.deliveryAddress.provinceCode
      console.log('[Shopify Delivery] Shopify recognized address:', {
        sentProvince: provinceCode,
        recognizedProvinceCode: firstGroup.deliveryAddress.provinceCode,
        recognizedProvince: firstGroup.deliveryAddress.province,
        countryCode: firstGroup.deliveryAddress.countryCodeV2,
        match: recognizedProvince && (recognizedProvince === provinceCode || recognizedProvince.toLowerCase() === provinceCode.toLowerCase()) ? '✓ MATCH' : '⚠ CHECK - May need adjustment',
      })
      
      // If Shopify normalized it differently, log a warning
      if (recognizedProvince && recognizedProvince !== provinceCode && recognizedProvince.toLowerCase() !== provinceCode.toLowerCase()) {
        console.warn(
          `[Shopify Delivery] Province format difference detected! ` +
          `Sent: "${provinceCode}" but Shopify recognized: "${recognizedProvince}". ` +
          `If shipping shows FREE, update mapStateToShopifyProvinceCode() to use "${recognizedProvince}" format.`
        )
      }
    }
    
    if (options.length === 0) {
      console.warn('[Shopify Delivery] No delivery options found in delivery group')
      return { shippingCost: 0, currencyCode: 'MYR', options: [], error: 'No shipping methods available' }
    }
    
    // Try to find "Standard Delivery" option first, otherwise use the first available option
    const standardDeliveryOption = options.find(
      (opt) => opt.title.toLowerCase().includes('standard') || opt.handle.toLowerCase().includes('standard')
    )
    const selectedOption = standardDeliveryOption || options[0]
    
    const amount = selectedOption
      ? parseFloat(selectedOption.estimatedCost.amount)
      : 0
    const currencyCode = selectedOption?.estimatedCost.currencyCode ?? 'MYR'

    console.log('[Shopify Delivery] Found options:', options.map(o => ({ 
      title: o.title, 
      handle: o.handle,
      cost: o.estimatedCost.amount,
      currency: o.estimatedCost.currencyCode 
    })))
    console.log('[Shopify Delivery] Selected option:', selectedOption.title, 'Cost:', amount, currencyCode)

    // If amount is 0, check if it's actually free shipping or if no zone matched
    if (amount === 0 && options.length > 0) {
      console.log('[Shopify Delivery] Shipping cost is 0 - this may be free shipping or check if zones match correctly')
    }

    return {
      shippingCost: amount,
      currencyCode,
      options,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get delivery rates'
    console.error('[Shopify Delivery] Error calculating shipping:', err)
    
    // Provide more detailed error information
    let errorMessage = message
    if (err instanceof Error) {
      // Check if it's a GraphQL error
      if (err.message.includes('GraphQL') || err.message.includes('Shopify')) {
        errorMessage = `Shopify API error: ${err.message}. Please check your Shopify configuration and shipping zones.`
      }
    }
    
    return { shippingCost: 0, currencyCode: 'MYR', options: [], error: errorMessage }
  }
}
