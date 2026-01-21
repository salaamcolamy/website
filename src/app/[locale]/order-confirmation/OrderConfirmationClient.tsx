'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import confetti from 'canvas-confetti'
import {
  CheckCircle2,
  Package,
  Truck,
  Mail,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react'

interface OrderData {
  id: string
  items: Array<{
    id: string
    title: string
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
  selectedBank: string | null
  createdAt: string
  status: string
}

export function OrderConfirmationClient() {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Load order from localStorage
    const storedOrder = localStorage.getItem('salaamcola-last-order')
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder))

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c21316', '#ffffff', '#ffd700'],
      })
    }
  }, [])

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No order found</h1>
            <p className="text-gray-600 mb-8">
              We couldn't find your order details. Please check your email for confirmation.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </motion.div>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-gray-900">{order.id}</p>
              </div>
              <button
                onClick={copyOrderId}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Order Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div
                className="absolute left-6 top-0 w-0.5 bg-salaam-red-500 transition-all duration-500"
                style={{ height: '25%' }}
              />

              {/* Timeline Steps */}
              <div className="space-y-8">
                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 bg-salaam-red-500 rounded-full flex items-center justify-center z-10">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-semibold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString('en-MY', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center z-10">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-semibold text-gray-400">Preparing Order</p>
                    <p className="text-sm text-gray-400">Estimated: 1-2 business days</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center z-10">
                    <Truck className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-semibold text-gray-400">Out for Delivery</p>
                    <p className="text-sm text-gray-400">Estimated: 3-5 business days</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center z-10">
                    <CheckCircle2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="font-semibold text-gray-400">Delivered</p>
                    <p className="text-sm text-gray-400">We'll notify you when delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-salaam-red-500" />
                <h3 className="font-bold text-gray-900">Shipping Address</h3>
              </div>
              <p className="text-gray-600">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
                <br />
                {order.customerInfo.address}
                {order.customerInfo.apartment && <>, {order.customerInfo.apartment}</>}
                <br />
                {order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.postcode}
                <br />
                {order.customerInfo.country}
              </p>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-salaam-red-500" />
                <h3 className="font-bold text-gray-900">Payment Method</h3>
              </div>
              <p className="text-gray-600">
                {order.paymentMethod === 'card' ? (
                  <>Credit/Debit Card<br />**** **** **** 4242</>
                ) : (
                  <>FPX Online Banking<br />{order.selectedBank}</>
                )}
              </p>
            </motion.div>
          </div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    RM{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>RM{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>RM{order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Email Notification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-salaam-red-50 border border-salaam-red-100 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-salaam-red-500" />
              <div>
                <p className="font-medium text-gray-900">Confirmation email sent</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to {order.customerInfo.email}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`/order-status?orderId=${order.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
            >
              Track Order
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
