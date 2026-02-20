import { shopifyFetch, isShopifyConfigured } from '../client'
import type { ShopifyCart, Cart, CartItem } from '../types'

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
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
    return {
      id: edge.node.id,
      variantId: edge.node.merchandise.id,
      productId: edge.node.merchandise.product.id,
      productHandle: edge.node.merchandise.product.handle,
      title: edge.node.merchandise.product.title,
      variantTitle: edge.node.merchandise.title,
      quantity: qty,
      price: parseFloat(edge.node.merchandise.price.amount),
      currencyCode: edge.node.merchandise.price.currencyCode,
      image: edge.node.merchandise.product.featuredImage,
    }
  })
  const totalQuantityFromLines = items.reduce((sum, item) => sum + item.quantity, 0)
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    totalQuantity: totalQuantityFromLines > 0 ? totalQuantityFromLines : (shopifyCart.totalQuantity ?? 0),
    subtotal: parseFloat(shopifyCart.cost.subtotalAmount.amount),
    total: parseFloat(shopifyCart.cost.totalAmount.amount),
    currencyCode: shopifyCart.cost.totalAmount.currencyCode,
    items,
  }
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

    const transformedCart = transformCart(data.cartCreate.cart)
    
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

  return data.cart ? transformCart(data.cart) : null
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
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart }
  }>({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
    cache: 'no-store',
  })

  return transformCart(data.cartLinesAdd.cart)
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
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart }
  }>({
    query,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
    cache: 'no-store',
  })

  return transformCart(data.cartLinesUpdate.cart)
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
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart }
  }>({
    query,
    variables: { cartId, lineIds },
    cache: 'no-store',
  })

  return transformCart(data.cartLinesRemove.cart)
}
