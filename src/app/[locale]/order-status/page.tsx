import { setRequestLocale } from 'next-intl/server'
import { OrderStatusClient } from './OrderStatusClient'

interface OrderStatusPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return {
    title: 'Track Order - Salaam Cola',
  }
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <OrderStatusClient />
}
