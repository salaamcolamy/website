# Shopify Admin Setup: Link Advanced Shipping to Checkout

**🚀 Quick Fix: Run the automatic validator first**

Before manual setup, run this to see exactly what needs fixing:

```bash
# In browser or curl:
GET http://localhost:3000/api/shopify/validate-setup
# Or visit: http://localhost:3000/api/shopify/validate-setup
```

This checks:
- ✓ Product variants have weight set
- ✓ Shipping zones exist for Malaysia/Selangor
- ✓ Zones have rates (Advanced Shipping)
- ✓ Advanced Shipping API is configured

The response tells you **exactly what to fix** with direct links/instructions.

---

Follow these steps to ensure Advanced Shipping rates appear at checkout.

## Step 1: Add Advanced Shipping to Shipping Zones

### For West Malaysia Zone:

1. Go to **Shopify Admin**: https://27ut15-e9.myshopify.com/admin
2. Navigate to **Settings** → **Shipping and delivery**
3. Find your **West Malaysia** zone (or create it if missing)
4. Click **"Manage rates"** or **"Add rate"**
5. Click **"Add rate"** → Select **"Use carrier or app to calculate rates"**
6. Choose **"Advanced Shipping Rules"** (or your Advanced Shipping app name)
7. Click **"Done"** or **"Save"**

### For East Malaysia Zone:

1. In the same **Shipping and delivery** page
2. Find or create **East Malaysia** zone
3. Add **Sabah** and **Sarawak** to the zone
4. Click **"Add rate"** → **"Use carrier or app"** → **"Advanced Shipping Rules"**
5. Save

## Step 2: Verify Advanced Shipping App Services

1. Go to **Apps** → **Advanced Shipping Rules**
2. Check **Services** section:
   - **West Malaysia** service exists and is **Active**
   - **East Malaysia** service exists and is **Active** (if shipping to Sabah/Sarawak)
3. Verify each service has rules for the correct provinces

## Verification

After setup, test checkout:
1. Add items to cart
2. Go to checkout
3. Fill in address (e.g. Selangor for West Malaysia)
4. Shipping rates should appear
5. Check browser console for `[Shopify Delivery]` logs - should show Advanced Shipping rates detected

## Why is it not working? Run the diagnostic

1. Open your site, add something to cart, go to checkout, and fill in the address form.
2. Open DevTools (F12) → **Network** tab.
3. Click **"Calculate shipping again"** (or move to the Shipping step so a request fires).
4. Find the request to **`shipping-rates`** → click it → **Payload** or **Request** tab. Copy the **Request payload** (the JSON with `cartId` and `address`).
5. In a new tab, open:
   ```
   https://your-site.com/api/shopify/shipping-diagnostic
   ```
   (Use your real domain, e.g. `http://localhost:3000` when running locally.)
6. Use a REST client (Postman, or DevTools → **Console**) to **POST** that URL with:
   - **Content-Type: application/json**
   - **Body:** the same JSON you copied (e.g. `{ "cartId": "...", "address": { ... } }`).

   Example in browser console (paste after copying the payload into a variable):
   ```js
   fetch('/api/shopify/shipping-diagnostic', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ cartId: 'PASTE_CART_ID_HERE', address: { address1: '123 Jalan X', city: 'Petaling Jaya', province: 'Selangor', countryCode: 'MY', zip: '46000', firstName: 'Test', lastName: 'User' } })
   }).then(r => r.json()).then(console.log)
   ```
7. The response will tell you:
   - **userErrors** – Shopify rejected something (e.g. invalid address/cart).
   - **deliveryGroupsCount: 0** – No zone matches this address. Add the province to a shipping zone and add Advanced Shipping to that zone.
   - **deliveryOptionsCount: 0** – Zone matches but no rates. Add a rate (Advanced Shipping) to the zone and set **Weight** on product variants.

Use the **whyNotWorking** field in the response for the exact fix.

## Troubleshooting

**If rates don't appear:**
- Run the diagnostic above and follow **whyNotWorking**.
- Check browser console for `[Shopify Delivery]` logs.
- Verify Advanced Shipping app is **Active** in Apps.
- Ensure product variants have **Weight** set (required for weight-based rates).
- Check that zones include the province you're testing (e.g. "Selangor" for Selangor addresses).
