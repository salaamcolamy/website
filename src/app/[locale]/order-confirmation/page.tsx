import { setRequestLocale } from 'next-intl/server'
import { OrderConfirmationClient } from './OrderConfirmationClient'

interface OrderConfirmationPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return {
    title: 'Order Confirmed - Salaam Cola',
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <OrderConfirmationClient />
}
