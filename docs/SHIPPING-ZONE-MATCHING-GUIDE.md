# Shipping Zone Matching Guide: Advanced Shipping App ↔ Shopify Admin

This guide ensures that shipping zones in **Advanced Shipping app** match exactly with **Shopify Admin** shipping zones so rates calculate correctly.

## Critical: Province Name Matching

The website sends province names to Shopify API. **Both Shopify Admin and Advanced Shipping app must use the exact same province names** for shipping to work.

## Province Names Sent by Website

The website uses this mapping (from `src/lib/shopify/delivery.ts`):

| User Input | Sent to Shopify API | Notes |
|------------|---------------------|-------|
| Johor | `Johor` | West Malaysia |
| Kedah | `Kedah` | West Malaysia |
| Kelantan | `Kelantan` | West Malaysia |
| Melaka | `Melaka` | West Malaysia |
| Negeri Sembilan | `Negeri Sembilan` | West Malaysia |
| Pahang | `Pahang` | West Malaysia |
| Perak | `Perak` | West Malaysia |
| Perlis | `Perlis` | West Malaysia |
| Pulau Pinang | `Penang` ⚠️ | West Malaysia - Note: Sent as "Penang" |
| Selangor | `Selangor` | West Malaysia |
| Terengganu | `Terengganu` | West Malaysia |
| Kuala Lumpur | `Kuala Lumpur` | West Malaysia - Part of Wilayah Persekutuan |
| Wilayah Persekutuan | `Kuala Lumpur` ⚠️ | West Malaysia - Maps to "Kuala Lumpur" |
| Putrajaya | `Putrajaya` | West Malaysia - Part of Wilayah Persekutuan |
| Labuan | `Labuan` | ❌ **NO SHIPPING** - Excluded from all shipping zones |
| Sabah | `Sabah` | East Malaysia |
| Sarawak | `Sarawak` | East Malaysia |

**⚠️ Important Notes:**
- `Pulau Pinang` → Sent as `Penang` (not "Pulau Pinang")
- `Wilayah Persekutuan` → Sent as `Kuala Lumpur` (not "Wilayah Persekutuan")

## Step 1: Configure Shopify Admin Shipping Zones

### Zone 1: West Malaysia (Peninsular)

1. Go to **Shopify Admin** → **Settings** → **Shipping and delivery**
2. Click **"Add shipping zone"** or edit existing zone
3. **Zone Name**: `West Malaysia` (or `Peninsular Malaysia`)
4. **Countries/Regions**: Add these provinces **exactly as shown**:
   ```
   Johor
   Kedah
   Kelantan
   Melaka
   Negeri Sembilan
   Pahang
   Perak
   Perlis
   Penang          ← Note: Use "Penang" not "Pulau Pinang"
   Selangor
   Terengganu
   Kuala Lumpur    ← Part of Wilayah Persekutuan
   Putrajaya       ← Part of Wilayah Persekutuan
   ```
   
   **⚠️ IMPORTANT**: 
   - **Labuan is EXCLUDED** from all shipping zones (no shipping available)
   - Wilayah Persekutuan (Federal Territory) includes: Kuala Lumpur, Putrajaya, and Labuan
   - Only Kuala Lumpur and Putrajaya are included in West Malaysia zone
   - Do NOT add Labuan to any shipping zone
5. **Rates**: Add **Advanced Shipping** app rate (or configure manual rates)
6. Click **"Save"**

### Zone 2: East Malaysia

1. Click **"Add shipping zone"**
2. **Zone Name**: `East Malaysia`
3. **Countries/Regions**: Add these provinces:
   ```
   Sabah
   Sarawak
   ```
4. **Rates**: Add **Advanced Shipping** app rate
5. Click **"Save"**

### Verification Checklist for Shopify Admin

- [ ] Zone names match: `West Malaysia` and `East Malaysia`
- [ ] All provinces listed above are included
- [ ] `Penang` is used (not "Pulau Pinang")
- [ ] `Kuala Lumpur` is used (not "Wilayah Persekutuan")
- [ ] Advanced Shipping app is selected as rate provider
- [ ] Zones are enabled for **Headless** sales channel

## Step 2: Configure Advanced Shipping App Zones

### Service 1: West Malaysia

1. Go to **Shopify Admin** → **Apps** → **Advanced Shipping Rules**
2. Go to **Services** section
3. Create or edit **"West Malaysia"** service
4. **Service Name**: `West Malaysia` (must match Shopify zone name)
5. **Rules**: Add destination rules for these provinces:
   ```
   Province = Johor
   Province = Kedah
   Province = Kelantan
   Province = Melaka
   Province = Negeri Sembilan
   Province = Pahang
   Province = Perak
   Province = Perlis
   Province = Penang          ← Use "Penang" not "Pulau Pinang"
   Province = Selangor
   Province = Terengganu
   Province = Kuala Lumpur    ← Part of Wilayah Persekutuan
   Province = Putrajaya       ← Part of Wilayah Persekutuan
   ```
   
   **⚠️ IMPORTANT**: 
   - **Labuan is EXCLUDED** from Advanced Shipping app rules (no shipping available)
   - If users select "Wilayah Persekutuan", the website converts it to "Kuala Lumpur" for Shopify API
   - Only include Kuala Lumpur and Putrajaya in the West Malaysia service
   - Do NOT add Labuan to any Advanced Shipping app service
   
   **OR** use condition: `Province is one of: [list all above]`
6. **Rate Type**: Weight-based
7. Configure weight tiers (e.g., RM 8.50 for first 2kg, then RM 2.00 per kg)
8. **Status**: Active/Enabled
9. Click **"Save"**

### Service 2: East Malaysia

1. Create or edit **"East Malaysia"** service
2. **Service Name**: `East Malaysia` (must match Shopify zone name)
3. **Rules**: Add destination rules:
   ```
   Province = Sabah
   Province = Sarawak
   ```
   **OR** use condition: `Province is Sabah OR Province is Sarawak`
4. **Rate Type**: Weight-based
5. Configure weight tiers (e.g., RM 11.00 for first 1kg, then RM 11.00 per kg)
6. **Status**: Active/Enabled
7. Click **"Save"**

### Verification Checklist for Advanced Shipping App

- [ ] Service names match Shopify zone names exactly:
  - `West Malaysia` (not "West Malaysia Shipping" or "Peninsular")
  - `East Malaysia` (not "East Malaysia Shipping")
- [ ] All provinces listed above are included in rules
- [ ] `Penang` is used (not "Pulau Pinang")
- [ ] `Kuala Lumpur` is used (not "Wilayah Persekutuan")
- [ ] Weight-based rates are configured
- [ ] Services are **Active/Enabled**
- [ ] Services are assigned to correct shipping zones in Shopify Admin

## Step 3: Link Advanced Shipping App to Shopify Zones

1. Go to **Shopify Admin** → **Settings** → **Shipping and delivery**
2. For each shipping zone:
   - Click on the zone name
   - Under **"Rates"**, click **"Add rate"**
   - Select **"Use carrier or app to calculate rates"**
   - Choose **"Advanced Shipping Rules"** (or your Advanced Shipping app name)
   - Select the corresponding service:
     - **West Malaysia zone** → **West Malaysia service**
     - **East Malaysia zone** → **East Malaysia service**
3. Click **"Done"** and **"Save"**

## Step 4: Verify Province Name Matching

### Test Addresses

Test with these addresses to verify matching:

**West Malaysia Test:**
- **State**: `Selangor`
- **City**: `Shah Alam`
- **Postcode**: `40000`
- **Expected**: Website sends `Selangor` → Should match Shopify zone → Should match Advanced Shipping rule

**East Malaysia Test:**
- **State**: `Sabah`
- **City**: `Kota Kinabalu`
- **Postcode**: `88000`
- **Expected**: Website sends `Sabah` → Should match Shopify zone → Should match Advanced Shipping rule

**Special Case Test (Penang):**
- **State**: `Pulau Pinang` (user input)
- **City**: `George Town`
- **Postcode**: `10000`
- **Expected**: Website converts to `Penang` → Should match Shopify zone → Should match Advanced Shipping rule

### Check Browser Console

When testing checkout, check browser console for:

```
[Shopify Delivery] Shopify recognized address:
  sentProvince: "Penang"
  recognizedProvince: "Penang"
  match: "✓ MATCH"
```

If you see `⚠ CHECK - May need adjustment`, the province name doesn't match:
- Check what Shopify recognized (e.g., `recognizedProvince: "Pulau Pinang"`)
- Update either:
  - Shopify Admin zone to use `Penang` (recommended)
  - OR update `mapStateToShopifyProvinceCode()` to send `Pulau Pinang`

## Step 5: Common Mismatch Issues

### Issue: "No delivery options available for Wilayah Persekutuan (sent as 'Kuala Lumpur')"

**Cause**: Shopify Admin shipping zone or Advanced Shipping app doesn't have "Kuala Lumpur" configured

**Fix**:
1. **In Shopify Admin**:
   - Go to **Settings** → **Shipping** → **Shipping zones**
   - Open **"West Malaysia"** zone
   - Verify **"Kuala Lumpur"** is listed in Countries/Regions
   - If missing, click **"Add country/region"** → Search for **"Kuala Lumpur"** → Add it
   - Save the zone

2. **In Advanced Shipping App**:
   - Open **"West Malaysia"** service
   - Verify rules include: `Province = Kuala Lumpur`
   - If missing, add rule: `Province is Kuala Lumpur`
   - Save the service

3. **Verify Linking**:
   - In Shopify Admin → Shipping zones → West Malaysia
   - Under Rates, ensure Advanced Shipping app is selected
   - Ensure it's linked to **"West Malaysia"** service

4. **Test Again**:
   - Enter address with state: **"Kuala Lumpur"** or **"Wilayah Persekutuan"**
   - Check browser console for shipping calculation logs
   - Should now show shipping rates

### Issue: "No delivery options available" (General)

**Cause**: Province name mismatch between website → Shopify → Advanced Shipping

**Fix**:
1. Check browser console: `[Shopify Delivery] Shopify recognized address`
2. Compare `sentProvince` vs `recognizedProvince`
3. If different:
   - Update Shopify Admin zone to use the name website sends
   - OR update Advanced Shipping app rules to use Shopify's recognized name
   - OR update `mapStateToShopifyProvinceCode()` to send Shopify's format

### Issue: "Only West Malaysia rates appear for East Malaysia"

**Cause**: Advanced Shipping app service not configured for East Malaysia provinces

**Fix**:
1. Verify **East Malaysia** service exists in Advanced Shipping app
2. Verify service has rules for `Sabah` and `Sarawak`
3. Verify service is **Active**
4. Verify service is linked to **East Malaysia** zone in Shopify Admin

### Issue: "Shipping cost is 0 or incorrect"

**Cause**: Weight-based rules not configured correctly in Advanced Shipping app

**Fix**:
1. Check product weights are set in Shopify Admin
2. Verify Advanced Shipping app weight tiers match your products
3. Check browser console: `[Shopify Delivery] 📦 Cart Weight Analysis`
4. Verify total cart weight matches expected tier

## Step 6: Quick Reference Table

| Component | West Malaysia Provinces | East Malaysia Provinces |
|-----------|------------------------|------------------------|
| **Website Sends** | Johor, Kedah, Kelantan, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, **Penang**, Selangor, Terengganu, Kuala Lumpur, Putrajaya | Sabah, Sarawak |
| **Excluded** | **Labuan** ❌ (No shipping available) | - |
| **Shopify Zone** | Must include all above provinces | Must include Sabah, Sarawak |
| **Advanced Shipping Service** | Must have rules for all above provinces | Must have rules for Sabah, Sarawak |
| **Service Name** | `West Malaysia` | `East Malaysia` |

## Step 7: Verification Checklist

### Complete Matching Checklist

- [ ] **Shopify Admin Zones**:
  - [ ] `West Malaysia` zone exists with all provinces listed (excluding Labuan)
  - [ ] `East Malaysia` zone exists with Sabah, Sarawak
  - [ ] Zones use `Penang` (not "Pulau Pinang")
  - [ ] Zones use `Kuala Lumpur` (not "Wilayah Persekutuan")
  - [ ] **Labuan is NOT included** in any shipping zone
  - [ ] Advanced Shipping app is selected as rate provider

- [ ] **Advanced Shipping App Services**:
  - [ ] `West Malaysia` service exists
  - [ ] `East Malaysia` service exists
  - [ ] Service names match zone names exactly
  - [ ] All provinces are included in rules (excluding Labuan)
  - [ ] **Labuan is NOT included** in any service rules
  - [ ] Services are Active/Enabled
  - [ ] Weight-based rates are configured

- [ ] **Linking**:
  - [ ] West Malaysia zone → West Malaysia service
  - [ ] East Malaysia zone → East Malaysia service

- [ ] **Testing**:
  - [ ] West Malaysia address calculates shipping correctly
  - [ ] East Malaysia address calculates shipping correctly
  - [ ] Browser console shows `✓ MATCH` for province recognition
  - [ ] Shipping rates match Advanced Shipping app configuration

## Troubleshooting

### Still Not Working?

1. **Check Console Logs**:
   - Look for `[Shopify Delivery] Shopify recognized address`
   - Note the `recognizedProvince` value
   - Update Advanced Shipping app rules to use that exact name

2. **Check Shopify Admin**:
   - Go to **Settings** → **Shipping** → Click zone
   - Verify province names match what website sends
   - If not, update zone to match

3. **Check Advanced Shipping App**:
   - Open service settings
   - Verify province conditions match Shopify zone
   - Test with a single province first (e.g., just `Selangor`)

4. **Contact Support**:
   - Provide console logs showing `recognizedProvince`
   - Provide screenshots of Shopify Admin zones
   - Provide screenshots of Advanced Shipping app rules

## Summary

**The key to matching zones:**
1. Website sends province names (see mapping table above)
2. Shopify Admin zones must include those exact province names
3. Advanced Shipping app services must have rules for those exact province names
4. Service names should match zone names (`West Malaysia`, `East Malaysia`)
5. All three must match for shipping to calculate correctly
6. **Labuan is EXCLUDED** from all shipping zones (no shipping available)

**Most Common Issue**: Province name mismatch (e.g., "Penang" vs "Pulau Pinang")

**Solution**: Use the exact names the website sends (see table above) in both Shopify Admin and Advanced Shipping app.

**Important**: If a customer selects Labuan as their state, the website will show an error message: "Shipping is not available to Labuan. Please contact support for alternative arrangements."
