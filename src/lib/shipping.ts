/**
 * Tranz Alliance Weight-Based Shipping Calculator
 * Ship from: Peninsular Malaysia
 *
 * Rate Card:
 * - Within Peninsular: RM 8.50 (first 2kg) + RM 2.00 per additional 1kg
 * - Peninsular → East MY: RM 11.00 (first 1kg) + RM 11.00 per additional 1kg
 * - Outer carton protection: RM 2.50 per piece
 */

const PENINSULAR_STATES = [
  'johor', 'kedah', 'kelantan', 'melaka', 'negeri sembilan',
  'pahang', 'perak', 'perlis', 'pulau pinang', 'selangor',
  'terengganu', 'kuala lumpur', 'wilayah persekutuan',
  'w.p. kuala lumpur', 'wp kuala lumpur',
  'federal territory of kuala lumpur',
  'putrajaya', 'w.p. putrajaya',
]

const EAST_MALAYSIA_STATES = ['sabah', 'sarawak']

const BLOCKED_STATES = ['labuan', 'w.p. labuan']

type Region = 'peninsular' | 'east_malaysia' | 'blocked' | 'unknown'

export interface CartItemForShipping {
  title: string
  variantTitle?: string
  quantity: number
  productHandle?: string
}

export interface ShippingResult {
  success: boolean
  shippingCost: number
  breakdown: {
    region: string
    totalWeightKg: number
    baseRate: number
    additionalWeightCharge: number
    cartonProtection: number
    totalCartons: number
  }
  error?: string
}

function classifyRegion(state: string): Region {
  if (!state?.trim()) return 'unknown'
  const norm = state.trim().toLowerCase()

  if (BLOCKED_STATES.some(s => norm.includes(s))) return 'blocked'
  if (PENINSULAR_STATES.some(s => norm.includes(s))) return 'peninsular'
  if (EAST_MALAYSIA_STATES.some(s => norm.includes(s))) return 'east_malaysia'

  // Common alternate spellings
  if (norm.includes('penang')) return 'peninsular'
  if (norm.includes('malacca')) return 'peninsular'
  if (norm.includes('n. sembilan')) return 'peninsular'
  if (norm.includes('ns')) return 'peninsular'
  if (norm.includes('kl')) return 'peninsular'

  return 'unknown'
}

function estimateItemWeight(item: CartItemForShipping): number {
  const title = (item.title || '').toLowerCase()
  const handle = (item.productHandle || '').toLowerCase()
  const variant = (item.variantTitle || '').toLowerCase()
  const combined = `${title} ${handle} ${variant}`

  if (combined.includes('24-pack') || combined.includes('24 pack') || combined.includes('24-cans') || combined.includes('24s')) {
    return 8.0
  }
  if (combined.includes('6-pack') || combined.includes('6 pack') || combined.includes('6-cans') || combined.includes('6s')) {
    return 2.0
  }
  // Single can fallback
  return 0.4
}

function countCartons(item: CartItemForShipping): number {
  const title = (item.title || '').toLowerCase()
  const handle = (item.productHandle || '').toLowerCase()
  const variant = (item.variantTitle || '').toLowerCase()
  const combined = `${title} ${handle} ${variant}`

  // 24-pack has 4 inner cartons of 6
  if (combined.includes('24-pack') || combined.includes('24 pack') || combined.includes('24-cans') || combined.includes('24s')) {
    return 4
  }
  // 6-pack is 1 carton
  if (combined.includes('6-pack') || combined.includes('6 pack') || combined.includes('6-cans') || combined.includes('6s')) {
    return 1
  }
  return 1
}

export function calculateShipping(state: string, cartItems: CartItemForShipping[]): ShippingResult {
  const region = classifyRegion(state)

  if (region === 'blocked') {
    return {
      success: false,
      shippingCost: 0,
      breakdown: { region: 'blocked', totalWeightKg: 0, baseRate: 0, additionalWeightCharge: 0, cartonProtection: 0, totalCartons: 0 },
      error: 'Shipping to Labuan is currently not available.',
    }
  }

  if (region === 'unknown') {
    return {
      success: false,
      shippingCost: 0,
      breakdown: { region: 'unknown', totalWeightKg: 0, baseRate: 0, additionalWeightCharge: 0, cartonProtection: 0, totalCartons: 0 },
      error: 'Unable to determine shipping region. Please check your state/province.',
    }
  }

  if (!cartItems || cartItems.length === 0) {
    return {
      success: false,
      shippingCost: 0,
      breakdown: { region, totalWeightKg: 0, baseRate: 0, additionalWeightCharge: 0, cartonProtection: 0, totalCartons: 0 },
      error: 'Cart is empty.',
    }
  }

  // Calculate total weight
  let totalWeightKg = 0
  let totalCartons = 0
  for (const item of cartItems) {
    totalWeightKg += estimateItemWeight(item) * item.quantity
    totalCartons += countCartons(item) * item.quantity
  }

  // Round weight up to nearest kg
  const weightCeiled = Math.ceil(totalWeightKg)

  let baseRate = 0
  let additionalWeightCharge = 0

  if (region === 'peninsular') {
    // Within Peninsular: RM 8.50 (first 2kg) + RM 2.00 per additional 1kg
    baseRate = 8.50
    const additionalKg = Math.max(0, weightCeiled - 2)
    additionalWeightCharge = additionalKg * 2.00
  } else {
    // Peninsular → East Malaysia: RM 11.00 (first 1kg) + RM 11.00 per additional 1kg
    baseRate = 11.00
    const additionalKg = Math.max(0, weightCeiled - 1)
    additionalWeightCharge = additionalKg * 11.00
  }

  // Outer carton protection: RM 2.50 per piece
  const cartonProtection = totalCartons * 2.50

  const shippingCost = baseRate + additionalWeightCharge + cartonProtection

  return {
    success: true,
    shippingCost: Math.round(shippingCost * 100) / 100,
    breakdown: {
      region: region === 'peninsular' ? 'Peninsular Malaysia' : 'East Malaysia',
      totalWeightKg,
      baseRate,
      additionalWeightCharge,
      cartonProtection,
      totalCartons,
    },
  }
}
