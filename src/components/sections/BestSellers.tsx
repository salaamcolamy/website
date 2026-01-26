'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from '@/i18n/routing'
import { ArrowRight, Star } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/shopify/types'

const tabs = [
  { key: 'featured', label: 'Featured', href: '/shop' },
  { key: 'original', label: 'Original', href: '/shop?category=original' },
  { key: 'zero-sugar', label: 'Zero Sugar', href: '/shop?category=zero-sugar' },
  { key: 'keffiyeh', label: 'Keffiyeh Edition', href: '/shop?category=keffiyeh' },
]

interface BestSellersProps {
  products: Product[]
}

export function BestSellers({ products }: BestSellersProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('featured')

  return (
    <section ref={ref} className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Salaam Cola</h2>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-salaam-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          ))}
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
                      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 max-w-[280px] md:max-w-[350px] lg:max-w-[400px] mx-auto shadow-sm border border-gray-100">
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

        {/* Explore our brands CTA */}
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
