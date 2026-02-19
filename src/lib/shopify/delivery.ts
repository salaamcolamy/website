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

const ADVANCED_SHIPPING_APP_ID = process.env.ADVANCED_SHIPPING_APP_ID || ''
const ADVANCED_SHIPPING_API_KEY = process.env.ADVANCED_SHIPPING_API_KEY || ''

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
 * Maps Malaysian state names to Shopify's expected province names.
 * Use for stores that configure shipping zones by province name.
 */
function mapStateToShopifyProvinceName(stateName: string): string {
  const stateToProvinceName: Record<string, string> = {
    'Wilayah Persekutuan': 'Kuala Lumpur',
    'Kuala Lumpur': 'Kuala Lumpur',
    'Pulau Pinang': 'Penang',
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
    'Labuan': 'Labuan',
    'Putrajaya': 'Putrajaya',
  }
  return stateToProvinceName[stateName] || stateName
}

/**
 * Malaysia ISO 3166-2 subdivision codes (used by Shopify for some shipping zones).
 * Try this if province name returns no delivery options.
 */
function mapStateToMalaysiaIsoCode(stateName: string): string | null {
  const stateToIso: Record<string, string> = {
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
    'Sabah': '12',
    'Sarawak': '13',
    'Kuala Lumpur': '14',
    'Wilayah Persekutuan': '14', // Same as KL for zone purposes
    'Labuan': '15',
    'Putrajaya': '16',
  }
  return stateToIso[stateName] ?? null
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
  /** Set when error is set; helps identify root cause of failed shipping calculation */
  debug?: {
    cause: 'shopify_not_configured' | 'invalid_cart_id' | 'labuan' | 'mutation_user_errors' | 'no_delivery_groups' | 'no_delivery_options' | 'exception'
    deliveryGroupsCount?: number
    userErrors?: Array<{ message: string }>
    warnings?: Array<{ message: string }>
    provinceTried?: string
  }
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
    console.error('[Shopify Delivery] Shopify not configured')
    return {
      shippingCost: 0,
      currencyCode: 'MYR',
      options: [],
      error: 'Shopify not configured',
      debug: { cause: 'shopify_not_configured' },
    }
  }

  // Cart ID must include the secret key or Shopify mutations will fail (e.g. "Cart not found")
  if (!cartId.includes('key=')) {
    console.error('[Shopify Delivery] Cart ID missing secret key (key=). Mutations will fail.')
    return {
      shippingCost: 0,
      currencyCode: 'MYR',
      options: [],
      error: 'Cart session invalid. Please refresh the page, add items again from the shop, then try checkout.',
      debug: { cause: 'invalid_cart_id' },
    }
  }

  // Validate cart ID format
  if (!cartId.startsWith('gid://shopify/Cart')) {
    console.error('[Shopify Delivery] Invalid cart ID format:', cartId)
    return {
      shippingCost: 0,
      currencyCode: 'MYR',
      options: [],
      error: 'Invalid cart ID format',
      debug: { cause: 'invalid_cart_id' },
    }
  }
  
  // Determine if this is East Malaysia for logging
  const isEastMalaysia = address.province === 'Sabah' || address.province === 'Sarawak'
  const regionLabel = isEastMalaysia ? 'East Malaysia' : 'West Malaysia'
  
  console.log('[Shopify Delivery] Starting shipping calculation...', {
    cartId: cartId.substring(0, 50) + '...',
    address: {
      province: address.province,
      city: address.city,
      zip: address.zip,
      countryCode: address.countryCode,
    },
    region: regionLabel,
    note: isEastMalaysia 
      ? '⚠️ East Malaysia address - ensure Advanced Shipping app has East Malaysia service configured'
      : 'West Malaysia address'
  })

  // Query cart weight and items to verify weight calculation
  // Shopify automatically calculates weight from product variant weights
  const mutation = `
    mutation cartDeliveryAddressesReplace($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
      cartDeliveryAddressesReplace(cartId: $cartId, addresses: $addresses) {
        userErrors { message code field }
        warnings { message code }
        cart {
          id
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    weight
                    weightUnit
                    product {
                      title
                    }
                  }
                }
              }
            }
          }
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
      warnings?: Array<{ message: string; code?: string }>
      cart: {
        id: string
        totalQuantity: number
        lines: {
          edges: Array<{
            node: {
              id: string
              quantity: number
              merchandise: {
                id: string
                title: string
                weight: number | null
                weightUnit: string
                product: {
                  title: string
                }
              } | null
            }
          }>
        } | null
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
    // Check if Labuan (no shipping available)
    if (address.province === 'Labuan' || address.province?.toLowerCase() === 'labuan') {
      console.warn('[Shopify Delivery] Labuan address detected - shipping not available')
      return {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: 'Shipping is not available to Labuan. Please contact support for alternative arrangements.',
        debug: { cause: 'labuan' },
      }
    }
    
    const countryCode = (address.countryCode?.trim().toUpperCase().slice(0, 2)) || 'MY'

    // Set buyer country on the cart so Shopify can compute delivery groups for the right region.
    // Without this, some stores return no delivery options.
    try {
      await shopifyFetch({
        query: `
          mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
            cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
              userErrors { message code }
              cart { id }
            }
          }
        `,
        variables: {
          cartId,
          buyerIdentity: { countryCode },
        },
        cache: 'no-store',
      })
    } catch (buyerErr) {
      console.warn('[Shopify Delivery] cartBuyerIdentityUpdate failed (continuing with address replace):', buyerErr)
    }

    /** Run cartDeliveryAddressesReplace with a given provinceCode (name or ISO code). */
    async function replaceAddressAndGetRates(provinceCodeValue: string): Promise<ReplacePayload['cartDeliveryAddressesReplace']> {
      const res = await shopifyFetch<ReplacePayload>({
        query: mutation,
        variables: {
          cartId,
          addresses: [
            {
              selected: true,
              oneTimeUse: true,
              validationStrategy: 'COUNTRY_CODE_ONLY',
              address: {
                deliveryAddress: {
                  address1: address.address1?.trim() || '',
                  address2: address.address2?.trim() || undefined,
                  city: address.city?.trim() || '',
                  provinceCode: provinceCodeValue,
                  countryCode,
                  zip: address.zip?.trim() || '',
                  firstName: address.firstName?.trim() || '',
                  lastName: address.lastName?.trim() || '',
                  phone: address.phone || undefined,
                },
              },
            },
          ],
        },
        cache: 'no-store',
      })
      return res.cartDeliveryAddressesReplace
    }

    // Try province NAME first (many stores use names in shipping zones)
    const provinceName = mapStateToShopifyProvinceName(address.province)
    let provinceCode = provinceName
    let payload = await replaceAddressAndGetRates(provinceName)

    const hasNoOptions = () =>
      !payload.cart?.deliveryGroups?.nodes?.length ||
      payload.cart.deliveryGroups.nodes.every((g) => !g.deliveryOptions?.length)

    // Retry with Malaysia ISO code if name returned nothing
    if (hasNoOptions() && !payload.userErrors?.length) {
      const isoCode = mapStateToMalaysiaIsoCode(address.province)
      if (isoCode) {
        payload = await replaceAddressAndGetRates(isoCode)
        provinceCode = isoCode
      }
    }

    // Retry with raw province (exact user selection) if still nothing
    if (hasNoOptions() && !payload.userErrors?.length && address.province !== provinceName && address.province !== mapStateToMalaysiaIsoCode(address.province)) {
      payload = await replaceAddressAndGetRates(address.province.trim())
      provinceCode = address.province.trim()
    }

    // Sometimes mutation response has empty deliveryOptions; fetch cart again to get rates
    if (hasNoOptions() && !payload.userErrors?.length) {
      try {
        const cartData = await shopifyFetch<{
          cart: ReplacePayload['cartDeliveryAddressesReplace']['cart']
        }>({
          query: `
            query getCartDeliveryGroups($cartId: ID!) {
              cart(id: $cartId) {
                deliveryGroups(first: 5) {
                  nodes {
                    id
                    deliveryAddress { provinceCode province countryCodeV2 }
                    deliveryOptions {
                      handle
                      title
                      estimatedCost { amount currencyCode }
                    }
                  }
                }
              }
            }
          `,
          variables: { cartId },
          cache: 'no-store',
        })
        if (cartData.cart?.deliveryGroups?.nodes?.length && payload.cart) {
          const withOptions = cartData.cart.deliveryGroups.nodes.filter((n) => n.deliveryOptions?.length)
          if (withOptions.length > 0) {
            payload = {
              ...payload,
              cart: {
                ...payload.cart,
                deliveryGroups: cartData.cart.deliveryGroups,
              },
            }
          }
        }
      } catch (_) {
        // ignore
      }
    }

    console.log('[Shopify Delivery] 📍 Address sent to Shopify:', {
      cartId: cartId.substring(0, 50) + '...',
      userSelectedProvince: address.province,
      city: address.city,
      zip: address.zip,
      countryCode,
      deliveryGroupsCount: payload.cart?.deliveryGroups?.nodes?.length ?? 0,
      optionsCount: payload.cart?.deliveryGroups?.nodes?.[0]?.deliveryOptions?.length ?? 0,
    })
    if (payload.warnings?.length) {
      console.warn('[Shopify Delivery] Mutation warnings:', payload.warnings.map((w) => w.message).join('; '), payload.warnings)
    }
    if (payload.userErrors?.length) {
      const msg = payload.userErrors.map((e) => e.message).join('; ')
      console.error('[Shopify Delivery] User errors:', payload.userErrors)
      return {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: msg,
        debug: {
          cause: 'mutation_user_errors',
          userErrors: payload.userErrors.map((e) => ({ message: e.message })),
          warnings: payload.warnings?.map((w) => ({ message: w.message })),
          provinceTried: provinceCode,
        },
      }
    }

    const cart = payload.cart
    
    // CRITICAL: Log cart weight information for debugging Advanced Shipping app
    if (cart?.lines?.edges?.length) {
      const cartItems = cart.lines.edges
        .filter(edge => edge?.node?.merchandise)
        .map(edge => {
          const m = edge.node.merchandise!
          const w = m.weight != null ? Number(m.weight) : null
          const qty = edge.node.quantity || 0
          return {
            productTitle: m.product?.title || 'Unknown',
            variantTitle: m.title || 'Unknown',
            quantity: qty,
            weight: w,
            weightUnit: m.weightUnit ?? null,
            totalWeight: w != null && qty > 0 ? w * qty : null,
          }
        })
      
      const totalCartWeight = cartItems.reduce((sum, item) => sum + (item.totalWeight ?? 0), 0)
      const itemsWithoutWeight = cartItems.filter(item => item.weight == null || item.weight <= 0)
      
      console.log('[Shopify Delivery] 📦 Cart Weight Analysis:', {
        totalCartWeight: totalCartWeight > 0 ? `${totalCartWeight} ${cartItems[0]?.weightUnit || 'kg'}` : 'UNKNOWN (no weights set)',
        itemsCount: cartItems.length,
        totalQuantity: cart.totalQuantity,
        items: cartItems.map(item => ({
          product: item.productTitle,
          variant: item.variantTitle,
          qty: item.quantity,
          weight: item.weight ? `${item.weight} ${item.weightUnit}` : '❌ NOT SET',
          totalWeight: item.totalWeight ? `${item.totalWeight} ${item.weightUnit}` : 'N/A'
        })),
        warning: itemsWithoutWeight.length > 0 
          ? `⚠️ ${itemsWithoutWeight.length} product(s) missing weight in Shopify Admin. Advanced Shipping app needs product weights to calculate rates correctly.`
          : '✓ All products have weight set',
        note: 'Advanced Shipping app uses this total weight to calculate shipping rates'
      })
      
      if (itemsWithoutWeight.length > 0) {
        console.error('[Shopify Delivery] ❌ PRODUCTS MISSING WEIGHT:', itemsWithoutWeight.map(item => 
          `${item.productTitle} (${item.variantTitle}) - Quantity: ${item.quantity}`
        ))
        console.error('[Shopify Delivery] 💡 FIX: Go to Shopify Admin → Products → Select product → Variants → Set Weight for each variant')
      }
    }
    
    if (!cart?.deliveryGroups?.nodes?.length) {
      // Kuala Lumpur / Wilayah Persekutuan: we send "Kuala Lumpur" for both; both are West Malaysia
      const isWPKL = address.province === 'Wilayah Persekutuan' || address.province === 'Kuala Lumpur' || provinceCode === 'Kuala Lumpur'
      
      let errorMessage = `No delivery options available for ${address.province}`
      let troubleshootingSteps: string[] = []
      
      if (isWPKL) {
        const userSelected = address.province === 'Wilayah Persekutuan' ? 'Wilayah Persekutuan' : 'Kuala Lumpur'
        errorMessage = `No shipping zone found for ${userSelected}. When customers select "Kuala Lumpur" or "Wilayah Persekutuan", we send "Kuala Lumpur" to Shopify. Add "Kuala Lumpur" to the West Malaysia shipping zone (this covers both selections).`
        troubleshootingSteps = [
          'Go to Shopify Admin → Settings → Shipping → Shipping zones',
          'Open "West Malaysia" zone',
          'Click "Add country/region" or "Edit"',
          'Search for and add "Kuala Lumpur" (exact spelling, case-sensitive)',
          'Verify "Kuala Lumpur" appears in the zone\'s list of regions',
          'In Advanced Shipping app → West Malaysia service → Add rule: Province = Kuala Lumpur',
          'Verify Advanced Shipping app service is linked to the West Malaysia shipping zone',
          'Save all changes and test again',
          'If still not working, check browser console for "Shopify recognized address" log to see what Shopify actually recognized'
        ]
      } else {
        troubleshootingSteps = [
          `We tried province as "${provinceCode}" (name or ISO). Add this region to a shipping zone in Shopify Admin.`,
          'Settings → Shipping → Edit zone → Add country/region → select your state (or add by name/code to match).',
          'Check Advanced Shipping app has rules for this province.',
          'Verify cart items have weight set in Shopify (Products → Variant → Weight).',
        ]
      }
      
      console.error('[Shopify Delivery] ❌ No delivery groups found for address:', {
        province: address.province,
        provinceCode: provinceCode,
        city: address.city,
        zip: address.zip,
        cartId: cartId.substring(0, 50) + '...',
        isWPKL,
        possibleCauses: [
          'Shipping zone not configured for this province',
          'Cart might be empty or items not synced',
          'Advanced Shipping app might not be configured for this zone',
          'Province name mismatch between address and Shopify zones'
        ],
        troubleshootingSteps
      })
      
      let fullErrorMessage = troubleshootingSteps.length > 0
        ? `${errorMessage}\n\nTo fix:\n${troubleshootingSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`
        : errorMessage
      if (payload.warnings?.length) {
        fullErrorMessage += `\n\nShopify warnings: ${payload.warnings.map((w) => w.message).join('; ')}`
      }

      return {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: fullErrorMessage,
        debug: {
          cause: 'no_delivery_groups',
          deliveryGroupsCount: 0,
          warnings: payload.warnings?.map((w) => ({ message: w.message })),
          provinceTried: provinceCode,
        },
      }
    }

    const firstGroup = cart.deliveryGroups.nodes[0]
    let options: Array<{ handle: string; title: string; estimatedCost: { amount: string; currencyCode: string } }> = firstGroup?.deliveryOptions ?? []
    
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
      
      // If Shopify normalized it differently, log a warning with matching instructions
      if (recognizedProvince && recognizedProvince !== provinceCode && recognizedProvince.toLowerCase() !== provinceCode.toLowerCase()) {
        console.warn(
          `[Shopify Delivery] ⚠️ PROVINCE NAME MISMATCH DETECTED!`
        )
        console.warn(
          `Website sent: "${provinceCode}" → Shopify recognized: "${recognizedProvince}"`
        )
        console.warn(
          `💡 TO FIX: Update Shopify Admin shipping zone to use "${provinceCode}" OR update Advanced Shipping app rules to use "${recognizedProvince}"`
        )
        console.warn(
          `See docs/SHIPPING-ZONE-MATCHING-GUIDE.md for detailed matching instructions`
        )
      }
    }
    
    // If no options from Shopify, try Advanced Shipping API directly so checkout stays linked to Advanced Shipping
    if (options.length === 0 && isAdvancedShippingConfigured() && ADVANCED_SHIPPING_APP_ID && ADVANCED_SHIPPING_API_KEY && cart?.lines?.edges?.length) {
      console.log('[Shopify Delivery] No Shopify options, fetching Advanced Shipping API directly...')
      try {
        const items = cart.lines.edges
          .filter((e) => e?.node?.merchandise)
          .map((e) => {
            const m = e!.node!.merchandise!
            const w = m.weight != null ? Number(m.weight) : undefined
            const wKg = w != null && (m.weightUnit === 'GRAMS' || String(m.weightUnit).toLowerCase().includes('gram')) ? w / 1000 : w
            return {
              id: m.id,
              quantity: e!.node!.quantity || 0,
              weight: wKg,
            }
          })
        const asResponse = await getAdvancedShippingRates(ADVANCED_SHIPPING_APP_ID, ADVANCED_SHIPPING_API_KEY, {
          items,
          destination: {
            address1: address.address1 || '',
            address2: address.address2,
            city: address.city || '',
            province: address.province || '',
            country: address.countryCode === 'MY' ? 'Malaysia' : address.countryCode,
            zip: address.zip || '',
          },
        })
        if (asResponse.rates?.length) {
          options = asResponse.rates.map((r) => ({
            handle: r.handle || r.title || 'advanced-shipping',
            title: r.title,
            estimatedCost: { amount: String(r.cost), currencyCode: r.currencyCode || 'MYR' },
          }))
          console.log('[Shopify Delivery] ✓ Advanced Shipping API fallback returned', options.length, 'rate(s)')
        }
      } catch (apiError) {
        console.error('[Shopify Delivery] Advanced Shipping API fallback failed:', apiError)
      }
    }

    if (options.length === 0) {
      console.warn('[Shopify Delivery] No delivery options found in delivery group')
      return {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: 'No shipping methods available',
        debug: {
          cause: 'no_delivery_options',
          deliveryGroupsCount: cart?.deliveryGroups?.nodes?.length ?? 0,
          provinceTried: provinceCode,
        },
      }
    }
    
    // PRIORITIZE ADVANCED SHIPPING APP RATES (especially weight-based rates)
    // Strategy: Advanced Shipping app rates are typically non-free and weight-based
    // If Advanced Shipping app is installed, prioritize ALL non-free options over free shipping
    // When multiple non-free options exist, use the HIGHEST cost (correct weight tier)
    
    // Get all options with their costs
    const optionsWithCosts = options.map(opt => ({
      option: opt,
      cost: parseFloat(opt.estimatedCost.amount) || 0,
      handle: opt.handle.toLowerCase(),
      title: opt.title.toLowerCase()
    }))
    
    // STEP 1: Find weight-based options by keywords (highest priority)
    const weightBasedOptions = optionsWithCosts.filter(({ handle, title }) => {
      return handle.includes('weight') ||
             title.includes('weight') ||
             title.includes('weight-based') ||
             title.includes('by weight') ||
             title.includes('per kg') ||
             title.includes('per kilogram') ||
             handle.includes('weight-based')
    })
    
    // STEP 2: Find Advanced Shipping app options by keywords
    const advancedShippingOptions = optionsWithCosts.filter(({ handle, title }) => {
      return handle.includes('advanced') || 
             title.includes('advanced') ||
             handle.includes('advanced-shipping') ||
             handle.includes('advancedshipping')
    })
    
    // STEP 3: Get ALL non-free options (Advanced Shipping app rates are always non-free)
    const nonFreeOptions = optionsWithCosts.filter(({ cost }) => cost > 0)
    
    // Sort non-free options by cost DESCENDING (highest cost = correct weight tier for Advanced Shipping)
    const sortedNonFreeOptions = [...nonFreeOptions].sort((a, b) => b.cost - a.cost)
    
    // STEP 4: Find free shipping options (should be lowest priority if Advanced Shipping is installed)
    const freeOptions = optionsWithCosts.filter(({ cost }) => cost === 0)
    
    // CRITICAL: If Advanced Shipping app is configured, ALWAYS prioritize non-free options
    // Advanced Shipping app rates are weight-based and will have costs > 0
    const advancedShippingAppConfigured = isAdvancedShippingConfigured()
    
    // SELECTION PRIORITY (Advanced Shipping app rates FIRST):
    // 1. Weight-based options (by keywords) - sorted by cost DESCENDING
    // 2. Advanced Shipping app options (by keywords) - sorted by cost DESCENDING  
    // 3. ALL non-free options sorted by cost DESCENDING (Advanced Shipping app rates are non-free)
    // 4. Standard Delivery (non-free)
    // 5. Free shipping options (only if no non-free options exist)
    // 6. First available option
    
    let selectedOption: typeof options[0] | undefined
    
    if (weightBasedOptions.length > 0) {
      // Sort by cost descending - highest cost = correct weight tier
      const sortedWeightOptions = [...weightBasedOptions].sort((a, b) => b.cost - a.cost)
      selectedOption = sortedWeightOptions[0].option
      console.log('[Shopify Delivery] ✓✓✓ PRIORITIZED: Weight-based rate (Advanced Shipping app):', selectedOption.title, 'Cost:', selectedOption.estimatedCost.amount, selectedOption.estimatedCost.currencyCode)
    } else if (advancedShippingOptions.length > 0) {
      // Sort by cost descending
      const sortedAdvancedOptions = [...advancedShippingOptions].sort((a, b) => b.cost - a.cost)
      selectedOption = sortedAdvancedOptions[0].option
      console.log('[Shopify Delivery] ✓✓ PRIORITIZED: Advanced Shipping app rate:', selectedOption.title, 'Cost:', selectedOption.estimatedCost.amount, selectedOption.estimatedCost.currencyCode)
    } else if (sortedNonFreeOptions.length > 0) {
      // CRITICAL: Always use highest cost non-free option when Advanced Shipping app is likely installed
      // This ensures we get the correct weight tier from Advanced Shipping app
      selectedOption = sortedNonFreeOptions[0].option
      console.log('[Shopify Delivery] ✓✓✓ PRIORITIZED: Highest cost non-free option (Advanced Shipping app weight-based):', selectedOption.title, 'Cost:', selectedOption.estimatedCost.amount, selectedOption.estimatedCost.currencyCode)
      console.log('[Shopify Delivery] 💡 All non-free options:', sortedNonFreeOptions.map(o => `${o.option.title} (${o.cost} ${o.option.estimatedCost.currencyCode})`).join(', '))
    } else if (freeOptions.length > 0) {
      // Only use free shipping if no non-free options exist
      selectedOption = freeOptions[0].option
      console.log('[Shopify Delivery] ⚠ Using free shipping (no non-free options available):', selectedOption.title)
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

    // Log region information for Advanced Shipping app debugging
    const isEastMalaysiaAddress = address.province === 'Sabah' || address.province === 'Sarawak'
    console.log('[Shopify Delivery] 🌍 Address Region:', {
      province: address.province,
      provinceCode: provinceCode,
      region: isEastMalaysiaAddress ? 'East Malaysia' : 'West Malaysia',
      note: isEastMalaysiaAddress 
        ? '⚠️ If only West Malaysia rates appear, configure East Malaysia service in Advanced Shipping app'
        : 'West Malaysia - rates should be available'
    })
    
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
      const isNonFree = cost > 0
      let priority = 'LOW'
      if (isWeightBased) priority = 'HIGHEST (weight-based)'
      else if (isAdvancedShipping) priority = 'HIGH (Advanced Shipping)'
      else if (isNonFree && advancedShippingAppConfigured) priority = 'HIGH (non-free - Advanced Shipping app)'
      else if (isNonFree) priority = 'MEDIUM (non-free)'
      else priority = 'LOW (free)'
      
      return { 
        title: o.title, 
        handle: o.handle,
        cost: o.estimatedCost.amount,
        costNumber: cost,
        currency: o.estimatedCost.currencyCode,
        isFree: cost === 0,
        isWeightBased: isWeightBased,
        isAdvancedShipping: isAdvancedShipping,
        isNonFree: isNonFree,
        priority: priority,
        source: isAdvancedShippingApp ? 'Advanced Shipping App (detected)' : (isNonFree && advancedShippingAppConfigured ? 'Advanced Shipping App (likely)' : 'Shopify Native')
      }
    }))
    
    // Log detection results
    if (weightBasedOptions.length > 0) {
      console.log('[Shopify Delivery] ✓✓✓ WEIGHT-BASED RATES DETECTED:', weightBasedOptions.map(({ option, cost }) => `${option.title} (${cost} ${option.estimatedCost.currencyCode})`))
    }
    if (advancedShippingOptions.length > 0) {
      console.log('[Shopify Delivery] ✓✓ Advanced Shipping app rates detected:', advancedShippingOptions.map(({ option, cost }) => `${option.title} (${cost} ${option.estimatedCost.currencyCode})`))
    }
    if (sortedNonFreeOptions.length > 0) {
      console.log('[Shopify Delivery] ✓ Non-free options (Advanced Shipping app rates):', sortedNonFreeOptions.map(({ option, cost }) => `${option.title} (${cost} ${option.estimatedCost.currencyCode})`))
      if (sortedNonFreeOptions.length > 1) {
        console.log('[Shopify Delivery] 💡 Multiple non-free options detected - using HIGHEST cost (correct weight tier)')
      }
    }
    if (advancedShippingAppConfigured) {
      console.log('[Shopify Delivery] ⚙️ Advanced Shipping app is configured - prioritizing non-free options')
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
    console.error('[Shopify Delivery] Error calculating shipping:', {
      error: err,
      message: message,
      stack: err instanceof Error ? err.stack : undefined,
      cartId: cartId.substring(0, 50) + '...',
      address: {
        province: address.province,
        city: address.city,
        zip: address.zip,
      }
    })
    
    // Provide more detailed error information
    let errorMessage = message
    if (err instanceof Error) {
      // Check if it's a GraphQL error
      if (err.message.includes('GraphQL') || err.message.includes('Shopify')) {
        errorMessage = `Shopify API error: ${err.message}. Please check your Shopify configuration and shipping zones.`
      } else if (err.message.includes('not configured')) {
        errorMessage = 'Shopify is not configured. Please check your environment variables.'
      } else {
        errorMessage = `Failed to calculate shipping: ${err.message}`
      }
    }
    
    return {
      shippingCost: 0,
      currencyCode: 'MYR',
      options: [],
      error: errorMessage,
      debug: { cause: 'exception' },
    }
  }
}
