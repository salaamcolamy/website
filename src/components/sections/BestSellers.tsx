'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from '@/i18n/routing'
import { ArrowRight, Star } from 'lucide-react'
import Image from 'next/image'

const products = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

export function BestSellers() {
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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={product.href} scroll={true} onClick={() => window.scrollTo(0, 0)}>
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
                    <div className="flex items-center justify-center gap-2">
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through">RM{product.originalPrice.toFixed(2)}</span>
                      )}
                      <span className="text-lg font-bold text-salaam-red-500">RM{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
