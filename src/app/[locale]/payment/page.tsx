import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

interface PaymentPolicyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PaymentPolicyPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Payment Policy - Salaam Cola',
    alternates: { canonical: `/${locale}/payment` },
  }
}

export default async function PaymentPolicyPage({ params }: PaymentPolicyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect(`/${locale}/policies#payment-policy`)
}

