'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    // Prevent scrolling during splash
    if (showSplash) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    // Auto-dismiss after animation completes (reduced from 2800ms for faster feel)
    const timer = setTimeout(() => {
      setShowSplash(false)
      setCanScroll(true)
    }, 1400)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [showSplash])

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-salaam-red-500 overflow-visible"
          >
            {/* Content container */}
            <div className="relative z-10 flex flex-col items-center justify-center overflow-visible">
              {/* Can image with animation */}
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2,
                }}
                className="relative overflow-visible"
              >
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="overflow-visible"
                >
                  <Image
                    src="/images/loader.png"
                    alt="Salaam Cola"
                    width={500}
                    height={800}
                    className="w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-auto object-contain drop-shadow-2xl"
                    style={{ aspectRatio: '500/800' }}
                    priority
                  />
                </motion.div>

                {/* Glow effect behind can */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute inset-0 -z-10 blur-3xl"
                >
                  <div className="w-full h-full bg-white/30 rounded-full" />
                </motion.div>
              </motion.div>

              {/* Loading indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8"
              >
                <motion.div
                  className="w-12 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-full h-full bg-white rounded-full"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - fades in after splash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: canScroll ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  )
}
