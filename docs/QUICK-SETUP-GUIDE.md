# Quick Setup Guide: Shopify Email Marketing

## 🚀 Fast Setup (5 minutes)

### Step 1: Create Shopify App

1. Go to: `https://27ut15-e9.myshopify.com/admin/settings/apps`
2. Click **"Develop apps"** → **"Create an app"**
3. Name it: `Email Marketing Integration`
4. Click **"Create app"**

### Step 2: Configure Permissions

1. Click **"Configure Admin API scopes"**
2. Find and check:
   - ✅ `write_customers`
   - ✅ `read_customers`
3. Click **"Save"**

### Step 3: Install App

1. Click **"Install app"** (top right)
2. Review permissions → Click **"Install"**

### Step 4: Get Token

1. Go to **"API credentials"** tab
2. Under **"Admin API access token"**, click **"Reveal token once"**
3. **Copy the token** (you won't see it again!)

### Step 5: Add to .env.local

Open `.env.local` and add:

```env
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:** Replace `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual token!

### Step 6: Verify Setup

Run this command:

```bash
npm run verify-shopify
```

Or visit: `http://localhost:3000/en/admin/test-shopify`

### Step 7: Test

1. Restart your dev server: `npm run dev`
2. Open homepage: `http://localhost:3000/en`
3. Submit an email in the Ramadan popup
4. Check Shopify Admin → Customers to verify it was created

## ✅ Done!

Your email subscription is now connected to Shopify!

## 🐛 Troubleshooting

### "Shopify Admin API not configured"
- Make sure `SHOPIFY_ADMIN_ACCESS_TOKEN` is in `.env.local`
- Restart your dev server after adding it

### "Connection failed"
- Verify your token is correct
- Check that app has `write_customers` and `read_customers` scopes
- Make sure the app is installed

### "Customer not appearing in Shopify"
- Check the browser console for errors
- Verify token permissions
- Test the connection at `/en/admin/test-shopify`

## 📚 Full Documentation

See `docs/SHOPIFY-EMAIL-MARKETING-SETUP.md` for detailed instructions.
