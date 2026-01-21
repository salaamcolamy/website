'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'
import Image from 'next/image'

export function ReviewNewsletter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Customer Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 text-center"
          >
            {/* Star Rating */}
            <div className="flex gap-1 mb-4 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
              "Akhirnya! Jenama kola dengan nilai dan etika! Ini adalah peningkatan untuk semua Muslim! Rasa 10/10."
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3 justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/images/avatar-placeholder.jpg"
                  alt="Ahmad Razak"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ahmad Razak</p>
                <p className="text-sm text-gray-500">Negeri Sembilan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
