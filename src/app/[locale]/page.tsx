import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { BestSellers } from '@/components/sections/BestSellers'
import { TasteIsEverything } from '@/components/sections/TasteIsEverything'
import { ChangeStartsSmall } from '@/components/sections/ChangeStartsSmall'
import { Supporters } from '@/components/sections/Supporters'
import { PledgeSection } from '@/components/sections/PledgeSection'
import type { Metadata } from 'next'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Salaam Cola - Taste the Freedom',
    description:
      'Premium halal cola made with passion and purpose. Experience the authentic taste of freedom with Salaam Cola Malaysia.',
    alternates: {
      canonical: `/${locale}`,
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <HeroSection />
      <TasteIsEverything />
      <BestSellers />
      <ChangeStartsSmall />
      <Supporters />
      <PledgeSection />
    </>
  )
}
