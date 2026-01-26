'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'

const BANNER_IMAGE = '/images/[No Font] SALAM COLA FEEDS_pict.png'
const MOBILE_BANNER_IMAGE = '/images/mobile-banner.png'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
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
          
          {/* What is Salaam Cola Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-32 md:pt-6"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-lg"
            >
              What is Salaam Cola
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
