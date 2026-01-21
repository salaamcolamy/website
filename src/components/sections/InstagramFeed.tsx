'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TikTokIcon } from '@/components/icons/SocialIcons'
import Image from 'next/image'

export function InstagramFeed() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative bg-gray-900 overflow-hidden py-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/change/WhatsApp Image 2025-12-11 at 23.51.27.jpeg"
          alt="Join Us background"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-quora font-black text-white uppercase tracking-wide">
            Follow Us
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Be part of the Salaam Cola movement. Connect with us on TikTok for the latest updates and behind-the-scenes content!
          </p>

          {/* TikTok Link Button */}
          <motion.a
            href="https://www.tiktok.com/@salaamcolamy"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            <TikTokIcon className="w-6 h-6" />
            <span>Follow us on TikTok</span>
          </motion.a>

          <p className="text-white/50 text-sm">@salaamcolamy</p>
        </motion.div>
      </div>
    </section>
  )
}
