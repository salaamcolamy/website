'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Eye } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/shopify/types'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const t = useTranslations('products')
  const { addItem, isLoading } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Get the first variant ID
    const variantId = product.variants[0]?.id
    if (variantId) {
      addItem(variantId)
    }
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/shop/${product.handle}`}>
        <GlassCard
          variant="light"
          padding="none"
          className="group flex gap-6 bg-white border-gray-100 overflow-hidden"
        >
          {/* Product image */}
          <div className="relative w-40 h-40 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-24 bg-gradient-to-b from-salaam-red-500 to-salaam-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xs text-center p-2">
                  MISTER COLA
                </div>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 py-4 pr-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-salaam-red-500 transition-colors">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-salaam-red-500">
                  {formatPrice(product.price, product.currencyCode)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice, product.currencyCode)}
                  </span>
                )}
              </div>

              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                isLoading={isLoading}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                {t('addToCart')}
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </Link>
    )
  }

  return (
    <Link href={`/shop/${product.handle}`}>
      <GlassCard
        variant="light"
        padding="none"
        className="group h-full overflow-hidden bg-white border-gray-100"
      >
        {/* Product image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-32 h-40 bg-gradient-to-b from-salaam-red-500 to-salaam-red-700 rounded-lg flex items-center justify-center text-white font-bold text-center p-4">
                <span>MISTER COLA</span>
              </div>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2"
            >
              <GlassButton
                variant="secondary"
                size="sm"
                className="flex-1 bg-white/90 text-gray-900"
                onClick={handleAddToCart}
                isLoading={isLoading}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                {t('addToCart')}
              </GlassButton>
            </motion.div>
          </div>

          {/* Sale badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-salaam-red-500 text-white text-sm font-semibold rounded-full">
              Sale
            </div>
          )}

          {/* Out of stock badge */}
          {!product.availableForSale && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-gray-900 text-white text-sm font-semibold rounded-full">
              {t('outOfStock')}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-salaam-red-500 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-salaam-red-500">
              {formatPrice(product.price, product.currencyCode)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice, product.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
