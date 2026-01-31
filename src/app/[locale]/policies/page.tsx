import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { PoliciesPageClient } from './PoliciesPageClient'

interface PoliciesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PoliciesPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Policies - Salaam Cola',
    description:
      'Payment policy, returns & refund SOP, shipping & delivery, privacy policy, and terms & conditions for Salaam Cola Malaysia.',
    alternates: {
      canonical: `/${locale}/policies`,
    },
  }
}

export default async function PoliciesPage({ params }: PoliciesPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PoliciesPageClient />
}

