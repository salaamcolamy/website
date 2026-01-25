'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations'
import { Grid, List, Star } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/shopify/types'

interface ShopPageClientProps {
  products: Product[]
}

export function ShopPageClient({ products }: ShopPageClientProps) {
  const t = useTranslations('shop')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
              {products.length} products
            </p>

            {/* View mode toggle */}
            <div className="flex items-center gap-4">
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
          {products.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'flex flex-col gap-4'
              }
            >
              {products.map((product, index) => {
                const imageUrl = product.featuredImage?.url || '/images/products/placeholder.webp'

                return (
                  <motion.div key={product.id} variants={scaleIn} custom={index}>
                    <Link href={`/shop/${product.handle}`}>
                      <div className="group text-center">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 max-w-[280px] md:max-w-[350px] lg:max-w-[400px] mx-auto">
                          <Image
                            src={imageUrl}
                            alt={product.featuredImage?.altText || product.title}
                            fill
                            className="object-contain p-4 sm:p-8 transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>

                        {/* Product Info */}
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-salaam-red-500 transition-colors">
                          {product.title}
                        </h3>
                        {product.tags[0] && (
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{product.tags[0]}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
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
