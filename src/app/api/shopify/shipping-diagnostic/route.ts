import { NextRequest } from 'next/server'
import { shopifyFetch, isShopifyConfigured } from '@/lib/shopify/client'

/**
 * POST with same body as /api/shopify/shipping-rates.
 * Returns raw Shopify response so you can see why shipping isn't working.
 * Check: userErrors, warnings, deliveryGroups[].deliveryOptions.
 */
export async function POST(req: NextRequest) {
  try {
    if (!isShopifyConfigured()) {
      return Response.json({
        ok: false,
        error: 'Shopify not configured',
        fix: 'Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local',
      })
    }

    const body = await req.json()
    const { cartId, address } = body as {
      cartId?: string
      address?: {
        address1?: string
        city?: string
        province?: string
        countryCode?: string
        zip?: string
        firstName?: string
        lastName?: string
      }
    }

    if (!cartId || !address) {
      return Response.json({
        ok: false,
        error: 'Missing cartId or address',
        fix: 'Send same JSON as shipping-rates: { cartId, address }',
      })
    }

    if (!cartId.includes('key=')) {
      return Response.json({
        ok: false,
        error: 'Cart ID is missing secret key (key=)',
        fix: 'Refresh the page, add items from the shop again, then try checkout. Do not use a cart ID from a link or old session.',
      })
    }

    const countryCode = (address.countryCode || 'MY').toString().trim().toUpperCase().slice(0, 2)
    const provinceCode = address.province?.toString().trim() || 'Selangor'

    // 1) Set buyer country
    let buyerIdentityOk = true
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
        variables: { cartId, buyerIdentity: { countryCode } },
        cache: 'no-store',
      })
    } catch (e) {
      buyerIdentityOk = false
    }

    // 2) Replace delivery address and get raw response
    const mutation = `
      mutation cartDeliveryAddressesReplace($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
        cartDeliveryAddressesReplace(cartId: $cartId, addresses: $addresses) {
          userErrors { message code field }
          warnings { message code }
          cart {
            id
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
      }
    `

    const data = await shopifyFetch<{
      cartDeliveryAddressesReplace: {
        userErrors: Array<{ message: string; code?: string }>
        warnings?: Array<{ message: string; code?: string }>
        cart: {
          id: string
          deliveryGroups: {
            nodes: Array<{
              id: string
              deliveryAddress: { provinceCode: string | null; province: string | null; countryCodeV2: string } | null
              deliveryOptions: Array<{ handle: string; title: string; estimatedCost: { amount: string; currencyCode: string } }>
            }>
          }
        } | null
      }
    }>({
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
                address1: (address.address1 || '').toString().trim(),
                city: (address.city || '').toString().trim(),
                provinceCode,
                countryCode,
                zip: (address.zip || '').toString().trim(),
                firstName: (address.firstName || '').toString().trim(),
                lastName: (address.lastName || '').toString().trim(),
              },
            },
          },
        ],
      },
      cache: 'no-store',
    })

    const payload = data.cartDeliveryAddressesReplace
    const nodes = payload.cart?.deliveryGroups?.nodes ?? []
    const firstGroup = nodes[0]
    const optionsCount = firstGroup?.deliveryOptions?.length ?? 0

    return Response.json({
      ok: optionsCount > 0,
      buyerIdentityOk,
      sentToShopify: {
        provinceCode,
        countryCode,
      },
      userErrors: payload.userErrors,
      warnings: payload.warnings ?? [],
      deliveryGroupsCount: nodes.length,
      recognizedAddress: firstGroup?.deliveryAddress
        ? {
            provinceCode: firstGroup.deliveryAddress.provinceCode,
            province: firstGroup.deliveryAddress.province,
            countryCodeV2: firstGroup.deliveryAddress.countryCodeV2,
          }
        : null,
      deliveryOptionsCount: optionsCount,
      deliveryOptions: firstGroup?.deliveryOptions ?? [],
      whyNotWorking:
        payload.userErrors?.length
          ? `Shopify returned userErrors: ${payload.userErrors.map((e) => e.message).join('; ')}`
          : nodes.length === 0
            ? 'Shopify returned 0 delivery groups. Add this province to a shipping zone in Settings → Shipping and delivery, and add Advanced Shipping (or a rate) to that zone.'
            : optionsCount === 0
              ? 'Shopify returned a delivery group but 0 options. Ensure the zone has a rate (e.g. Advanced Shipping) and product variants have Weight set.'
              : null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({
      ok: false,
      error: message,
      whyNotWorking: `Request failed: ${message}. Check server logs for [Shopify] GraphQL errors.`,
    })
  }
}
