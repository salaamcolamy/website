'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { Link } from '@/i18n/routing'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { ArrowRight, Heart, Users, Globe } from 'lucide-react'

const impactStats = [
  { icon: Heart, value: '10K+', label: 'Bottles Donated' },
  { icon: Users, value: '50+', label: 'Communities Reached' },
  { icon: Globe, value: '100%', label: 'Halal Certified' },
]

export function GivingPower() {
  const t = useTranslations('impact')

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-salaam-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gray-100 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Image/Visual side */}
          <motion.div variants={fadeInLeft} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              {/* Glass overlay container */}
              <div className="absolute inset-0 bg-gradient-to-br from-salaam-red-500/20 to-salaam-red-600/30 backdrop-blur-sm rounded-3xl" />

              {/* Placeholder image representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center"
                  >
                    <Heart className="w-12 h-12 text-white" />
                  </motion.div>
                  <p className="text-lg font-medium opacity-90">
                    Community Impact
                  </p>
                </div>
              </div>

              {/* Decorative floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-salaam-red-500/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-salaam-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">50+</p>
                    <p className="text-sm text-gray-500">Communities</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div variants={fadeInRight} className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('title').split(' ').map((word, index) => (
                  <span key={index}>
                    {word === 'POWER' || word === 'KUASA' || word === 'القوة' ? (
                      <span className="text-salaam-red-500">{word}</span>
                    ) : (
                      word
                    )}{' '}
                  </span>
                ))}
              </h2>
              <p className="text-lg text-salaam-red-500 font-medium">
                {t('subtitle')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-salaam-red-500/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-salaam-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <Link href="/about">
              <GlassButton
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {t('cta')}
              </GlassButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
