'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { Link, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import {
  CreditCard,
  Building2,
  ChevronRight,
  ChevronLeft,
  Lock,
  ShoppingBag,
  Check,
  User,
  MapPin,
  Truck,
} from 'lucide-react'

type Step = 'information' | 'shipping' | 'payment'
type PaymentMethod = 'card' | 'fpx'

interface CustomerInfo {
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

interface CardInfo {
  number: string
  name: string
  expiry: string
  cvv: string
}

// Demo prefilled data
const demoCustomerInfo: CustomerInfo = {
  email: 'ahmad@example.com',
  firstName: 'Ahmad',
  lastName: 'Ibrahim',
  phone: '+60123456789',
  address: '123 Jalan Bukit Bintang',
  apartment: 'Unit 15-3',
  city: 'Kuala Lumpur',
  state: 'Wilayah Persekutuan',
  postcode: '50200',
  country: 'Malaysia',
}

const demoCardInfo: CardInfo = {
  number: '4242 4242 4242 4242',
  name: 'AHMAD IBRAHIM',
  expiry: '12/28',
  cvv: '123',
}

// Malaysian banks for FPX
const fpxBanks = [
  { id: 'maybank', name: 'Maybank2u', logo: '/images/banks/maybank.png' },
  { id: 'cimb', name: 'CIMB Clicks', logo: '/images/banks/cimb.png' },
  { id: 'publicbank', name: 'PBe', logo: '/images/banks/publicbank.png' },
  { id: 'rhb', name: 'RHB Now', logo: '/images/banks/rhb.png' },
  { id: 'hongLeong', name: 'Hong Leong Connect', logo: '/images/banks/hongleong.png' },
  { id: 'ambank', name: 'AmOnline', logo: '/images/banks/ambank.png' },
  { id: 'bankIslam', name: 'Bank Islam', logo: '/images/banks/bankislam.png' },
  { id: 'bsn', name: 'myBSN', logo: '/images/banks/bsn.png' },
]

export function CheckoutPageClient() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<Step>('information')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [useDemoData, setUseDemoData] = useState(false)

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    country: 'Malaysia',
  })

  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })

  const fillDemoData = () => {
    setCustomerInfo(demoCustomerInfo)
    setCardInfo(demoCardInfo)
    setUseDemoData(true)
  }

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'information', label: 'Information', icon: <User className="w-4 h-4" /> },
    { key: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const handleNextStep = () => {
    if (currentStep === 'information') setCurrentStep('shipping')
    else if (currentStep === 'shipping') setCurrentStep('payment')
  }

  const handlePrevStep = () => {
    if (currentStep === 'payment') setCurrentStep('shipping')
    else if (currentStep === 'shipping') setCurrentStep('information')
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order ID
    const orderId = `SC${Date.now().toString().slice(-8)}`

    // Store order in localStorage for the confirmation page
    const orderData = {
      id: orderId,
      items: cart?.items || [],
      subtotal: cart?.subtotal || 0,
      shipping: 0,
      total: cart?.total || 0,
      customerInfo,
      paymentMethod,
      selectedBank: paymentMethod === 'fpx' ? selectedBank : null,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    }

    localStorage.setItem('salaamcola-last-order', JSON.stringify(orderData))

    // Clear cart
    clearCart()

    // Redirect to confirmation page
    router.push(`/order-confirmation?orderId=${orderId}`)
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart before checkout.</p>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order securely</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      index <= currentStepIndex
                        ? 'bg-salaam-red-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.icon
                    )}
                    <span className="hidden sm:inline font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Demo Data Button */}
              {!useDemoData && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">Demo Mode</p>
                      <p className="text-sm text-blue-700">Fill in sample data to test checkout</p>
                    </div>
                    <button
                      onClick={fillDemoData}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Use Demo Data
                    </button>
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Information Step */}
                {currentStep === 'information' && (
                  <motion.div
                    key="information"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-salaam-red-500" />
                      Contact Information
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                          placeholder="+60123456789"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={customerInfo.firstName}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={customerInfo.lastName}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                            placeholder="Last name"
                          />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-salaam-red-500" />
                      Shipping Address
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={customerInfo.address}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, address: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                          placeholder="Street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          value={customerInfo.apartment}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, apartment: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                          placeholder="Apartment, suite, unit, etc."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={customerInfo.city}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, city: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                          </label>
                          <select
                            value={customerInfo.state}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, state: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                          >
                            <option value="">Select state</option>
                            <option value="Johor">Johor</option>
                            <option value="Kedah">Kedah</option>
                            <option value="Kelantan">Kelantan</option>
                            <option value="Melaka">Melaka</option>
                            <option value="Negeri Sembilan">Negeri Sembilan</option>
                            <option value="Pahang">Pahang</option>
                            <option value="Perak">Perak</option>
                            <option value="Perlis">Perlis</option>
                            <option value="Pulau Pinang">Pulau Pinang</option>
                            <option value="Sabah">Sabah</option>
                            <option value="Sarawak">Sarawak</option>
                            <option value="Selangor">Selangor</option>
                            <option value="Terengganu">Terengganu</option>
                            <option value="Wilayah Persekutuan">Wilayah Persekutuan</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postcode
                          </label>
                          <input
                            type="text"
                            value={customerInfo.postcode}
                            onChange={(e) =>
                              setCustomerInfo({ ...customerInfo, postcode: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                            placeholder="Postcode"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={customerInfo.country}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors flex items-center gap-2"
                      >
                        Continue to Shipping
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-salaam-red-500" />
                      Shipping Method
                    </h2>

                    <div className="space-y-4">
                      <label className="block p-4 border-2 border-salaam-red-500 rounded-xl bg-salaam-red-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-salaam-red-500 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-salaam-red-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Standard Delivery</p>
                              <p className="text-sm text-gray-500">3-5 business days</p>
                            </div>
                          </div>
                          <span className="font-bold text-salaam-red-500">FREE</span>
                        </div>
                      </label>

                      <label className="block p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            <div>
                              <p className="font-medium text-gray-900">Express Delivery</p>
                              <p className="text-sm text-gray-500">1-2 business days</p>
                            </div>
                          </div>
                          <span className="font-bold text-gray-900">RM15.00</span>
                        </div>
                      </label>
                    </div>

                    {/* Shipping Address Summary */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Ship to</h3>
                        <button
                          onClick={() => setCurrentStep('information')}
                          className="text-salaam-red-500 text-sm font-medium hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {customerInfo.firstName} {customerInfo.lastName}
                        <br />
                        {customerInfo.address}
                        {customerInfo.apartment && `, ${customerInfo.apartment}`}
                        <br />
                        {customerInfo.city}, {customerInfo.state} {customerInfo.postcode}
                        <br />
                        {customerInfo.country}
                      </p>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-3 text-gray-700 font-medium hover:text-salaam-red-500 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors flex items-center gap-2"
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-salaam-red-500" />
                      Payment Method
                    </h2>

                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-xl transition-colors ${
                          paymentMethod === 'card'
                            ? 'border-salaam-red-500 bg-salaam-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard
                          className={`w-8 h-8 mx-auto mb-2 ${
                            paymentMethod === 'card' ? 'text-salaam-red-500' : 'text-gray-400'
                          }`}
                        />
                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('fpx')}
                        className={`p-4 border-2 rounded-xl transition-colors ${
                          paymentMethod === 'fpx'
                            ? 'border-salaam-red-500 bg-salaam-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2
                          className={`w-8 h-8 mx-auto mb-2 ${
                            paymentMethod === 'fpx' ? 'text-salaam-red-500' : 'text-gray-400'
                          }`}
                        />
                        <p className="font-medium text-gray-900">FPX Online Banking</p>
                        <p className="text-xs text-gray-500">Malaysian banks</p>
                      </button>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardInfo.number}
                            onChange={(e) =>
                              setCardInfo({
                                ...cardInfo,
                                number: formatCardNumber(e.target.value),
                              })
                            }
                            maxLength={19}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            value={cardInfo.name}
                            onChange={(e) =>
                              setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                            placeholder="JOHN DOE"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={cardInfo.expiry}
                              onChange={(e) =>
                                setCardInfo({
                                  ...cardInfo,
                                  expiry: formatExpiry(e.target.value),
                                })
                              }
                              maxLength={5}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cardInfo.cvv}
                              onChange={(e) =>
                                setCardInfo({
                                  ...cardInfo,
                                  cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                                })
                              }
                              maxLength={4}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* FPX Bank Selection */}
                    {paymentMethod === 'fpx' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                      >
                        <p className="text-sm text-gray-600 mb-4">Select your bank:</p>
                        <div className="grid grid-cols-2 gap-3">
                          {fpxBanks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => setSelectedBank(bank.id)}
                              className={`p-3 border-2 rounded-xl transition-colors text-left ${
                                selectedBank === bank.id
                                  ? 'border-salaam-red-500 bg-salaam-red-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <p className="font-medium text-gray-900 text-sm">{bank.name}</p>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        Your payment information is encrypted and secure. We never store your card
                        details.
                      </p>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-3 text-gray-700 font-medium hover:text-salaam-red-500 transition-colors flex items-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing || (paymentMethod === 'fpx' && !selectedBank)}
                        className="px-8 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Place Order - RM{cart.total.toFixed(2)}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
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
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-salaam-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        RM{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>RM{cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>RM{cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
