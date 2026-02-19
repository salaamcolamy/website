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
import { getAdvancedShippingRates, isAdvancedShippingConfigured } from '../advanced-shipping/client'

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
 * 
 * IMPORTANT - Advanced Shipping App Integration:
 * This function automatically returns rates from Advanced Shipping app if installed.
 * Shopify's Storefront API includes app-generated rates in deliveryOptions.
 * The function prioritizes Advanced Shipping app rates when available.
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
    
    // If no options from Shopify, try Advanced Shipping API directly as fallback
    if (options.length === 0 && isAdvancedShippingConfigured()) {
      console.log('[Shopify Delivery] No Shopify options, trying Advanced Shipping API directly...')
      try {
        // Note: We'd need cart items to call Advanced Shipping API
        // For now, return empty and let the caller handle it
        console.warn('[Shopify Delivery] Advanced Shipping API fallback requires cart items - not implemented yet')
      } catch (apiError) {
        console.error('[Shopify Delivery] Advanced Shipping API fallback failed:', apiError)
      }
    }
    
    if (options.length === 0) {
      console.warn('[Shopify Delivery] No delivery options found in delivery group')
      return { shippingCost: 0, currencyCode: 'MYR', options: [], error: 'No shipping methods available' }
    }
    
    // PRIORITIZE ADVANCED SHIPPING APP RATES (especially weight-based rates)
    // Advanced Shipping app rates are identified by:
    // 1. Weight-based keywords: "weight", "weight-based", "by weight", "kg", "per kg"
    // 2. Advanced Shipping keywords: "advanced", "advanced-shipping", "advancedshipping"
    // 3. Non-free options (Advanced Shipping typically charges based on weight)
    
    // STEP 1: Find weight-based options (highest priority - these are Advanced Shipping app rates)
    const weightBasedOptions = options.filter((opt) => {
      const handleLower = opt.handle.toLowerCase()
      const titleLower = opt.title.toLowerCase()
      return handleLower.includes('weight') ||
             titleLower.includes('weight') ||
             titleLower.includes('weight-based') ||
             titleLower.includes('by weight') ||
             titleLower.includes('per kg') ||
             titleLower.includes('per kilogram') ||
             handleLower.includes('weight-based')
    })
    
    // STEP 2: Find Advanced Shipping app options (by explicit keywords)
    const advancedShippingOptions = options.filter((opt) => {
      const handleLower = opt.handle.toLowerCase()
      const titleLower = opt.title.toLowerCase()
      return handleLower.includes('advanced') || 
             titleLower.includes('advanced') ||
             handleLower.includes('advanced-shipping') ||
             handleLower.includes('advancedshipping')
    })
    
    // STEP 3: Get all non-free options (Advanced Shipping typically charges based on weight)
    const nonFreeOptions = options.filter((opt) => {
      const cost = parseFloat(opt.estimatedCost.amount) || 0
      return cost > 0
    })
    
    // Sort non-free options by cost (descending) - weight-based rates typically cost more for heavier items
    const sortedNonFreeOptions = [...nonFreeOptions].sort((a, b) => {
      const costA = parseFloat(a.estimatedCost.amount) || 0
      const costB = parseFloat(b.estimatedCost.amount) || 0
      return costB - costA // Higher cost first (likely weight-based)
    })
    
    // STEP 4: Find standard delivery (non-free)
    const standardDeliveryOption = options.find(
      (opt) => {
        const titleLower = opt.title.toLowerCase()
        const handleLower = opt.handle.toLowerCase()
        return (titleLower.includes('standard') || handleLower.includes('standard')) &&
               parseFloat(opt.estimatedCost.amount) > 0
      }
    )
    
    // SELECTION PRIORITY (Advanced Shipping weight-based rates first):
    // 1. Weight-based options (highest priority - Advanced Shipping app weight-based rates)
    // 2. Advanced Shipping app options (by keywords)
    // 3. Non-free options sorted by cost (descending - higher cost = likely weight-based)
    // 4. Standard Delivery (non-free)
    // 5. First available option
    let selectedOption: typeof options[0] | undefined
    
    if (weightBasedOptions.length > 0) {
      // Prioritize weight-based options - if multiple, use the one with highest cost (likely correct weight tier)
      const sortedWeightOptions = [...weightBasedOptions].sort((a, b) => {
        const costA = parseFloat(a.estimatedCost.amount) || 0
        const costB = parseFloat(b.estimatedCost.amount) || 0
        return costB - costA // Higher cost first
      })
      selectedOption = sortedWeightOptions[0]
      console.log('[Shopify Delivery] ✓✓✓ PRIORITIZED: Advanced Shipping weight-based rate:', selectedOption.title, 'Cost:', selectedOption.estimatedCost.amount, selectedOption.estimatedCost.currencyCode)
    } else if (advancedShippingOptions.length > 0) {
      // Use Advanced Shipping app option
      const sortedAdvancedOptions = [...advancedShippingOptions].sort((a, b) => {
        const costA = parseFloat(a.estimatedCost.amount) || 0
        const costB = parseFloat(b.estimatedCost.amount) || 0
        return costB - costA // Higher cost first
      })
      selectedOption = sortedAdvancedOptions[0]
      console.log('[Shopify Delivery] ✓✓ PRIORITIZED: Advanced Shipping app rate:', selectedOption.title, 'Cost:', selectedOption.estimatedCost.amount, selectedOption.estimatedCost.currencyCode)
    } else if (sortedNonFreeOptions.length > 0) {
      // Use highest cost non-free option (likely weight-based from Advanced Shipping)
      selectedOption = sortedNonFreeOptions[0]
      console.log('[Shopify Delivery] ✓ PRIORITIZED: Non-free shipping option (likely Advanced Shipping weight-based):', selectedOption.title, 'Cost:', selectedOption.estimatedCost.amount, selectedOption.estimatedCost.currencyCode)
    } else if (standardDeliveryOption) {
      selectedOption = standardDeliveryOption
      console.log('[Shopify Delivery] Using Standard Delivery:', standardDeliveryOption.title)
    } else {
      selectedOption = options[0]
      console.log('[Shopify Delivery] Using first available option:', selectedOption.title)
    }
    
    if (!selectedOption) {
      console.error('[Shopify Delivery] No option selected! Available options:', options)
      selectedOption = options[0] // Fallback
    }
    
    const amount = selectedOption
      ? parseFloat(selectedOption.estimatedCost.amount)
      : 0
    const currencyCode = selectedOption?.estimatedCost.currencyCode ?? 'MYR'

    // Log all available options with detailed information
    console.log('[Shopify Delivery] 📦 All available shipping options:', options.map(o => {
      const cost = parseFloat(o.estimatedCost.amount) || 0
      const titleLower = o.title.toLowerCase()
      const handleLower = o.handle.toLowerCase()
      const isWeightBased = handleLower.includes('weight') ||
                           titleLower.includes('weight') ||
                           titleLower.includes('weight-based') ||
                           titleLower.includes('by weight') ||
                           titleLower.includes('per kg')
      const isAdvancedShipping = handleLower.includes('advanced') || 
                                 titleLower.includes('advanced') ||
                                 handleLower.includes('advanced-shipping') ||
                                 handleLower.includes('advancedshipping')
      const isAdvancedShippingApp = isWeightBased || isAdvancedShipping
      return { 
        title: o.title, 
        handle: o.handle,
        cost: o.estimatedCost.amount,
        costNumber: cost,
        currency: o.estimatedCost.currencyCode,
        isFree: cost === 0,
        isWeightBased: isWeightBased,
        isAdvancedShipping: isAdvancedShipping,
        priority: isWeightBased ? 'HIGHEST (weight-based)' : isAdvancedShipping ? 'HIGH (Advanced Shipping)' : cost > 0 ? 'MEDIUM (non-free)' : 'LOW (free)',
        source: isAdvancedShippingApp ? 'Advanced Shipping App (detected)' : 'Shopify Native'
      }
    }))
    
    // Log detection results
    if (weightBasedOptions.length > 0) {
      console.log('[Shopify Delivery] ✓✓✓ WEIGHT-BASED RATES DETECTED (Advanced Shipping app):', weightBasedOptions.map(o => `${o.title} (${o.estimatedCost.amount} ${o.estimatedCost.currencyCode})`))
    }
    if (advancedShippingOptions.length > 0) {
      console.log('[Shopify Delivery] ✓✓ Advanced Shipping app rates detected:', advancedShippingOptions.map(o => `${o.title} (${o.estimatedCost.amount} ${o.estimatedCost.currencyCode})`))
    }
    if (sortedNonFreeOptions.length > 0 && weightBasedOptions.length === 0 && advancedShippingOptions.length === 0) {
      console.log('[Shopify Delivery] ✓ Non-free options detected (likely Advanced Shipping weight-based):', sortedNonFreeOptions.map(o => `${o.title} (${o.estimatedCost.amount} ${o.estimatedCost.currencyCode})`))
      console.log('[Shopify Delivery] 💡 Prioritizing highest cost option (likely correct weight tier)')
    }
    
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
