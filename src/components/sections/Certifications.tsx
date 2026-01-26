'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const certifications = [
  {
    text: 'HALAL',
    logo: '/images/jakim-logo-vector-720x340.png',
  },
  {
    text: 'JAKIM',
    logo: null,
  },
  {
    text: 'KKM',
    logo: '/images/49c08ae21f09324a91f311dcb741c685.png',
  },
  {
    text: 'APPROVED',
    logo: null,
  },
]

export function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="relative py-4 md:py-6 overflow-hidden bg-white -mt-px flex items-center">
      <div className="container mx-auto px-4 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 md:gap-4"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex items-center"
            >
              {cert.logo ? (
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center shrink-0 border-2 border-black">
                  <Image
                    src={cert.logo}
                    alt={cert.text}
                    width={64}
                    height={64}
                    className="object-contain p-1.5"
                  />
                </div>
              ) : (
                <span className="text-2xl md:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight leading-none">
                  {cert.text}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
