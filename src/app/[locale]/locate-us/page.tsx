import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { LocateUsPageClient } from './LocateUsPageClient'

interface LocateUsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LocateUsPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Locate Us - Salaam Cola',
    description: 'Find Salaam Cola at retailers and locations near you.',
    alternates: {
      canonical: `/${locale}/locate-us`,
    },
  }
}

export default async function LocateUsPage({ params }: LocateUsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <LocateUsPageClient />
}
