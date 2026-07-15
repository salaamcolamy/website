'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

type CounterPhase = 'idle' | 'flicker' | 'settle' | 'done'

function randomSlotValue(target: number, flickerProgress: number) {
  const digits = String(Math.max(target, 1)).length
  const maxVal = 10 ** digits - 1
  const minVal = digits > 1 ? 10 ** (digits - 1) : 0

  if (flickerProgress > 0.72) {
    const spread = Math.max(1, Math.ceil((1 - flickerProgress) * target * 0.55))
    return Math.min(maxVal, Math.max(minVal, target + Math.floor(Math.random() * spread * 2) - spread))
  }

  return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
}

function useAnimatedCounter(target: number, active: boolean, prefersReducedMotion: boolean | null) {
  const [state, setState] = useState<{ value: number; opacity: number; phase: CounterPhase }>({
    value: 0,
    opacity: 1,
    phase: 'idle',
  })

  useEffect(() => {
    if (!active) return

    if (prefersReducedMotion) {
      setState({ value: target, opacity: 1, phase: 'done' })
      return
    }

    // Longer, faster race so flicker is obvious on first paint
    const flickerMs = 1000
    const settleMs = 280
    const flickerIntervalMs = 28
    const start = performance.now()
    let frameId = 0
    let lastDigit = 0
    let lastDigitAt = 0
    let settleFrom = 0

    const tick = (now: number) => {
      const elapsed = now - start

      if (elapsed < flickerMs) {
        const flickerProgress = elapsed / flickerMs
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 0.045)
        const opacity = 0.42 + pulse * 0.58

        if (elapsed - lastDigitAt >= flickerIntervalMs) {
          lastDigitAt = elapsed
          lastDigit = randomSlotValue(target, flickerProgress)
        }

        setState({ value: lastDigit, opacity, phase: 'flicker' })
        frameId = requestAnimationFrame(tick)
        return
      }

      if (elapsed < flickerMs + settleMs) {
        if (settleFrom === 0 && lastDigit !== target) {
          settleFrom = lastDigit
        }

        const settleProgress = (elapsed - flickerMs) / settleMs
        const eased = 1 - (1 - settleProgress) ** 4
        const value = Math.round(settleFrom + (target - settleFrom) * eased)

        setState({ value, opacity: 1, phase: 'settle' })
        frameId = requestAnimationFrame(tick)
        return
      }

      setState({ value: target, opacity: 1, phase: 'done' })
    }

    lastDigit = randomSlotValue(target, 0)
    lastDigitAt = 0
    settleFrom = 0
    setState({ value: lastDigit, opacity: 0.55, phase: 'flicker' })
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [active, prefersReducedMotion, target])

  return state
}

function AnimatedStatCard({
  label,
  target,
  active,
  prefersReducedMotion,
  theme,
}: {
  label: string
  target: number
  active: boolean
  prefersReducedMotion: boolean | null
  theme: 'light' | 'dark'
}) {
  const { value, opacity, phase } = useAnimatedCounter(target, active, prefersReducedMotion)
  const isFlickering = phase === 'flicker'

  return (
    <div className="glass-card glow-red min-w-[10.5rem] flex-1 max-w-[13rem] rounded-2xl px-6 py-5 text-center border border-white/40 shadow-glass">
      <motion.p
        key={isFlickering ? value : 'locked'}
        initial={
          prefersReducedMotion
            ? false
            : isFlickering
              ? { opacity: 0.45, y: -6, scale: 0.92 }
              : { opacity: 0.85, y: 2, scale: 1.05 }
        }
        animate={{
          opacity,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: isFlickering ? 0.03 : phase === 'settle' ? 0.28 : 0.12,
          ease: isFlickering ? 'linear' : [0.22, 1, 0.36, 1],
        }}
        className="text-[2.8125rem] md:text-[3.375rem] leading-none font-bold text-salaam-red-500 tabular-nums"
        aria-live="polite"
      >
        {value}
      </motion.p>
      <p className={`mt-1 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
        {label}
      </p>
    </div>
  )
}

function isElementVisiblyRendered(el: HTMLElement) {
  let node: HTMLElement | null = el
  while (node) {
    const { opacity, visibility, display } = getComputedStyle(node)
    if (display === 'none' || visibility === 'hidden' || Number(opacity) < 0.05) {
      return false
    }
    node = node.parentElement
  }
  return true
}

export interface LocationStatsCountersProps {
  locationCount: number
  stateCount: number
  className?: string
  /** Soft in-view threshold (hero / above-fold use ~0.2). */
  inViewAmount?: number
  /** When true, wait until the element is actually painted (splash opacity gate). */
  waitForVisibility?: boolean
  /** `dark` = white labels (map sections); `light` = gray labels (Locate Us). */
  theme?: 'light' | 'dark'
}

/**
 * Locations + States counter cards with Locate Us flicker animation.
 * Starts once the row is in view (and optionally once splashes/parents are visible).
 */
export function LocationStatsCounters({
  locationCount,
  stateCount,
  className,
  inViewAmount = 0.35,
  waitForVisibility = true,
  theme = 'light',
}: LocationStatsCountersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: inViewAmount })
  const [countersActive, setCountersActive] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!inView || countersActive) return

    if (!waitForVisibility) {
      setCountersActive(true)
      return
    }

    let cancelled = false
    let timeoutId = 0

    const tryStart = () => {
      if (cancelled) return
      const el = ref.current
      if (el && isElementVisiblyRendered(el)) {
        setCountersActive(true)
        return
      }
      timeoutId = window.setTimeout(tryStart, 80)
    }

    tryStart()
    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [inView, countersActive, waitForVisibility])

  return (
    <div
      ref={ref}
      className={className ?? 'flex flex-wrap justify-center gap-4'}
      aria-label="Salaam Cola coverage summary"
    >
      <AnimatedStatCard
        label="Locations"
        target={locationCount}
        active={countersActive}
        prefersReducedMotion={prefersReducedMotion}
        theme={theme}
      />
      <AnimatedStatCard
        label="States"
        target={stateCount}
        active={countersActive}
        prefersReducedMotion={prefersReducedMotion}
        theme={theme}
      />
    </div>
  )
}
