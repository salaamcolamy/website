'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

const HERO_BANNER_IMAGE =
  '/images/hero/Website%20Banner%20Aidilfitri.png'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-salaam-red-500">
      {/* Full-bleed banner — same asset on mobile and desktop */}
      <div className="absolute inset-0">
        <Image
          src={HERO_BANNER_IMAGE}
          alt="Salaam Aidilfitri — Salaam Cola festive offers"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* CTAs: on mobile at bottom, on desktop centered toward bottom */}
      <div className="relative z-10 container mx-auto px-4 pt-24 md:pt-28 min-h-screen flex flex-col items-center justify-end pb-10 md:pb-12 lg:pb-14 xl:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white text-center w-full"
        >
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
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
