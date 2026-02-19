# Advanced Shipping Rules API Integration

This document explains how the Advanced Shipping Rules API is integrated into the website.

## API Key Configuration

The Advanced Shipping API requires both an **App ID** and **API Key**:

```env
ADVANCED_SHIPPING_APP_ID=your-app-id
ADVANCED_SHIPPING_API_KEY=8270f9c-3581-476c-b0c6-771f59093679
```

**Note:** 
- **API Key** (provided): `8270f9c-3581-476c-b0c6-771f59093679` - Found in Advanced Shipping App → Settings → General
- **App ID** (required): Contact Advanced Shipping Rules support to obtain an App ID

## How It Works

### Primary Method: Shopify Integration (Automatic)

The **recommended** way is through Shopify's carrier service integration:

1. **Install Advanced Shipping app** in Shopify Admin
2. **Configure weight-based rates** in the app
3. **Rates automatically appear** in Shopify's delivery options
4. **Website automatically detects** and uses Advanced Shipping rates

**No API key needed** for this method - it works automatically through Shopify!

### Secondary Method: Direct API (Fallback)

If you need direct API access, the API key can be used:

1. **Store API key** in `.env.local`:
   ```env
   ADVANCED_SHIPPING_API_KEY=8270f9c-3581-476c-b0c6-771f59093679
   ```

2. **API Client** is available at `src/lib/advanced-shipping/client.ts`

3. **Usage** (if needed):
   ```typescript
   import { getAdvancedShippingRates } from '@/lib/advanced-shipping/client'
   
   const appId = process.env.ADVANCED_SHIPPING_APP_ID!
   const apiKey = process.env.ADVANCED_SHIPPING_API_KEY!
   
   const rates = await getAdvancedShippingRates(appId, apiKey, {
     items: [{ id: 'variant-id', quantity: 1, weight: 2.5 }],
     destination: { address1: '...', city: '...', province: '...', country: 'MY', zip: '...' }
   })
   ```

## Current Implementation

The website **automatically prioritizes Advanced Shipping app rates** when they're available through Shopify's Storefront API:

1. ✅ **Detects** Advanced Shipping rates from Shopify delivery options
2. ✅ **Prioritizes** them over native Shopify rates
3. ✅ **Displays** the correct rate name and cost
4. ✅ **Shows** "(Advanced Shipping)" label in checkout

## API Key Location

Your API key: `8270f9c-3581-476c-b0c6-771f59093679`

**To use it:**
1. Add to `.env.local`:
   ```env
   ADVANCED_SHIPPING_API_KEY=8270f9c-3581-476c-b0c6-771f59093679
   ADVANCED_SHIPPING_APP_ID=your-app-id  # Contact Advanced Shipping for App ID
   ```

2. The keys are stored but **not required** for normal operation
   - Advanced Shipping rates come through Shopify automatically
   - Direct API requires both App ID and API Key (contact Advanced Shipping for App ID)
   - Direct API is only used if needed for custom integrations

## Verification

To verify Advanced Shipping is working:

1. **Check browser console** during checkout:
   - Look for: `[Checkout] ✓ Using Advanced Shipping app rate`
   - Or: `[Shopify Delivery] Advanced Shipping app rates detected`

2. **Check checkout UI**:
   - Shipping method should show "(Advanced Shipping)" label
   - Rate should match your Advanced Shipping app configuration

3. **Check Shopify Admin**:
   - Advanced Shipping app → Settings → Verify API key matches
   - Test rates in app to ensure they match website

## Troubleshooting

### Rates not showing Advanced Shipping?

- **Check app installation**: Make sure Advanced Shipping is installed in Shopify
- **Check sales channel**: Enable Advanced Shipping for "Headless" sales channel
- **Check configuration**: Verify weight-based rates are configured in app
- **Check console logs**: Look for Advanced Shipping detection messages

### Want to use direct API?

The direct API client is available but **not currently used** because:
- Shopify integration is simpler and more reliable
- Rates are automatically synced
- No additional API calls needed

If you need direct API access, contact the development team.
