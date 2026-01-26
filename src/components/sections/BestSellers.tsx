'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Salaam Cola</h2>
        </motion.div>

        {/* Products Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                      <div className="relative aspect-square overflow-hidden mb-4 max-w-[320px] md:max-w-[400px] lg:max-w-[480px] mx-auto">
                        <Image
                          src={imageUrl}
                          alt={product.featuredImage?.altText || product.title}
                          fill
                          className="object-contain p-6 sm:p-10 transition-transform duration-500 group-hover:scale-105"
                        />
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
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
