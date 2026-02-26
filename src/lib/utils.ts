import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currencyCode: string = 'MYR') {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

/** Whether the product is a 6-pack (by handle or title). */
function is6Pack(handle: string, title: string): boolean {
  const s = `${handle} ${title}`.toLowerCase()
  return /6[- ]?pack|6pack/.test(s)
}

/** Whether the product is a carton (by handle or title). */
function isCarton(handle: string, title: string): boolean {
  const s = `${handle} ${title}`.toLowerCase()
  return /carton/.test(s)
}

/** Whether the product is a 24-pack (by handle or title). */
function is24Pack(handle: string, title: string): boolean {
  const s = `${handle} ${title}`.toLowerCase()
  return /24[- ]?pack|24pack/.test(s)
}

/** Category for shop filter: 6-pack, 24-pack, or null (other). */
export function getProductPackCategory(handle: string, title: string): '6-pack' | '24-pack' | null {
  if (is6Pack(handle, title)) return '6-pack'
  if (is24Pack(handle, title)) return '24-pack'
  return null
}

/** Tags to display for a product. Excludes Ramadan Preorder / Order Starts tag. */
export function getDisplayTags(handle: string, title: string, tags: string[]): string[] {
  const hidePattern = /ramadan|ramadhan|pre-?order starts|order starts\s+\d|order starts\s+\d/i
  return tags.filter((t) => !hidePattern.test(t))
}
