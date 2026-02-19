'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      lerp: 0.1,
    })

    lenisRef.current = lenis
    
    // Make Lenis instance available globally for PageTransition to use
    ;(window as any).lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  // Scroll to top when pathname changes
  useEffect(() => {
    if (lenisRef.current) {
      // Scroll to top smoothly when route changes
      lenisRef.current.scrollTo(0, { duration: 0.5, immediate: false })
    }
  }, [pathname])

  return <>{children}</>
}
