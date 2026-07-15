import Link from 'next/link'
import { routing } from '@/i18n/routing'

export default function NotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0a0a',
          color: '#f5f5f5',
        }}
      >
        <main style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ margin: '0 0 0.5rem', opacity: 0.7, letterSpacing: '0.08em' }}>404</p>
          <h1 style={{ margin: '0 0 1rem', fontSize: '1.75rem' }}>Page not found</h1>
          <Link
            href={`/${routing.defaultLocale}`}
            style={{ color: '#c21316', textDecoration: 'underline' }}
          >
            Back to home
          </Link>
        </main>
      </body>
    </html>
  )
}
