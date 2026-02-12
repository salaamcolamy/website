# 🔑 How to Get Your Shopify Admin API Token

Follow these exact steps to get your token:

## Step 1: Open Shopify Admin

Go to: **https://27ut15-e9.myshopify.com/admin**

Log in if needed.

## Step 2: Go to Apps Settings

1. Look at the **bottom left** of the screen
2. Click **"Settings"** (gear icon ⚙️)
3. Click **"Apps and sales channels"**

## Step 3: Create or Find Your App

### Option A: If you already created an app
- Look for **"Email Marketing Integration"** in the list
- Click on it

### Option B: If you need to create an app
1. Click **"Develop apps"** button (top right)
2. Click **"Create an app"**
3. Name: `Email Marketing Integration`
4. Click **"Create app"**

## Step 4: Configure Scopes (if creating new app)

1. Click **"Configure Admin API scopes"** tab
2. Scroll down to **"Customer"** section
3. Check these boxes:
   - ✅ `read_customers`
   - ✅ `write_customers`
4. Click **"Save"**

## Step 5: Install the App (if not installed)

1. Click **"Install app"** button (top right)
2. Review permissions
3. Click **"Install"**

## Step 6: Get the Token ⭐ THIS IS THE IMPORTANT PART

1. Click the **"API credentials"** tab
2. Scroll down to find **"Admin API access token"** section
3. You'll see a button that says **"Reveal token once"** or **"Install app"** if not installed yet
4. Click **"Reveal token once"**
5. **COPY THE TOKEN IMMEDIATELY** - it starts with `shpat_` and looks like:
   ```
   shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. ⚠️ **IMPORTANT:** You can only see it once! Copy it right away.

## Step 7: Add Token to .env.local

1. Open `.env.local` file in your project
2. Find the line:
   ```env
   # SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token_here
   ```
3. Remove the `#` and replace with your actual token:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_paste_your_actual_token_here
   ```
4. Save the file

## Step 8: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Visual Guide

```
Shopify Admin
  └─ Settings (bottom left)
      └─ Apps and sales channels
          └─ Develop apps
              └─ Create app / Select existing app
                  └─ API credentials tab
                      └─ Admin API access token
                          └─ Reveal token once
                              └─ COPY TOKEN (shpat_...)
```

## Quick Links

- **Direct link to Apps:** https://27ut15-e9.myshopify.com/admin/settings/apps
- **Direct link to Develop Apps:** https://27ut15-e9.myshopify.com/admin/settings/apps/develop

## Troubleshooting

### "I don't see 'Develop apps' button"
- Make sure you're logged in as an admin
- Check you're on the "Apps and sales channels" page

### "I don't see 'Reveal token' button"
- Make sure the app is installed first
- Click "Install app" if you see that button instead

### "Token doesn't work"
- Make sure you copied the entire token (it's long!)
- Check there are no extra spaces
- Verify it starts with `shpat_`
- Make sure you removed the `#` in `.env.local`

### "I lost the token"
- You'll need to regenerate it or create a new app
- Tokens can only be viewed once for security

---

**Need help?** The token should look like: `shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
