import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ReviewNewsletter } from '@/components/sections/ReviewNewsletter'
import { BestSellers } from '@/components/sections/BestSellers'
import { TasteIsEverything } from '@/components/sections/TasteIsEverything'
import { ChangeStartsSmall } from '@/components/sections/ChangeStartsSmall'
import { Supporters } from '@/components/sections/Supporters'
import { PledgeSection } from '@/components/sections/PledgeSection'
import { InstagramFeed } from '@/components/sections/InstagramFeed'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Hero - Red background with floating can */}
      <HeroSection />

      {/* Customer Review + Newsletter Subscribe */}
      <ReviewNewsletter />

      {/* Taste Is Everything - Red section */}
      <TasteIsEverything />

      {/* Best Sellers - Product showcase */}
      <BestSellers />

      {/* Change Starts Small - Image grid + text */}
      <ChangeStartsSmall />

      {/* Supporters Logos */}
      <Supporters />

      {/* Pledge Section - Icons row */}
      <PledgeSection />

      {/* Instagram Feed */}
      <InstagramFeed />
    </>
  )
}
