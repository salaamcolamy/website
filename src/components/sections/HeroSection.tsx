'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const BANNER_IMAGE = '/images/[No Font] SALAM COLA FEEDS_pict.png'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full-bleed banner image */}
      <div className="absolute inset-0">
        <Image
          src={BANNER_IMAGE}
          alt="Salaam Cola"
          fill
          className="object-cover"
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
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-poppins text-white text-center space-y-4 mt-56 md:mt-72 lg:mt-96"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight uppercase tracking-wide text-white">
            Taste the Freedom
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide text-white">
            Rasai Kebebasan
          </p>
        </motion.div>
      </div>

      {/* Bottom wave transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-20 md:h-32"
          aria-hidden
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
