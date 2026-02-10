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

/** Tags to display for a product; includes "Pre-Order" for 6-pack products. */
export function getDisplayTags(handle: string, title: string, tags: string[]): string[] {
  const preOrder = 'Pre-Order'
  if (is6Pack(handle, title)) {
    return tags.includes(preOrder) ? tags : [preOrder, ...tags]
  }
  return tags
}
