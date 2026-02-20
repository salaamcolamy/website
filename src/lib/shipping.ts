/**
 * Shipping Calculator — Matches Shopify shipping zones configuration
 *
 * Peninsular Malaysia: RM 10.50 for first 3kg, RM 2.00 per additional kg
 * East Malaysia:       RM 11.00 per kg (flat rate)
 *
 * Product weights: 6-pack = 2.5kg, 24-pack = 8kg
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
  }
  error?: string
}

function classifyRegion(state: string): Region {
  if (!state?.trim()) return 'unknown'
  const norm = state.trim().toLowerCase()

  if (BLOCKED_STATES.some(s => norm.includes(s))) return 'blocked'
  if (PENINSULAR_STATES.some(s => norm.includes(s))) return 'peninsular'
  if (EAST_MALAYSIA_STATES.some(s => norm.includes(s))) return 'east_malaysia'

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
    return 2.5
  }
  return 0.4
}

export function calculateShipping(state: string, cartItems: CartItemForShipping[]): ShippingResult {
  const region = classifyRegion(state)
  const emptyBreakdown = { region: 'unknown', totalWeightKg: 0, baseRate: 0, additionalWeightCharge: 0 }

  if (region === 'blocked') {
    return { success: false, shippingCost: 0, breakdown: { ...emptyBreakdown, region: 'blocked' }, error: 'Shipping to Labuan is currently not available.' }
  }

  if (region === 'unknown') {
    return { success: false, shippingCost: 0, breakdown: emptyBreakdown, error: 'Unable to determine shipping region. Please check your state/province.' }
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, shippingCost: 0, breakdown: { ...emptyBreakdown, region }, error: 'Cart is empty.' }
  }

  let totalWeightKg = 0
  for (const item of cartItems) {
    totalWeightKg += estimateItemWeight(item) * item.quantity
  }

  const weightCeiled = Math.ceil(totalWeightKg)

  let baseRate = 0
  let additionalWeightCharge = 0
  let regionLabel = ''

  if (region === 'peninsular') {
    // Peninsular: RM 10.50 for first 3kg, then RM 2.00 per additional kg
    baseRate = 10.50
    additionalWeightCharge = Math.max(0, weightCeiled - 3) * 2.00
    regionLabel = 'Peninsular Malaysia'
  } else {
    // East Malaysia: RM 11.00 per kg (flat rate)
    baseRate = 0
    additionalWeightCharge = weightCeiled * 11.00
    regionLabel = 'East Malaysia'
  }

  const shippingCost = Math.round((baseRate + additionalWeightCharge) * 100) / 100

  return {
    success: true,
    shippingCost,
    breakdown: { region: regionLabel, totalWeightKg, baseRate, additionalWeightCharge },
  }
}
