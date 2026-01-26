'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
export function BestSellers() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-0"
        >
          <h2 className="font-quora font-black text-salaam-red-500 text-[3.6rem] md:text-[4.48rem] lg:text-[5.4rem] xl:text-[7.2rem] leading-none md:leading-tight flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-0 md:gap-x-2">
            <span className="md:inline">Meet</span>
            <span className="md:inline">Salaam Cola</span>
          </h2>
        </motion.div>

        {/* Cans Image with Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center mt-0"
        >
          <div className="relative w-full max-w-5xl mx-auto">
            <Image
              src="/images/Salaam Cola cans-2.png"
              alt="Salaam Cola cans - Keffiyeh Edition, Original, Seriously No Sugar"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mt-6"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors shadow-lg"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
