import { shopifyFetch, isShopifyConfigured } from '../client'
import { getShopifyPromoDiscountCodes } from '../promoDiscountCodes'
import type { ShopifyCart, Cart, CartItem } from '../types'

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    discountCodes {
      code
      applicable
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

function transformCart(shopifyCart: ShopifyCart): Cart {
  const items: CartItem[] = shopifyCart.lines.edges.map((edge): CartItem => {
    const qty = Number(edge.node.quantity) || 0
    const unitPrice = parseFloat(edge.node.merchandise.price.amount)
    const lineTotal = parseFloat(edge.node.cost.totalAmount.amount)
    return {
      id: edge.node.id,
      variantId: edge.node.merchandise.id,
      productId: edge.node.merchandise.product.id,
      productHandle: edge.node.merchandise.product.handle,
      title: edge.node.merchandise.product.title,
      variantTitle: edge.node.merchandise.title,
      quantity: qty,
      price: unitPrice,
      lineTotal,
      currencyCode: edge.node.merchandise.price.currencyCode,
      image: edge.node.merchandise.product.featuredImage,
    }
  })
  const totalQuantityFromLines = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = parseFloat(shopifyCart.cost.subtotalAmount.amount)
  const totalAmount = parseFloat(shopifyCart.cost.totalAmount.amount)
  const discountFromAllocations = (shopifyCart.discountAllocations ?? []).reduce(
    (sum, d) => sum + parseFloat(d.discountedAmount.amount),
    0,
  )
  // Some Shopify carts report discounted line totals while discountAllocations can be empty.
  // Derive fallback discount from Shopify subtotal vs line totals to avoid double counting when
  // product prices are already discounted.
  const discountedSubtotalFromLines = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const derivedDiscountFromLines = Math.max(0, subtotal - discountedSubtotalFromLines)
  const discountTotal =
    discountFromAllocations > 0
      ? discountFromAllocations
      : (derivedDiscountFromLines > 0.005 ? derivedDiscountFromLines : 0)
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    totalQuantity: totalQuantityFromLines > 0 ? totalQuantityFromLines : (shopifyCart.totalQuantity ?? 0),
    appliedDiscountCodes: (shopifyCart.discountCodes ?? [])
      .filter((entry) => entry.applicable)
      .map((entry) => entry.code),
    subtotal,
    // Keep Shopify total so cart can reflect shipping once address is attached.
    total: totalAmount,
    discountTotal,
    currencyCode: shopifyCart.cost.totalAmount.currencyCode,
    items,
  }
}

/** Re-applies configured promo discount codes so cart totals match Shopify checkout. */
async function applyPromoDiscountCodesIfConfigured(shopifyCart: ShopifyCart): Promise<ShopifyCart> {
  const configuredCodes = getShopifyPromoDiscountCodes()
  const existingCodes = (shopifyCart.discountCodes ?? [])
    .map((entry) => entry.code?.trim())
    .filter(Boolean) as string[]
  const codes = Array.from(
    new Set(
      [...existingCodes, ...configuredCodes]
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
    ),
  )
  if (codes.length === 0) {
    return shopifyCart
  }

  const query = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartDiscountCodesUpdate: {
      cart: ShopifyCart | null
      userErrors: Array<{ field?: string[]; message: string }>
    }
  }>({
    query,
    variables: { cartId: shopifyCart.id, discountCodes: codes },
    cache: 'no-store',
  })

  const payload = data.cartDiscountCodesUpdate
  if (payload.userErrors?.length) {
    console.warn('[Cart] cartDiscountCodesUpdate userErrors:', payload.userErrors)
  }
  return payload.cart ?? shopifyCart
}

export async function finalizeShopifyCart(shopifyCart: ShopifyCart): Promise<Cart> {
  const withCodes = await applyPromoDiscountCodesIfConfigured(shopifyCart)
  return transformCart(withCodes)
}

export async function updateCartDiscountCodes(
  cartId: string,
  discountCodes: string[],
): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured')
  }

  // Allow stacking with configured promo codes, but prevent duplicate codes.
  const normalizedCodes = Array.from(
    new Set(
      [...getShopifyPromoDiscountCodes(), ...discountCodes]
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
    ),
  )

  const query = `
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartDiscountCodesUpdate: {
      cart: ShopifyCart | null
      userErrors: Array<{ field?: string[]; message: string }>
    }
  }>({
    query,
    variables: { cartId, discountCodes: normalizedCodes },
    cache: 'no-store',
  })

  const payload = data.cartDiscountCodesUpdate
  if (payload.userErrors?.length) {
    const msg = payload.userErrors.map((e) => e.message).join('; ')
    throw new Error(`Shopify discount update failed: ${msg}`)
  }

  if (!payload.cart) {
    throw new Error('Shopify discount update returned no cart')
  }

  return transformCart(payload.cart)
}

export async function createCart(): Promise<Cart> {
  // Always attempt to create cart via API - let shopifyFetch handle configuration errors
  // This allows the function to work from both client and server components
  const query = `
    mutation createCart {
      cartCreate {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  try {
    const data = await shopifyFetch<{
      cartCreate: { 
        cart: ShopifyCart | null
        userErrors: Array<{ field: string[]; message: string }>
      }
    }>({
      query,
      cache: 'no-store',
    })

    // Check for user errors from Shopify
    if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
      const errorMessages = data.cartCreate.userErrors.map(e => e.message).join('; ')
      const error = new Error(`Shopify cart creation failed: ${errorMessages}`)
      console.error('[Cart] createCart user errors:', data.cartCreate.userErrors)
      throw error
    }

    if (!data.cartCreate.cart) {
      const error = new Error('Shopify cart creation returned null. Please check Shopify configuration (SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN).')
      console.error('[Cart] createCart returned null cart')
      throw error
    }

    const transformedCart = await finalizeShopifyCart(data.cartCreate.cart)

    // Validate the cart ID format
    if (!transformedCart.id || !transformedCart.id.startsWith('gid://shopify/Cart')) {
      const error = new Error(`Invalid cart ID format: ${transformedCart.id}. Expected gid://shopify/Cart format. Please check Shopify configuration.`)
      console.error('[Cart] Invalid cart ID:', transformedCart.id)
      throw error
    }

    console.log('[Cart] Successfully created Shopify cart:', transformedCart.id)
    return transformedCart
  } catch (error) {
    console.error('[Cart] createCart API error:', error)
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      // Enhance error message if it's a configuration issue
      if (error.message.includes('Shopify') || error.message.includes('fetch')) {
        throw new Error(`${error.message} Please verify SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN are set correctly.`)
      }
      throw error
    }
    throw new Error(`Failed to create Shopify cart: ${String(error)}. Please check Shopify configuration.`)
  }
}

/**
 * Sets cart buyer country so market-specific automatic discounts (e.g. PAYDAY10) can evaluate on the Storefront cart.
 */
export async function updateCartBuyerIdentity(
  cartId: string,
  countryCode: string,
): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured')
  }

  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: ShopifyCart | null
      userErrors: Array<{ field?: string[]; message: string }>
    }
  }>({
    query,
    variables: { cartId, buyerIdentity: { countryCode } },
    cache: 'no-store',
  })

  const payload = data.cartBuyerIdentityUpdate
  if (payload.userErrors?.length) {
    console.warn('[Cart] cartBuyerIdentityUpdate userErrors:', payload.userErrors)
  }
  const raw = payload.cart
  if (!raw) {
    throw new Error('cartBuyerIdentityUpdate returned no cart')
  }
  return await finalizeShopifyCart(raw)
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!isShopifyConfigured()) {
    return null
  }

  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartFragment
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
    cache: 'no-store',
  })

  return data.cart ? await finalizeShopifyCart(data.cart) : null
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured')
  }

  const query = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart | null
      userErrors: Array<{ field?: string[]; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: 'no-store',
  })

  if (data.cartLinesAdd.userErrors?.length) {
    const msg = data.cartLinesAdd.userErrors.map((e) => e.message).join('; ')
    throw new Error(`Shopify add-to-cart failed: ${msg}`)
  }
  if (!data.cartLinesAdd.cart) {
    throw new Error('Shopify add-to-cart returned no cart')
  }
  return await finalizeShopifyCart(data.cartLinesAdd.cart)
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured')
  }

  const query = `
    mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart | null
      userErrors: Array<{ field?: string[]; message: string }>
    }
  }>({
    query,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: 'no-store',
  })

  if (data.cartLinesUpdate.userErrors?.length) {
    const msg = data.cartLinesUpdate.userErrors.map((e) => e.message).join('; ')
    throw new Error(`Shopify update-cart-line failed: ${msg}`)
  }
  if (!data.cartLinesUpdate.cart) {
    throw new Error('Shopify update-cart-line returned no cart')
  }
  return await finalizeShopifyCart(data.cartLinesUpdate.cart)
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify not configured')
  }

  const query = `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFragment
        }
        userErrors {
          field
          message
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart | null
      userErrors: Array<{ field?: string[]; message: string }>
    }
  }>({
    query,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })

  if (data.cartLinesRemove.userErrors?.length) {
    const msg = data.cartLinesRemove.userErrors.map((e) => e.message).join('; ')
    throw new Error(`Shopify remove-from-cart failed: ${msg}`)
  }
  if (!data.cartLinesRemove.cart) {
    throw new Error('Shopify remove-from-cart returned no cart')
  }
  return await finalizeShopifyCart(data.cartLinesRemove.cart)
}
