'use client'

import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
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
const SLIDE_DURATION_MS = 4500
const FADE_DURATION_S = 0.7

export function SalaamMovement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % CAROUSEL_IMAGES.length)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  const src = CAROUSEL_IMAGES[currentIndex]

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full max-w-4xl mx-auto px-4"
        aria-label="Photo carousel"
      >
        <div className="relative w-full aspect-[4/3] max-h-[420px] rounded-2xl overflow-hidden shadow-xl bg-slate-200">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: FADE_DURATION_S, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={`${IMAGE_ALT} ${currentIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indicator */}
        {!prefersReducedMotion && (
          <div className="flex justify-center gap-2 mt-4" aria-hidden>
            {CAROUSEL_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-salaam-red-500'
                    : 'w-2 bg-salaam-red-500/30 hover:bg-salaam-red-500/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
