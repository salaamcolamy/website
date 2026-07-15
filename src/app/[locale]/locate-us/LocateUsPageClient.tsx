'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { X } from 'lucide-react'

const IMAGE_BASE = '/images/locate%20us'
const GRID_IMAGE_KL_FIRST = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-4.png` // High Street Art Cafe — first KL slot
const GRID_IMAGE_2026_2 = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-2.png`
const GRID_IMAGE_RIVERSIDE = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola-2.png`
const GRID_IMAGE_KUNAFA_CRISP = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026-3.png`
const GRID_IMAGE_SSSETEL_PARLIMEN = `${IMAGE_BASE}/Lokasi%20Salaam%20Cola%202026%20%281%29.png`
const GRID_IMAGE_WOP = '/images/WOP.png'
const GRID_IMAGE_HADRAMAWT_PUTRAJAYA = `${IMAGE_BASE}/Conezion%20Putrajaya.png`
const GRID_IMAGE_EDAR_MART = `${IMAGE_BASE}/edar%20mart.png`
const TOTAL_SLOTS = 25

const KL_EXTRA_IMAGES = [
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
] as const

const SELANGOR_EXTRA_IMAGES = [
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

/** Map gallery regions that are not separate Malaysian states for the counter. */
const STATE_COUNT_GROUP: Partial<Record<(typeof STATE_ORDER)[number], (typeof STATE_ORDER)[number]>> = {
  Langkawi: 'Kedah',
}

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
  24: 'Selangor', // Hadramawt Putrajaya
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

function getLocateUsStats() {
  const slotCount = Object.keys(SLOT_STATE).length
  const galleryCount = STATE_ORDER.reduce(
    (sum, state) => sum + STATE_GALLERY_IMAGES[state].length,
    0
  )
  const countedStates = new Set(
    STATE_ORDER.filter((state) => {
      const hasSlots = Object.values(SLOT_STATE).includes(state)
      return hasSlots || STATE_GALLERY_IMAGES[state].length > 0
    }).map((state) => STATE_COUNT_GROUP[state] ?? state)
  )

  return {
    locationCount: slotCount + galleryCount,
    stateCount: countedStates.size,
  }
}

type CounterPhase = 'idle' | 'flicker' | 'settle' | 'done'

function randomSlotValue(target: number, flickerProgress: number) {
  const digits = String(Math.max(target, 1)).length
  const maxVal = 10 ** digits - 1
  const minVal = digits > 1 ? 10 ** (digits - 1) : 0

  if (flickerProgress > 0.72) {
    const spread = Math.max(1, Math.ceil((1 - flickerProgress) * target * 0.55))
    return Math.min(maxVal, Math.max(minVal, target + Math.floor(Math.random() * spread * 2) - spread))
  }

  return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
}

function useAnimatedCounter(target: number, active: boolean, prefersReducedMotion: boolean | null) {
  const [state, setState] = useState<{ value: number; opacity: number; phase: CounterPhase }>({
    value: 0,
    opacity: 1,
    phase: 'idle',
  })

  useEffect(() => {
    if (!active) return

    if (prefersReducedMotion) {
      setState({ value: target, opacity: 1, phase: 'done' })
      return
    }

    // Longer, faster race so flicker is obvious on first paint
    const flickerMs = 1000
    const settleMs = 280
    const flickerIntervalMs = 28
    const start = performance.now()
    let frameId = 0
    let lastDigit = 0
    let lastDigitAt = 0
    let settleFrom = 0

    const tick = (now: number) => {
      const elapsed = now - start

      if (elapsed < flickerMs) {
        const flickerProgress = elapsed / flickerMs
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 0.045)
        const opacity = 0.42 + pulse * 0.58

        if (elapsed - lastDigitAt >= flickerIntervalMs) {
          lastDigitAt = elapsed
          lastDigit = randomSlotValue(target, flickerProgress)
        }

        setState({ value: lastDigit, opacity, phase: 'flicker' })
        frameId = requestAnimationFrame(tick)
        return
      }

      if (elapsed < flickerMs + settleMs) {
        if (settleFrom === 0 && lastDigit !== target) {
          settleFrom = lastDigit
        }

        const settleProgress = (elapsed - flickerMs) / settleMs
        const eased = 1 - (1 - settleProgress) ** 4
        const value = Math.round(settleFrom + (target - settleFrom) * eased)

        setState({ value, opacity: 1, phase: 'settle' })
        frameId = requestAnimationFrame(tick)
        return
      }

      setState({ value: target, opacity: 1, phase: 'done' })
    }

    lastDigit = randomSlotValue(target, 0)
    lastDigitAt = 0
    settleFrom = 0
    setState({ value: lastDigit, opacity: 0.55, phase: 'flicker' })
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [active, prefersReducedMotion, target])

  return state
}

function AnimatedStatCard({
  label,
  target,
  active,
  prefersReducedMotion,
}: {
  label: string
  target: number
  active: boolean
  prefersReducedMotion: boolean | null
}) {
  const { value, opacity, phase } = useAnimatedCounter(target, active, prefersReducedMotion)
  const isFlickering = phase === 'flicker'

  return (
    <div className="glass-card glow-red min-w-[10.5rem] flex-1 max-w-[13rem] rounded-2xl px-6 py-5 text-center border border-white/40 shadow-glass">
      <motion.p
        key={isFlickering ? value : 'locked'}
        initial={
          prefersReducedMotion
            ? false
            : isFlickering
              ? { opacity: 0.45, y: -6, scale: 0.92 }
              : { opacity: 0.85, y: 2, scale: 1.05 }
        }
        animate={{
          opacity,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: isFlickering ? 0.03 : phase === 'settle' ? 0.28 : 0.12,
          ease: isFlickering ? 'linear' : [0.22, 1, 0.36, 1],
        }}
        className="text-[2.8125rem] md:text-[3.375rem] leading-none font-bold text-salaam-red-500 tabular-nums"
        aria-live="polite"
      >
        {value}
      </motion.p>
      <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
    </div>
  )
}

function getGridImageSrc(num: number) {
  if (num === 1) return GRID_IMAGE_KL_FIRST
  if (num === 2) return GRID_IMAGE_2026_2
  if (num === 3) return GRID_IMAGE_RIVERSIDE
  if (num === 21) return GRID_IMAGE_KUNAFA_CRISP
  if (num === 22) return GRID_IMAGE_SSSETEL_PARLIMEN
  if (num === 23) return GRID_IMAGE_WOP
  if (num === 24) return GRID_IMAGE_HADRAMAWT_PUTRAJAYA
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
  if (num === 24)
    return 'Hadramawt Putrajaya — M-G-01, Conezion Commercial, Persiaran IRC 3, Putrajaya. Contact: 017-500 4011'
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

function isElementVisiblyRendered(el: HTMLElement) {
  let node: HTMLElement | null = el
  while (node) {
    const { opacity, visibility, display } = getComputedStyle(node)
    if (display === 'none' || visibility === 'hidden' || Number(opacity) < 0.05) {
      return false
    }
    node = node.parentElement
  }
  return true
}

export function LocateUsPageClient() {
  const heroRef = useRef<HTMLDivElement>(null)
  // Soft threshold — hero is above the fold; splash/parent opacity is the real gate below
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 })
  const [countersActive, setCountersActive] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { locationCount, stateCount } = useMemo(() => getLocateUsStats(), [])
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

  // Start flicker only once the hero is in view AND actually visible (splash keeps
  // children at opacity 0 for ~1.4s — without this gate the race finishes unseen).
  useEffect(() => {
    if (!heroInView || countersActive) return

    let cancelled = false
    let timeoutId = 0

    const tryStart = () => {
      if (cancelled) return
      const el = heroRef.current
      if (el && isElementVisiblyRendered(el)) {
        setCountersActive(true)
        return
      }
      timeoutId = window.setTimeout(tryStart, 80)
    }

    tryStart()
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [heroInView, countersActive])

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
          ref={heroRef}
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
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex flex-wrap justify-center gap-4"
            aria-label="Salaam Cola coverage summary"
          >
            <AnimatedStatCard
              label="Locations"
              target={locationCount}
              active={countersActive}
              prefersReducedMotion={prefersReducedMotion}
            />
            <AnimatedStatCard
              label="States"
              target={stateCount}
              active={countersActive}
              prefersReducedMotion={prefersReducedMotion}
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
                                  : num === 24
                                    ? 'View Hadramawt Putrajaya enlarged'
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
                {galleryImages.map((image) => (
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
