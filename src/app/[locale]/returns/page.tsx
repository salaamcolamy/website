import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

interface ReturnsPolicyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ReturnsPolicyPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Returns & Refund SOP - Salaam Cola',
    alternates: { canonical: `/${locale}/returns` },
  }
}

export default async function ReturnsPolicyPage({ params }: ReturnsPolicyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect(`/${locale}/policies#returns-refunds`)
}

