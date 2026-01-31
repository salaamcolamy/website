import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { ShopPageClient } from './ShopPageClient'
import { getProducts } from '@/lib/shopify/queries/products'
import type { Metadata } from 'next'

interface ShopPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })

  return {
    title: t('title'),
    alternates: {
      canonical: `/${locale}/shop`,
    },
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const products = await getProducts()

  return <ShopPageClient products={products} />
}
