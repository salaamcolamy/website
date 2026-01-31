import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Terms & Conditions - Salaam Cola',
    alternates: { canonical: `/${locale}/terms` },
  }
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect(`/${locale}/policies#terms-conditions`)
}

