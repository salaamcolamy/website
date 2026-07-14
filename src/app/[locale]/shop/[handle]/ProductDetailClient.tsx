'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { formatPrice, getDisplayTags } from '@/lib/utils'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { ChevronLeft, Shield, RefreshCw, Star, ShoppingBag, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { GlassButton } from '@/components/ui/GlassButton'
import {
  PAYDAY_SALES_BANNER_ALT,
  PAYDAY_SALES_BANNER_SRC,
  RayaPromoBanner,
} from '@/components/shop/RayaPromoBanner'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/shopify/types'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const t = useTranslations('products')
  const { addItem, isLoading } = useCart()
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'review'>('description')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Get all product images (featured image + additional images)
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : product.featuredImage 
      ? [product.featuredImage] 
      : []
  
  const selectedImage = allImages[selectedImageIndex] || product.featuredImage
  const imageUrl = selectedImage?.url || '/images/products/placeholder.webp'
  const selectedVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0]
  const variantId = selectedVariant?.id
  const availableForSale = product.availableForSale && variantId

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!variantId) return
    try {
      await addItem(variantId, quantity, product)
    } catch (err) {
      console.error('[Product] Add to cart failed:', err)
      const msg =
        err instanceof Error ? err.message : 'Could not add this item to your cart.'
      if (typeof window !== 'undefined') window.alert(msg)
    }
  }
  const displayTags = getDisplayTags(product.handle, product.title, product.tags)
  const category = displayTags[0] || 'PRODUCT'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12">
        <RayaPromoBanner src={PAYDAY_SALES_BANNER_SRC} alt={PAYDAY_SALES_BANNER_ALT} />
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
          {/* Product image gallery */}
          <motion.div variants={fadeInLeft} className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50">
              <Image
                src={imageUrl}
                alt={selectedImage?.altText || product.title}
                fill
                className="object-contain p-8"
                priority={selectedImageIndex === 0}
              />
            </div>

            {/* Thumbnail gallery - only show if there are multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-salaam-red-500 ring-2 ring-salaam-red-200'
                        : 'border-gray-200 hover:border-salaam-red-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div variants={fadeInRight} className="space-y-6">
            {/* Category */}
            <span className="inline-block px-3 py-1 text-xs font-medium text-salaam-red-500 bg-salaam-red-50 rounded-full uppercase tracking-wide">
              {category}
            </span>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-bold text-salaam-red-500">
                  {formatPrice(product.price, product.currencyCode)}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Description — Shopify format: HTML (with bullets) or plain text as list */}
            <div className="prose prose-gray max-w-none prose-p:text-gray-600 prose-ul:pl-6 prose-li:text-gray-600 prose-li:leading-relaxed prose-li:my-1">
              {product.descriptionHtml ? (
                <div
                  className="text-gray-600 leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : product.description ? (
                <ul className="list-disc pl-6 space-y-1 text-gray-600 leading-relaxed">
                  {product.description
                    .split(/\n+/)
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>
              ) : null}
            </div>

            {/* Add to Cart */}
            {availableForSale && (
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-gray-600 hover:text-salaam-red-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 text-gray-600 hover:text-salaam-red-500 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  isLoading={isLoading}
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                >
                  {t('addToCart')}
                </GlassButton>
              </div>
            )}
            {!product.availableForSale && (
              <p className="pt-6 border-t border-gray-100 text-gray-500 font-medium">{t('outOfStock')}</p>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
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

        {/* Product Tabs */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'description'
                  ? 'text-salaam-red-500 border-b-2 border-salaam-red-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'additional'
                  ? 'text-salaam-red-500 border-b-2 border-salaam-red-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Additional Information
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'review'
                  ? 'text-salaam-red-500 border-b-2 border-salaam-red-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-gray max-w-none">
                {product.descriptionHtml ? (
                  <div
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                )}
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="text-gray-500">Weight</div>
                  <div className="text-gray-900 font-medium">8 kg</div>
                  <div className="text-gray-500">Cans</div>
                  <div className="text-gray-900 font-medium">Box of 24, Single</div>
                  <div className="text-gray-500">Volume</div>
                  <div className="text-gray-900 font-medium">330ml</div>
                  <div className="text-gray-500">Category</div>
                  <div className="text-gray-900 font-medium">{category}</div>
                  <div className="text-gray-500">Certification</div>
                  <div className="text-gray-900 font-medium">Halal JAKIM, KKM-Approved</div>
                  <div className="text-gray-500">Origin</div>
                  <div className="text-gray-900 font-medium">Malaysia</div>
                </div>

                {/* Nutrition Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Nutrition Information</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Per 100ml */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-medium text-gray-700 mb-3">Per 100ml</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Energy</span>
                          <span className="text-gray-900">195kJ / 46kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Fat</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Carbohydrate</span>
                          <span className="text-gray-900">11g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Sugars</span>
                          <span className="text-gray-900">11g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fiber</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Protein</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Salt</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                      </div>
                    </div>

                    {/* Per 330ml */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-medium text-gray-700 mb-3">Per 330ml (1 can)</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Energy</span>
                          <span className="text-gray-900">643.5kJ / 151.8kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Fat</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Carbohydrate</span>
                          <span className="text-gray-900">36.6g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Sugars</span>
                          <span className="text-gray-900">36.3g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fiber</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Protein</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Salt</span>
                          <span className="text-gray-900">0g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-gray-900">5.0</div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Based on customer reviews</p>
                  </div>
                </div>
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Ahmad R.</span>
                        <span className="text-gray-400 text-sm">Negeri Sembilan</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-2">Rasa yang sangat sedap! Saya sangat suka dengan kola ini.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              {relatedProducts.map((relatedProduct) => {
                const relatedImageUrl = relatedProduct.featuredImage?.url || '/images/products/placeholder.webp'
                const relatedTag = getDisplayTags(relatedProduct.handle, relatedProduct.title, relatedProduct.tags)[0]

                return (
                  <Link key={relatedProduct.id} href={`/shop/${relatedProduct.handle}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="group text-center"
                    >
                      <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={relatedImageUrl}
                          alt={relatedProduct.featuredImage?.altText || relatedProduct.title}
                          fill
                          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-salaam-red-500 transition-colors">
                        {relatedProduct.title}
                      </h3>
                      <div className="mb-1">
                        <p className="text-salaam-red-500 font-semibold">
                          {formatPrice(relatedProduct.price, relatedProduct.currencyCode)}
                        </p>
                      </div>
                      {relatedTag && (
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                          {relatedTag}
                        </p>
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
