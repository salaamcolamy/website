'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useCart } from '@/context/CartContext'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations'
import { Grid, List, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

// Static products matching the landing page BestSellers
const staticProducts = [
  {
    id: 'original',
    title: 'Original',
    category: 'CLASSIC',
    price: 20.00,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 3,
    image: '/images/products/1111.webp',
    href: '/shop/original',
  },
  {
    id: 'zero-sugar',
    title: 'Zero Sugar',
    category: 'NO SUGAR',
    price: 34.00,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 3,
    image: '/images/products/2222.webp',
    href: '/shop/zero-sugar',
  },
  {
    id: 'keffiyah',
    title: 'Keffiyah Edition',
    category: 'LIMITED EDITION',
    price: 25.20,
    originalPrice: 28.00,
    discount: 10,
    rating: 5,
    reviews: 3,
    image: '/images/products/3333.webp',
    href: '/shop/keffiyeh',
  },
]

type SortOption = 'newest' | 'price-low-high' | 'price-high-low'

export function ShopPageClient() {
  const t = useTranslations('shop')
  const { addDemoItem, isLoading } = useCart()
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    addDemoItem(productId)
  }

  // Sort products
  const sortedProducts = [...staticProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price
      case 'price-high-low':
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('allProducts')}
            </p>
          </motion.div>

          {/* Filters and sort */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            {/* Product count */}
            <p className="text-gray-500">
              {sortedProducts.length} products
            </p>

            {/* Sort and view controls */}
            <div className="flex items-center gap-4">
              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50"
                >
                  <option value="newest">{t('newest')}</option>
                  <option value="price-low-high">{t('priceLowHigh')}</option>
                  <option value="price-high-low">{t('priceHighLow')}</option>
                </select>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-salaam-red-500 text-white'
                      : 'bg-white text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-salaam-red-500 text-white'
                      : 'bg-white text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Products grid */}
          {sortedProducts.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'flex flex-col gap-4'
              }
            >
              {sortedProducts.map((product, index) => (
                <motion.div key={product.id} variants={scaleIn} custom={index}>
                  <Link href={product.href}>
                    <div className="group text-center">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 max-w-[280px] md:max-w-[350px] lg:max-w-[400px] mx-auto">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain p-4 sm:p-8 transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Discount Badge */}
                        {product.discount && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-salaam-red-500 text-white text-sm font-semibold rounded-full">
                            -{product.discount}% OFF
                          </div>
                        )}

                        {/* Add to Cart Button - appears on hover */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            onClick={(e) => handleAddToCart(e, product.id)}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-salaam-red-500 text-white rounded-full font-medium hover:bg-salaam-red-600 disabled:opacity-50 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < product.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
                      </div>

                      {/* Product Info */}
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-salaam-red-500 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{product.category}</p>

                      {/* Price */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        {product.originalPrice && (
                          <span className="text-gray-400 line-through">RM{product.originalPrice.toFixed(2)}</span>
                        )}
                        <span className="text-lg font-bold text-salaam-red-500">RM{product.price.toFixed(2)}</span>
                      </div>

                      {/* Mobile Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={isLoading}
                        className="lg:hidden w-full max-w-[280px] mx-auto px-6 py-2.5 bg-salaam-red-500 text-white rounded-full font-medium hover:bg-salaam-red-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={fadeInUp}
              className="text-center py-20"
            >
              <p className="text-gray-500">{t('noProducts')}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
