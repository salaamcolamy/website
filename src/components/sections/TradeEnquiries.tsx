'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { Building2, Phone, Mail, ArrowRight, Users, TrendingUp, Award } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

const benefits = [
  { icon: TrendingUp, label: 'Growing Market', value: '200%' },
  { icon: Users, label: 'Active Retailers', value: '500+' },
  { icon: Award, label: 'Halal Certified', value: '100%' },
]

export function TradeEnquiries() {
  const t = useTranslations('trade')

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-salaam-red-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-salaam-red-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Product display */}
          <motion.div variants={fadeInLeft} className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Multiple cans display */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src="https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&h=600&fit=crop"
                  alt="Mister Cola Products"
                  fill
                  className="object-contain"
                />
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-salaam-red-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeInRight} className="space-y-8">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-block text-salaam-red-500 font-semibold tracking-wider uppercase text-sm"
              >
                {t('tagline')}
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                {t('title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('description')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  className="text-center"
                >
                  <GlassCard className="p-4" variant="light">
                    <benefit.icon className="w-6 h-6 text-salaam-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{benefit.value}</div>
                    <div className="text-xs text-gray-500">{benefit.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Contact info */}
            <GlassCard className="p-6 space-y-4" variant="light">
              <h3 className="font-semibold text-gray-900">{t('contactTitle')}</h3>
              <div className="space-y-3">
                <a
                  href="tel:+60123456789"
                  className="flex items-center gap-3 text-gray-600 hover:text-salaam-red-500 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+60 12-345 6789</span>
                </a>
                <a
                  href="mailto:trade@salaamcola.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-salaam-red-500 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>trade@salaamcola.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="w-5 h-5" />
                  <span>Kuala Lumpur, Malaysia</span>
                </div>
              </div>
            </GlassCard>

            {/* CTA */}
            <motion.div variants={fadeInUp}>
              <Link href="/contact">
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
        </motion.div>
      </div>
    </section>
  )
}
