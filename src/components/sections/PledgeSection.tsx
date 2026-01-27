'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { HeartHandshake, Store, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'

const pledges = [
  {
    icon: HeartHandshake,
    title: 'Sip with Purpose',
    description: 'Join the mission for global humanitarian aid. Every sip supports communities.',
    accent: 'bg-salaam-red-500',
    glow: 'group-hover:shadow-[0_0_40px_rgba(194,19,22,0.4)]',
  },
  {
    icon: Store,
    title: 'Business',
    description: 'Distribute Salaam Cola at your premise. Partner with a brand that cares.',
    accent: 'bg-amber-500',
    glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.35)]',
  },
]

export function PledgeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-salaam-red-950/90 to-gray-900"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-salaam-red-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 text-amber-400/90 text-sm font-semibold tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Be part of it
          </motion.span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-black text-white uppercase tracking-tight">
            Join Us
          </h2>
          <p className="mt-4 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Whether you sip with purpose or run a business that cares — there&apos;s a place for you.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {pledges.map((pledge, index) => {
            const Icon = pledge.icon
            return (
              <motion.div
                key={pledge.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + index * 0.1,
                  type: 'spring',
                  stiffness: 80,
                  damping: 14,
                }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <Link href="/join-us" className="block h-full">
                  <div
                    className={`relative h-full rounded-2xl md:rounded-3xl p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-white/10 
                      hover:bg-white/10 hover:border-white/20 transition-all duration-500 ${pledge.glow} 
                      overflow-hidden`}
                  >
                    {/* Accent stripe */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 md:w-2 rounded-l-2xl ${pledge.accent} 
                        group-hover:scale-y-105 origin-top transition-transform duration-500`}
                    />

                    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 pl-2">
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl ${pledge.accent} 
                          flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-poppins font-bold text-xl md:text-2xl text-white mb-2 group-hover:text-amber-50 transition-colors">
                          {pledge.title}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed group-hover:text-gray-300 transition-colors">
                          {pledge.description}
                        </p>
                        <span className="inline-flex items-center gap-2 mt-4 text-salaam-red-400 text-sm font-semibold group-hover:gap-3 transition-all">
                          Learn more
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>

                    {/* Hover gradient */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                        bg-gradient-to-r ${pledge.accent === 'bg-salaam-red-500' ? 'from-salaam-red-500/5' : 'from-amber-500/5'} to-transparent pointer-events-none`}
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-14 md:mt-16"
        >
          <Link
            href="/join-us"
            className="group inline-flex items-center gap-3 px-10 py-4 md:px-12 md:py-5 
              bg-white text-gray-900 rounded-full font-poppins font-bold text-lg
              hover:bg-salaam-red-500 hover:text-white 
              shadow-xl hover:shadow-[0_0_50px_rgba(194,19,22,0.4)]
              transition-all duration-300"
          >
            Join Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
