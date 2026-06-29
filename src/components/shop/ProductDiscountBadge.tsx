import { cn } from '@/lib/utils'

interface ProductDiscountBadgeProps {
  className?: string
  label?: string
}

/** Site-wide product promo tag shown on shop listings and product cards. */
export function ProductDiscountBadge({
  className,
  label = '10% OFF',
}: ProductDiscountBadgeProps) {
  return (
    <span
      className={cn(
        'absolute top-3 left-3 z-10 px-2.5 py-1 bg-salaam-red-500 text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wide',
        className
      )}
    >
      {label}
    </span>
  )
}
