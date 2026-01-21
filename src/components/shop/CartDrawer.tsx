'use client'

import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { GlassButton } from '@/components/ui/GlassButton'
import { formatPrice } from '@/lib/utils'
import { slideInRight, overlayAnimation } from '@/lib/animations'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/routing'

export function CartDrawer() {
  const t = useTranslations('cart')
  const router = useRouter()
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart()

  const handleCheckout = () => {
    closeCart()
    // Navigate to checkout page using next-intl router
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-salaam-red-500" />
                {t('title')}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeCart}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  </motion.div>
                  <p className="text-gray-500 mb-6">{t('empty')}</p>
                  <Link href="/shop" onClick={closeCart}>
                    <GlassButton variant="primary">
                      {t('continueShopping')}
                    </GlassButton>
                  </Link>
                </div>
              ) : (
                cart.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Product image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.productHandle}`}
                        onClick={closeCart}
                        className="font-medium text-gray-900 hover:text-salaam-red-500 transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      {item.variantTitle !== 'Default Title' && (
                        <p className="text-sm text-gray-500">{item.variantTitle}</p>
                      )}
                      <p className="text-salaam-red-500 font-semibold mt-1">
                        {formatPrice(item.price, item.currencyCode)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            item.quantity > 1
                              ? updateItem(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          disabled={isLoading}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-salaam-red-500 hover:border-salaam-red-500 transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-salaam-red-500 hover:border-salaam-red-500 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>

                        {/* Remove button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('subtotal')}</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(cart.subtotal, cart.currencyCode)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{t('shipping')}</p>

                {/* Checkout button */}
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  isLoading={isLoading}
                >
                  {t('checkout')}
                </GlassButton>

                {/* Continue shopping */}
                <Link href="/shop" onClick={closeCart} className="block">
                  <GlassButton variant="ghost" size="md" className="w-full">
                    {t('continueShopping')}
                  </GlassButton>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
