import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://salaamcolamy.com'),
  title: 'Salaam Cola - Taste the Freedom',
  description: 'Premium halal cola made with passion and purpose. Experience the authentic taste of freedom with Salaam Cola Malaysia.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
