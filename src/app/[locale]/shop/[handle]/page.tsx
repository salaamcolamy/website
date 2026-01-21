import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from './ProductDetailClient'

// Static demo products
const demoProducts = [
  {
    id: 'original',
    handle: 'original',
    title: 'Salaam Cola Original',
    category: 'CLASSIC',
    description: 'Our signature cola with a refreshing taste that stands for freedom and quality. Made with natural ingredients and 10% of profits go to charitable causes. Experience the authentic cola taste with a conscience.',
    price: 20.00,
    originalPrice: 26.00,
    discount: 23,
    rating: 5,
    reviews: 3,
    image: '/images/products/1111.webp',
    availableForSale: true,
  },
  {
    id: 'zero-sugar',
    handle: 'zero-sugar',
    title: 'Salaam Cola Zero Sugar',
    category: 'NO SUGAR',
    description: 'All the great taste of Salaam Cola with zero sugar. Perfect for those who want to enjoy a refreshing cola without the calories. Same great cause, same great taste, zero sugar.',
    price: 34.00,
    originalPrice: 38.00,
    discount: 11,
    rating: 5,
    reviews: 3,
    image: '/images/products/3333.webp',
    availableForSale: true,
  },
  {
    id: 'keffiyah',
    handle: 'keffiyeh',
    title: 'Salaam Cola Keffiyah Edition',
    category: 'LIMITED EDITION',
    description: 'A limited edition release featuring our iconic Keffiyah-inspired design. This special edition celebrates culture and heritage while supporting charitable causes. Collect yours before they\'re gone!',
    price: 28.00,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 3,
    image: '/images/products/2222.webp',
    availableForSale: true,
  },
]

interface ProductPageProps {
  params: Promise<{ locale: string; handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params
  const product = demoProducts.find((p) => p.handle === handle)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.title} - Salaam Cola`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, handle } = await params
  setRequestLocale(locale)

  const product = demoProducts.find((p) => p.handle === handle)

  if (!product) {
    notFound()
  }

  // Get related products (other products)
  const relatedProducts = demoProducts.filter((p) => p.id !== product.id)

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
