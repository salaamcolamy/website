'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { X } from 'lucide-react'
import { LocationStatsCounters } from '@/components/shared/LocationStatsCounters'
import { getStoreLocationStats } from '@/lib/storeLocations'

const IMAGE_BASE = '/images/locate%20us'
const GRID_IMAGE_KL_FIRST = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-4.png` // High Street Art Cafe — first KL slot
const GRID_IMAGE_2026_2 = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-2.png`
const GRID_IMAGE_RIVERSIDE = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola-2.png`
const GRID_IMAGE_KUNAFA_CRISP = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-3.png`
const GRID_IMAGE_SSSETEL_PARLIMEN = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026%20%281%29.png`
const GRID_IMAGE_WOP = '/images/WOP.png'
const GRID_IMAGE_EDAR_MART = `${IMAGE_BASE}/edar%20mart.png`
const TOTAL_SLOTS = 25

const KL_EXTRA_IMAGES = [
  {
    src: `${IMAGE_BASE}/pernama%20kl.png`,
    alt: 'Kedai PERNAMA — Kuala Lumpur locations: Kedai PERNAMA Bellamy (Jalan Bellamy), Lamaniaga PERNAMA Sungai Besi, Kedai PERNAMA Batu Kentomen, Kedai PERNAMA DTHO KL, Kedai PERNAMA Ampat Tin, Kompleks Lamaniaga PERNAMA Wardieburn, Kedai PERNAMA Keramat Hujung, Kedai PERNAMA U-Thant, Kedai PERNAMA Kem Transit KL, Kedai PERNAMA Desa Tun Abdul Razak, Kedai PERNAMA 1 RAMD Kem Perdana, Kedai PERNAMA RKAT Desa Setia Wira, Kedai PERNAMA RKAT Tentera Darat Bukit Jalil, Kedai PERNAMA Kem Pasifik',
  },
  {
    src: `${IMAGE_BASE}/Kapitan%20TTDI.png`,
    alt: 'Kapitan Tandoori House, TTDI — 50, Jalan Tun Mohd Fuad 1, Taman Tun Dr Ismail, Kuala Lumpur. Contact: 017-899 7011',
  },
  {
    src: `${IMAGE_BASE}/Lutfi%20Jaya.png`,
    alt: 'Lutfi Jaya, Plaza City One — No. G20, Ground Floor, Plaza City One, Jalan Munshi Abdullah, Kuala Lumpur. Contact: 03-2202 8800',
  },
  {
    src: `${IMAGE_BASE}/Baitul%20Bijico%20Cafe.png`,
    alt: 'Baitul Bijico Cafe — 14, Jalan Aman, Kampung Datuk Keramat, Kuala Lumpur. Contact: 013-274 8586',
  },
  {
    src: '/images/bonda.png',
    alt: 'Bonda KL — Lot 2736, Seksyen 41, Jalan Mahmud, Kampung Baru, Kuala Lumpur. Contact: 03-8999 4267',
  },
  {
    src: '/images/positano.png',
    alt: 'Positano Risto — Block C1, Lot 2, Level G3, Publika Shopping Gallery, 1, Jln Dutamas 1, Solaris Dutamas, Kuala Lumpur. Contact: 03-6411 3799',
  },
  {
    src: '/images/hartamas%20corner.png',
    alt: 'Hartamas Corner — No 1, Warong Makan, Jalan Sri Hartamas 2, Sri Hartamas, Kuala Lumpur. Contact: 012-927 6852',
  },
  {
    src: `${IMAGE_BASE}/Hadramawt%20Razak%20City.png`,
    alt: 'Hadramawt Restaurant, Razak City — Tun Razak City, Kuala Lumpur. Contact: +603-4100-0002',
  },
] as const

const SELANGOR_EXTRA_IMAGES = [
  {
    src: `${IMAGE_BASE}/pernama%20selangor.png`,
    alt: 'Kedai PERNAMA — Selangor locations: Kedai PERNAMA Kajang, Kedai PERNAMA Paya Jaras, Kompleks Lamaniaga PERNAMA TUDM Subang, Kedai PERNAMA TUDM Jugra, Kedai PERNAMA Sungai Buloh',
  },
  {
    src: `${IMAGE_BASE}/Kemuning.png`,
    alt: 'Shawarma Gaza (Giant Kemuning Utama) — 22, Jalan Kemuning Prima F33/F, Kemuning Utama, Shah Alam, Selangor',
  },
  {
    src: `${IMAGE_BASE}/Hilal%20Resources%20Shah%20Alam.png`,
    alt: 'Hilal Resources — No 28 Tingkat Bawah Blok 4, Bangunan Worldwide, Seksyen 13, Shah Alam, Selangor. Contact: 012-220 2712',
  },
  {
    src: `${IMAGE_BASE}/Nasi%20Kandar%20Budak%20Mamaks.png`,
    alt: 'Nasi Kandar Budak Mamaks — Lot 3A, Jln Utara, Pjs 52, 46200 Petaling Jaya, Selangor. Contact: 012-377 2276',
  },
  {
    src: `${IMAGE_BASE}/Mozers.png`,
    alt: "Mozer's Restaurant — 03-0G-01, D'Vida Business Centre, Jalan Bazar U8/101, Bukit Jelutong, Shah Alam, Selangor. Contact: 03-7734 1783",
  },
  {
    src: `${IMAGE_BASE}/eraman%20gate%20a.png`,
    alt: 'Eraman Express, Gate A, KLIA 1 — KLIA Terminal 1, Contact Pier (International Level) near Gate A, Sepang, Selangor. Contact: 03-8776 8600',
  },
  {
    src: `${IMAGE_BASE}/eraman%20arrival.png`,
    alt: 'Eraman Express, KLIA 1 — KLIA Terminal 1, Level 3 (Arrival Hall), Sepang, Selangor. Contact: 03-8776 8600',
  },
  {
    src: `${IMAGE_BASE}/eraman%20klia%202.png`,
    alt: 'Eraman Express, KLIA 2 — KLIA Terminal 2, Level 3 (Departure Hall), Sepang, Selangor. Contact: 03-8776 8600',
  },
  {
    src: `${IMAGE_BASE}/Amir.png`,
    alt: 'Amir Damascus Restaurant — D3-G-01, Block D3, Jln Atelier 2A, Edusphere, Cyberjaya, Selangor. Contact: 011-5556 0008',
  },
  {
    src: `${IMAGE_BASE}/salaampoint.png`,
    alt: 'Salam Point Mart — I-G-6, Kelana Jaya Parklane Commercial Hub, Jalan SS 7/26, SS7, Petaling Jaya, Selangor. Contact: 03-3142 2666',
  },
  {
    src: `${IMAGE_BASE}/kurma%20madinah%202.png`,
    alt: 'Kurma Madinah 2 — 11-1, Jalan USJ Heights 1/1B, USJ Heights, Subang Jaya, Selangor. Contact: 011-6936 9984',
  },
  {
    src: `${IMAGE_BASE}/Beard%20Brothers%20PJ.png`,
    alt: "Beard Brothers' BBQ, PJ — P-G-01, Tropicana Avenue, Persiaran Tropicana, Golf & Country Resort, Petaling Jaya, Selangor. Contact: 012-319 0962",
  },
  {
    src: '/images/Mister%20Pizza.png',
    alt: 'Mister Pizza Malaysia — Surau Al-Mauizhah, Bandar Hill Park, Persiaran Hill Park, Puncak Alam, Selangor. Contact: 011-6061 4255',
  },
  {
    src: `${IMAGE_BASE}/Hadramawt%20Neo%20Damansara.png`,
    alt: 'Hadramawt Restaurant, Neo Damansara — Neo Damansara, Petaling Jaya, Selangor. Contact: +603-4100-0003',
  },
] as const

const MELAKA_IMAGES = [
  {
    src: `${IMAGE_BASE}/Ben%20Salleh.png`,
    alt: 'Ben Salleh (Kedai Kurma & Makanan Sunnah) — 26, Jln TMS 8, Taman Tanjung Minyak Setia, Melaka. Contact: 017-374 6398',
  },
] as const

const JOHOR_IMAGES = [
  {
    src: `${IMAGE_BASE}/Kedai%20Kurma.png`,
    alt: "Kedai Kurma — 34, Jalan Gambir 2, Bandar Baru Bukit Gambir, Bukit Gambir, Tangkak, Johor Darul Ta'zim. Contact: 019-726 0855",
  },
  {
    src: `${IMAGE_BASE}/Beard%20Brothers%20JB.png`,
    alt: "Beard Brothers' BBQ, JB — Lot B-0-3, Tebing @, Bandar Dato Onn, Johor Bahru. Contact: 012-314 9637",
  },
  {
    src: `${IMAGE_BASE}/Kedai%20Kurma%20Batu%20Pahat.png`,
    alt: 'Kedai Kurma, Batu Pahat — Batu Pahat, Johor',
  },
] as const

const PULAU_PINANG_IMAGES = [
  {
    src: `${IMAGE_BASE}/Kapitan%20Ara..png`,
    alt: 'Kapitan Tandoori House @ Sungai Ara — R-01-05 Setia Triangle, Persiaran Kelicap, Sungai Ara, Bayan Lepas, Pulau Pinang. Contact: 010-268 7011',
  },
  {
    src: `${IMAGE_BASE}/Kapitan%20Bukit%20Mertajam.png`,
    alt: 'Kapitan Tandoori House @ Bandar Perda — G36, Jalan Perda Selatan, De\'Rendezuous, Bukit Mertajam, Pulau Pinang. Contact: 010-256 7011',
  },
  {
    src: `${IMAGE_BASE}/Khalifah%20Bukit%20Mertajam.png`,
    alt: 'Khalifah Eksklusif — 2, Tingkat Ciku 1, Taman Ciku, Bukit Mertajam, Pulau Pinang. Contact: 019-288 2786',
  },
] as const

const KEDAH_IMAGES = [
  {
    src: `${IMAGE_BASE}/Kapitan%20Penang.png`,
    alt: 'Kapitan Tandoori House @ Lunas Kulim — 28, Jalan Saujana 2, Taman Industri Saujana, Lunas, Kedah. Contact: 010-396 7011',
  },
] as const

const KELANTAN_IMAGES = [
  {
    src: `${IMAGE_BASE}/Jaffar%20Tunjung.png`,
    alt: 'Jaffar Rawas Tunjung — Pt 510–515 Tingkat 1, Jalan Kuala Krai, Bandar Baharu Tunjung, Kota Bharu, Kelantan. Contact: 017-542 4011',
  },
  {
    src: `${IMAGE_BASE}/Jaffar%20KB.png`,
    alt: 'Jaffar Rawas Kota Bharu — 18T-B, Jalan Dato Pati, Kota Bharu, Kelantan. Contact: 011-1535 2347',
  },
] as const

const LANGKAWI_IMAGES = [
  {
    src: `${IMAGE_BASE}/2.jpg`,
    alt: 'Tropical Charters — Koperasi Kakitangan Tropical Charters Berhad, 12-3, Langkawi Boulevard Langkawi City, Jalan Mahawangsa 1, Kuah, Langkawi. Contact: 04-952 3641',
  },
  {
    src: `${IMAGE_BASE}/Lokasi%20Terbaru%20Langkawi.png`,
    alt: 'Tasik Dayang Bunting — Tasik Dayang Bunting, Kuah, Langkawi. Contact: 03-26164488',
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
] as const

// Gallery/section order: Kuala Lumpur → Selangor → Negeri Sembilan → Melaka → Johor → Pulau Pinang → Kedah → Kelantan → Langkawi
// Langkawi stays as its own gallery section but counts as Kedah for the "States" stat (8 total).
const STATE_ORDER = [
  'Kuala Lumpur',
  'Selangor',
  'Negeri Sembilan',
  'Melaka',
  'Johor',
  'Pulau Pinang',
  'Kedah',
  'Kelantan',
  'Langkawi',
] as const

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
  25: 'Kuala Lumpur', // Edar Mart, Desa Pandan
}

type GalleryImage = { src: string; alt: string }

const STATE_GALLERY_IMAGES: Record<(typeof STATE_ORDER)[number], readonly GalleryImage[]> = {
  'Kuala Lumpur': KL_EXTRA_IMAGES,
  Selangor: SELANGOR_EXTRA_IMAGES,
  'Negeri Sembilan': [],
  Melaka: MELAKA_IMAGES,
  Johor: JOHOR_IMAGES,
  'Pulau Pinang': PULAU_PINANG_IMAGES,
  Kedah: KEDAH_IMAGES,
  Kelantan: KELANTAN_IMAGES,
  Langkawi: LANGKAWI_IMAGES,
}

function getGridImageSrc(num: number) {
  if (num === 1) return GRID_IMAGE_KL_FIRST
  if (num === 2) return GRID_IMAGE_2026_2
  if (num === 3) return GRID_IMAGE_RIVERSIDE
  if (num === 21) return GRID_IMAGE_KUNAFA_CRISP
  if (num === 22) return GRID_IMAGE_SSSETEL_PARLIMEN
  if (num === 23) return GRID_IMAGE_WOP
  if (num === 25) return GRID_IMAGE_EDAR_MART
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
  if (num === 25)
    return 'Edar Mart — Jalan 2/76c, Desa Pandan, Kuala Lumpur. Instagram: @edarmart.my'
  return `Location ${num}`
}

function LocationImageCard({
  image,
  label,
  onEnlarge,
}: {
  image: GalleryImage
  label: string
  onEnlarge: () => void
}) {
  return (
    <motion.article
      variants={fadeInUp}
      className="rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-salaam-red-500 focus-visible:ring-offset-2"
      onClick={onEnlarge}
      onKeyDown={(e) => e.key === 'Enter' && onEnlarge()}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <img src={image.src} alt={image.alt} className="w-full h-auto block" loading="lazy" />
    </motion.article>
  )
}

export function LocateUsPageClient() {
  // Same totals as map counters: 71 locations (excl. coming-soon), 8 states (Langkawi→Kedah)
  const { locationCount, stateCount } = useMemo(() => getStoreLocationStats(), [])
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
    | { type: 'slot'; num: number }
    | { type: 'gallery'; src: string; alt: string }
    | null
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
          <motion.div variants={fadeInUp} className="mt-8">
            <LocationStatsCounters
              locationCount={locationCount}
              stateCount={stateCount}
              inViewAmount={0.2}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Images grouped by state (same order as map list) */}
      <section className="container-padding pb-20 space-y-16">
        {STATE_ORDER.map((stateName) => {
          const slots = slotsByState[stateName] ?? []
          const galleryImages = STATE_GALLERY_IMAGES[stateName]

          if (slots.length === 0 && galleryImages.length === 0) return null

          // When a state has grid slots, render the first gallery image ahead of
          // the slots so it appears first overall in that section; the remaining
          // gallery images follow the slots. States without slots keep their order.
          const leadGalleryImage = slots.length > 0 ? galleryImages[0] : undefined
          const trailingGalleryImages = slots.length > 0 ? galleryImages.slice(1) : galleryImages

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
              <motion.div className="grid grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
                {leadGalleryImage && (
                  <LocationImageCard
                    key={leadGalleryImage.src}
                    image={leadGalleryImage}
                    label={`View ${leadGalleryImage.alt.split(' — ')[0]} enlarged`}
                    onEnlarge={() =>
                      setEnlarged({ type: 'gallery', src: leadGalleryImage.src, alt: leadGalleryImage.alt })
                    }
                  />
                )}
                {slots.map((num) => (
                  <motion.article
                    key={`slot-${num}`}
                    variants={fadeInUp}
                    className="rounded-2xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-salaam-red-500 focus-visible:ring-offset-2"
                    onClick={() => setEnlarged({ type: 'slot', num })}
                    onKeyDown={(e) => e.key === 'Enter' && setEnlarged({ type: 'slot', num })}
                    tabIndex={0}
                    role="button"
                    aria-label={
                      num === 1
                        ? 'View High Street Art Cafe enlarged'
                        : num === 2
                          ? 'View Nasi Kerabu Keramat locations enlarged'
                          : num === 3
                            ? 'View Riverside Cafe WTCKL enlarged'
                            : num === 21
                              ? 'View Kunafa Crisp enlarged'
                              : num === 22
                                ? 'View Sssetel Mart Parlimen enlarged'
                                : num === 23
                                  ? 'View WOP Pizzeria enlarged'
                                  : num === 25
                                    ? 'View Edar Mart enlarged'
                                    : `View location ${num} enlarged`
                    }
                  >
                    <img
                      src={getGridImageSrc(num)}
                      alt={getGridImageAlt(num)}
                      className="w-full h-auto block"
                      loading={num === 1 ? 'eager' : 'lazy'}
                    />
                  </motion.article>
                ))}
                {trailingGalleryImages.map((image) => (
                  <LocationImageCard
                    key={image.src}
                    image={image}
                    label={`View ${image.alt.split(' — ')[0]} enlarged`}
                    onEnlarge={() => setEnlarged({ type: 'gallery', src: image.src, alt: image.alt })}
                  />
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
                  enlarged.type === 'gallery'
                    ? enlarged.src
                    : getGridImageSrc(enlarged.num)
                }
                alt={
                  enlarged.type === 'gallery'
                    ? enlarged.alt
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
