import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { ShopPageClient } from './ShopPageClient'

interface ShopPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ShopPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shop' })

  return {
    title: t('title'),
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ShopPageClient />
}
