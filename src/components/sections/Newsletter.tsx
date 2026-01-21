'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { Mail, Send, Check, Gift } from 'lucide-react'
import Image from 'next/image'

export function Newsletter() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In production, this would be an actual API call
    setStatus('success')
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section className="py-20 bg-salaam-red-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        {/* Wave patterns */}
        <svg
          className="absolute top-0 left-0 right-0 w-full h-20"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(255,255,255,0.1)"
            d="M0,40 C320,80 420,0 740,40 C1060,80 1140,0 1440,40 L1440,0 L0,0 Z"
          />
        </svg>

        {/* Decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Product image */}
          <motion.div variants={fadeInLeft} className="relative hidden lg:block">
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-64 h-80 mx-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=500&fit=crop"
                alt="Mister Cola"
                fill
                className="object-contain drop-shadow-2xl"
              />
              {/* Glow */}
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl -z-10 scale-150" />
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeInRight} className="text-center lg:text-left">
            <GlassCard
              variant="dark"
              className="bg-white/10 backdrop-blur-xl border-white/20 p-8 md:p-10"
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/80 font-medium">{t('badge')}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {t('title')}
                  </h2>
                  <p className="text-white/70">{t('subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <GlassInput
                      type="email"
                      placeholder={t('placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      leftIcon={<Mail className="w-5 h-5" />}
                      disabled={status === 'loading' || status === 'success'}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />

                    <GlassButton
                      type="submit"
                      variant="secondary"
                      size="lg"
                      isLoading={status === 'loading'}
                      rightIcon={
                        status === 'success' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )
                      }
                    >
                      {status === 'success' ? t('success') : t('cta')}
                    </GlassButton>
                  </div>

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white/80 text-sm"
                    >
                      {t('error')}
                    </motion.p>
                  )}
                </form>

                <p className="text-xs text-white/50">{t('privacy')}</p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
