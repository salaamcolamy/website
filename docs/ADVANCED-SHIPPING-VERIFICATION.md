# Advanced Shipping App Configuration Verification Guide

This guide helps you verify that Advanced Shipping app is correctly configured for weight-based shipping rates.

## Step 1: Verify Product Weights in Shopify Admin

✅ **Already Done** - Products have weights set.

**To Double-Check:**
1. Go to **Shopify Admin** → **Products**
2. Select each product variant
3. Verify **Weight** is set:
   - 6-pack: Should be `2.5 kg` (or your actual weight)
   - 24-pack: Should be `10 kg` (or your actual weight)
4. Ensure **Weight Unit** is set to `kg` (kilograms)

## Step 2: Verify Advanced Shipping App Installation

1. Go to **Shopify Admin** → **Apps**
2. Search for **"Advanced Shipping Rules"** or **"Advanced Shipping"**
3. Verify the app is **Installed** and **Active**
4. Click on the app to open settings

## Step 3: Verify Services Configuration

### Check West Malaysia Service

1. In Advanced Shipping app, go to **Services** section
2. Look for **"West Malaysia"** service
3. Verify:
   - ✅ Service is **Active/Enabled**
   - ✅ Has weight-based rules configured
   - ✅ Weight tiers match your product weights:
     ```
     0.01 kg - 1.00 kg: RM [your rate]
     1.01 kg - 2.00 kg: RM [your rate]
     2.01 kg - 3.00 kg: RM [your rate]
     3.01 kg - 5.00 kg: RM [your rate]
     5.01 kg - 10.00 kg: RM [your rate]
     ```

### Check East Malaysia Service

1. In Advanced Shipping app, go to **Services** section
2. Look for **"East Malaysia"** service
3. If it doesn't exist:
   - Click **"Add Service"** or **"Create Service"**
   - Name: `East Malaysia`
   - Configure rules for **Sabah** and **Sarawak** provinces
   - Set weight-based rates (typically higher than West Malaysia)
4. If it exists, verify:
   - ✅ Service is **Active/Enabled**
   - ✅ Has rules for **Sabah** and **Sarawak**
   - ✅ Has weight-based rates configured

## Step 4: Verify Shipping Zones in Shopify

1. Go to **Shopify Admin** → **Settings** → **Shipping**
2. Check your shipping zones:

### Zone 1: West Malaysia
- **Name**: "West Malaysia" or "Peninsular Malaysia"
- **Countries/Regions**: Should include all West Malaysia states:
  - Johor, Kedah, Kelantan, Melaka, Negeri Sembilan
  - Pahang, Perak, Perlis, Pulau Pinang, Selangor
  - Terengganu, Kuala Lumpur, Putrajaya, Labuan
- **Rates**: Should use **Advanced Shipping** app

### Zone 2: East Malaysia
- **Name**: "East Malaysia"
- **Countries/Regions**: Should include:
  - Sabah
  - Sarawak
- **Rates**: Should use **Advanced Shipping** app

## Step 5: Verify Sales Channel

1. Go to **Shopify Admin** → **Settings** → **Sales channels**
2. Find **"Headless"** or **"Online Store"** sales channel
3. Verify Advanced Shipping app is enabled for this channel
4. If using **Headless** channel:
   - Go to **Settings** → **Shipping**
   - Ensure Advanced Shipping app rates are available for Headless channel

## Step 6: Test Shipping Calculation

### Test West Malaysia Address

1. Go to your storefront checkout
2. Add products to cart (e.g., 6-pack = 2.5kg)
3. Enter West Malaysia address:
   - **State**: Selangor (or any West Malaysia state)
   - **City**: Shah Alam
   - **Postcode**: 40000
4. **Open Browser Console** (F12 or Right-click → Inspect → Console)
5. Look for `🚚 SHIPPING CALCULATION VERIFICATION` log group
6. Verify:
   - ✅ Cart shows correct items and quantities
   - ✅ Total cart weight is calculated (e.g., "2.5 kg")
   - ✅ Shipping options include Advanced Shipping rates
   - ✅ Selected rate matches your weight tier

### Test East Malaysia Address

1. Add products to cart
2. Enter East Malaysia address:
   - **State**: Sabah (or Sarawak)
   - **City**: Kota Kinabalu (or Kuching)
   - **Postcode**: 88000
3. **Open Browser Console**
4. Look for `🚚 SHIPPING CALCULATION VERIFICATION` log group
5. Verify:
   - ✅ Region shows "East Malaysia"
   - ✅ Shipping options include East Malaysia rates
   - ✅ Rates are higher than West Malaysia (if configured)

## Step 7: Check Console Logs for Issues

When testing checkout, check browser console for:

### ✅ Success Indicators:
```
🚚 SHIPPING CALCULATION VERIFICATION
✅ SUCCESS: Shipping rates calculated
Selected Rate: { title: "...", cost: "RM...", isAdvancedShipping: true }
```

### ⚠️ Warning Indicators:
```
⚠️ WARNING: No shipping options returned
💡 POSSIBLE CAUSES:
- Advanced Shipping app not configured for this region
- Shipping zone not set up correctly
- Products missing weight in Shopify Admin
```

### ❌ Error Indicators:
```
❌ ERROR: [error message]
💡 TROUBLESHOOTING:
1. Check if products have weight set in Shopify Admin
2. Verify Advanced Shipping app is configured for this region
3. Check Shopify Admin → Settings → Shipping → Shipping zones
4. Ensure Advanced Shipping app service is active
```

### 📦 Weight Verification:
Look for `[Shopify Delivery] 📦 Cart Weight Analysis:` log:
```
📦 Cart Weight Analysis:
  totalCartWeight: "2.5 kg" ✅
  items: [
    { product: "6-pack", weight: "2.5 kg", totalWeight: "2.5 kg" } ✅
  ]
  warning: "✓ All products have weight set"
```

If you see:
```
⚠️ 1 product(s) missing weight in Shopify Admin
❌ PRODUCTS MISSING WEIGHT: [product names]
💡 FIX: Go to Shopify Admin → Products → Select product → Variants → Set Weight
```

## Step 8: Common Issues & Fixes

### Issue: "No shipping options available"
**Fix:**
- Verify Advanced Shipping app service is **Active**
- Check shipping zone includes the customer's province
- Ensure Advanced Shipping app is enabled for your sales channel

### Issue: "Shipping cost is 0 or incorrect"
**Fix:**
- Verify weight tiers in Advanced Shipping app match your product weights
- Check if weight-based rules are configured correctly
- Ensure product weights are set in Shopify Admin

### Issue: "Only West Malaysia rates appear for East Malaysia addresses"
**Fix:**
- Create **East Malaysia** service in Advanced Shipping app
- Configure rules for **Sabah** and **Sarawak** provinces
- Verify shipping zone includes Sabah and Sarawak

### Issue: "Weight not calculating correctly"
**Fix:**
- Verify product variant weights are set in Shopify Admin
- Check weight unit is `kg` (kilograms)
- Ensure cart has items before calculating shipping
- Check console logs for weight breakdown

## Step 9: Verify API Key Configuration

1. Check `.env.local` file has:
   ```env
   ADVANCED_SHIPPING_API_KEY=8270f9c-3581-476c-b0c6-771f59093679
   ```
2. Verify API key matches Advanced Shipping app settings:
   - Go to Advanced Shipping app → Settings → General
   - Compare API key with `.env.local`

## Step 10: Contact Advanced Shipping Support

If issues persist after verification:

1. **Contact Advanced Shipping Rules support**
2. **Provide them with:**
   - Store domain: `27ut15-e9.myshopify.com`
   - API key: `8270f9c-3581-476c-b0c6-771f59093679`
   - Issue description: "Weight-based shipping rates not calculating correctly"
   - Console logs from browser (copy the `🚚 SHIPPING CALCULATION VERIFICATION` log group)
   - Screenshots of Advanced Shipping app configuration

## Quick Verification Checklist

- [ ] Products have weight set in Shopify Admin (✅ Already Done)
- [ ] Advanced Shipping app is installed and active
- [ ] West Malaysia service exists and is active
- [ ] East Malaysia service exists and is active (if needed)
- [ ] Weight-based rules are configured in Advanced Shipping app
- [ ] Shipping zones include correct provinces
- [ ] Advanced Shipping app is enabled for sales channel
- [ ] Console logs show weight calculation correctly
- [ ] Shipping rates appear correctly in checkout
- [ ] Rates match Advanced Shipping app configuration

## Next Steps

After completing verification:
1. Test checkout with different product combinations (6-pack, 24-pack, multiple items)
2. Test with both West and East Malaysia addresses
3. Verify rates match Advanced Shipping app configuration
4. Check console logs for any warnings or errors
5. Report any issues with console logs attached
