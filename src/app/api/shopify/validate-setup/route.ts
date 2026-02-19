import { NextRequest } from 'next/server'
import { shopifyFetch, isShopifyConfigured } from '@/lib/shopify/client'
import { isAdvancedShippingConfigured } from '@/lib/advanced-shipping/client'

/**
 * GET /api/shopify/validate-setup
 * Validates your Shopify shipping setup and tells you exactly what to fix.
 */
export async function GET(req: NextRequest) {
  const issues: string[] = []
  const fixes: string[] = []
  const warnings: string[] = []

  if (!isShopifyConfigured()) {
    return Response.json({
      ok: false,
      error: 'Shopify not configured',
      fix: 'Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local',
    })
  }

  // 1. Check if we can query products and get weights
  try {
    const productsQuery = `
      query getProducts {
        products(first: 10) {
          edges {
            node {
              id
              title
              variants(first: 5) {
                edges {
                  node {
                    id
                    title
                    weight
                    weightUnit
                  }
                }
              }
            }
          }
        }
      }
    `
    const productsData = await shopifyFetch<{
      products: {
        edges: Array<{
          node: {
            id: string
            title: string
            variants: {
              edges: Array<{
                node: {
                  id: string
                  title: string
                  weight: number | null
                  weightUnit: string | null
                }
              }>
            }
          }
        }>
      }
    }>({
      query: productsQuery,
      cache: 'no-store',
    })

    const products = productsData.products.edges
    const variantsWithoutWeight: Array<{ product: string; variant: string }> = []

    products.forEach(({ node: product }) => {
      product.variants.edges.forEach(({ node: variant }) => {
        if (!variant.weight || variant.weight <= 0) {
          variantsWithoutWeight.push({
            product: product.title,
            variant: variant.title || 'Default',
          })
        }
      })
    })

    if (variantsWithoutWeight.length > 0) {
      issues.push(`${variantsWithoutWeight.length} product variant(s) missing weight`)
      fixes.push(
        `Go to Shopify Admin → Products → For each product listed below, click → Variants → Set Weight (and unit) for each variant:\n${variantsWithoutWeight
          .slice(0, 10)
          .map((v) => `  - ${v.product} (${v.variant})`)
          .join('\n')}${variantsWithoutWeight.length > 10 ? `\n  ... and ${variantsWithoutWeight.length - 10} more` : ''}`
      )
    } else if (products.length > 0) {
      warnings.push('✓ All sampled products have weight set')
    }
  } catch (e) {
    issues.push('Cannot query products - check Storefront API token permissions')
    fixes.push('Verify SHOPIFY_STOREFRONT_ACCESS_TOKEN has read_products scope')
  }

  // 2. Test shipping zone matching with a sample address
  try {
    const testAddress = {
      address1: '123 Test Street',
      city: 'Petaling Jaya',
      province: 'Selangor',
      countryCode: 'MY',
      zip: '46000',
      firstName: 'Test',
      lastName: 'User',
    }

    // Create a test cart
    const createCartQuery = `
      mutation createTestCart {
        cartCreate {
          cart { id }
          userErrors { message }
        }
      }
    `
    const cartData = await shopifyFetch<{
      cartCreate: { cart: { id: string } | null; userErrors: Array<{ message: string }> }
    }>({
      query: createCartQuery,
      cache: 'no-store',
    })

    if (!cartData.cartCreate.cart) {
      issues.push('Cannot create test cart')
      fixes.push('Check Storefront API token has cart creation permissions')
    } else {
      const cartId = cartData.cartCreate.cart.id

      // Try to set delivery address
      const deliveryQuery = `
        mutation testDelivery($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
          cartDeliveryAddressesReplace(cartId: $cartId, addresses: $addresses) {
            userErrors { message code }
            warnings { message }
            cart {
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

      const deliveryData = await shopifyFetch<{
        cartDeliveryAddressesReplace: {
          userErrors: Array<{ message: string }>
          warnings?: Array<{ message: string }>
          cart: {
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
        query: deliveryQuery,
        variables: {
          cartId,
          addresses: [
            {
              selected: true,
              oneTimeUse: true,
              validationStrategy: 'COUNTRY_CODE_ONLY',
              address: {
                deliveryAddress: {
                  address1: testAddress.address1,
                  city: testAddress.city,
                  provinceCode: testAddress.province,
                  countryCode: testAddress.countryCode,
                  zip: testAddress.zip,
                  firstName: testAddress.firstName,
                  lastName: testAddress.lastName,
                },
              },
            },
          ],
        },
        cache: 'no-store',
      })

      const payload = deliveryData.cartDeliveryAddressesReplace

      if (payload.userErrors?.length) {
        issues.push(`Shopify returned errors: ${payload.userErrors.map((e) => e.message).join('; ')}`)
      }

      const groups = payload.cart?.deliveryGroups?.nodes ?? []
      if (groups.length === 0) {
        issues.push(`No shipping zone found for ${testAddress.province}, Malaysia`)
        fixes.push(
          `Go to Shopify Admin → Settings → Shipping and delivery → Add or edit a zone → Add "${testAddress.province}" (or "Malaysia" to cover all states) → Add a rate (e.g. Advanced Shipping Rules)`
        )
      } else {
        const firstGroup = groups[0]
        const optionsCount = firstGroup?.deliveryOptions?.length ?? 0

        if (optionsCount === 0) {
          issues.push(`Shipping zone found for ${testAddress.province} but has 0 rates`)
          fixes.push(
            `Go to Shopify Admin → Settings → Shipping and delivery → Find the zone that includes "${testAddress.province}" → Click "Add rate" → Choose "Use carrier or app" → Select "Advanced Shipping Rules" (or add a manual rate)`
          )
        } else {
          warnings.push(`✓ Shipping zone for ${testAddress.province} has ${optionsCount} rate(s)`)
          const recognized = firstGroup.deliveryAddress
          if (recognized) {
            warnings.push(
              `  Shopify recognized: ${recognized.province || recognized.provinceCode || 'unknown'} (country: ${recognized.countryCodeV2})`
            )
          }
        }
      }

      if (payload.warnings?.length) {
        warnings.push(`Shopify warnings: ${payload.warnings.map((w) => w.message).join('; ')}`)
      }
    }
  } catch (e) {
    issues.push(`Cannot test shipping zones: ${e instanceof Error ? e.message : String(e)}`)
    fixes.push('Check server logs for [Shopify] GraphQL errors')
  }

  // 3. Check Advanced Shipping API config
  if (isAdvancedShippingConfigured()) {
    warnings.push('✓ Advanced Shipping API is configured (fallback will work if Shopify returns no rates)')
  } else {
    warnings.push(
      '⚠ Advanced Shipping API not configured - set ADVANCED_SHIPPING_APP_ID and ADVANCED_SHIPPING_API_KEY in .env.local for direct API fallback'
    )
  }

  return Response.json({
    ok: issues.length === 0,
    issues,
    fixes,
    warnings,
    summary:
      issues.length === 0
        ? '✓ Setup looks good! Shipping should work.'
        : `Found ${issues.length} issue(s) that need fixing. See "fixes" array for exact steps.`,
  })
}
