'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useCart } from '@/context/CartContext'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import {
  ShoppingBag,
  Minus,
  Plus,
  ChevronLeft,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Star,
} from 'lucide-react'
import Image from 'next/image'

interface DemoProduct {
  id: string
  handle: string
  title: string
  category: string
  description: string
  price: number
  originalPrice: number | null
  discount: number | null
  rating: number
  reviews: number
  image: string
  availableForSale: boolean
}

interface ProductDetailClientProps {
  product: DemoProduct
  relatedProducts: DemoProduct[]
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addDemoItem, isLoading } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addDemoItem(product.id, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-salaam-red-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Shop</span>
          </Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Product image */}
          <motion.div variants={fadeInLeft} className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
              />

              {/* Discount badge */}
              {product.discount && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-salaam-red-500 text-white font-semibold rounded-full">
                  -{product.discount}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div variants={fadeInRight} className="space-y-6">
            {/* Category */}
            <span className="inline-block px-3 py-1 text-xs font-medium text-salaam-red-500 bg-salaam-red-50 rounded-full uppercase tracking-wide">
              {product.category}
            </span>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < product.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-salaam-red-500">
                  RM{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    RM{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={decrementQuantity}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-salaam-red-500 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <span className="w-12 text-center font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={incrementQuantity}
                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-salaam-red-500 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Add to cart button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isLoading || !product.availableForSale}
              className={`w-full py-4 px-8 rounded-full font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-salaam-red-500 text-white hover:bg-salaam-red-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAdded ? (
                <>
                  <Check className="w-6 h-6" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart - RM{(product.price * quantity).toFixed(2)}
                </>
              )}
            </motion.button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-salaam-red-500/10 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-salaam-red-500" />
                </div>
                <p className="text-sm text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-salaam-red-500/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-salaam-red-500" />
                </div>
                <p className="text-sm text-gray-600">Halal Certified</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-salaam-red-500/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-salaam-red-500" />
                </div>
                <p className="text-sm text-gray-600">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-24 space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/shop/${relatedProduct.handle}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group text-center"
                  >
                    <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.title}
                        fill
                        className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                      />
                      {relatedProduct.discount && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-salaam-red-500 text-white text-sm font-semibold rounded-full">
                          -{relatedProduct.discount}% OFF
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-salaam-red-500 transition-colors">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      {relatedProduct.category}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      {relatedProduct.originalPrice && (
                        <span className="text-gray-400 line-through">
                          RM{relatedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-salaam-red-500">
                        RM{relatedProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
