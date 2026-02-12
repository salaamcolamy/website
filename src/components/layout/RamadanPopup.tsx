'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import { scaleInBounce, overlayAnimation } from '@/lib/animations'
import { Mail, X, Check } from 'lucide-react'

export function RamadanPopup() {
  const t = useTranslations('ramadanBanner')
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Wait for splash screen to finish (1400ms) before showing popup
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setEmail('')

      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
      setStatus('error')
      
      // Reset error state after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />

          {/* Popup Modal */}
          <motion.div
            variants={scaleInBounce}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none"
          >
            <GlassCard
              variant="light"
              blur="xl"
              glow
              padding="lg"
              className="w-full max-w-md pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/20 transition-colors z-10"
                aria-label={t('close')}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900"
                  >
                    {t('title')}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-salaam-red-600 font-semibold"
                  >
                    {t('message')}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-gray-600"
                  >
                    {t('subtitle')}
                  </motion.p>
                </div>

                {/* Email Form */}
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <GlassInput
                    type="email"
                    placeholder={t('placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-5 h-5" />}
                    disabled={status === 'loading' || status === 'success'}
                    required
                    className="bg-white/20 border-white/30 text-gray-900 placeholder:text-gray-500"
                  />

                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={status === 'loading'}
                    disabled={status === 'success'}
                    rightIcon={
                      status === 'success' ? (
                        <Check className="w-5 h-5" />
                      ) : undefined
                    }
                    className="w-full"
                  >
                    {status === 'success' ? t('success') : t('cta')}
                  </GlassButton>

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      {t('error')}
                    </motion.p>
                  )}
                </motion.form>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
