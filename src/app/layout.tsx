import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://salaamcolamy.com'),
  title: 'Salaam Cola - Taste the Freedom',
  description: 'Premium halal cola made with passion and purpose. Experience the authentic taste of freedom with Salaam Cola Malaysia.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Salaam Cola - Taste the Freedom',
    description: 'Premium halal cola made with passion and purpose. Experience the authentic taste of freedom with Salaam Cola Malaysia.',
    url: 'https://salaamcolamy.com',
    siteName: 'Salaam Cola Malaysia',
    type: 'website',
    locale: 'en_MY',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salaam Cola - Taste the Freedom',
    description: 'Premium halal cola made with passion and purpose.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
