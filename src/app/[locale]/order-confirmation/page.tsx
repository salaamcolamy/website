import { setRequestLocale } from 'next-intl/server'
import { OrderConfirmationClient } from './OrderConfirmationClient'
import type { Metadata } from 'next'

interface OrderConfirmationPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: OrderConfirmationPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Order Confirmed - Salaam Cola',
    alternates: {
      canonical: `/${locale}/order-confirmation`,
    },
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <OrderConfirmationClient />
}
