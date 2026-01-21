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
    description: 'Experience the clean, bold bite of authentic cola. We\'ve layered in hints of earthy herbs and warm spices, finishing with a sharp, zesty citrus twist that keeps every sip fresh. With fine, smooth bubbles that aren\'t too harsh on the throat, it\'s a familiar taste, but elevated for a better way to refresh.',
    longDescription: 'Indulge in the irresistible allure of Salaam Cola – a beverage that transcends the ordinary, combining exquisite taste with a commitment to making a positive impact. With each refreshing gulp, you\'re not just enjoying a top-tier cola; you\'re supporting charitable foundations that bring hope and change to those in need. We take pride in maintaining the highest standards of taste and quality, ensuring that every sip is a premium experience. In blind taste tests, 98% of participants agreed that Salaam Cola rivals the flavours of leading cola brands. Join us in savoring the goodness, making a difference sip by sip. Here\'s to great taste and a greater cause!',
    price: 20.00,
    originalPrice: null,
    discount: null,
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
    description: 'Experience the clean, bold bite of authentic cola. We\'ve layered in hints of earthy herbs and warm spices, finishing with a sharp, zesty citrus twist that keeps every sip fresh. With fine, smooth bubbles that aren\'t too harsh on the throat, it\'s a familiar taste, but elevated for a better way to refresh.',
    longDescription: 'Indulge in the irresistible allure of Salaam Cola Seriously No Sugar – a beverage that transcends the ordinary, combining exquisite taste with a commitment to making a positive impact. With each refreshing gulp, you\'re not just enjoying a top-tier cola; you\'re supporting charitable foundations that bring hope and change to those in need.\n\nWe take pride in maintaining the highest standards of taste and quality, ensuring that every sip is a premium experience. In blind taste tests, 98% of participants agreed that Salaam Cola Seriously No Sugar rivals the flavours of leading Diet cola brands without harmful additives like aspartame. Join us in savouring the goodness, making a difference sip by sip. Here\'s to great taste and a greater cause!',
    price: 34.00,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 3,
    image: '/images/products/2222.webp',
    availableForSale: true,
  },
  {
    id: 'keffiyah',
    handle: 'keffiyeh',
    title: 'Salaam Cola Keffiyah Edition',
    category: 'LIMITED EDITION',
    description: 'Experience the clean, bold bite of authentic cola. We\'ve layered in hints of earthy herbs and warm spices, finishing with a sharp, zesty citrus twist that keeps every sip fresh. With fine, smooth bubbles that aren\'t too harsh on the throat, it\'s a familiar taste, but elevated for a better way to refresh.',
    longDescription: 'Introducing Salaam Cola, Keffiyeh Edition, 50% Less sugar, Same Great Taste\n\nIndulge in the irresistible allure of Salaam Cola – a beverage that transcends the ordinary, combining exquisite taste with a commitment to making a positive impact. With each refreshing gulp, you\'re not just enjoying a top-tier cola; you\'re supporting charitable foundations that bring hope and change to those in need.\n\nWe take pride in maintaining the highest standards of taste and quality, ensuring that every sip is a premium experience. In blind taste tests, 98% of participants agreed that Salaam Cola rivals the flavours of leading cola brands. Join us in savoring the goodness, making a difference sip by sip. Here\'s to great taste and a greater cause!',
    price: 25.20,
    originalPrice: 28.00,
    discount: 10,
    rating: 5,
    reviews: 3,
    image: '/images/products/3333.webp',
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
