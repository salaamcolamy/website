'use client'

import Image from 'next/image'

const BANNER_SRC = '/images/RAYA10%20Hero%20Website-2.png'

/** Raya-End Sales promo — used on shop listing and product detail pages */
export function RayaPromoBanner() {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8 md:mb-10 rounded-2xl overflow-hidden shadow-xl shadow-gray-900/10 ring-1 ring-black/5 bg-white">
      <Image
        src={BANNER_SRC}
        alt="Raya-End Sales: 10% off with code RAYA10 from 18–30 April on the official website and TikTok Shop"
        width={1366}
        height={768}
        className="w-full h-auto"
        priority
        sizes="(max-width: 1280px) 100vw, 1152px"
      />
    </div>
  )
}
