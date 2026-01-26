import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { BestSellers } from '@/components/sections/BestSellers'
import { TasteIsEverything } from '@/components/sections/TasteIsEverything'
import { ChangeStartsSmall } from '@/components/sections/ChangeStartsSmall'
import { Supporters } from '@/components/sections/Supporters'
import { PledgeSection } from '@/components/sections/PledgeSection'

interface HomePageProps {
  params: Promise<{ locale: string }>
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
