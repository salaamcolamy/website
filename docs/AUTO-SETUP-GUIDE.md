# 🚀 Automated Shopify Admin API Setup

The easiest way to set up Shopify Admin API - just run one command!

## Quick Start

```bash
npm run auto-setup-shopify
```

This script will:
1. ✅ Check your current setup
2. ✅ Create/update `.env.local` file
3. ✅ Open Shopify Admin in your browser
4. ✅ Guide you through getting the token
5. ✅ Add the token to `.env.local` automatically
6. ✅ Verify everything is set up correctly

## What Happens

### Step 1: Script Runs
- Checks if `.env.local` exists (creates if needed)
- Checks if token is already configured
- Opens Shopify Admin in your browser

### Step 2: You Follow Instructions
The script shows you exactly what to do:
1. Create app in Shopify
2. Configure scopes
3. Install app
4. Get token

### Step 3: Paste Token
- Script asks you to paste the token
- Automatically adds it to `.env.local`
- Verifies setup

### Step 4: Done!
- Restart dev server
- Test connection
- Start using email subscriptions!

## Manual Alternative

If you prefer to do it manually:

```bash
# Just get instructions
npm run setup-shopify-admin

# Or follow the detailed guide
# See: docs/SHOPIFY-ADMIN-API-STEP-BY-STEP.md
```

## Troubleshooting

### Script doesn't open browser
- Manually open: https://27ut15-e9.myshopify.com/admin/settings/apps
- Continue with the steps shown

### Token not accepted
- Make sure token starts with `shpat_`
- Check for extra spaces
- Verify token was copied completely

### Still not working?
```bash
# Verify setup
npm run verify-shopify

# Test connection
# Visit: http://localhost:3000/en/admin/test-shopify
```

## What You Need

- ✅ Access to Shopify Admin
- ✅ Admin credentials for `27ut15-e9.myshopify.com`
- ✅ About 2-3 minutes

## After Setup

Once configured:
- ✅ Email subscriptions work automatically
- ✅ Customers created in Shopify
- ✅ Marketing consent recorded
- ✅ Ready for campaigns

---

**Ready?** Run `npm run auto-setup-shopify` now! 🚀
