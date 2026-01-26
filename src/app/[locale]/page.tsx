import { setRequestLocale } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { ReviewNewsletter } from '@/components/sections/ReviewNewsletter'
import { BestSellers } from '@/components/sections/BestSellers'
import { TasteIsEverything } from '@/components/sections/TasteIsEverything'
import { ChangeStartsSmall } from '@/components/sections/ChangeStartsSmall'
import { Supporters } from '@/components/sections/Supporters'
import { PledgeSection } from '@/components/sections/PledgeSection'
import { InstagramFeed } from '@/components/sections/InstagramFeed'
import { LiquidWave } from '@/components/shared/LiquidWave'
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
      <HeroSection />
      <LiquidWave />

      <TasteIsEverything />
      <LiquidWave />

      <BestSellers products={products} />
      <LiquidWave />

      <ChangeStartsSmall />
      <LiquidWave />

      <Supporters />
      <LiquidWave />

      <InstagramFeed />
      <LiquidWave />

      <PledgeSection />
      <LiquidWave />

      <ReviewNewsletter />
    </>
  )
}
