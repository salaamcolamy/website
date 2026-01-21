'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'light' | 'dark'
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      variant = 'light',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'w-full rounded-full transition-all duration-300 focus:outline-none focus:ring-2'

    const variants = {
      light:
        'bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 placeholder:text-gray-500 focus:ring-salaam-red-500/50 focus:border-salaam-red-500/50',
      dark:
        'bg-black/10 backdrop-blur-md border border-white/10 text-white placeholder:text-gray-400 focus:ring-salaam-red-500/50 focus:border-salaam-red-500/50',
    }

    const paddingStyles = leftIcon
      ? 'pl-12 pr-4 py-3'
      : rightIcon
      ? 'pl-4 pr-12 py-3'
      : 'px-4 py-3'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              baseStyles,
              variants[variant],
              paddingStyles,
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500/50',
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'

export { GlassInput }
