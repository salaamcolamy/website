'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Heart, Briefcase } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

const images = [
  '/images/DSC00424.jpg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.25.jpeg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.26.jpeg',
  '/images/image-gen (13).jpg',
  '/images/change/WhatsApp Image 2025-12-11 at 23.51.27.jpeg',
  '/images/lalala.png',
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
              Salaam Cola was founded on the principle of 'Purposeful Consumption.' We connect with the people who think and care deeply about what they consume. Our core value is built on a cycle of kindness, where 10% of profits support global humanitarian causes. We have reshaped a classic favorite into a responsible alternative.
            </p>

            {/* Bullet Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-salaam-red-50 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-salaam-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sip with Purpose</p>
                  <p className="text-sm text-gray-600">Join the mission for global humanitarian aids</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-salaam-red-50 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-salaam-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Business</p>
                  <p className="text-sm text-gray-600">Distribute Salaam Cola at your premise</p>
                </div>
              </div>
            </div>

            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
            >
              Where Your Sip Goes
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
