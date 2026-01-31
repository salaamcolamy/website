import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { AboutPageClient } from './AboutPageClient'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'About - Salaam Cola',
    alternates: {
      canonical: `/${locale}/about`,
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AboutPageClient />
}
