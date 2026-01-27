'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { HeartHandshake, Store, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'

const pledges = [
  {
    icon: HeartHandshake,
    title: 'Sip with Purpose',
    description: 'Join the mission for global humanitarian aids',
    gradient: 'from-salaam-red-500 to-red-600',
    bgGradient: 'from-salaam-red-50 to-red-100',
  },
  {
    icon: Store,
    title: 'Business',
    description: 'Distribute Salaam Cola at your premise',
    gradient: 'from-salaam-red-500 to-red-600',
    bgGradient: 'from-salaam-red-50 to-red-100',
  },
]

export function PledgeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-salaam-red-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-quora font-black text-center text-salaam-red-500 mb-12 md:mb-16"
        >
          Join Us
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {pledges.map((pledge, index) => {
            const Icon = pledge.icon
            return (
              <motion.div
                key={pledge.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="relative bg-white/20 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-white/50 overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${pledge.gradient} opacity-10 rounded-full blur-2xl`}></div>
                  
                  {/* Icon container */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring' }}
                    className="relative mb-6"
                  >
                    <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl bg-gradient-to-br ${pledge.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                    </div>
                    {/* Decorative ring */}
                    <div className={`absolute inset-0 rounded-2xl border-2 border-white/30 scale-110`}></div>
                  </motion.div>

                  {/* Content */}
                  <div className="relative text-center">
                    <h3 className="font-quora font-bold text-xl md:text-2xl text-gray-900 mb-3 group-hover:text-salaam-red-500 transition-colors duration-300">
                      {pledge.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {pledge.description}
                    </p>
                  </div>

                  {/* Hover effect glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pledge.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Join Us Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <Link
            href="/join-us"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-salaam-red-500 to-red-600 text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-salaam-red-500/50 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Join Us</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            {/* Hover effect gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-salaam-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
