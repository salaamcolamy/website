'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'

const SECTION_IMAGE = '/images/pour.jpg'
const SECTION_VIDEO =
  process.env.NEXT_PUBLIC_SECTION_VIDEO || '/videos/pour-video.mp4'

export function TasteIsEverything() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden -mt-px">
      {/* Wave at top of section */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-20">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-20 md:h-28 lg:h-32"
          aria-hidden
        >
          <path
            fill="white"
            d="M0,40 C180,80 360,20 540,60 C720,100 900,40 1080,70 C1260,100 1380,50 1440,60 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      {/* Full-bleed background */}
      <div className="absolute inset-0">
        {/* Video background (if provided) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={SECTION_IMAGE}
        >
          <source src={SECTION_VIDEO} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40"
          aria-hidden
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-24 md:pt-32 md:pb-32 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-quora font-black text-white tracking-wide mb-6">
            Taste is Everything
          </h2>

          <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            In blind taste tests, 98% of participants agreed that Salaam Cola rivals the flavor of the world's leading brands.
            Crafted to fit perfectly into Malaysia's vibrant food culture and social lifestyle, we are more than just a drink,
            we are an ethical movement. Join the hype, choose the ethical alternative, and make a difference sip by sip.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/shop"
              scroll={true}
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Taste the Impact
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
