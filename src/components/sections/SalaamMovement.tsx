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

// Card dimensions for seamless loop (single source of truth)
const CARD_WIDTH_PX = 420
const CARD_GAP_PX = 32
const TRANSLATE_PER_SET = (CARD_WIDTH_PX + CARD_GAP_PX) * CAROUSEL_IMAGES.length

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
          className="flex w-max"
          style={{ gap: CARD_GAP_PX }}
          animate={
            prefersReducedMotion ? {} : { x: [0, -TRANSLATE_PER_SET] }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 55,
                    ease: 'linear',
                  },
                }
          }
        >
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((src, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-xl overflow-hidden shadow-lg"
              style={{
                width: CARD_WIDTH_PX,
                height: Math.round(CARD_WIDTH_PX * (2 / 3)),
              }}
            >
              <Image
                src={src}
                alt={`${IMAGE_ALT} ${(i % CAROUSEL_IMAGES.length) + 1}`}
                fill
                className="object-cover"
                sizes="420px"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
