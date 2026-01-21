'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardHover } from '@/lib/animations'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'light' | 'dark' | 'colored'
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hover?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'light',
      blur = 'lg',
      hover = true,
      glow = false,
      padding = 'md',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'rounded-2xl border backdrop-saturate-150 transition-all duration-300'

    const variants = {
      light: 'bg-white/10 border-white/20 shadow-glass',
      dark: 'bg-black/10 border-white/10 shadow-glass-strong',
      colored: 'bg-salaam-red-500/10 border-salaam-red-500/20',
    }

    const blurStyles = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
      '2xl': 'backdrop-blur-2xl',
    }

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          blurStyles[blur],
          paddingStyles[padding],
          glow && 'shadow-glow-red',
          className
        )}
        whileHover={hover ? cardHover : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }
