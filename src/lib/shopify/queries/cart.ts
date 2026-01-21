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
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    totalQuantity: shopifyCart.totalQuantity,
    subtotal: parseFloat(shopifyCart.cost.subtotalAmount.amount),
    total: parseFloat(shopifyCart.cost.totalAmount.amount),
    currencyCode: shopifyCart.cost.totalAmount.currencyCode,
    items: shopifyCart.lines.edges.map((edge): CartItem => ({
      id: edge.node.id,
      variantId: edge.node.merchandise.id,
      productId: edge.node.merchandise.product.id,
      productHandle: edge.node.merchandise.product.handle,
      title: edge.node.merchandise.product.title,
      variantTitle: edge.node.merchandise.title,
      quantity: edge.node.quantity,
      price: parseFloat(edge.node.merchandise.price.amount),
      currencyCode: edge.node.merchandise.price.currencyCode,
      image: edge.node.merchandise.product.featuredImage,
    })),
  }
}

export async function createCart(): Promise<Cart> {
  if (!isShopifyConfigured()) {
    return {
      id: 'mock-cart',
      checkoutUrl: '#',
      totalQuantity: 0,
      subtotal: 0,
      total: 0,
      currencyCode: 'MYR',
      items: [],
    }
  }

  const query = `
    mutation createCart {
      cartCreate {
        cart {
          ...CartFragment
        }
      }
    }
    ${CART_FRAGMENT}
  `

  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart }
  }>({
    query,
    cache: 'no-store',
  })

  return transformCart(data.cartCreate.cart)
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
