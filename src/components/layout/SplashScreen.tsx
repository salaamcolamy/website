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

    // Auto-dismiss after animation completes
    const timer = setTimeout(() => {
      setShowSplash(false)
      setCanScroll(true)
    }, 2800)

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
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-salaam-red-500 overflow-hidden"
          >
            {/* Animated background waves */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.svg
                className="absolute bottom-0 left-0 w-[200%] h-[60%]"
                viewBox="0 0 2880 320"
                preserveAspectRatio="none"
                animate={{ x: [0, -1440] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <path
                  fill="rgba(0,0,0,0.1)"
                  d="M0,160L60,170.7C120,181,240,203,360,208C480,213,600,203,720,176C840,149,960,107,1080,101.3C1200,96,1320,128,1440,154.7C1560,181,1680,203,1800,197.3C1920,192,2040,160,2160,154.7C2280,149,2400,171,2520,176C2640,181,2760,171,2820,165.3L2880,160L2880,320L0,320Z"
                />
              </motion.svg>
              <motion.svg
                className="absolute bottom-0 left-0 w-[200%] h-[40%]"
                viewBox="0 0 2880 320"
                preserveAspectRatio="none"
                animate={{ x: [-1440, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <path
                  fill="rgba(255,255,255,0.05)"
                  d="M0,224L60,218.7C120,213,240,203,360,192C480,181,600,171,720,181.3C840,192,960,224,1080,229.3C1200,235,1320,213,1440,197.3C1560,181,1680,171,1800,176C1920,181,2040,203,2160,208C2280,213,2400,203,2520,186.7C2640,171,2760,149,2820,138.7L2880,128L2880,320L0,320Z"
                />
              </motion.svg>
            </div>

            {/* Content container */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Can image with animation */}
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2,
                }}
                className="relative"
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
                >
                  <Image
                    src="/images/hero/Can-Mockup-V2.webp"
                    alt="Salaam Cola"
                    width={300}
                    height={600}
                    className="h-[350px] md:h-[450px] lg:h-[500px] w-auto drop-shadow-2xl"
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

              {/* Brand text */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 text-center"
              >
                <h1 className="text-4xl md:text-5xl font-quora font-black text-white uppercase tracking-wider">
                  Salaam Cola
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mt-2 text-white/80 text-sm md:text-base"
                >
                  Taste The Freedom
                </motion.p>
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
