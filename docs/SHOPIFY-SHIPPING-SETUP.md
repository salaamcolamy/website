# Shopify Shipping Setup Guide - Weight-Based Rates

This guide explains how to configure weight-based shipping rates in Shopify Admin based on the Tranz Alliance rate card.

## Overview

Based on your rate card, you need to set up shipping zones with weight-based rates:

1. **Within Peninsular Malaysia**: RM 8.50 for first 2 kg, then RM 2.00 per 1 kg
2. **Between Peninsular to East Malaysia**: RM 11.00 for first 1 kg, then RM 11.00 per 1 kg
3. **Between Sabah & Sarawak**: RM 14.50 for first 1 kg, then RM 13.00 per 1 kg
4. **Within Sarawak or Sabah**: RM 17.50 for first 3 kg, then RM 6.00 per 1 kg

## Quick Answer: How to Set Up Your Example

**For East Malaysia with 6-pack (2.5 kg) = RM 33.00:**

1. Go to **Settings** → **Shipping and delivery**
2. Create/edit shipping zone for **East Malaysia** (Sabah, Sarawak, Labuan)
3. Click **Add rate** → **Add weight-based shipping rate**
4. Set up weight tiers:
   - **0.01 - 1.00 kg**: RM 11.00
   - **1.01 - 2.00 kg**: RM 22.00
   - **2.01 - 3.00 kg**: RM 33.00 ← This covers your 2.5kg product
   - Continue adding tiers for higher weights

5. Make sure your **6-pack product variant** has **Weight: 2.5 kg** set in product settings

Shopify will automatically calculate RM 33.00 for a 2.5kg product (rounded up to 3kg tier).

## Step-by-Step Setup

### Step 1: Access Shipping Settings

1. Log in to your Shopify Admin
2. Go to **Settings** → **Shipping and delivery**
3. Scroll down to **Shipping zones**

### Step 2: Create Shipping Zones

You'll need to create separate shipping zones for different regions:

#### Zone 1: Peninsular Malaysia
- **Name**: "Peninsular Malaysia"
- **Countries/Regions**: Select these Malaysian states:
  - Perlis
  - Kedah
  - Pulau Pinang
  - Perak
  - Selangor
  - Negeri Sembilan
  - Melaka
  - Johor
  - Pahang
  - Terengganu
  - Kelantan
  - Kuala Lumpur
  - Putrajaya

#### Zone 2: East Malaysia (Sabah & Sarawak)
- **Name**: "East Malaysia"
- **Countries/Regions**: Select:
  - Sabah
  - Sarawak
  - Labuan

#### Zone 3: Cross-Region (Peninsular to East Malaysia)
- **Name**: "Peninsular to East Malaysia"
- **Countries/Regions**: Select all Malaysian states (this will handle cross-region shipping)

**Note**: Shopify doesn't natively support "between zones" shipping. You have two options:

**Option A (Recommended)**: Create separate zones and use conditional logic
- Create zones for Peninsular and East Malaysia separately
- Use Shopify Flow or apps to handle cross-region rates

**Option B**: Use a single zone with conditional rates based on customer location
- Create one zone with all Malaysian states
- Use weight-based rates that vary by province/state

### Step 3: Set Up Weight-Based Rates

For each shipping zone, click **Add rate** → **Add weight-based shipping rate**

#### Example: Peninsular Malaysia Zone

1. **Rate name**: "Standard Delivery (Peninsular)"
2. **Weight range**: Set up tiers:

   **Tier 1: 0.01 kg - 2.00 kg**
   - Price: **RM 8.50**
   - This covers the first 2 kg

   **Tier 2: 2.01 kg - 3.00 kg**
   - Price: **RM 10.50** (RM 8.50 + RM 2.00)
   - Additional 1 kg

   **Tier 3: 3.01 kg - 4.00 kg**
   - Price: **RM 12.50** (RM 8.50 + RM 2.00 + RM 2.00)
   - Additional 1 kg

   **Tier 4: 4.01 kg - 5.00 kg**
   - Price: **RM 14.50** (RM 8.50 + RM 2.00 × 3)
   - Additional 1 kg

   Continue this pattern for higher weights (add RM 2.00 per kg after the first 2 kg).

#### Example: East Malaysia Zone (Peninsular to East Malaysia)

1. **Rate name**: "Standard Delivery (East Malaysia)"
2. **Weight range**: Set up tiers:

   **Tier 1: 0.01 kg - 1.00 kg**
   - Price: **RM 11.00**
   - First 1 kg

   **Tier 2: 1.01 kg - 2.00 kg**
   - Price: **RM 22.00** (RM 11.00 + RM 11.00)
   - Additional 1 kg

   **Tier 3: 2.01 kg - 3.00 kg**
   - Price: **RM 33.00** (RM 11.00 + RM 11.00 + RM 11.00)
   - Additional 1 kg (this covers your 2.5kg product example - rounded up to 3kg)

   **Tier 4: 3.01 kg - 4.00 kg**
   - Price: **RM 44.00** (RM 11.00 × 4)
   - Additional 1 kg

   **Tier 5: 4.01 kg - 5.00 kg**
   - Price: **RM 55.00** (RM 11.00 × 5)
   - Additional 1 kg

   Continue this pattern (add RM 11.00 per kg after the first 1 kg).

#### Quick Setup Table for East Malaysia

| Weight Range | Price (RM) | Calculation |
|--------------|------------|-------------|
| 0.01 - 1.00 kg | 11.00 | First 1 kg |
| 1.01 - 2.00 kg | 22.00 | 11.00 + 11.00 |
| 2.01 - 3.00 kg | 33.00 | 11.00 × 3 (covers 2.5kg) |
| 3.01 - 4.00 kg | 44.00 | 11.00 × 4 |
| 4.01 - 5.00 kg | 55.00 | 11.00 × 5 |
| 5.01 - 6.00 kg | 66.00 | 11.00 × 6 |
| ... | ... | Continue pattern |

### Step 4: Configure Product Weights

**IMPORTANT**: Each product variant must have a weight set for weight-based shipping to work.

1. Go to **Products** → Select a product
2. For each variant, set the **Weight**:
   - **6-pack**: 2.5 kg (or actual weight)
   - **24-pack**: ~10 kg (or actual weight)
   - Adjust based on your actual product weights

3. **Weight unit**: Set to **kg** (kilograms)

### Step 5: Using Shopify Shipping Calculator API

Since you're using the Storefront API, Shopify will automatically calculate shipping based on:
- Cart total weight (sum of all items)
- Customer's shipping address (province/state)
- Your configured shipping zones and rates

## Example Calculation

### Example 1: 6-pack product (2.5 kg) to East Malaysia

Using "Between Peninsular to East Malaysia" rates:
- First 1 kg: RM 11.00
- Next 1 kg (1.01 - 2.00 kg): RM 11.00  
- Remaining 0.5 kg (2.01 - 2.5 kg, rounded up to next full kg = 3.00 kg): RM 11.00
- **Total: RM 33.00**

**Note**: Shopify typically rounds up to the next weight tier, so 2.5 kg becomes 3.0 kg.

### Example 2: 6-pack product (2.5 kg) within Peninsular Malaysia

Using "Within Peninsular Malaysia" rates:
- First 2 kg: RM 8.50
- Remaining 0.5 kg (2.01 - 2.5 kg, rounded up = 3.0 kg): RM 2.00
- **Total: RM 10.50**

### Example 3: Multiple items (6-pack + 24-pack)

If cart contains:
- 6-pack: 2.5 kg
- 24-pack: 10 kg
- **Total weight: 12.5 kg**

For East Malaysia:
- First 1 kg: RM 11.00
- Next 12 kg (1.01 - 13.0 kg): RM 11.00 × 12 = RM 132.00
- **Total: RM 143.00**

## Important Notes

1. **Weight Rounding**: Shopify typically rounds up to the next weight tier. Check your actual rounding behavior.

2. **Multiple Items**: If a cart has multiple items, Shopify sums the total weight and applies the rate based on the total.

3. **Testing**: After setup, test with:
   - Different product weights
   - Different shipping addresses
   - Multiple items in cart

4. **Headless Channel**: Make sure your shipping zones are enabled for the **Headless** sales channel (Settings → Sales channels → Headless)

## Troubleshooting

### Shipping rates not showing?
- Check that products have weights set
- Verify shipping zones include the customer's location
- Ensure Headless sales channel is enabled for shipping zones
- Check that shipping zones are published

### Wrong rates showing?
- Verify weight tiers are set correctly
- Check that product weights match your expectations
- Test with different addresses to ensure correct zone matching

### Cross-region shipping?
- Shopify's native zones don't handle "between zones" well
- Consider using a shipping app or custom logic
- Or create a combined zone with conditional rates

## Alternative: Using Shipping Apps

If Shopify's native weight-based shipping is too complex, consider:
- **Shippo**: Advanced shipping rate calculation
- **EasyShip**: Multi-carrier shipping with weight-based rates
- **ShipStation**: More flexible rate configuration

These apps can handle complex scenarios like cross-region shipping more easily.
