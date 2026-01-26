'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

const SECTION_IMAGE = '/images/pour.jpg'

export function TasteIsEverything() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-[85vh] overflow-hidden -mt-px">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <Image
          src={SECTION_IMAGE}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40"
          aria-hidden
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-24 md:pt-32 md:pb-32 min-h-[85vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-black text-white tracking-wide mb-6">
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
