'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check } from 'lucide-react'

export function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const certifications = [
    'Halal JAKIM',
    'KKM-Approved',
  ]

  return (
    <section ref={ref} className="relative py-12 md:py-16 overflow-hidden -mt-px bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-salaam-red-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg md:text-xl font-semibold text-gray-900">
                {cert}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
