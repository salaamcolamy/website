# Why Advanced Shipping Must Be "Linked" to Checkout

Checkout gets shipping rates in two ways. Both can show Advanced Shipping rates.

## 1. Via Shopify (primary)

- Checkout calls our **shipping-rates API**, which uses **Shopify Storefront API** (`cartDeliveryAddressesReplace` → `cart.deliveryGroups[].deliveryOptions`).
- **Advanced Shipping appears there only if it is linked in Shopify Admin:**
  1. **Settings → Shipping and delivery** → open the zone (e.g. West Malaysia).
  2. Under **Rates**, add a rate and choose **"Advanced Shipping Rules"** (or your Advanced Shipping app name).
  3. Ensure the zone is enabled for your **Headless** (or custom) sales channel so the Storefront API returns those rates.

If the zone has no Advanced Shipping rate, or the app isn’t enabled for the channel, Shopify returns no Advanced Shipping options and checkout won’t show them.

## 2. Direct Advanced Shipping API (fallback)

- If Shopify returns **no** delivery options, we call the **Advanced Shipping Rules API** directly (when `ADVANCED_SHIPPING_APP_ID` and `ADVANCED_SHIPPING_API_KEY` are set).
- That keeps checkout linked to Advanced Shipping even when:
  - The app isn’t added to the zone in Shopify, or
  - The Headless channel doesn’t get app rates from Shopify.

So: **link in Admin = rates via Shopify; env vars set = fallback so checkout can still show Advanced Shipping when Shopify returns nothing.**

## Checklist if Advanced Shipping doesn’t show at checkout

- [ ] **Shopify**: Settings → Shipping → [your zone] → Rates → **Advanced Shipping** (or app name) is added.
- [ ] **Shopify**: Zone is enabled for **Headless** (or the sales channel your storefront uses).
- [ ] **Env**: `ADVANCED_SHIPPING_APP_ID` and `ADVANCED_SHIPPING_API_KEY` are set (for the direct API fallback).
- [ ] **Products**: Variants have **Weight** set (required for weight-based Advanced Shipping rules).
- [ ] **Advanced Shipping app**: Services (e.g. West/East Malaysia) are **Active** and rules match the provinces we send (see SHIPPING-ZONE-MATCHING-GUIDE.md).
