'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

const HERO_BANNER_DESKTOP = '/images/RAYA10%20Hero%20Website-3.png'
const HERO_BANNER_MOBILE = '/images/1.png'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white md:bg-neutral-100">
      {/* Full-bleed banner — portrait on mobile, landscape on md+ */}
      <div className="absolute inset-0">
        <Image
          src={HERO_BANNER_MOBILE}
          alt="Raya-End Sales — 10% off with code RAYA10, 18–30 April (mobile)"
          fill
          className="object-cover object-center md:hidden"
          priority
          sizes="100vw"
        />
        <Image
          src={HERO_BANNER_DESKTOP}
          alt="Raya-End Sales — 10% off with code RAYA10, 18–30 April"
          fill
          className="hidden md:block object-cover object-center"
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
