import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Salaam Cola - Taste the Freedom',
  description: 'Premium halal cola made with passion and purpose. Experience the authentic taste of freedom with Salaam Cola Malaysia.',
  icons: {
    icon: '/favico.svg',
    shortcut: '/favico.svg',
    apple: '/favico.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
