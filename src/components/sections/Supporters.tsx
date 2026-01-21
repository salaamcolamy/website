'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const retailers = [
  {
    name: 'Giant',
    logo: '/images/retailers/giant.svg',
  },
  {
    name: 'Lotus\'s',
    logo: '/images/retailers/lotus.svg',
  },
  {
    name: 'Mydin',
    logo: '/images/retailers/mydin.svg',
  },
  {
    name: '7-Eleven',
    logo: '/images/retailers/7eleven.svg',
  },
]

export function Supporters() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-salaam-red-500 mb-2">
            Get Your Salaam Cola At
          </h2>
        </motion.div>

        {/* Retailer Logos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {retailers.map((retailer, index) => (
            <motion.div
              key={retailer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <Image
                src={retailer.logo}
                alt={retailer.name}
                width={120}
                height={60}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
