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
  const [errorMessage, setErrorMessage] = useState<string>('')

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
    setErrorMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      // Check if response is OK before parsing JSON
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        // If JSON parsing fails, it's likely a server error
        console.error('Failed to parse API response:', parseError)
        setErrorMessage('Server error. Please try again later.')
        setStatus('error')
        setTimeout(() => {
          setStatus('idle')
          setErrorMessage('')
        }, 5000)
        return
      }

      if (!response.ok || !data.success) {
        // Show specific error message
        const errorMsg = data.error || 'Failed to subscribe. Please try again.'
        setErrorMessage(errorMsg)
        setStatus('error')
        
        // Reset error state after 5 seconds
        setTimeout(() => {
          setStatus('idle')
          setErrorMessage('')
        }, 5000)
        return
      }

      // Success - show success message
      setStatus('success')
      setEmail('')
      setErrorMessage('')
      
      // If in demo mode, log it
      if (data.demo) {
        console.log('📧 Demo mode: Email subscription recorded:', data)
      }

      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage('Network error. Please check your connection and try again.')
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
        setErrorMessage(errorMsg)
      }
      
      setStatus('error')
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setErrorMessage('')
      }, 5000)
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
              variant="dark"
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
                className="absolute top-4 right-4 p-2 text-white hover:text-white/90 rounded-full hover:bg-white/20 transition-colors z-10"
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
                    className="text-2xl md:text-3xl font-bold text-white"
                  >
                    {t('title')}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-white font-semibold"
                  >
                    {t('message')}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-white"
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
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
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
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-red-900/40 border border-white/30"
                    >
                      <p className="text-white text-sm text-center font-medium">
                        {errorMessage || t('error')}
                      </p>
                      {errorMessage?.includes('not configured') && (
                        <p className="text-white/90 text-xs text-center mt-2">
                          Please contact support or check the setup guide.
                        </p>
                      )}
                    </motion.div>
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
