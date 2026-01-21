'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Instagram } from 'lucide-react'
import Image from 'next/image'

const instagramPosts = [
  { id: 1, image: '/images/change/WhatsApp Image 2025-12-11 at 23.51.22.jpeg' },
  { id: 2, image: '/images/change/WhatsApp Image 2025-12-11 at 23.51.25.jpeg' },
  { id: 3, image: '/images/change/WhatsApp Image 2025-12-11 at 23.51.26.jpeg' },
  { id: 4, image: '/images/change/WhatsApp Image 2025-12-11 at 23.51.26 (1).jpeg' },
  { id: 5, image: '/images/change/WhatsApp Image 2025-12-11 at 23.51.27.jpeg' },
  { id: 6, image: '/images/change/WhatsApp Image 2025-12-11 at 23.51.27 (1).jpeg' },
]

export function InstagramFeed() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative bg-gray-900 overflow-hidden">
      {/* Header with background image */}
      <div className="relative py-16">
        <div className="absolute inset-0">
          <Image
            src="/images/change/WhatsApp Image 2025-12-11 at 23.51.27.jpeg"
            alt="Instagram background"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Follow us on
              <br />
              Instagram
            </h2>
            <a
              href="https://instagram.com/salaamcola"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              @salaamcola
            </a>
          </motion.div>
        </div>
      </div>

      {/* Instagram Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6">
        {instagramPosts.map((post, index) => (
          <motion.a
            key={post.id}
            href="https://instagram.com/salaamcola"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={post.image}
              alt={`Instagram post ${post.id}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-salaam-red-500/0 group-hover:bg-salaam-red-500/70 transition-colors duration-300 flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
