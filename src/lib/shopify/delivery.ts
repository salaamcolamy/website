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
 * Shopify shipping zones use ISO 3166-2 codes or exact province names.
 * This mapping ensures exact match with Shopify backend shipping zones.
 * 
 * IMPORTANT: Verify in Shopify Admin → Settings → Shipping → Shipping zones
 * what format your zones use (ISO codes like "01" or names like "Selangor")
 */
function mapStateToShopifyProvinceCode(stateName: string): string {
  // Option 1: Use ISO 3166-2 codes (2-digit numeric) - Shopify's standard format
  const stateToIsoCode: Record<string, string> = {
    // West Malaysia
    'Johor': '01',
    'Kedah': '02',
    'Kelantan': '03',
    'Melaka': '04',
    'Negeri Sembilan': '05',
    'Pahang': '06',
    'Pulau Pinang': '07',
    'Perak': '08',
    'Perlis': '09',
    'Selangor': '10',
    'Terengganu': '11',
    // East Malaysia
    'Sabah': '12',
    'Sarawak': '13',
    // Federal Territories
    'Wilayah Persekutuan': '14', // Maps to Kuala Lumpur ISO code
    'Kuala Lumpur': '14',
    'Labuan': '15',
    'Putrajaya': '16',
  }
  
  // Option 2: Normalize province names to match Shopify's exact format
  // If your Shopify zones use province names, use this mapping instead
  const stateToProvinceName: Record<string, string> = {
    'Wilayah Persekutuan': 'Kuala Lumpur', // Shopify typically uses "Kuala Lumpur"
    'Pulau Pinang': 'Penang', // Some configs use "Penang" instead of "Pulau Pinang"
    // All other states use their exact names as-is
  }
  
  // Try ISO code first (Shopify's standard), fallback to normalized name
  // If your Shopify zones use names, swap the order or use stateToProvinceName
  return stateToIsoCode[stateName] || stateToProvinceName[stateName] || stateName
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
    
    console.log('[Shopify Delivery] Sending province code:', provinceCode, 'for state:', address.province)
    
    // Shopify's provinceCode field accepts either:
    // 1. ISO 3166-2 codes (e.g., "10" for Selangor) - Shopify's standard format
    // 2. Province names (e.g., "Selangor") - if zones are configured with names
    // This ensures exact match with backend shipping zones configured in Shopify admin
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
                // Use mapped province code/name to match Shopify shipping zones exactly
                provinceCode: provinceCode,
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
        error: `No delivery options available for ${address.province}. Check Shopify Admin shipping zones match province format "${provinceCode}"` 
      }
    }

    const firstGroup = cart.deliveryGroups.nodes[0]
    const options = firstGroup?.deliveryOptions ?? []
    
    // Log the delivery address that Shopify recognized for debugging
    // This helps verify if Shopify normalized our province code/name
    if (firstGroup.deliveryAddress) {
      const recognizedProvince = firstGroup.deliveryAddress.provinceCode || firstGroup.deliveryAddress.province
      console.log('[Shopify Delivery] Shopify recognized address:', {
        sentProvinceCode: provinceCode,
        recognizedProvinceCode: firstGroup.deliveryAddress.provinceCode,
        recognizedProvince: firstGroup.deliveryAddress.province,
        countryCode: firstGroup.deliveryAddress.countryCodeV2,
        match: recognizedProvince === provinceCode ? '✓ MATCH' : '✗ MISMATCH - Check Shopify zone format',
      })
      
      // If Shopify normalized it differently, log a warning
      if (recognizedProvince && recognizedProvince !== provinceCode) {
        console.warn(
          `[Shopify Delivery] Province format mismatch! ` +
          `Sent: "${provinceCode}" but Shopify recognized: "${recognizedProvince}". ` +
          `Update mapStateToShopifyProvinceCode() to use "${recognizedProvince}" format.`
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

    console.log('[Shopify Delivery] Found options:', options.map(o => ({ title: o.title, cost: o.estimatedCost.amount })))
    console.log('[Shopify Delivery] Selected option:', selectedOption.title, 'Cost:', amount)

    return {
      shippingCost: amount,
      currencyCode,
      options,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get delivery rates'
    return { shippingCost: 0, currencyCode: 'MYR', options: [], error: message }
  }
}
