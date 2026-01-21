'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

const images = [
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.22.jpeg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.25.jpeg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.26.jpeg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.26 (1).jpeg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.27.jpeg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.27 (1).jpeg',
]

export function ChangeStartsSmall() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-3 gap-3"
          >
            {images.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="aspect-square relative rounded-xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-center lg:text-left"
          >
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-salaam-red-500 bg-salaam-red-50 backdrop-blur-sm border border-salaam-red-100 rounded-full">
              Meet your match
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-quora font-black text-salaam-red-500 uppercase tracking-wide">
              Change Starts Small
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Our adventure started with a dream, to create choices that resonate
              with those who think and care deeply about what they consume. Our
              core ethos is giving back to those who need it most. Our product is all
              about high standards in quality and giving you options, but with a twist
              —we're all in on sustainability and ethics. It's about reshaping your
              favourites in a way that feels good and responsible.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
            >
              Get started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
