'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations'
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

const products = [
  {
    id: 1,
    name: 'Mister Cola Original',
    subtitle: '24-Can Pack',
    price: 'RM 48.00',
    originalPrice: 'RM 55.00',
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&h=400&fit=crop',
    badge: 'Best Seller',
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: 'Mister Cola Zero',
    subtitle: '24-Can Pack',
    price: 'RM 48.00',
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600&h=400&fit=crop',
    badge: null,
    rating: 4.8,
    reviews: 96,
  },
  {
    id: 3,
    name: 'Mister Lemonade',
    subtitle: '24-Can Pack',
    price: 'RM 52.00',
    originalPrice: 'RM 58.00',
    image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600&h=400&fit=crop',
    badge: 'New',
    rating: 4.7,
    reviews: 54,
  },
  {
    id: 4,
    name: 'Variety Pack',
    subtitle: 'Mixed 24-Can',
    price: 'RM 55.00',
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1598614187854-26a60e982dc4?w=600&h=400&fit=crop',
    badge: 'Popular',
    rating: 4.9,
    reviews: 203,
  },
]

export function ProductLineup() {
  const t = useTranslations('lineup')

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-salaam-red-500/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-salaam-red-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {t('title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Product grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={scaleIn}
                custom={index}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="h-full overflow-hidden group" variant="light" hover>
                  {/* Product image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          product.badge === 'Best Seller'
                            ? 'bg-salaam-red-500 text-white'
                            : product.badge === 'New'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 text-white'
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Quick add overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        leftIcon={<ShoppingCart className="w-4 h-4" />}
                      >
                        Add to Cart
                      </GlassButton>
                    </motion.div>
                  </div>

                  {/* Product info */}
                  <div className="p-4 space-y-3">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-salaam-red-500 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.subtitle}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-salaam-red-500">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* View all button */}
          <motion.div variants={fadeInUp} className="text-center">
            <Link href="/shop">
              <GlassButton variant="outline" size="lg">
                {t('viewAll')}
              </GlassButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
