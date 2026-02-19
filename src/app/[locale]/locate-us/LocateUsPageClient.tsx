'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { X } from 'lucide-react'

const IMAGE_COUNT = 18
const IMAGE_BASE = '/images/locate%20us'

export function LocateUsPageClient() {
  const images = Array.from({ length: IMAGE_COUNT }, (_, i) => i + 1)
  const [enlargedNum, setEnlargedNum] = useState<number | null>(null)

  useEffect(() => {
    if (enlargedNum !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [enlargedNum])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlargedNum(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="section-padding container-padding pt-28 pb-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Locate Us
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 text-lg"
          >
            Find Salaam Cola at retailers and locations near you.
          </motion.p>
        </motion.div>
      </section>

      {/* Images grid — number order 1–18, cell matches each image */}
      <section className="container-padding pb-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.map((num) => (
            <motion.article
              key={num}
              variants={fadeInUp}
              className="rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-salaam-red-500 focus-visible:ring-offset-2"
              onClick={() => setEnlargedNum(num)}
              onKeyDown={(e) => e.key === 'Enter' && setEnlargedNum(num)}
              tabIndex={0}
              role="button"
              aria-label={`View location ${num} enlarged`}
            >
              <img
                src={`${IMAGE_BASE}/${num}.png`}
                alt={`Location ${num}`}
                className="w-full h-auto block"
                loading="lazy"
              />
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Lightbox — click photo to enlarge */}
      <AnimatePresence>
        {enlargedNum !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setEnlargedNum(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged location photo"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setEnlargedNum(null)
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${IMAGE_BASE}/${enlargedNum}.png`}
                alt={`Location ${enlargedNum}`}
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
