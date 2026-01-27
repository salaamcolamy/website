'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

const SECTION_IMAGE = '/images/DSC00799.jpg'

export function ChangeStartsSmall() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Single image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-xl overflow-hidden"
          >
            <Image
              src={SECTION_IMAGE}
              alt="Change starts small"
              fill
              className="object-cover object-[center_35%]"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-center lg:text-left"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-poppins font-black text-salaam-red-500 tracking-wide">
              Change Starts Small
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Salaam Cola was founded on the principle of 'Purposeful Consumption.' We connect with the people who think and care deeply about what they consume. Our core value is built on a cycle of kindness, where 10% of profits support global humanitarian causes. We have reshaped a classic favorite into a responsible alternative.
            </p>

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
