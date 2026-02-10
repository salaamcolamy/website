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

/** Tags to display for a product; includes Ramadhan/carton tags for 6-pack and carton products. */
export function getDisplayTags(handle: string, title: string, tags: string[]): string[] {
  const preOrderTag = 'Ramadhan Pre-Order Starts 16 Feb'
  const cartonTag = 'Order Starts 16 Feb'
  if (is6Pack(handle, title)) {
    return tags.includes(preOrderTag) ? tags : [preOrderTag, ...tags]
  }
  if (isCarton(handle, title)) {
    return tags.includes(cartonTag) ? tags : [cartonTag, ...tags]
  }
  return tags
}
