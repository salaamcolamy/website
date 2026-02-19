# Quick Fix: Shipping Not Working

## Step 1: Run Automatic Validator

**Visit:** `http://localhost:3000/api/shopify/validate-setup` (or your domain)

This automatically checks:
- Product weights
- Shipping zones
- Zone rates
- Advanced Shipping config

**It tells you exactly what to fix** - follow the `fixes` array.

## Step 2: If Validator Shows Issues

### Fix Product Weights
- Go to **Shopify Admin** → **Products**
- For each product → **Variants** → Set **Weight** (and unit: kg or g)
- **Required** for weight-based shipping (Advanced Shipping)

### Fix Shipping Zones
- Go to **Settings** → **Shipping and delivery**
- Add/edit zone → Include **Malaysia** (or specific states like Selangor, Kuala Lumpur)
- **Add rate** → **Use carrier or app** → **Advanced Shipping Rules**

### Fix Advanced Shipping App
- Go to **Apps** → **Advanced Shipping Rules**
- **Services** → Ensure **West Malaysia** (and **East Malaysia** if needed) are **Active**
- Verify rules include the provinces you ship to

## Step 3: Test

1. Add items to cart
2. Go to checkout
3. Fill address (e.g. Selangor)
4. Shipping should calculate

If not, check browser console for `[Shopify Delivery]` logs or run `/api/shopify/shipping-diagnostic` with your cart/address.

## What's Already Fixed in Code

✅ Tries province name, ISO code, and raw value  
✅ Fallback cart query when mutation returns empty  
✅ Advanced Shipping API direct call when Shopify returns nothing  
✅ Cart key validation  
✅ Detailed error messages with exact fixes  
✅ Automatic validator endpoint

**Everything else is Shopify Admin configuration** - the validator tells you what.
