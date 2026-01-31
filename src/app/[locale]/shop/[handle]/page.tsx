import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from './ProductDetailClient'
import { getProduct, getProducts } from '@/lib/shopify/queries/products'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ locale: string; handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return {
      title: 'Product Not Found',
      alternates: {
        canonical: `/${locale}/shop/${handle}`,
      },
    }
  }

  return {
    title: `${product.title} - Salaam Cola`,
    description: product.description,
    alternates: {
      canonical: `/${locale}/shop/${handle}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, handle } = await params
  setRequestLocale(locale)

  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  // Get related products (other products)
  const allProducts = await getProducts()
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3)

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
