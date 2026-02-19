'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const IMAGE_COUNT = 18
const IMAGE_BASE = '/images/locate%20us'

export function LocateUsPageClient() {
  const images = Array.from({ length: IMAGE_COUNT }, (_, i) => i + 1)

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

      {/* Images grid — number order 1–18 */}
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
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center"
            >
              <Image
                src={`${IMAGE_BASE}/${num}.png`}
                alt={`Location ${num}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
