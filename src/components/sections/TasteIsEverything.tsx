'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'

export function TasteIsEverything() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative pt-24 pb-24 md:pt-32 md:pb-32 bg-salaam-red-500 overflow-hidden">
      {/* Animated wavy background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave layer 1 */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[50%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(0,0,0,0.1)"
            d="M0,160L60,170.7C120,181,240,203,360,208C480,213,600,203,720,176C840,149,960,107,1080,101.3C1200,96,1320,128,1440,154.7C1560,181,1680,203,1800,197.3C1920,192,2040,160,2160,154.7C2280,149,2400,171,2520,176C2640,181,2760,171,2820,165.3L2880,160L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Wave layer 2 */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[40%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [-1440, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(0,0,0,0.05)"
            d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,218.7C840,213,960,171,1080,154.7C1200,139,1320,149,1440,165.3C1560,181,1680,203,1800,202.7C1920,203,2040,181,2160,165.3C2280,149,2400,139,2520,149.3C2640,160,2760,192,2820,208L2880,224L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-quora font-black text-white uppercase tracking-wide mb-6">
            Taste is Everything
          </h2>

          {/* Description */}
          <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            In blind taste tests, 98% of participants agreed that Salaam Cola rivals the flavor of the world's leading brands.
            Crafted to fit perfectly into Malaysia's vibrant food culture and social lifestyle, we are more than just a drink,
            we are an ethical movement. Join the hype, choose the ethical alternative, and make a difference sip by sip.
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Taste the Impact
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
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
