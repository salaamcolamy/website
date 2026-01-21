import { setRequestLocale } from 'next-intl/server'
import { CheckoutPageClient } from './CheckoutPageClient'

interface CheckoutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return {
    title: 'Checkout - Salaam Cola',
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <CheckoutPageClient />
}
