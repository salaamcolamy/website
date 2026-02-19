'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Scroll to top when route changes
  useEffect(() => {
    // Use Lenis if available (from SmoothScroll), otherwise use window.scrollTo
    const scrollToTop = () => {
      // Try to use Lenis smooth scroll if available
      const lenisInstance = (window as any).lenis
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 0.5 })
      } else {
        // Fallback to native scroll
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Small delay to ensure page is rendered
    const timeoutId = setTimeout(scrollToTop, 100)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
