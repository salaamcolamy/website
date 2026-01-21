'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

const categories = [
  {
    id: 1,
    title: 'Shop NO SUGAR',
    image: '/images/products/no-sugar-category.webp',
    href: '/shop?category=no-sugar',
    color: 'from-gray-900 to-gray-800',
  },
  {
    id: 2,
    title: 'Shop Original',
    image: '/images/products/original-category.webp',
    href: '/shop?category=original',
    color: 'from-salaam-red-600 to-salaam-red-500',
  },
  {
    id: 3,
    title: 'Shop Keffiyeh',
    image: '/images/products/keffiyeh-category.webp',
    href: '/shop?category=keffiyeh',
    color: 'from-salaam-red-500 to-salaam-red-400',
  },
]

export function BrowseCategories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative pt-24 pb-24 md:pt-32 md:pb-32 bg-salaam-red-500 overflow-hidden">
      {/* Animated wavy background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated wave layer 1 - slowest, darkest */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[60%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(0,0,0,0.15)"
            d="M0,160L60,170.7C120,181,240,203,360,208C480,213,600,203,720,176C840,149,960,107,1080,101.3C1200,96,1320,128,1440,154.7C1560,181,1680,203,1800,197.3C1920,192,2040,160,2160,154.7C2280,149,2400,171,2520,176C2640,181,2760,171,2820,165.3L2880,160L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Animated wave layer 2 - medium speed */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[50%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [-1440, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(0,0,0,0.1)"
            d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,218.7C840,213,960,171,1080,154.7C1200,139,1320,149,1440,165.3C1560,181,1680,203,1800,202.7C1920,203,2040,181,2160,165.3C2280,149,2400,139,2520,149.3C2640,160,2760,192,2820,208L2880,224L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Animated wave layer 3 - fastest, lightest */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[40%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(255,255,255,0.05)"
            d="M0,224L60,218.7C120,213,240,203,360,192C480,181,600,171,720,181.3C840,192,960,224,1080,229.3C1200,235,1320,213,1440,197.3C1560,181,1680,171,1800,176C1920,181,2040,203,2160,208C2280,213,2400,203,2520,186.7C2640,171,2760,149,2820,138.7L2880,128L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Soft gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <p className="text-sm text-white/70 mb-1">Browse categories</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Best Sellers</h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors"
          >
            Shop all categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                  {/* Background Image */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`} />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-lg">{category.title}</h3>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top curved divider - white to red */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24 rotate-180"
        >
          <path
            fill="white"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>

      {/* Bottom curved divider - red to white */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            fill="white"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  )
}
