import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { ProgramsPageClient } from './ProgramsPageClient'

interface ProgramsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProgramsPageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Programs - Salaam Cola',
    alternates: {
      canonical: `/${locale}/programs`,
    },
  }
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ProgramsPageClient />
}
