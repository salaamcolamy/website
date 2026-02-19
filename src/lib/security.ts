// Per-endpoint rate limiter (in-memory, suitable for single-instance deployments)
const hits = new Map<string, { count: number; time: number }>()

// Periodic cleanup to prevent memory leaks
const CLEANUP_INTERVAL = 60000 // 1 minute
let lastCleanup = Date.now()

function cleanupOldEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - 120000 // 2 minutes
  for (const [key, val] of hits.entries()) {
    if (val.time < cutoff) hits.delete(key)
  }
}

// Rate limit presets per endpoint category
export const RATE_LIMITS = {
  payment: 10,   // 10 req/min for payment endpoints
  cart: 30,      // 30 req/min for cart operations
  general: 60,   // 60 req/min for general endpoints
} as const

export function rateLimit(ip: string, maxRequests: number = RATE_LIMITS.general, endpoint?: string): boolean {
  const now = Date.now()
  // Use endpoint-scoped key so limits are independent per endpoint
  const key = endpoint ? `${ip}:${endpoint}` : ip
  const entry = hits.get(key) || { count: 0, time: now }

  // Reset if more than 1 minute passed
  if (now - entry.time > 60000) {
    entry.count = 0
    entry.time = now
  }

  entry.count++
  hits.set(key, entry)

  // Periodic cleanup
  cleanupOldEntries()

  return entry.count <= maxRequests
}

// Origin validation
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  // Allow same-origin requests (server-side calls, non-browser clients)
  if (!origin && !referer) return true

  const url = origin || referer || ''
  
  // Allow same-origin requests (when origin matches the request host)
  if (origin && host) {
    try {
      const originUrl = new URL(origin)
      const requestHost = host.split(':')[0] // Remove port if present
      const originHost = originUrl.hostname
      
      // Allow if origin hostname matches request hostname (same-origin)
      if (originHost === requestHost) {
        return true
      }
    } catch {
      // If URL parsing fails, continue with other checks
    }
  }

  // Allow localhost in development
  if (process.env.NODE_ENV === 'development') {
    if (url.includes('localhost') || url.includes('127.0.0.1')) return true
  }

  const allowedDomains = process.env.ALLOWED_ORIGINS?.split(',').map(d => d.trim()).filter(Boolean) || []

  // Check allowed domains with exact hostname matching
  if (allowedDomains.length > 0) {
    try {
      const requestHost = new URL(url).hostname
      return allowedDomains.some(domain => {
        try {
          // Support both bare domains and full URLs
          const allowedHost = domain.startsWith('http') ? new URL(domain).hostname : domain
          return requestHost === allowedHost
        } catch {
          return false
        }
      })
    } catch {
      return false
    }
  }

  // In production, if no ALLOWED_ORIGINS configured, allow same-origin only
  if (process.env.NODE_ENV === 'production') {
    // If we got here and it's not same-origin, reject
    // (same-origin was already checked above)
    console.warn('ALLOWED_ORIGINS not configured in production - rejecting cross-origin request', {
      origin,
      referer,
      host
    })
    return false
  }

  // In development, allow if no restrictions
  return true
}

// Get client IP
export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

// Security middleware wrapper with configurable rate limit
export function withSecurity(
  handler: (req: Request) => Promise<Response>,
  options?: { maxRequests?: number; endpoint?: string }
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    // Validate origin
    if (!validateOrigin(req)) {
      const origin = req.headers.get('origin')
      const host = req.headers.get('host')
      console.error('[Security] Origin validation failed:', {
        origin,
        host,
        referer: req.headers.get('referer'),
        url: req.url
      })
      return Response.json(
        { error: 'Forbidden: Origin not allowed', origin, host },
        { status: 403 }
      )
    }

    // Rate limit with per-endpoint configuration
    const ip = getClientIP(req)
    if (!rateLimit(ip, options?.maxRequests, options?.endpoint)) {
      return Response.json(
        { error: 'Too Many Requests' },
        { status: 429 }
      )
    }

    // Execute handler
    return handler(req)
  }
}
