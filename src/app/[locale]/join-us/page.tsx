import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { JoinUsPageClient } from './JoinUsPageClient'

interface JoinUsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: JoinUsPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Join Us - Salaam Cola',
    alternates: {
      canonical: `/${locale}/join-us`,
    },
  }
}

export default async function JoinUsPage({ params }: JoinUsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <JoinUsPageClient />
}
