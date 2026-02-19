# Advanced Shipping App - West Malaysia Configuration Guide

## How to Set First 2kg at RM 8.50 for West Malaysia

This guide shows you how to configure weight-based shipping rates in Advanced Shipping Rules app for West Malaysia, with the first 2kg at RM 8.50.

---

## Step 1: Access Advanced Shipping Rules App

1. Go to **Shopify Admin** → **Apps** → **Advanced Shipping Rules**
2. Click on the app to open settings
3. Navigate to **Services** or **Shipping Services** section

---

## Step 2: Create or Edit West Malaysia Service

### Option A: Create New Service
1. Click **"Add Service"** or **"Create Service"**
2. Enter service details:
   - **Service Name**: `West Malaysia`
   - **Description**: `Weight-based shipping for West Malaysia (Peninsular)`

### Option B: Edit Existing Service
1. Find your existing **"West Malaysia"** service
2. Click to edit it

---

## Step 3: Configure Destination Rules

1. In the service settings, go to **Rules** or **Conditions** section
2. Click **"Add Rule"** or **"Create Rule"**
3. Set up destination conditions:

### Destination Configuration:
- **Condition Type**: `Province` or `Destination`
- **Match Type**: `Is one of` or `Equals`
- **Provinces**: Add all West Malaysia provinces:
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
  Kuala Lumpur    ← Covers both "Kuala Lumpur" and "Wilayah Persekutuan"
  Putrajaya
  ```

**⚠️ IMPORTANT**: 
- **Do NOT include Labuan** (no shipping available)
- **Kuala Lumpur** covers both "Kuala Lumpur" and "Wilayah Persekutuan" selections

---

## Step 4: Configure Weight-Based Rates

1. Set **Rate Type** to: `Weight Based` or `By Weight` or `Per Kilogram`
2. Configure weight tiers:

### ⚠️ IMPORTANT: "Each Rule Must Have Unique From Value"

When creating weight tiers, **each tier must have a unique starting weight ("from" value)**. You cannot have overlapping ranges or duplicate starting points.

**❌ WRONG - Duplicate "From" Values:**
```
Tier 1: 0.01 kg - 2.00 kg: RM 8.50
Tier 2: 0.01 kg - 5.00 kg: RM 12.00  ← ERROR: Same "from" value (0.01)!
Tier 3: 2.00 kg - 10.00 kg: RM 18.00 ← ERROR: Overlaps with Tier 1!
```

**✅ CORRECT - Unique "From" Values:**
```
Tier 1: 0.01 kg - 2.00 kg: RM 8.50      (from: 0.01)
Tier 2: 2.01 kg - 5.00 kg: RM 12.00     (from: 2.01) ← Unique!
Tier 3: 5.01 kg - 10.00 kg: RM 18.00    (from: 5.01) ← Unique!
Tier 4: 10.01 kg - 15.00 kg: RM 25.00   (from: 10.01) ← Unique!
```

**Key Rules:**
- Each tier's "from" weight must be **unique** (no duplicates)
- Each tier's "from" weight should be **higher** than the previous tier's "to" weight
- Typically: `Previous Tier "To" + 0.01` = `Next Tier "From"`
- Example: If Tier 1 ends at 2.00 kg, Tier 2 should start at 2.01 kg

### Weight Tier Configuration:

**Option 1: First 2kg Fixed, Then Per kg**
```
0.01 kg - 2.00 kg: RM 8.50 (flat rate for first 2kg)
2.01 kg - 3.00 kg: RM 8.50 + (RM X per additional kg)
3.01 kg - 5.00 kg: RM 8.50 + (RM X per additional kg)
...continue tiers
```

**Option 2: Tiered Pricing (Recommended)**
```
Tier 1: 0.01 kg - 2.00 kg: RM 8.50      (from: 0.01, to: 2.00)
Tier 2: 2.01 kg - 5.00 kg: RM 12.00     (from: 2.01, to: 5.00) ← Unique from!
Tier 3: 5.01 kg - 10.00 kg: RM 18.00    (from: 5.01, to: 10.00) ← Unique from!
Tier 4: 10.01 kg - 15.00 kg: RM 25.00   (from: 10.01, to: 15.00) ← Unique from!
Tier 5: 15.01 kg - 20.00 kg: RM 32.00   (from: 15.01, to: 20.00) ← Unique from!
Tier 6: 20.01 kg and above: RM 40.00    (from: 20.01, to: unlimited) ← Unique from!
```

**Note**: Each tier has a unique "from" value (0.01, 2.01, 5.01, 10.01, 15.01, 20.01)

**Option 3: First 2kg + Per kg After**
If Advanced Shipping supports "first X kg + per kg":
```
First 2 kg: RM 8.50
Additional per kg: RM 2.00 (or your rate)
```

---

## Step 5: Example Configuration for Your Products

Based on your products:
- **6-pack**: 2.5 kg → Should charge RM 8.50 (first 2kg) + additional for 0.5kg
- **24-pack**: ~10 kg → Should charge based on weight tier

### Recommended Weight Tiers (All with Unique "From" Values):
```
Tier 1: From 0.01 kg to 2.00 kg: RM 8.50      ← Unique from: 0.01
Tier 2: From 2.01 kg to 5.00 kg: RM 12.00     ← Unique from: 2.01
Tier 3: From 5.01 kg to 10.00 kg: RM 18.00    ← Unique from: 5.01
Tier 4: From 10.01 kg to 15.00 kg: RM 25.00   ← Unique from: 10.01
Tier 5: From 15.01 kg to 20.00 kg: RM 32.00   ← Unique from: 15.01
Tier 6: From 20.01 kg and above: RM 40.00     ← Unique from: 20.01
```

**How to Set This Up:**
1. Click "Add Tier" or "Add Rule" for each weight range
2. Enter **From**: `0.01` (or `0` if app allows), **To**: `2.00`, **Rate**: `RM 8.50`
3. Click "Add Tier" again
4. Enter **From**: `2.01`, **To**: `5.00`, **Rate**: `RM 12.00`
5. Continue for each tier, ensuring each "From" value is unique

**For 6-pack (2.5kg)**: Falls into 2.01-5.00kg tier → **RM 12.00**

**For 24-pack (10kg)**: Falls into 5.01-10.00kg tier → **RM 18.00**

---

## Step 6: Activate Service

1. Ensure the service is **Enabled** or **Active**
2. Set **Status** to **Active**
3. Click **"Save"** or **"Update"**

---

## Step 7: Link Service to Shopify Shipping Zone

1. Go to **Shopify Admin** → **Settings** → **Shipping and delivery**
2. Find or create **"West Malaysia"** shipping zone
3. Under **Rates**, click **"Add rate"**
4. Select **"Use carrier or app to calculate rates"**
5. Choose **"Advanced Shipping Rules"** (or your Advanced Shipping app name)
6. Select **"West Malaysia"** service
7. Click **"Done"** and **"Save"**

---

## Step 8: Verify Product Weights

Before testing, ensure product weights are set in Shopify:

1. Go to **Shopify Admin** → **Products**
2. Select your product (e.g., 6-pack)
3. Go to **Variants** section
4. Set **Weight** for each variant:
   - **6-pack variant**: `2.5` kg
   - **24-pack variant**: `10` kg (or actual weight)
5. Set **Weight Unit**: `kg` or `kilograms`
6. Click **"Save"**

**⚠️ CRITICAL**: Advanced Shipping app needs product weights to calculate rates correctly!

---

## Step 9: Test Configuration

1. Go to your storefront checkout page
2. Add products to cart:
   - Test with **6-pack** (2.5kg) → Should show ~RM 12.00 (or your tier rate)
   - Test with **24-pack** (10kg) → Should show ~RM 18.00 (or your tier rate)
3. Enter a West Malaysia address:
   - Example: `Shah Alam, Selangor` or `Kuala Lumpur`
4. Check shipping rates appear
5. Verify rates match your configured tiers

---

## Troubleshooting

### Issue: Shipping rate shows RM 0 or incorrect amount

**Solutions**:
1. **Check product weights**: Go to Products → Variants → Ensure weight is set (e.g., 6-pack = 2.5kg)
2. **Verify weight tiers**: Check Advanced Shipping app → West Malaysia service → Ensure tiers are configured correctly
3. **Check browser console**: Look for `[Shopify Delivery] 📦 Cart Weight Analysis` log to see total cart weight
4. **Verify service is active**: Ensure West Malaysia service is Enabled/Active in Advanced Shipping app

### Issue: "No delivery options available"

**Solutions**:
1. **Check province name**: Ensure "Kuala Lumpur" is in the West Malaysia service rules (covers both KL and Wilayah Persekutuan)
2. **Verify zone linking**: Check Shopify Admin → Shipping zones → West Malaysia → Ensure Advanced Shipping app is selected
3. **Check service status**: Ensure West Malaysia service is Active in Advanced Shipping app

### Issue: "Each rule must have unique from value" Error

**Cause**: You have duplicate "from" values in your weight tiers

**Solutions**:
1. **Check all tiers**: Ensure each tier has a unique starting weight ("from" value)
2. **Fix overlapping ranges**: 
   - If Tier 1: `0.01 - 2.00 kg`, then Tier 2 must start at `2.01 kg` (not `0.01` or `2.00`)
   - Each tier's "from" should be: `Previous Tier "To" + 0.01`
3. **Remove duplicate tiers**: Delete any tiers with the same "from" value
4. **Example fix**:
   - ❌ Wrong: `0.01-2.00` and `0.01-5.00` (duplicate from: 0.01)
   - ✅ Correct: `0.01-2.00` and `2.01-5.00` (unique from values)

### Issue: Rate doesn't match first 2kg = RM 8.50

**Solutions**:
1. **Check weight tier configuration**: Ensure first tier is `0.01 kg - 2.00 kg: RM 8.50` with unique "from" value
2. **Verify cart weight**: Check browser console for total cart weight calculation
3. **Check for multiple rules**: Ensure no conflicting rules in Advanced Shipping app
4. **Test with single product**: Add only 6-pack (2.5kg) and check rate

### Issue: Rate calculation for multiple products is wrong

**Solutions**:
1. **Verify total weight**: Advanced Shipping calculates based on total cart weight
   - 6-pack (2.5kg) + 24-pack (10kg) = 12.5kg total
   - Should fall into appropriate weight tier (e.g., 10.01-15.00kg = RM 25.00)
2. **Check weight tiers**: Ensure tiers cover combined product weights
3. **Verify all products have weight**: Check Products → Variants → All variants have weight set

---

## Browser Console Verification

When testing checkout, check browser console for these logs:

```
[Shopify Delivery] 📦 Cart Weight Analysis:
  totalCartWeight: "2.5 kg"
  items: [
    { product: "Salaam Cola 6-Pack", weight: "2.5 kg", qty: 1 }
  ]
```

```
[Shopify Delivery] 📦 All available shipping options:
  [
    {
      title: "West Malaysia",
      cost: "12.00 MYR",
      source: "Advanced Shipping"
    }
  ]
```

---

## Quick Reference

| Product | Weight | Expected Rate (Example) |
|---------|--------|------------------------|
| 6-pack | 2.5 kg | RM 12.00 (2.01-5.00kg tier) |
| 24-pack | 10 kg | RM 18.00 (5.01-10.00kg tier) |
| 6-pack + 24-pack | 12.5 kg | RM 25.00 (10.01-15.00kg tier) |

**Note**: Actual rates depend on your configured weight tiers in Advanced Shipping app.

---

## Summary

✅ **Service Name**: `West Malaysia`  
✅ **Destination**: All West Malaysia provinces (including Kuala Lumpur)  
✅ **Rate Type**: Weight Based  
✅ **First Tier**: `0.01 kg - 2.00 kg: RM 8.50`  
✅ **Status**: Active  
✅ **Linked**: To Shopify "West Malaysia" shipping zone  
✅ **Product Weights**: Set in Shopify Admin → Products → Variants  

---

## Need Help?

If you're still having issues:
1. Check Advanced Shipping Rules app documentation
2. Contact Advanced Shipping app support
3. Verify product weights are set correctly
4. Check browser console logs during checkout
5. Ensure service is linked to correct shipping zone
