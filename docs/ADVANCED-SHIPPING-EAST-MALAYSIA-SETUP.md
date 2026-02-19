# Advanced Shipping App - East Malaysia Configuration Guide

## Problem
When checking shipping rates for East Malaysia addresses (Sabah, Sarawak), only "West Malaysia" service appears in Advanced Shipping Rules app, and East Malaysia rates are not calculated.

## Solution: Configure East Malaysia Service in Advanced Shipping App

### Step 1: Access Advanced Shipping Rules App
1. Go to **Shopify Admin** → **Apps** → **Advanced Shipping Rules**
2. Click on the app to open settings

### Step 2: Create East Malaysia Service
1. In Advanced Shipping Rules, go to **Services** or **Shipping Services** section
2. Click **"Add Service"** or **"Create Service"**
3. Create a new service with these settings:
   - **Service Name**: `East Malaysia` (or `East Malaysia Shipping`)
   - **Description**: `Shipping to Sabah and Sarawak`

### Step 3: Configure Service Rules for East Malaysia
1. Select the **East Malaysia** service you just created
2. Click **"Add Rule"** or **"Create Rule"**
3. Configure the rule:

#### Rule Configuration:
- **Rule Name**: `East Malaysia - Weight Based`
- **Condition**: 
  - **Destination**: Select `Sabah` and `Sarawak` (or `East Malaysia` if available)
  - **OR** use **Province** condition: `Province is Sabah OR Province is Sarawak`
- **Rate Type**: `Weight Based` (or `By Weight`)
- **Weight Tiers**: Configure based on your pricing:
  ```
  0.01 kg - 1.00 kg: RM 11.00
  1.01 kg - 2.00 kg: RM 22.00
  2.01 kg - 3.00 kg: RM 33.00
  3.01 kg - 5.00 kg: RM 55.00
  5.01 kg - 10.00 kg: RM 110.00
  (Adjust based on your actual rates)
  ```

### Step 4: Verify Service is Active
1. Ensure the **East Malaysia** service is **Enabled** or **Active**
2. Check that it's assigned to the correct **Shipping Zone**:
   - Go to **Shopify Admin** → **Settings** → **Shipping**
   - Find your shipping zones
   - Ensure **Sabah** and **Sarawak** are included in a zone that uses Advanced Shipping app

### Step 5: Test Configuration
1. Go to your storefront checkout
2. Enter an address in **Sabah** or **Sarawak**:
   - Example: `Kota Kinabalu, Sabah` or `Kuching, Sarawak`
3. Add products to cart (e.g., 6-pack = 2.5kg)
4. Check if shipping rates appear correctly
5. Verify the rate matches your East Malaysia pricing

## Troubleshooting

### Issue: Still only seeing "West Malaysia" service
**Solution**: 
- Check Advanced Shipping app → **Services** → Ensure **East Malaysia** service exists and is **Active**
- Verify the service has rules configured for Sabah/Sarawak provinces
- Check Shopify Admin → **Settings** → **Shipping** → Ensure Sabah/Sarawak are in a shipping zone

### Issue: East Malaysia rates not appearing
**Solution**:
- Verify province names match exactly: `Sabah` and `Sarawak` (case-sensitive in some cases)
- Check Advanced Shipping app logs/activity for errors
- Ensure weight-based rules are configured correctly
- Verify the service is assigned to the correct shipping zone

### Issue: Wrong rates showing
**Solution**:
- Double-check weight tiers in Advanced Shipping app
- Verify product weights are set correctly in Shopify (6-pack = 2.5kg, 24-pack = 10kg)
- Check if multiple rules are conflicting

## Code Verification

The codebase sends province names as-is to Shopify:
- `Sabah` → Sent as `"Sabah"`
- `Sarawak` → Sent as `"Sarawak"`

Check browser console logs when testing:
- Look for `[Shopify Delivery] 🌍 Address Region:` log
- Verify `region: 'East Malaysia'` appears for Sabah/Sarawak addresses
- Check `[Shopify Delivery] 📦 All available shipping options:` to see what rates Shopify returns

## Expected Behavior

**For West Malaysia addresses** (e.g., Selangor, KL, Johor):
- Service: `West Malaysia` (or similar)
- Rates: Based on West Malaysia weight tiers

**For East Malaysia addresses** (Sabah, Sarawak):
- Service: `East Malaysia` (should appear if configured)
- Rates: Based on East Malaysia weight tiers (typically higher)

## Contact Advanced Shipping Support

If issues persist:
1. Contact Advanced Shipping Rules app support
2. Provide them with:
   - Your store domain
   - API key: `8270f9c-3581-476c-b0c6-771f59093679`
   - Issue: "East Malaysia service not appearing, only West Malaysia"
   - Request: "Help configure East Malaysia service for Sabah and Sarawak"
