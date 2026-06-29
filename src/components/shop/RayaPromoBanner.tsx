'use client'

import Image from 'next/image'

const DEFAULT_BANNER_SRC = '/images/hero/RAYA10%20Hero%20Website.jpg'
const DEFAULT_BANNER_ALT =
  'Raya-End Sales: 10% off with code RAYA10 from 18–30 April on the official website and TikTok Shop'

export const AIDILADHA_BANNER_SRC = '/images/hero/Banner%20of%20Aidiladha%20Deals-2.png'
export const AIDILADHA_BANNER_ALT =
  'Aidiladha Deals — Aidiladha Bundle RM128, RM10 off'

export const PAYDAY_SALES_BANNER_SRC = '/images/Web%20Website%20Banner.png'
export const PAYDAY_SALES_BANNER_ALT =
  'Payday Sales — 10% off, 29 Jun – 9 Julai 2026'

type RayaPromoBannerProps = {
  src?: string
  alt?: string
}

/** Promo banner — used on shop listing and product detail pages */
export function RayaPromoBanner({
  src = DEFAULT_BANNER_SRC,
  alt = DEFAULT_BANNER_ALT,
}: RayaPromoBannerProps = {}) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8 md:mb-10 rounded-2xl overflow-hidden shadow-xl shadow-gray-900/10 ring-1 ring-black/5 bg-white">
      <Image
        src={src}
        alt={alt}
        width={2561}
        height={1440}
        className="w-full h-auto"
        priority
        sizes="(max-width: 1280px) 100vw, 1152px"
      />
    </div>
  )
}
