import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

interface PrivacyPolicyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PrivacyPolicyPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Privacy Policy - Salaam Cola',
    alternates: { canonical: `/${locale}/privacy` },
  }
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect(`/${locale}/policies#privacy-policy`)
}

