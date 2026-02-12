import { setRequestLocale } from 'next-intl/server'
import { CheckoutPageClient } from './CheckoutPageClient'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid font bundling issues during build
export const dynamic = 'force-dynamic'

interface CheckoutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Checkout - Salaam Cola',
    alternates: {
      canonical: `/${locale}/checkout`,
    },
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CheckoutPageClient />
}
