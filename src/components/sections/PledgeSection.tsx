'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TreePine, Truck, CreditCard, RotateCcw } from 'lucide-react'

const pledges = [
  {
    icon: TreePine,
    title: 'Sip with Purpose',
    description: 'Join the mission for global humanitarian aids',
  },
  {
    icon: Truck,
    title: 'Business',
    description: 'Distribute Salaam Cola at your premise',
  },
  {
    icon: CreditCard,
    title: 'Pay Later',
    description: 'Buy now, pay later in four easy installments',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Within 14 days of purchase date',
  },
]

export function PledgeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10"
        >
          Join Us
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {pledges.map((pledge, index) => (
            <motion.div
              key={pledge.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <pledge.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{pledge.title}</h3>
              <p className="text-xs md:text-sm text-gray-500">{pledge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
