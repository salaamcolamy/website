'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from '@/i18n/routing'
import { ArrowRight, Star } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/shopify/types'

interface BestSellersProps {
  products: Product[]
}

export function BestSellers({ products }: BestSellersProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-3 text-sm font-medium text-salaam-red-500 bg-salaam-red-50 backdrop-blur-sm border border-salaam-red-100 rounded-full">
            Must-haves
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop Now</h2>
        </motion.div>

        {/* Products Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const imageUrl = product.featuredImage?.url || '/images/products/placeholder.webp'

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/shop/${product.handle}`} scroll={true} onClick={() => window.scrollTo(0, 0)}>
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
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.tags[0]}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Shop All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
          >
            Shop all
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
