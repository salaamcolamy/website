# What Can Block the Storefront (Headless) From Getting Product Weight & Shipping Zones

The Storefront API doesn’t “block” weight or zones by itself. It sends the cart and address to Shopify; Shopify’s backend does the rest. Something is only “blocked” when **data in Shopify Admin** or **channel/profile setup** means there’s no weight or no matching zone/rates.

---

## 1. Product weight

**How it works**

- Weight is stored in **Shopify Admin** on each **Product → Variant** (weight + unit).
- When you call `cartDeliveryAddressesReplace`, Shopify:
  - Looks at the cart line items (variant IDs),
  - Loads each variant’s weight from the catalog,
  - Sums total weight and passes it to the rate source (e.g. Advanced Shipping).
- The Storefront API does **not** send weight in the request; Shopify reads it from the catalog using the variant IDs in the cart.

**What can “block” weight from working**

| Cause | What to do |
|--------|------------|
| **Variants have no weight** | In Admin: **Products** → each product → **Variants** → set **Weight** (and unit) for every variant. |
| **Weight is 0 or wrong unit** | Set a positive weight and choose the correct unit (e.g. kg or g). |
| **App doesn’t use weight** | If the zone uses a rate that isn’t weight-based, weight won’t affect the rate. Use a weight-based rate (e.g. Advanced Shipping with weight rules). |

So: nothing in the “storefront” or “headless” side blocks weight. If weight isn’t affecting rates, it’s **Admin (variant weight)** or **zone/rate (not weight-based)**.

---

## 2. Shipping zone

**How it works**

- You send **address** (country, province, postcode, etc.) in `cartDeliveryAddressesReplace`.
- Shopify matches that address to a **shipping zone** in **Settings → Shipping and delivery**.
- That zone’s **rates** (manual or app, e.g. Advanced Shipping) are what come back in `deliveryGroups[].deliveryOptions`.

**What can “block” the zone from matching or returning rates**

| Cause | What to do |
|--------|------------|
| **No zone includes that province/country** | In **Settings → Shipping and delivery**, add a zone that includes the **exact** province/country you’re sending (e.g. “Selangor”, “Kuala Lumpur”, “Malaysia”). |
| **Province name/code mismatch** | We send names like “Selangor”, “Kuala Lumpur”. The zone must use the **same** names (or the ISO codes your store uses). If the zone uses something else (e.g. “Selangor Darul Ehsan”), add the exact value we send. See `docs/SHIPPING-ZONE-MATCHING-GUIDE.md`. |
| **Zone has no rate** | Zone exists but has no “rate” (no manual price and no app). Add a rate: **Add rate** → **Use carrier or app** → e.g. **Advanced Shipping Rules**. |
| **App not returning rates for that zone** | e.g. Advanced Shipping: service for that region must be **Active**, and rules must include that province. Check **Apps → Advanced Shipping Rules → Services**. |

So: the storefront/headless doesn’t block zones. If you get no options or wrong ones, it’s **zone coverage**, **province naming**, or **zone/app rate setup** in Admin.

---

## 3. Sales channel / checkout (when headless “doesn’t see” rates)

**How it works**

- The Storefront API uses the **store’s** shipping and checkout configuration.
- Which **sales channel** the storefront uses (e.g. “Headless”, “Custom storefront”, “Online Store”) can affect **which** delivery profiles or rates are available to that channel.

**What can “block” headless from seeing zones/rates**

| Cause | What to do |
|--------|------------|
| **Rates only for another channel** | Some setups limit rates to “Online Store” or a specific channel. In **Settings → Shipping and delivery** (and in the app, if it has channel options), ensure the zones/rates you need are available for the channel your headless storefront uses. |
| **Checkout/delivery profile** | If the store uses **delivery profiles**, the profile that applies to your products and channel must include the right zones and rates. In Admin, check **Settings → Checkout** and any **Delivery profile** or app settings that might filter by channel. |
| **App not enabled for headless** | In the app (e.g. Advanced Shipping), check for “Channels”, “Where to show rates”, or “Checkout” and ensure your headless/custom channel is included. |

So: if the same address and cart work in the “normal” Shopify checkout but not via the Storefront API, the usual cause is **channel or profile** configuration (zones/rates or app not enabled for the channel the API uses).

---

## Quick checklist (storefront/headless)

1. **Weight**  
   - [ ] Every variant has **Weight** (and unit) set in **Products → [Product] → Variants**.

2. **Zones**  
   - [ ] **Settings → Shipping and delivery**: a zone exists that includes the **exact** province/country you send (e.g. Selangor, Malaysia).  
   - [ ] That zone has at least one **rate** (e.g. Advanced Shipping).

3. **App (e.g. Advanced Shipping)**  
   - [ ] App is **Active**.  
   - [ ] A **service** for that region (e.g. West Malaysia) exists and is **Active**.  
   - [ ] Rules include the province you’re testing.  
   - [ ] If the app has channel settings, your headless/custom channel is enabled.

4. **See what Shopify returns**  
   - Use **POST /api/shopify/shipping-diagnostic** with the same `cartId` and `address` as checkout.  
   - Check `userErrors`, `deliveryGroupsCount`, `deliveryOptionsCount`, and `whyNotWorking` to see whether the problem is **no zone**, **no options**, or **errors**.

Nothing in the Storefront API itself blocks product weight or shipping zones; it’s always **Admin data** (weight, zones, rates) or **channel/profile** setup.
