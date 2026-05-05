export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  selectedOptions: Array<{
    name: string
    value: string
  }>
  image: ShopifyImage | null
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: {
    edges: Array<{
      node: ShopifyImage
    }>
  }
  priceRange: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  variants: {
    edges: Array<{
      node: ShopifyProductVariant
    }>
  }
  options: Array<{
    id: string
    name: string
    values: string[]
  }>
  tags: string[]
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  image: ShopifyImage | null
  products: {
    edges: Array<{
      node: ShopifyProduct
    }>
  }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      id: string
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
    price: ShopifyMoney
    selectedOptions: Array<{
      name: string
      value: string
    }>
  }
  cost: {
    totalAmount: ShopifyMoney
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoney
    totalAmount: ShopifyMoney
    totalTaxAmount: ShopifyMoney | null
  }
  discountAllocations?: Array<{
    discountedAmount: ShopifyMoney
  }>
  lines: {
    edges: Array<{
      node: ShopifyCartLine
    }>
  }
}

// Simplified types for the app
export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: ShopifyImage[]
  price: number
  compareAtPrice: number | null
  currencyCode: string
  variants: ShopifyProductVariant[]
  options: Array<{
    id: string
    name: string
    values: string[]
  }>
  tags: string[]
}

export interface CartItem {
  id: string
  variantId: string
  productId: string
  productHandle: string
  title: string
  variantTitle: string
  quantity: number
  /** Unit price from variant (before cart-level discount). */
  price: number
  /** Line total from Shopify (quantity × price after cart-level discount allocation). */
  lineTotal: number
  currencyCode: string
  image: ShopifyImage | null
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  /** Merchandise subtotal before cart-level discounts (Shopify). */
  subtotal: number
  /** Cart total from Shopify (merchandise after discounts, including tax if applicable). */
  total: number
  /** Sum of cart discount allocations (Shopify), 0 if none. */
  discountTotal: number
  currencyCode: string
  items: CartItem[]
}
