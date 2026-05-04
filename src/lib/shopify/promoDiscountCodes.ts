/**
 * Discount codes auto-applied to Storefront carts and Admin draft orders (not automatic discounts).
 * Set SHOPIFY_CART_DISCOUNT_CODE to a comma-separated list (e.g. RAYA10).
 * Leave unset for no code injection so automatic discounts (e.g. PAYDAY10) are not overridden.
 */
export function getShopifyPromoDiscountCodes(): string[] {
  const raw = process.env.SHOPIFY_CART_DISCOUNT_CODE ?? process.env.SHOPIFY_DISCOUNT_CODE ?? ''
  return raw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}
