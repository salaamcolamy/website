'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const BANNER_IMAGE = '/images/[No Font] SALAM COLA FEEDS_pict.png'
const MOBILE_BANNER_IMAGE = '/images/mobile-banner.png'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full-bleed banner image */}
      <div className="absolute inset-0">
        {/* Mobile banner image */}
        <Image
          src={MOBILE_BANNER_IMAGE}
          alt="Salaam Cola"
          fill
          className="object-contain md:hidden"
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
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30"
          aria-hidden
        />
      </div>

      {/* Centered text */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 min-h-screen flex flex-col items-center justify-start md:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-white text-center space-y-1 md:space-y-4 pt-6 md:pt-0 md:mt-72 lg:mt-96"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-quora font-black leading-tight tracking-wide text-white">
            Taste the Freedom
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-quora font-normal tracking-wide text-white">
            Rasai Kebebasan
          </p>
        </motion.div>
      </div>
    </section>
  )
}
