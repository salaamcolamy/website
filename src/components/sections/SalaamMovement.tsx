'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

const CAROUSEL_IMAGES = [
  '/images/Carousel%20Events/A7405600.jpg',
  '/images/Carousel%20Events/A7405597.jpg',
  '/images/Carousel%20Events/DSC01075.jpg',
  '/images/Carousel%20Events/DSC01214.jpg',
  '/images/Carousel%20Events/DSC06518.JPG',
  '/images/Carousel%20Events/DSC09951.jpg',
  '/images/Carousel%20Events/FF_07300.JPG',
  '/images/Carousel%20Events/FF_07314.JPG',
  '/images/Carousel%20Events/FF_07362.JPG',
  '/images/Carousel%20Events/FF_07483.JPG',
  '/images/Carousel%20Events/FF_07501.JPG',
]

const IMAGE_ALT = 'Salaam Cola community and events'
const SLIDE_DURATION_MS = 4500
const FADE_DURATION_MS = 700

export function SalaamMovement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    CAROUSEL_IMAGES.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % CAROUSEL_IMAGES.length)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

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
        <div className="relative w-full aspect-[4/3] max-h-[420px] min-h-[240px] rounded-2xl overflow-hidden shadow-xl bg-slate-200">
          {CAROUSEL_IMAGES.map((imageSrc, i) => {
            const distance = Math.min(
              Math.abs(i - currentIndex),
              CAROUSEL_IMAGES.length - Math.abs(i - currentIndex)
            )
            if (distance > 1) return null

            return (
              <div
                key={imageSrc}
                className={`absolute inset-0 transition-opacity ease-in-out ${
                  i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
                aria-hidden={i !== currentIndex}
              >
                <Image
                  src={imageSrc}
                  alt={i === currentIndex ? `${IMAGE_ALT} ${i + 1}` : ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority={i <= 2}
                />
              </div>
            )
          })}
        </div>

        {!prefersReducedMotion && (
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
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
                aria-current={i === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  )
}
