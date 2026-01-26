import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ReviewNewsletter } from '@/components/sections/ReviewNewsletter'
import { BestSellers } from '@/components/sections/BestSellers'
import { TasteIsEverything } from '@/components/sections/TasteIsEverything'
import { ChangeStartsSmall } from '@/components/sections/ChangeStartsSmall'
import { Supporters } from '@/components/sections/Supporters'
import { PledgeSection } from '@/components/sections/PledgeSection'
import { InstagramFeed } from '@/components/sections/InstagramFeed'
import { getCollectionProducts } from '@/lib/shopify/queries/products'

const FEATURED_COLLECTION =
  process.env.NEXT_PUBLIC_FEATURED_COLLECTION || 'frontpage'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  // Featured products in collection order (e.g. Shopify homepage collection)
  const products = await getCollectionProducts(FEATURED_COLLECTION, 3)

  return (
    <>
      {/* Hero - Red background with floating can */}
      <HeroSection />

      {/* Taste Is Everything - Red section */}
      <TasteIsEverything />

      {/* Best Sellers - Product showcase */}
      <BestSellers products={products} />

      {/* Change Starts Small - Image grid + text */}
      <ChangeStartsSmall />

      {/* Supporters Logos */}
      <Supporters />

      {/* Join Us - TikTok Link */}
      <InstagramFeed />

      {/* Pledge Section - Icons row */}
      <PledgeSection />

      {/* Customer Review + Newsletter Subscribe - Before footer */}
      <ReviewNewsletter />
    </>
  )
}
