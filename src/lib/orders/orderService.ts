/**
 * Order Service
 * Handles order creation, storage, and management
 */

import {
  createDraftOrder,
  completeDraftOrder,
  markOrderAsPaid,
  isShopifyAdminConfigured,
  type CreateOrderInput,
  type ShopifyOrder,
} from '@/lib/shopify/admin-client'
import type { Cart } from '@/lib/shopify/types'

export interface OrderData {
  id: string
  shopifyDraftOrderId?: string
  shopifyOrderId?: string
  shopifyOrderNumber?: string
  billplzBillId?: string
  items: Array<{
    id: string
    variantId: string
    title: string
    variantTitle: string
    quantity: number
    price: number
    image?: { url: string; altText?: string }
  }>
  subtotal: number
  shipping: number
  total: number
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    phone: string
    address: string
    apartment: string
    city: string
    state: string
    postcode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
  paidAt?: string
  status: 'pending' | 'processing' | 'confirmed' | 'failed'
}

const ORDER_STORAGE_KEY = 'salaamcola-orders'

export function generateOrderId(): string {
  return `SC${Date.now().toString().slice(-8)}`
}

export function saveOrder(order: OrderData): void {
  try {
    localStorage.setItem(`salaamcola-order-${order.id}`, JSON.stringify(order))
    const orderList = getOrderList()
    if (!orderList.includes(order.id)) {
      orderList.unshift(order.id)
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderList))
    }
    localStorage.setItem('salaamcola-last-order', JSON.stringify(order))
  } catch (error) {
    // Silent fail for localStorage errors
  }
}

export function getOrder(orderId: string): OrderData | null {
  try {
    const stored = localStorage.getItem(`salaamcola-order-${orderId}`)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    return null
  }
}

export function updateOrder(orderId: string, updates: Partial<OrderData>): void {
  const order = getOrder(orderId)
  if (order) {
    const updated = { ...order, ...updates }
    saveOrder(updated)
  }
}

export function getOrderList(): string[] {
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

export function createOrderFromCart(
  orderId: string,
  cart: Cart,
  customerInfo: OrderData['customerInfo']
): OrderData {
  return {
    id: orderId,
    items: cart.items.map(item => ({
      id: item.id,
      variantId: item.variantId,
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    })),
    subtotal: cart.subtotal,
    shipping: 0,
    total: cart.total,
    customerInfo,
    paymentMethod: 'billplz',
    paymentStatus: 'pending',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
}

export async function createShopifyOrderFromOrderData(
  orderData: OrderData
): Promise<{ draftOrder: ShopifyOrder; order: ShopifyOrder }> {
  if (!isShopifyAdminConfigured()) {
    throw new Error('Shopify Admin API not configured')
  }

  const orderInput: CreateOrderInput = {
    email: orderData.customerInfo.email,
    lineItems: orderData.items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    })),
    billingAddress: {
      firstName: orderData.customerInfo.firstName,
      lastName: orderData.customerInfo.lastName,
      address1: orderData.customerInfo.address,
      address2: orderData.customerInfo.apartment || '',
      city: orderData.customerInfo.city,
      province: orderData.customerInfo.state,
      zip: orderData.customerInfo.postcode,
      country: orderData.customerInfo.country,
      phone: orderData.customerInfo.phone,
    },
    shippingAddress: {
      firstName: orderData.customerInfo.firstName,
      lastName: orderData.customerInfo.lastName,
      address1: orderData.customerInfo.address,
      address2: orderData.customerInfo.apartment || '',
      city: orderData.customerInfo.city,
      province: orderData.customerInfo.state,
      zip: orderData.customerInfo.postcode,
      country: orderData.customerInfo.country,
      phone: orderData.customerInfo.phone,
    },
    note: `Order ID: ${orderData.id}\nBillplz Bill ID: ${orderData.billplzBillId || 'N/A'}`,
    tags: ['billplz', 'online-order'],
    customAttributes: [
      { key: 'internal_order_id', value: orderData.id },
      { key: 'payment_gateway', value: 'Billplz' },
      ...(orderData.billplzBillId ? [{ key: 'billplz_bill_id', value: orderData.billplzBillId }] : []),
    ],
  }

  const draftOrder = await createDraftOrder(orderInput)
  updateOrder(orderData.id, { shopifyDraftOrderId: draftOrder.id })

  const order = await completeDraftOrder(draftOrder.id)
  updateOrder(orderData.id, { shopifyOrderId: order.id, shopifyOrderNumber: order.name })

  return { draftOrder, order }
}

export async function markOrderPaid(orderId: string, billplzBillId: string): Promise<void> {
  const orderData = getOrder(orderId)
  if (!orderData) throw new Error(`Order ${orderId} not found`)

  if (!orderData.billplzBillId) {
    updateOrder(orderId, { billplzBillId })
  }

  if (!orderData.shopifyOrderId) {
    const { order } = await createShopifyOrderFromOrderData(orderData)
    if (order.id) await markOrderAsPaid(order.id, orderData.total.toString())
  } else {
    await markOrderAsPaid(orderData.shopifyOrderId, orderData.total.toString())
  }

  updateOrder(orderId, {
    paymentStatus: 'paid',
    status: 'confirmed',
    paidAt: new Date().toISOString(),
  })
}

export function markOrderFailed(orderId: string): void {
  updateOrder(orderId, { paymentStatus: 'failed', status: 'failed' })
}

export function getLastOrder(): OrderData | null {
  try {
    const stored = localStorage.getItem('salaamcola-last-order')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    return null
  }
}
