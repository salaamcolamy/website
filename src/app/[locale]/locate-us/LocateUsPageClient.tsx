'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { X } from 'lucide-react'

const IMAGE_BASE = '/images/locate%20us'
const GRID_IMAGE_KL_FIRST = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-4.png` // High Street Art Cafe — first KL slot
const GRID_IMAGE_2026_2 = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-2.png`
const GRID_IMAGE_RIVERSIDE = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola-2.png`
const GRID_IMAGE_KUNAFA_CRISP = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-3.png`
const GRID_IMAGE_SSSETEL_PARLIMEN = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026%20%281%29.png`
const GRID_IMAGE_WOP = '/images/WOP.png'
const TOTAL_SLOTS = 23

const LANGKAWI_IMAGES = [
  {
    src: `${IMAGE_BASE}/2.jpg`,
    alt: 'Tropical Charters — Koperasi Kakitangan Tropical Charters Berhad, 12-3, Langkawi Boulevard Langkawi City, Jalan Mahawangsa 1, Kuah, Langkawi. Contact: 04-952 3641',
  },
  {
    src: `${IMAGE_BASE}/3.jpg`,
    alt: 'Salaam Cola location in Langkawi',
  },
  {
    src: `${IMAGE_BASE}/4.jpg`,
    alt: 'Telaga Seafood — Telaga Seafood Restaurant, Jalan Pantai Chenang, Kampung Lubok Buaya, Langkawi. Contact: 013-350 8171',
  },
  {
    src: `${IMAGE_BASE}/5.jpg`,
    alt: 'Angrik Kopi — Angrik Kopi, Simpang Perana, Mukim, Perana, Langkawi. Contact: 018-9479288',
  },
  {
    src: `${IMAGE_BASE}/6.jpg`,
    alt: 'RedSky Cafe — Redsky Cafe @ Villa Molek, Jalan Teluk Baru, Pantai Tengah, Langkawi. Contact: 04-952 3641',
  },
  {
    src: `${IMAGE_BASE}/Lokasi%20Terbaru%20Langkawi.png`,
    alt: 'Tasik Dayang Bunting — Tasik Dayang Bunting, Kuah, Langkawi. Contact: 03-26164488',
  },
] as const

// State order matches the map list: Kuala Lumpur → Selangor → Negeri Sembilan → Langkawi
const STATE_ORDER = ['Kuala Lumpur', 'Selangor', 'Negeri Sembilan', 'Langkawi'] as const

// Each slot mapped to state. KL: High Street (1), Kunafa (21), Sssetel Parlimen (22), WOP Pizzeria (23). Sahra Savor (KL), Kopi & Kita (NS).
const SLOT_STATE: Record<number, (typeof STATE_ORDER)[number]> = {
  1: 'Kuala Lumpur',    // High Street Art Cafe, Lebuh Pudu
  2: 'Kuala Lumpur',
  3: 'Kuala Lumpur',
  4: 'Kuala Lumpur',
  5: 'Kuala Lumpur',
  6: 'Kuala Lumpur',
  7: 'Kuala Lumpur',
  8: 'Kuala Lumpur',
  9: 'Kuala Lumpur',
  10: 'Kuala Lumpur',
  11: 'Kuala Lumpur',  // Sahra Savor
  12: 'Selangor',
  14: 'Selangor',
  16: 'Negeri Sembilan',
  17: 'Negeri Sembilan',
  18: 'Negeri Sembilan',
  19: 'Negeri Sembilan', // Kopi & Kita
  21: 'Kuala Lumpur', // Kunafa Crisp, Bukit Bintang
  22: 'Kuala Lumpur', // Sssetel Mart, Parlimen Malaysia
  23: 'Kuala Lumpur', // WOP Pizzeria, Sri Hartamas
}

function getGridImageSrc(num: number) {
  if (num === 1) return GRID_IMAGE_KL_FIRST
  if (num === 2) return GRID_IMAGE_2026_2
  if (num === 3) return GRID_IMAGE_RIVERSIDE
  if (num === 21) return GRID_IMAGE_KUNAFA_CRISP
  if (num === 22) return GRID_IMAGE_SSSETEL_PARLIMEN
  if (num === 23) return GRID_IMAGE_WOP
  return `${IMAGE_BASE}/${num - 2}.png` // slot 4 → 2.png, slot 12 → 10.png, slot 14 → 12.png
}
function getGridImageAlt(num: number) {
  if (num === 1) return 'High Street Art Cafe — 8, Lebuh Pudu, Kuala Lumpur. Contact: 010-2390255'
  if (num === 2) return 'Nasi Kerabu Keramat — Sri Rampai (7-9 Jln 46B/26, Taman Sri Rampai, KL) and Season Garden, Seksyen 10, Wangsa Maju, KL. Contact: 011-6316 1661'
  if (num === 3) return 'Riverside Cafe, WTCKL — Level 2, World Trade Centre Kuala Lumpur, 41 Jalan Tun Ismail, Chow Kit, KL. Contact: 03-26146701'
  if (num === 21)
    return 'Kunafa Crisp — Branch 1: 51, Jln Sultan Ismail, Bukit Bintang, KL. Branch 2: 44-2G, Bangunan Bintang, 51, Jln Sultan Ismail, Bukit Bintang, KL. Contact: 011-5155 9488'
  if (num === 22)
    return 'Sssetel Mart, Parlimen Malaysia — Blok Utama Parlimen Malaysia, Jln Parlimen, Kuala Lumpur. Contact: 017-855 9205'
  if (num === 23)
    return 'WOP Pizzeria — H-0-8, Plaza Damas, 60, Jalan Sri Hartamas 1, Sri Hartamas, Kuala Lumpur. Contact: 03-64197530'
  return `Location ${num}`
}

export function LocateUsPageClient() {
  const slotsByState = useMemo(() => {
    const grouped: Record<string, number[]> = {}
    for (const state of STATE_ORDER) grouped[state] = []
    for (let slot = 1; slot <= TOTAL_SLOTS; slot++) {
      const state = SLOT_STATE[slot]
      if (state) grouped[state].push(slot)
    }
    return grouped
  }, [])
  const [enlarged, setEnlarged] = useState<
    { type: 'slot'; num: number } | { type: 'langkawi'; index: number } | null
  >(null)

  useEffect(() => {
    if (enlarged !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [enlarged])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlarged(null)
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

      {/* Images grouped by state (same order as map list) */}
      <section className="container-padding pb-20 space-y-16">
        {STATE_ORDER.map((stateName) => {
          const slots = slotsByState[stateName] ?? []
          const isLangkawi = stateName === 'Langkawi'
          if (!isLangkawi && slots.length === 0) return null
          return (
            <motion.div
              key={stateName}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-b-2 border-salaam-red-500 pb-2 w-fit">
                {stateName}
              </h2>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLangkawi
                  ? LANGKAWI_IMAGES.map((image, index) => (
                      <motion.article
                        key={image.src}
                        variants={fadeInUp}
                        className="rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-salaam-red-500 focus-visible:ring-offset-2"
                        onClick={() => setEnlarged({ type: 'langkawi', index })}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && setEnlarged({ type: 'langkawi', index })
                        }
                        tabIndex={0}
                        role="button"
                        aria-label={`View Langkawi location ${index + 1} enlarged`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto block"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </motion.article>
                    ))
                  : slots.map((num) => (
                      <motion.article
                        key={num}
                        variants={fadeInUp}
                        className="rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-salaam-red-500 focus-visible:ring-offset-2"
                        onClick={() => setEnlarged({ type: 'slot', num })}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && setEnlarged({ type: 'slot', num })
                        }
                    tabIndex={0}
                    role="button"
                    aria-label={num === 1 ? 'View High Street Art Cafe enlarged' : num === 2 ? 'View Nasi Kerabu Keramat locations enlarged' : num === 3 ? 'View Riverside Cafe WTCKL enlarged' : num === 21 ? 'View Kunafa Crisp enlarged' : num === 22 ? 'View Sssetel Mart Parlimen enlarged' : num === 23 ? 'View WOP Pizzeria enlarged' : `View location ${num} enlarged`}
                  >
                    <img
                      src={getGridImageSrc(num)}
                      alt={getGridImageAlt(num)}
                      className="w-full h-auto block"
                      loading={num === 1 ? 'eager' : 'lazy'}
                    />
                      </motion.article>
                    ))}
              </motion.div>
            </motion.div>
          )
        })}
      </section>

      {/* Lightbox — click photo to enlarge */}
      <AnimatePresence>
        {enlarged !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setEnlarged(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged location photo"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setEnlarged(null)
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
                src={
                  enlarged.type === 'langkawi'
                    ? LANGKAWI_IMAGES[enlarged.index].src
                    : getGridImageSrc(enlarged.num)
                }
                alt={
                  enlarged.type === 'langkawi'
                    ? LANGKAWI_IMAGES[enlarged.index].alt
                    : getGridImageAlt(enlarged.num)
                }
                className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
