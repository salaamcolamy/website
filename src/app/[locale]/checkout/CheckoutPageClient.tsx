'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { Link } from '@/i18n/routing'
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
import { generateOrderId, saveOrder, type OrderData } from '@/lib/orders/orderService'

type Step = 'information' | 'shipping' | 'payment'
type PaymentMethod = 'fpx'

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

// Malaysian banks for FPX with Billplz bank codes
// Bank codes are used in reference_1 field when creating Billplz bills
const fpxBanks = [
  { id: 'MB2U0227', name: 'Maybank2u', code: 'MB2U0227', logo: '/images/banks/maybank.png' },
  { id: 'BCBB0235', name: 'CIMB Clicks', code: 'BCBB0235', logo: '/images/banks/cimb.png' },
  { id: 'PBB0233', name: 'PBe (Public Bank)', code: 'PBB0233', logo: '/images/banks/publicbank.png' },
  { id: 'RHB0218', name: 'RHB Now', code: 'RHB0218', logo: '/images/banks/rhb.png' },
  { id: 'HLB0224', name: 'Hong Leong Connect', code: 'HLB0224', logo: '/images/banks/hongleong.png' },
  { id: 'AMBB0209', name: 'AmOnline', code: 'AMBB0209', logo: '/images/banks/ambank.png' },
  { id: 'BIMB0340', name: 'Bank Islam Internet Banking', code: 'BIMB0340', logo: '/images/banks/bankislam.png' },
  { id: 'BSN0601', name: 'myBSN', code: 'BSN0601', logo: '/images/banks/bsn.png' },
  { id: 'OCBC0229', name: 'OCBC Online Banking', code: 'OCBC0229', logo: '/images/banks/ocbc.png' },
  { id: 'HSBC0223', name: 'HSBC Online Banking', code: 'HSBC0223', logo: '/images/banks/hsbc.png' },
  { id: 'UOB0226', name: 'UOB Internet Banking', code: 'UOB0226', logo: '/images/banks/uob.png' },
  { id: 'SCB0216', name: 'Standard Chartered Online Banking', code: 'SCB0216', logo: '/images/banks/scb.png' },
  { id: 'CIT0219', name: 'Citibank Online', code: 'CIT0219', logo: '/images/banks/citibank.png' },
  { id: 'ABB0233', name: 'Affin Online', code: 'ABB0233', logo: '/images/banks/affin.png' },
  { id: 'ABMB0212', name: 'Alliance Online', code: 'ABMB0212', logo: '/images/banks/alliance.png' },
  { id: 'BKRM0602', name: 'i-Rakyat (Bank Kerjasama Rakyat)', code: 'BKRM0602', logo: '/images/banks/bkrm.png' },
  { id: 'BMMB0341', name: 'i-Muamalat', code: 'BMMB0341', logo: '/images/banks/muamalat.png' },
  { id: 'KFH0346', name: 'KFH Online', code: 'KFH0346', logo: '/images/banks/kfh.png' },
  { id: 'AGRO01', name: 'AGRONet', code: 'AGRO01', logo: '/images/banks/agrobank.png' },
]

export function CheckoutPageClient() {
  const { cart } = useCart()
  const [currentStep, setCurrentStep] = useState<Step>('information')
  const [paymentMethod] = useState<PaymentMethod>('fpx')
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingCostValue, setShippingCostValue] = useState<number | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [shippingBreakdown, setShippingBreakdown] = useState<{
    region: string
    totalWeightKg: number
    baseRate: number
    additionalWeightCharge: number
    cartonProtection: number
    totalCartons: number
  } | null>(null)
  const shippingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CustomerInfo | 'bank', string>>>({})

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
    country: 'Malaysia', // Fixed for Malaysia-only; countryCode MY is sent to Shopify for shipping
  })

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'information', label: 'Information', icon: <User className="w-4 h-4" /> },
    { key: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const validateInformationStep = (): boolean => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[+]?[\d\s\-()]{8,15}$/

    if (!customerInfo.email.trim()) errors.email = 'Email is required'
    else if (!emailRegex.test(customerInfo.email.trim())) errors.email = 'Please enter a valid email'

    if (!customerInfo.phone.trim()) errors.phone = 'Phone number is required'
    else if (!phoneRegex.test(customerInfo.phone.trim())) errors.phone = 'Please enter a valid phone number'

    if (!customerInfo.firstName.trim()) errors.firstName = 'First name is required'
    if (!customerInfo.lastName.trim()) errors.lastName = 'Last name is required'
    if (!customerInfo.address.trim()) errors.address = 'Address is required'
    if (!customerInfo.city.trim()) errors.city = 'City is required'
    if (!customerInfo.state) errors.state = 'Please select a state'
    if (!customerInfo.postcode.trim()) errors.postcode = 'Postcode is required'
    else if (!/^\d{5}$/.test(customerInfo.postcode.trim())) errors.postcode = 'Postcode must be 5 digits'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 'information') {
      if (!validateInformationStep()) return
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      if (shippingCost === null && !shippingLoading) {
        setFieldErrors({ state: 'Shipping must be calculated before proceeding' })
        return
      }
      if (shippingError) {
        setFieldErrors({ state: shippingError })
        return
      }
      setFieldErrors({})
      setCurrentStep('payment')
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 'payment') setCurrentStep('shipping')
    else if (currentStep === 'shipping') setCurrentStep('information')
  }

  const hasMinAddress = Boolean(
    customerInfo.address?.trim() &&
    customerInfo.city?.trim() &&
    customerInfo.state?.trim() &&
    customerInfo.postcode?.trim() &&
    customerInfo.firstName?.trim() &&
    customerInfo.lastName?.trim()
  )

  const fetchShippingRates = useCallback(async () => {
    if (!customerInfo.state) {
      setShippingCostValue(null)
      setShippingError(null)
      setShippingBreakdown(null)
      setShippingLoading(false)
      return
    }

    if (!cart?.items || cart.items.length === 0) {
      setShippingError('Your cart is empty.')
      setShippingCostValue(null)
      setShippingBreakdown(null)
      setShippingLoading(false)
      return
    }

    setShippingLoading(true)
    setShippingError(null)

    try {
      const cartItems = cart.items.map(item => ({
        title: item.title,
        variantTitle: item.variantTitle || '',
        quantity: item.quantity,
        productHandle: (item as any).productHandle || '',
      }))

      console.log('[Checkout] Calculating shipping (Tranz rate card):', {
        state: customerInfo.state,
        items: cartItems.map(i => `${i.title} x${i.quantity}`),
      })

      const res = await fetch('/api/shopify/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          address: {
            province: customerInfo.state,
            city: customerInfo.city,
            zip: customerInfo.postcode,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Failed to calculate shipping.'
        setShippingError(errorMsg)
        setShippingCostValue(null)
        setShippingBreakdown(null)
        console.error('[Checkout] Shipping error:', errorMsg)
      } else {
        setShippingCostValue(data.shippingCost)
        setShippingBreakdown(data.breakdown)
        setShippingError(null)
        console.log('[Checkout] Shipping calculated:', {
          cost: data.shippingCost,
          region: data.breakdown.region,
          weight: data.breakdown.totalWeightKg + 'kg',
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Could not load shipping rates'
      setShippingError(`Unable to calculate shipping. ${errorMessage}`)
      setShippingCostValue(null)
      setShippingBreakdown(null)
      console.error('[Checkout] Shipping calculation error:', error)
    } finally {
      setShippingLoading(false)
    }
  }, [cart?.items, customerInfo.state, customerInfo.city, customerInfo.postcode])

  // Debounced shipping calculation
  const debouncedFetchShipping = useCallback(() => {
    if (shippingDebounceRef.current) {
      clearTimeout(shippingDebounceRef.current)
    }
    shippingDebounceRef.current = setTimeout(() => {
      fetchShippingRates()
    }, 500)
  }, [fetchShippingRates])

  // Recalculate shipping when state, cart items, or quantities change (debounced)
  useEffect(() => {
    if (!customerInfo.state || !cart?.items || cart.items.length === 0) {
      setShippingCostValue(null)
      setShippingError(null)
      setShippingBreakdown(null)
      return
    }
    debouncedFetchShipping()
    return () => {
      if (shippingDebounceRef.current) clearTimeout(shippingDebounceRef.current)
    }
  }, [customerInfo.state, cart?.items, debouncedFetchShipping])

  // Also recalculate when entering shipping step
  useEffect(() => {
    if (currentStep === 'shipping' && customerInfo.state && cart?.items && cart.items.length > 0) {
      fetchShippingRates()
    }
  }, [currentStep, fetchShippingRates, customerInfo.state, cart?.items])

  const shippingCost = shippingLoading ? null : (shippingCostValue !== null && !shippingError ? shippingCostValue : null)
  
  const orderTotal = (cart?.subtotal ?? 0) + (shippingCost ?? 0)

  const handlePlaceOrder = async () => {
    if (!selectedBank) {
      setFieldErrors({ bank: 'Please select a bank' })
      return
    }
    setFieldErrors({})

    // Validate all customer info is still present
    if (!validateInformationStep()) {
      setCurrentStep('information')
      return
    }

    // Validate shipping is calculated before proceeding
    if (shippingCost === null && !shippingLoading) {
      alert('Please wait for shipping to be calculated, or verify your address is correct.')
      return
    }

    if (shippingError) {
      alert(`Cannot proceed: ${shippingError}\n\nPlease verify your address or contact support.`)
      return
    }

    setIsProcessing(true)

    try {
      // Find the selected bank details
      const bankDetails = fpxBanks.find(bank => bank.id === selectedBank)
      if (!bankDetails) {
        throw new Error('Invalid bank selection')
      }

      // Generate order ID
      const orderId = generateOrderId()

      // Create order data
      const orderData: OrderData = {
        id: orderId,
        items: cart?.items.map(item => ({
          id: item.id,
          variantId: item.variantId || '',
          title: item.title,
          variantTitle: item.variantTitle || '',
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })) || [],
        subtotal: cart?.subtotal || 0,
        shipping: shippingCost,
        total: orderTotal,
        customerInfo,
        paymentMethod: 'billplz',
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }

      // Save order before creating bill
      saveOrder(orderData)

      // Create Shopify draft order — this MUST succeed so the order appears in Shopify
      let draftOrderId: string | null = null
      const draftRes = await fetch('/api/orders/create-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerInfo.email,
          lineItems: (cart?.items || []).map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          billingAddress: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            address1: customerInfo.address,
            address2: customerInfo.apartment || '',
            city: customerInfo.city,
            province: customerInfo.state,
            zip: customerInfo.postcode,
            country: customerInfo.country,
            phone: customerInfo.phone,
          },
          shippingAddress: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            address1: customerInfo.address,
            address2: customerInfo.apartment || '',
            city: customerInfo.city,
            province: customerInfo.state,
            zip: customerInfo.postcode,
            country: customerInfo.country,
            phone: customerInfo.phone,
          },
          note: `Order ${orderId}. Billplz payment. Shipping: RM${(shippingCost ?? 0).toFixed(2)}`,
          tags: ['billplz', 'online-order'],
          customAttributes: [
            { key: 'internal_order_id', value: orderId },
            { key: 'payment_gateway', value: 'Billplz' },
            { key: 'shipping_cost', value: String(shippingCost ?? 0) },
          ],
        }),
      })

      if (!draftRes.ok) {
        const errorText = await draftRes.text()
        console.error('[Checkout] Draft order creation failed:', draftRes.status, errorText)
        throw new Error('Unable to create order in Shopify. Please try again or contact support.')
      }

      const draftData = await draftRes.json()
      if (!draftData.draftOrderId) {
        console.error('[Checkout] Draft order response missing ID:', draftData)
        throw new Error('Order was not created properly. Please try again.')
      }

      draftOrderId = draftData.draftOrderId
      console.log('[Checkout] Shopify draft order created:', draftOrderId)

      // Create Billplz bill with bank code (and draftOrderId so callback can complete order in Shopify)
      console.log('[Checkout] Creating Billplz bill with bank code:', bankDetails.code, 'for bank:', bankDetails.name)
      
      const response = await fetch('/api/billplz/create-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerInfo.email,
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          amount: orderTotal,
          description: `Order ${orderId} - ${cart?.items.length || 0} item(s)`,
          orderId,
          phone: customerInfo.phone,
          bankCode: bankDetails.code, // Pass the Billplz bank code
          draftOrderId: draftOrderId || undefined, // So payment callback can complete draft → order in Shopify
        }),
      })

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          console.error('[Checkout] Billplz API error response:', errorData)
        } catch {
          // If response is not JSON, use status text
          const text = await response.text()
          errorMessage = text || errorMessage
          console.error('[Checkout] Billplz API non-JSON error:', text)
        }
        throw new Error(`Billplz API Error: ${errorMessage}`)
      }

      const billData = await response.json()
      console.log('[Checkout] Billplz bill created:', { billId: billData.billId, paymentUrl: billData.paymentUrl })

      // Check for success flag and required fields
      if (!billData.success) {
        const errorMsg = billData.error || 'Failed to create payment bill'
        console.error('[Checkout] Billplz bill creation failed:', errorMsg)
        throw new Error(errorMsg)
      }

      if (!billData.billId) {
        console.error('[Checkout] Missing billId in response:', billData)
        throw new Error('Bill ID not received from Billplz')
      }

      if (!billData.paymentUrl) {
        console.error('[Checkout] Missing paymentUrl in response:', billData)
        throw new Error('Payment URL not received from Billplz')
      }

      // Update order with Billplz bill ID
      orderData.billplzBillId = billData.billId
      saveOrder(orderData)

      // Append auto_submit=true to redirect directly to bank's online portal
      const paymentUrl = billData.paymentUrl.includes('?')
        ? `${billData.paymentUrl}&auto_submit=true`
        : `${billData.paymentUrl}?auto_submit=true`

      console.log('[Checkout] Redirecting to payment URL:', paymentUrl)
      
      // Redirect to Billplz payment page (which will auto-submit to selected bank)
      window.location.href = paymentUrl
    } catch (error) {
      console.error('Error creating payment:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to process payment. Please try again.'
      
      // Show user-friendly error message
      alert(`Payment Error: ${errorMessage}\n\nPlease check your connection and try again.`)
      setIsProcessing(false)
    }
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
            <p className="text-gray-600 mb-8">Add products from the shop page. Shipping is calculated by delivery address and cart weight at checkout.</p>
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
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, email: e.target.value })
                            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }))
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder="your@email.com"
                        />
                        {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, phone: e.target.value })
                            if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }))
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder="+60123456789"
                        />
                        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customerInfo.firstName}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, firstName: e.target.value })
                              if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: undefined }))
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            placeholder="First name"
                          />
                          {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customerInfo.lastName}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, lastName: e.target.value })
                              if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: undefined }))
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            placeholder="Last name"
                          />
                          {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
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
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerInfo.address}
                          onChange={(e) => {
                            setCustomerInfo({ ...customerInfo, address: e.target.value })
                            if (fieldErrors.address) setFieldErrors(prev => ({ ...prev, address: undefined }))
                          }}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                          placeholder="Street address"
                        />
                        {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
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
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customerInfo.city}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, city: e.target.value })
                              if (fieldErrors.city) setFieldErrors(prev => ({ ...prev, city: undefined }))
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            placeholder="City"
                          />
                          {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={customerInfo.state}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, state: e.target.value })
                              if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: undefined }))
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.state ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
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
                            <option value="Kuala Lumpur">Kuala Lumpur</option>
                            <option value="Wilayah Persekutuan">Wilayah Persekutuan</option>
                          </select>
                          {fieldErrors.state && <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postcode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customerInfo.postcode}
                            onChange={(e) => {
                              setCustomerInfo({ ...customerInfo, postcode: e.target.value })
                              if (fieldErrors.postcode) setFieldErrors(prev => ({ ...prev, postcode: undefined }))
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500 ${fieldErrors.postcode ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            placeholder="Postcode"
                          />
                          {fieldErrors.postcode && <p className="text-red-500 text-xs mt-1">{fieldErrors.postcode}</p>}
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
                      <div className="block p-4 border-2 border-salaam-red-500 rounded-xl bg-salaam-red-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-salaam-red-500 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-salaam-red-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Tranz Alliance Express - {shippingBreakdown?.region || (customerInfo.state === 'Sabah' || customerInfo.state === 'Sarawak' ? 'East Malaysia' : 'Peninsular Malaysia')}
                              </p>
                              <p className="text-sm text-gray-500">
                                {customerInfo.state
                                  ? `3-5 business days${customerInfo.state === 'Sabah' || customerInfo.state === 'Sarawak' ? ' (East Malaysia)' : ' (West Malaysia)'}`
                                  : '3-5 business days'}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-salaam-red-500">
                            {shippingCost === null
                              ? (shippingLoading ? 'Calculating...' : '\u2014')
                              : shippingCost === 0
                                ? 'FREE'
                                : `RM${shippingCost.toFixed(2)}`
                            }
                          </span>
                        </div>
                        {/* Shipping breakdown */}
                        {shippingBreakdown && shippingCost !== null && (
                          <div className="mt-3 pt-3 border-t border-salaam-red-200 text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Weight: {shippingBreakdown.totalWeightKg}kg</span>
                              <span>Base rate: RM{shippingBreakdown.baseRate.toFixed(2)}</span>
                            </div>
                            {shippingBreakdown.additionalWeightCharge > 0 && (
                              <div className="flex justify-between">
                                <span>Additional weight</span>
                                <span>RM{shippingBreakdown.additionalWeightCharge.toFixed(2)}</span>
                              </div>
                            )}
                            {shippingBreakdown.cartonProtection > 0 && (
                              <div className="flex justify-between">
                                <span>Carton protection ({shippingBreakdown.totalCartons} pcs)</span>
                                <span>RM{shippingBreakdown.cartonProtection.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {shippingError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 font-medium">
                            Unable to calculate shipping
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            {shippingError}
                          </p>
                        </div>
                      )}
                      {shippingLoading && (
                        <p className="text-sm text-gray-500 italic mt-2">
                          Calculating shipping based on your address...
                        </p>
                      )}
                      {!customerInfo.state && !shippingLoading && (
                        <p className="text-sm text-gray-500 italic">
                          Shipping cost will be calculated based on your delivery address
                        </p>
                      )}
                      {customerInfo.state && shippingCost !== null && !shippingError && (
                        <p className="text-sm text-green-600 italic mt-2">
                          Shipping calculated for {customerInfo.city}, {customerInfo.state}
                        </p>
                      )}
                      {customerInfo.state && (shippingError || (shippingCost === null && !shippingLoading)) && (
                        <button
                          type="button"
                          onClick={() => fetchShippingRates()}
                          disabled={shippingLoading}
                          className="mt-3 text-sm font-medium text-salaam-red-500 hover:text-salaam-red-600 underline disabled:opacity-50"
                        >
                          {shippingLoading ? 'Calculating...' : 'Calculate shipping again'}
                        </button>
                      )}
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
                      <Building2 className="w-5 h-5 text-salaam-red-500" />
                      Payment Method
                    </h2>

                    <div className="space-y-3 mb-6">
                      <p className="text-sm text-gray-600 mb-4">Select your bank: <span className="text-red-500">*</span></p>
                      {fieldErrors.bank && <p className="text-red-500 text-sm mb-3">{fieldErrors.bank}</p>}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {fpxBanks.map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => {
                              setSelectedBank(bank.id)
                              if (fieldErrors.bank) setFieldErrors(prev => ({ ...prev, bank: undefined }))
                            }}
                            className={`p-4 border-2 rounded-xl transition-colors text-left ${
                              selectedBank === bank.id
                                ? 'border-salaam-red-500 bg-salaam-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium text-gray-900 text-sm">{bank.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                      <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        Your payment will be processed securely through FPX online banking. You will be redirected to your bank's secure payment page.
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
                        disabled={isProcessing || !selectedBank}
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
                            Place Order - RM{orderTotal.toFixed(2)}
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
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                      {!customerInfo.state ? (
                        <span className="text-gray-400 text-sm">Enter address</span>
                      ) : shippingLoading ? (
                        <span className="text-gray-400 text-sm">Calculating...</span>
                      ) : shippingCost === null ? (
                        <span className="text-gray-400 text-sm">—</span>
                      ) : shippingCost === 0 ? (
                        'FREE'
                      ) : (
                        `RM${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>
                      {!customerInfo.state ? (
                        <span className="text-gray-400">RM{cart.subtotal.toFixed(2)}</span>
                      ) : (
                        `RM${orderTotal.toFixed(2)}`
                      )}
                    </span>
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
