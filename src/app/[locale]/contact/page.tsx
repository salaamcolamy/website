import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { ContactPageClient } from './ContactPageClient'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Contact - Salaam Cola',
    alternates: {
      canonical: `/${locale}/contact`,
    },
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ContactPageClient />
}
