'use client'

import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return { ref, scrollYProgress, opacity, y, scale }
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}px`, `${-speed * 100}px`]
  )

  return { ref, y }
}

export function useHeroParallax() {
  const { scrollY } = useScroll()

  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])

  return { y, opacity, scale }
}
