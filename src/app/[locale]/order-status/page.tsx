import { setRequestLocale } from 'next-intl/server'
import { OrderStatusClient } from './OrderStatusClient'
import type { Metadata } from 'next'

interface OrderStatusPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: OrderStatusPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Track Order - Salaam Cola',
    alternates: {
      canonical: `/${locale}/order-status`,
    },
  }
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <OrderStatusClient />
}
