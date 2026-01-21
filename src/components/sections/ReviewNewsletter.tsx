'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export function ReviewNewsletter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [email, setEmail] = useState('')

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Customer Review */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 text-center md:text-left"
          >
            {/* Star Rating */}
            <div className="flex gap-1 mb-4 justify-center md:justify-start">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
              Finally! A cola brand with morals and ethics! This is an upgrade for all Muslims! Taste was 10/10.
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src="/images/avatar-placeholder.jpg"
                  alt="Claire Johnson"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Claire Johnson</p>
                <p className="text-sm text-gray-500">Verified Buyer</p>
              </div>
            </div>
          </motion.div>

          {/* Newsletter Subscribe */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-salaam-red-500 rounded-2xl p-6 md:p-8 text-white flex flex-col justify-center text-center md:text-left"
          >
            <h3 className="text-xl md:text-3xl font-bold mb-2">
              Subscribe and get{' '}
              <span className="text-white/90">10% off</span> on your first purchase
            </h3>

            <p className="text-white/80 mb-6 text-sm">
              Be the first to know about new arrivals, special offers, in-store events and news.
            </p>

            {/* Email Input */}
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
