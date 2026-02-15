'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const CAROUSEL_IMAGES = [
  '/images/Carousel Events/DSC01075.jpg',
  '/images/Carousel Events/DSC01214.jpg',
  '/images/Carousel Events/DSC06518.JPG',
  '/images/Carousel Events/DSC09951.jpg',
  '/images/Carousel Events/FF_07300.JPG',
  '/images/Carousel Events/FF_07314.JPG',
  '/images/Carousel Events/FF_07362.JPG',
  '/images/Carousel Events/FF_07483.JPG',
  '/images/Carousel Events/FF_07501.JPG',
]

const IMAGE_ALT = 'Salaam Cola community and events'

export function SalaamMovement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section ref={ref} className="py-16 md:py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-4xl lg:text-5xl font-poppins font-black text-salaam-red-500 tracking-wide text-center"
        >
          Salaam Movement
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 text-center mt-2 max-w-2xl mx-auto text-sm md:text-base"
        >
          Moments from our community and events
        </motion.p>
      </div>

      {/* Infinite scroll carousel: one strip with duplicated set for seamless loop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
        aria-label="Photo carousel"
      >
        <motion.div
          className="flex w-max gap-4 md:gap-6"
          animate={
            prefersReducedMotion
              ? {}
              : { x: [0, -((280 + 24) * CAROUSEL_IMAGES.length)] }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 30,
                    ease: 'linear',
                  },
                }
          }
        >
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((src, i) => (
            <div
              key={i}
              className="relative w-[260px] md:w-[280px] h-[180px] md:h-[200px] shrink-0 rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={src}
                alt={`${IMAGE_ALT} ${(i % CAROUSEL_IMAGES.length) + 1}`}
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
