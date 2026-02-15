import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

const intlMiddleware = createMiddleware(routing, {
  localeDetection: false
})

export default function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Enforce non-www canonical host
  const host = request.headers.get('host')
  if (host?.toLowerCase().startsWith('www.')) {
    const next = url.clone()
    next.host = host.slice(4)
    return NextResponse.redirect(next, 308)
  }

  // Normalize trailing slash to avoid duplicate URLs
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    const next = url.clone()
    next.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(next, 308)
  }

  // Root: rewrite to default locale so the page is served (avoids 404 on /)
  if (url.pathname === '/') {
    const next = url.clone()
    next.pathname = `/${routing.defaultLocale}`
    return NextResponse.rewrite(next)
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
