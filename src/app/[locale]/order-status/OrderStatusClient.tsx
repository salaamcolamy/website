'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useRouter } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Search,
  ArrowRight,
  RefreshCw,
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

type OrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'out_for_delivery' | 'delivered'

const statusSteps: {
  key: OrderStatus
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been placed successfully',
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    key: 'preparing',
    label: 'Preparing Order',
    description: 'We are preparing your items for shipment',
    icon: <Package className="w-6 h-6" />,
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'Your order is on its way to the delivery hub',
    icon: <Truck className="w-6 h-6" />,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Your order is out for delivery',
    icon: <Truck className="w-6 h-6" />,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered',
    icon: <Home className="w-6 h-6" />,
  },
]

export function OrderStatusClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [searchOrderId, setSearchOrderId] = useState('')
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('confirmed')
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    if (orderId) {
      // Load order from localStorage
      const storedOrder = localStorage.getItem('salaamcola-last-order')
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder)
        if (parsed.id === orderId) {
          setOrder(parsed)
        }
      }
    }
  }, [orderId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchOrderId) {
      window.location.href = `/order-status?orderId=${searchOrderId}`
    }
  }

  // Simulate order progress
  const simulateProgress = async () => {
    setIsSimulating(true)
    const statuses: OrderStatus[] = ['preparing', 'shipped', 'out_for_delivery', 'delivered']

    for (const status of statuses) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setCurrentStatus(status)
    }
    setIsSimulating(false)
  }

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === currentStatus)

  // Show search form if no order
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 bg-salaam-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-salaam-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
              <p className="text-gray-600">Enter your order number to see the delivery status</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                  placeholder="e.g., SC12345678"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-salaam-red-500 text-white rounded-xl font-semibold hover:bg-salaam-red-600 transition-colors"
                >
                  Track
                </button>
              </div>
            </motion.form>

            {orderId && !order && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center"
              >
                <p className="text-yellow-800">
                  Order <strong>{orderId}</strong> not found. Please check the order number.
                </p>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <Link href="/shop" className="text-salaam-red-500 font-medium hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Status</h1>
            <p className="text-gray-600">
              Order <span className="font-semibold">{order.id}</span>
            </p>
          </motion.div>

          {/* Simulate Progress Button (Demo) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Demo Mode</p>
                <p className="text-sm text-blue-700">
                  Click to simulate order progress through all stages
                </p>
              </div>
              <button
                onClick={simulateProgress}
                disabled={isSimulating || currentStatus === 'delivered'}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    Simulating...
                  </>
                ) : currentStatus === 'delivered' ? (
                  'Delivered!'
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Simulate Progress
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Main Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            {/* Current Status Banner */}
            <div
              className={`p-4 rounded-xl mb-6 ${
                currentStatus === 'delivered'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-salaam-red-50 border border-salaam-red-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStatus === 'delivered'
                      ? 'bg-green-500 text-white'
                      : 'bg-salaam-red-500 text-white'
                  }`}
                >
                  {statusSteps[currentStatusIndex].icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {statusSteps[currentStatusIndex].label}
                  </p>
                  <p className="text-sm text-gray-600">
                    {statusSteps[currentStatusIndex].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full">
                <motion.div
                  className="h-full bg-salaam-red-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Status Steps */}
              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => (
                  <div key={step.key} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: index <= currentStatusIndex ? 1 : 0.8,
                        backgroundColor:
                          index <= currentStatusIndex
                            ? index === currentStatusIndex
                              ? '#c21316'
                              : '#22c55e'
                            : '#e5e7eb',
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        index <= currentStatusIndex ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {index < currentStatusIndex ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        step.icon
                      )}
                    </motion.div>
                    <p
                      className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                        index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Delivery */}
            {currentStatus !== 'delivered' && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-salaam-red-500" />
                <div>
                  <p className="font-medium text-gray-900">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">
                    {new Date(
                      new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('en-MY', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
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
                <h3 className="font-bold text-gray-900">Delivery Address</h3>
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

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-salaam-red-500" />
                <h3 className="font-bold text-gray-900">Contact Information</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.customerInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{order.customerInfo.email}</span>
                </div>
              </div>
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

            <div className="border-t border-gray-100 mt-6 pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>RM{order.total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Contact Support
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
