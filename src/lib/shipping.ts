/**
 * Location-based shipping rates for checkout.
 * Adjust the rate tables below to match your delivery zones and pricing.
 */

/** West Malaysia (Peninsular) states */
const WEST_MALAYSIA_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Selangor',
  'Terengganu',
  'Wilayah Persekutuan',
] as const

/** East Malaysia states (typically higher shipping) */
const EAST_MALAYSIA_STATES = ['Sabah', 'Sarawak'] as const

export interface ShippingRates {
  /** Default rate when state is not matched (e.g. international). */
  default: number
  /** West Malaysia (Peninsular) – RM per order */
  westMalaysia: number
  /** East Malaysia (Sabah, Sarawak) – RM per order */
  eastMalaysia: number
}

/** Edit these values to set your shipping prices (RM). */
export const SHIPPING_RATES: ShippingRates = {
  default: 0,
  westMalaysia: 0, // FREE for Peninsular; set e.g. 8 for a flat rate
  eastMalaysia: 15, // e.g. RM 15 for Sabah/Sarawak
}

/**
 * Returns shipping cost in RM for a given state (and optional postcode).
 * Uses state only; postcode can be used later for more granular rules.
 */
export function getShippingForLocation(state: string, _postcode?: string): number {
  if (!state?.trim()) return SHIPPING_RATES.default

  const stateNorm = state.trim()
  if (WEST_MALAYSIA_STATES.includes(stateNorm as (typeof WEST_MALAYSIA_STATES)[number])) {
    return SHIPPING_RATES.westMalaysia
  }
  if (EAST_MALAYSIA_STATES.includes(stateNorm as (typeof EAST_MALAYSIA_STATES)[number])) {
    return SHIPPING_RATES.eastMalaysia
  }

  return SHIPPING_RATES.default
}
