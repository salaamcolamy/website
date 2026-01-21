'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonHover, buttonTap } from '@/lib/animations'

interface GlassButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      onClick,
    },
    ref
  ) => {
    const baseStyles =
      'relative overflow-hidden rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-salaam-red-500 text-white hover:bg-salaam-red-600 shadow-glow-red',
      secondary:
        'bg-white/20 backdrop-blur-md border border-white/30 text-gray-900 hover:bg-white/30',
      ghost:
        'bg-transparent border border-white/20 text-gray-900 hover:bg-white/10 backdrop-blur-sm',
      outline:
        'bg-transparent border-2 border-salaam-red-500 text-salaam-red-500 hover:bg-salaam-red-500 hover:text-white',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        onClick={onClick}
        whileHover={!disabled && !isLoading ? buttonHover : undefined}
        whileTap={!disabled && !isLoading ? buttonTap : undefined}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}

        {/* Button content */}
        <span className="relative z-10">{children}</span>

        {/* Right icon */}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}

        {/* Shimmer effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          whileHover={{ translateX: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    )
  }
)

GlassButton.displayName = 'GlassButton'

export { GlassButton }
