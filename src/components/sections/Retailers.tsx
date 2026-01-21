'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

// Retailer logos - using text placeholders
const retailers = [
  { name: 'AEON', color: '#E60012' },
  { name: 'myNEWS', color: '#00A651' },
  { name: '7-Eleven', color: '#FF6900' },
  { name: 'Tesco', color: '#00539F' },
  { name: 'Giant', color: '#F4A900' },
  { name: 'KK Mart', color: '#E31E24' },
]

export function Retailers() {
  const t = useTranslations('retailers')

  return (
    <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-8"
        >
          {/* Section header */}
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              {t('title')}
            </p>
            <p className="text-gray-600">{t('subtitle')}</p>
          </motion.div>

          {/* Retailers logos */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {retailers.map((retailer, index) => (
              <motion.div
                key={retailer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div
                  className="px-6 py-3 rounded-lg bg-white shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:border-gray-200"
                >
                  <span
                    className="text-xl font-bold transition-colors duration-300"
                    style={{ color: retailer.color }}
                  >
                    {retailer.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
