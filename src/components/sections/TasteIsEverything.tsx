'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'

const SECTION_VIDEO =
  process.env.NEXT_PUBLIC_SECTION_VIDEO || '/videos/pour-video.mp4'

export function TasteIsEverything() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden -mt-px">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        {/* Video background (if provided) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-quora font-black text-white tracking-wide mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.25),0_4px_8px_rgba(0,0,0,0.15)]">
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors shadow-lg"
            >
              Taste the Impact
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
