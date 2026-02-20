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

import { shopifyFetch, isShopifyConfigured, cartQueryWithCarrierRates } from './client'

/** Optional: when no Shopify delivery options, return one option with this amount (MYR) so checkout can proceed. e.g. FALLBACK_SHIPPING_MY_RATE=10 */
const FALLBACK_SHIPPING_MY_RATE = process.env.FALLBACK_SHIPPING_MY_RATE != null ? parseFloat(process.env.FALLBACK_SHIPPING_MY_RATE) : NaN

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

/**
 * Converts Shopify variant weight to kilograms (for logging).
 * Shopify uses WeightUnit: GRAMS, KILOGRAMS, POUNDS, OUNCES.
 */
function variantWeightToKg(
  weight: number | null | undefined,
  weightUnit: string | null | undefined
): number | undefined {
  if (weight == null || Number.isNaN(weight) || weight < 0) return undefined
  const w = Number(weight)
  const unit = (weightUnit ?? '').toUpperCase()
  if (unit === 'KILOGRAMS' || unit === 'KG') return w
  if (unit === 'GRAMS' || unit === 'G') return w / 1000
  if (unit === 'POUNDS' || unit === 'LB' || unit === 'LBS') return w * 0.453592
  if (unit === 'OUNCES' || unit === 'OZ') return w * 0.0283495
  // Fallback: treat as grams if looks like gram unit, else assume kg
  if (String(weightUnit).toLowerCase().includes('gram')) return w / 1000
  return w
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
    usedAdvancedShippingFallback?: boolean
    usedFallbackRate?: boolean
  }
}

/**
 * Replaces the cart's delivery address and returns available delivery options with costs.
 * Use this to get zone-based shipping rates from Shopify for the customer's address.
 * 
 * Shipping rates come only from Shopify backend (Settings → Shipping and delivery).
 * Configure zones and rates in Shopify Admin; variant weights are used for weight-based rates.
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
      ? 'East Malaysia address – ensure a shipping zone/rate is configured in Shopify Admin'
      : 'West Malaysia address'
  })

  // Query cart weight and items for logging. Delivery options come from Shopify backend (zones + variant weights in Admin).
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
                      handle
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
                  handle: string
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

    // Kuala Lumpur / Wilayah Persekutuan: try alternate names Shopify might use in zones
    const klAlternates = ['W.P. Kuala Lumpur', 'WP Kuala Lumpur', 'Federal Territory of Kuala Lumpur', 'Wilayah Persekutuan Kuala Lumpur']
    if (hasNoOptions() && !payload.userErrors?.length && (address.province === 'Kuala Lumpur' || address.province === 'Wilayah Persekutuan')) {
      for (const alt of klAlternates) {
        if (hasNoOptions() && !payload.userErrors?.length) {
          payload = await replaceAddressAndGetRates(alt)
          if (!hasNoOptions()) provinceCode = alt
        }
      }
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

    // If still no options, try cart query with @defer + withCarrierRates for carrier-calculated rates
    if (hasNoOptions() && !payload.userErrors?.length) {
      try {
        const carrierCart = await cartQueryWithCarrierRates(cartId)
        const edges = carrierCart?.deliveryGroups?.edges
        if (edges?.length && payload.cart) {
          const nodes = edges
            .map((e) => e.node)
            .filter((n) => n.deliveryOptions?.length)
          if (nodes.length > 0) {
            payload = {
              ...payload,
              cart: {
                ...payload.cart,
                deliveryGroups: { nodes },
              },
            }
            console.log('[Shopify Delivery] Used carrier rates from @defer query:', nodes[0].deliveryOptions?.length, 'options')
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
    
    if (cart?.lines?.edges?.length) {
      const cartItems = cart.lines.edges
        .filter(edge => edge?.node?.merchandise)
        .map(edge => {
          const m = edge.node.merchandise!
          const w = m.weight != null ? Number(m.weight) : null
          const qty = edge.node.quantity || 0
          const wKg = variantWeightToKg(w, m.weightUnit ?? undefined)
          const totalKg = wKg != null && qty > 0 ? wKg * qty : null
          return {
            productTitle: m.product?.title || 'Unknown',
            variantTitle: m.title || 'Unknown',
            quantity: qty,
            weight: w,
            weightUnit: m.weightUnit ?? null,
            totalWeight: w != null && qty > 0 ? w * qty : null,
            weightKg: wKg,
            totalKg,
          }
        })
      
      const totalCartKg = cartItems.reduce((sum, item) => sum + (item.totalKg ?? 0), 0)
      const itemsWithoutWeight = cartItems.filter(item => item.weight == null || item.weight <= 0)
      
      console.log('[Shopify Delivery] 📦 Cart weight (from Shopify):', {
        totalCartKg: totalCartKg > 0 ? `${totalCartKg.toFixed(4)} kg` : 'UNKNOWN (set variant weight in Admin)',
        itemsCount: cartItems.length,
        items: cartItems.map(item => ({
          product: item.productTitle,
          qty: item.quantity,
          weight: item.weight != null ? `${item.weight} ${item.weightUnit}` : 'NOT SET',
          weightKg: item.weightKg != null ? `${item.weightKg.toFixed(4)} kg` : '—',
        })),
        note: 'Rates come from Shopify backend (Settings → Shipping). Set weight on each variant for correct rates.',
      })
      if (itemsWithoutWeight.length > 0) {
        console.warn('[Shopify Delivery] ⚠ Products missing weight in Admin:', itemsWithoutWeight.map(i => `${i.productTitle} (${i.variantTitle})`))
      }
    }
    
    if (!cart?.deliveryGroups?.nodes?.length) {
      // No delivery groups from Shopify – check zones and variant weights in Admin
      const isWPKL = address.province === 'Wilayah Persekutuan' || address.province === 'Kuala Lumpur' || provinceCode === 'Kuala Lumpur'
      
      let errorMessage = `No delivery options available for ${address.province}`
      let troubleshootingSteps: string[] = []
      
      if (isWPKL) {
        const userSelected = address.province === 'Wilayah Persekutuan' ? 'Wilayah Persekutuan' : 'Kuala Lumpur'
        errorMessage = `No shipping zone found for ${userSelected}. Add "Kuala Lumpur" or "Wilayah Persekutuan" to your West Malaysia shipping zone.`
        troubleshootingSteps = [
          'Go to Shopify Admin → Settings → Shipping and delivery',
          'Open your West Malaysia zone (or create one)',
          'Under Malaysia, add "Kuala Lumpur" and/or "Wilayah Persekutuan" (exact spelling)',
          'Under Rates, add a rate (e.g. Standard, or a carrier). Save.',
          'Run GET /api/shopify/validate-setup to verify what Shopify recognizes'
        ]
      } else {
        troubleshootingSteps = [
          `We tried province as "${provinceCode}" (name or ISO). Add this region to a shipping zone in Shopify Admin.`,
          'Settings → Shipping and delivery → Edit zone → Add country/region → select your state.',
          'Verify variant weights are set (Products → Variant → Weight).',
        ]
      }
      
      console.error('[Shopify Delivery] ❌ No delivery groups from Shopify for address:', {
        province: address.province,
        provinceCode: provinceCode,
        city: address.city,
        zip: address.zip,
        possibleCauses: ['Shipping zone not configured for this province', 'Province name/code mismatch', 'Variant weights not set'],
        troubleshootingSteps
      })

      // Optional: allow checkout to proceed with a single fallback rate when nothing else worked
      const fallbackAmount = Number.isFinite(FALLBACK_SHIPPING_MY_RATE) && FALLBACK_SHIPPING_MY_RATE >= 0 ? FALLBACK_SHIPPING_MY_RATE : NaN
      if (Number.isFinite(fallbackAmount)) {
        console.warn('[Shopify Delivery] Using FALLBACK_SHIPPING_MY_RATE so checkout can proceed:', fallbackAmount)
        return {
          shippingCost: fallbackAmount,
          currencyCode: 'MYR',
          options: [{ handle: 'fallback-standard', title: 'Standard delivery', estimatedCost: { amount: String(fallbackAmount), currencyCode: 'MYR' } }],
          debug: { cause: 'no_delivery_groups', usedFallbackRate: true, provinceTried: provinceCode },
        }
      }
      
      // Long troubleshooting text is logged above; show only a short message to the customer
      const userFacingError = 'Unable to calculate shipping for your address. Please verify your details or contact support for assistance.'
      if (payload.warnings?.length) {
        console.warn('[Shopify Delivery] Shopify warnings:', payload.warnings.map((w) => w.message).join('; '))
      }

      return {
        shippingCost: 0,
        currencyCode: 'MYR',
        options: [],
        error: userFacingError,
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
          `[Shopify Delivery] ⚠️ Province mismatch: sent "${provinceCode}" → Shopify recognized "${recognizedProvince}". Update shipping zone in Admin to match.`
        )
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
    
    // Use first delivery option from Shopify backend (zones + rates configured in Admin)
    const selectedOption = options[0]
    const amount = selectedOption
      ? parseFloat(selectedOption.estimatedCost.amount)
      : 0
    const currencyCode = selectedOption?.estimatedCost.currencyCode ?? 'MYR'

    console.log('[Shopify Delivery] Using first Shopify option:', selectedOption?.title ?? '—', 'Cost:', amount, currencyCode)

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
