import { shopifyFetch, isShopifyConfigured } from '../client'
import type { ShopifyProduct, Product, ShopifyImage } from '../types'

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      id
      name
      values
    }
    tags
  }
`

// Transform Shopify product to simplified Product type
function transformProduct(shopifyProduct: ShopifyProduct): Product {
  const firstVariant = shopifyProduct.variants.edges[0]?.node

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    availableForSale: shopifyProduct.availableForSale,
    featuredImage: shopifyProduct.featuredImage,
    images: shopifyProduct.images.edges.map((edge) => edge.node),
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    compareAtPrice: firstVariant?.compareAtPrice
      ? parseFloat(firstVariant.compareAtPrice.amount)
      : null,
    currencyCode: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    variants: shopifyProduct.variants.edges.map((edge) => edge.node),
    options: shopifyProduct.options,
    tags: shopifyProduct.tags,
  }
}

// Mock products for when Shopify is not configured
const mockProducts: Product[] = [
  {
    id: 'mock-1',
    handle: 'mister-cola-classic',
    title: 'Mister Cola Classic',
    description: 'The original Mister Cola taste. Refreshing and bold. Made with premium ingredients and certified halal for the conscious consumer.',
    descriptionHtml: '<p>The original Mister Cola taste. Refreshing and bold. Made with premium ingredients and certified halal for the conscious consumer.</p>',
    availableForSale: true,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&h=800&fit=crop',
      altText: 'Mister Cola Classic',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&h=800&fit=crop',
        altText: 'Mister Cola Classic',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&h=800&fit=crop',
        altText: 'Mister Cola Classic Side View',
        width: 800,
        height: 800,
      },
    ],
    price: 3.50,
    compareAtPrice: null,
    currencyCode: 'MYR',
    variants: [{ id: 'variant-1', title: 'Default', availableForSale: true, quantityAvailable: 100, price: { amount: '3.50', currencyCode: 'MYR' }, compareAtPrice: null, selectedOptions: [], image: null }],
    options: [],
    tags: ['best-seller'],
  },
  {
    id: 'mock-2',
    handle: 'mister-cola-zero',
    title: 'Mister Cola Zero',
    description: 'Zero sugar, full taste. Perfect for the health-conscious consumer who wants great taste without compromise.',
    descriptionHtml: '<p>Zero sugar, full taste. Perfect for the health-conscious consumer who wants great taste without compromise.</p>',
    availableForSale: true,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&h=800&fit=crop',
      altText: 'Mister Cola Zero',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=800&h=800&fit=crop',
        altText: 'Mister Cola Zero',
        width: 800,
        height: 800,
      },
    ],
    price: 3.50,
    compareAtPrice: null,
    currencyCode: 'MYR',
    variants: [{ id: 'variant-2', title: 'Default', availableForSale: true, quantityAvailable: 100, price: { amount: '3.50', currencyCode: 'MYR' }, compareAtPrice: null, selectedOptions: [], image: null }],
    options: [],
    tags: ['best-seller'],
  },
  {
    id: 'mock-3',
    handle: 'mister-cola-lemon',
    title: 'Mister Cola Lemon',
    description: 'A citrus twist on the classic. Zesty and refreshing with natural lemon flavor.',
    descriptionHtml: '<p>A citrus twist on the classic. Zesty and refreshing with natural lemon flavor.</p>',
    availableForSale: true,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=800&h=800&fit=crop',
      altText: 'Mister Cola Lemon',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=800&h=800&fit=crop',
        altText: 'Mister Cola Lemon',
        width: 800,
        height: 800,
      },
    ],
    price: 3.80,
    compareAtPrice: 4.20,
    currencyCode: 'MYR',
    variants: [{ id: 'variant-3', title: 'Default', availableForSale: true, quantityAvailable: 50, price: { amount: '3.80', currencyCode: 'MYR' }, compareAtPrice: { amount: '4.20', currencyCode: 'MYR' }, selectedOptions: [], image: null }],
    options: [],
    tags: ['new'],
  },
  {
    id: 'mock-4',
    handle: 'mister-cola-pack-6',
    title: 'Mister Cola 6-Pack',
    description: 'Value pack of 6 classic Mister Cola bottles. Perfect for sharing with family and friends.',
    descriptionHtml: '<p>Value pack of 6 classic Mister Cola bottles. Perfect for sharing with family and friends.</p>',
    availableForSale: true,
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=800&h=800&fit=crop',
      altText: 'Mister Cola 6-Pack',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=800&h=800&fit=crop',
        altText: 'Mister Cola 6-Pack',
        width: 800,
        height: 800,
      },
    ],
    price: 18.00,
    compareAtPrice: 21.00,
    currencyCode: 'MYR',
    variants: [{ id: 'variant-4', title: 'Default', availableForSale: true, quantityAvailable: 30, price: { amount: '18.00', currencyCode: 'MYR' }, compareAtPrice: { amount: '21.00', currencyCode: 'MYR' }, selectedOptions: [], image: null }],
    options: [],
    tags: ['best-seller', 'value'],
  },
]

export async function getProducts(first: number = 20): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    return mockProducts
  }

  const query = `
    query getProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> }
  }>({
    query,
    variables: { first },
    tags: ['products'],
  })

  return data.products.edges.map((edge) => transformProduct(edge.node))
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    return mockProducts.find((p) => p.handle === handle) || null
  }

  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFragment
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query,
    variables: { handle },
    tags: ['product', handle],
  })

  return data.product ? transformProduct(data.product) : null
}

export async function getBestSellers(first: number = 4): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    return mockProducts.filter((p) => p.tags.includes('best-seller')).slice(0, first)
  }

  const query = `
    query getBestSellers($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
    ${PRODUCT_FRAGMENT}
  `

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> }
  }>({
    query,
    variables: { first },
    tags: ['best-sellers'],
  })

  return data.products.edges.map((edge) => transformProduct(edge.node))
}
