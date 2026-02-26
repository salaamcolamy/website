'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

const BANNER_IMAGE = '/images/Website Banner.png'
const MOBILE_BANNER_IMAGE = '/images/mobile-banner.png'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white md:bg-black">
      {/* Full-bleed banner image */}
      <div className="absolute inset-0">
        {/* Mobile banner image */}
        <Image
          src={MOBILE_BANNER_IMAGE}
          alt="Salaam Cola"
          fill
          className="object-cover md:hidden"
          priority
          sizes="100vw"
        />
        {/* Desktop banner image */}
        <Image
          src={BANNER_IMAGE}
          alt="Salaam Cola"
          fill
          className="hidden md:block object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Centered text */}
      <div className="relative z-10 container mx-auto px-4 pt-24 md:pt-28 pb-20 min-h-screen flex flex-col items-center justify-start md:justify-end md:pb-12 lg:pb-14 xl:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white text-center"
        >
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-40 md:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/95 transition-all duration-300 shadow-lg border-2 border-white"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/95 transition-all duration-300 shadow-lg border-2 border-white"
            >
              What is Salaam Cola?
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
