# 🎯 Quick Setup Instructions

I've prepared everything for you! Here's what to do:

## Step 1: Open Shopify Admin

Go to: **https://27ut15-e9.myshopify.com/admin/settings/apps**

## Step 2: Create App

1. Click **"Develop apps"** button (top right)
2. Click **"Create an app"**
3. Name: `Email Marketing Integration`
4. Developer: Your name
5. Click **"Create app"**

## Step 3: Configure Scopes

1. Click **"Configure Admin API scopes"** tab
2. Scroll to **"Customer"** section
3. Check these boxes:
   - ✅ `read_customers`
   - ✅ `write_customers`
4. Click **"Save"**

## Step 4: Install App

1. Click **"Install app"** button (top right)
2. Review permissions
3. Click **"Install"**

## Step 5: Get Token

1. Click **"API credentials"** tab
2. Scroll to **"Admin API access token"**
3. Click **"Reveal token once"**
4. **Copy the token** (starts with `shpat_`)

## Step 6: Add Token

Open `.env.local` and add this line:

```env
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_paste_your_token_here
```

Replace `shpat_paste_your_token_here` with your actual token.

## Step 7: Verify

```bash
npm run verify-shopify
```

## Step 8: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Step 9: Test

Visit: `http://localhost:3000/en/admin/test-shopify`

---

**Or use the automated script:**

```bash
npm run auto-setup-shopify
```

This will guide you through everything interactively!
