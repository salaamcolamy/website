/**
 * Shopify Admin API Client
 * 
 * Used for operations that require admin access, such as:
 * - Creating/updating customers with email marketing consent
 * - Managing customer subscriptions
 * 
 * Note: Admin API requires different credentials than Storefront API
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN || ''
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''

const endpoint = `https://${domain}/admin/api/2024-10/graphql.json`

type ShopifyAdminResponse<T> = {
  data: T
  errors?: Array<{ message: string; extensions?: { code?: string } }>
}

export async function shopifyAdminFetch<T>({
  query,
  variables = {},
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  if (!domain || !adminAccessToken) {
    throw new Error('Shopify Admin API not configured. Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN')
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    })

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shopify Admin API HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized: Invalid Shopify Admin API token')
      }
      
      throw new Error(`Shopify Admin API error: ${response.status} ${response.statusText}`)
    }

    const body: ShopifyAdminResponse<T> = await response.json()

    if (body.errors) {
      const errorMessage = body.errors[0]?.message || 'Shopify Admin API error'
      const errorCode = body.errors[0]?.extensions?.code
      console.error('Shopify Admin API GraphQL error:', {
        message: errorMessage,
        code: errorCode,
        errors: body.errors,
      })
      throw new Error(errorCode ? `${errorCode}: ${errorMessage}` : errorMessage)
    }

    return body.data
  } catch (error) {
    console.error('Shopify Admin API error:', error)
    // Re-throw to let the caller handle it
    throw error
  }
}

// Helper to check if Admin API is configured
export function isAdminApiConfigured(): boolean {
  return Boolean(domain && adminAccessToken)
}

// Alias for backward compatibility
export const isShopifyAdminConfigured = isAdminApiConfigured

// Types for order creation
export interface ShopifyLineItem {
  variantId: string
  quantity: number
  title?: string
  price?: string
}

export interface ShopifyAddress {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  province: string
  zip: string
  country: string
  phone?: string
}

export interface CreateOrderInput {
  email: string
  lineItems: ShopifyLineItem[]
  billingAddress: ShopifyAddress
  shippingAddress: ShopifyAddress
  financialStatus?: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'PARTIALLY_PAID' | 'REFUNDED' | 'VOIDED'
  note?: string
  tags?: string[]
  customAttributes?: Array<{ key: string; value: string }>
}

export interface ShopifyOrder {
  id: string
  name: string
  email: string
  createdAt: string
  displayFinancialStatus: string
  displayFulfillmentStatus: string
  totalPriceSet: {
    shopMoney: {
      amount: string
      currencyCode: string
    }
  }
  customer?: {
    id: string
    email: string
  }
}

/**
 * Create a draft order in Shopify
 */
export async function createDraftOrder(input: CreateOrderInput): Promise<ShopifyOrder> {
  const mutation = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          name
          email
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const variables = {
    input: {
      email: input.email,
      lineItems: input.lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      billingAddress: input.billingAddress,
      shippingAddress: input.shippingAddress,
      note: input.note,
      tags: input.tags,
      customAttributes: input.customAttributes,
    },
  }

  const result = await shopifyAdminFetch<{
    draftOrderCreate: {
      draftOrder: ShopifyOrder
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>({ query: mutation, variables })

  if (result.draftOrderCreate.userErrors?.length > 0) {
    throw new Error(result.draftOrderCreate.userErrors[0].message)
  }

  return result.draftOrderCreate.draftOrder
}

/**
 * Complete a draft order (convert to actual order)
 */
export async function completeDraftOrder(draftOrderId: string): Promise<ShopifyOrder> {
  const mutation = `
    mutation draftOrderComplete($id: ID!) {
      draftOrderComplete(id: $id) {
        draftOrder {
          id
          order {
            id
            name
            email
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              id
              email
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const result = await shopifyAdminFetch<{
    draftOrderComplete: {
      draftOrder: { order: ShopifyOrder }
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>({ query: mutation, variables: { id: draftOrderId } })

  if (result.draftOrderComplete.userErrors?.length > 0) {
    throw new Error(result.draftOrderComplete.userErrors[0].message)
  }

  return result.draftOrderComplete.draftOrder.order
}

/**
 * Mark order as paid
 */
export async function markOrderAsPaid(orderId: string, amount: string): Promise<void> {
  const mutation = `
    mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
      orderMarkAsPaid(input: $input) {
        order {
          id
          displayFinancialStatus
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const result = await shopifyAdminFetch<{
    orderMarkAsPaid: {
      order: { id: string; displayFinancialStatus: string }
      userErrors: Array<{ field: string[]; message: string }>
    }
  }>({ query: mutation, variables: { input: { id: orderId } } })

  if (result.orderMarkAsPaid.userErrors?.length > 0) {
    throw new Error(result.orderMarkAsPaid.userErrors[0].message)
  }
}

/**
 * Get order by ID
 */
export async function getShopifyOrder(orderId: string): Promise<ShopifyOrder | null> {
  const query = `
    query getOrder($id: ID!) {
      order(id: $id) {
        id
        name
        email
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          email
        }
      }
    }
  `

  try {
    const result = await shopifyAdminFetch<{ order: ShopifyOrder | null }>({
      query,
      variables: { id: orderId },
    })
    return result.order
  } catch (error) {
    return null
  }
}
