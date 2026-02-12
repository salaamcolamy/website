# 🎯 Exact Steps to Get Token in Shopify Admin (2026)

## ⚠️ Important Clarification

**You're NOT installing an email marketing app!**

You're creating a **custom app** (just for API access) so your website can add customers to Shopify. Once customers are in Shopify, you can use:
- ✅ Shopify's built-in email marketing (Marketing → Email campaigns)
- ✅ Klaviyo, Mailchimp, or any email tool that syncs with Shopify

The custom app is just a "key" that lets your website talk to Shopify's API. It's not an email marketing tool itself.

## Step-by-Step Instructions

### Step 1: Log into Shopify Admin
1. Go to: **https://27ut15-e9.myshopify.com/admin**
2. Log in with your admin credentials

### Step 2: Navigate to Settings
1. Look at the **bottom left** of your screen
2. You'll see a menu with icons
3. Click the **⚙️ Settings** icon (gear icon)
4. A menu will open

### Step 3: Go to Apps Section
1. In the Settings menu, look for **"Apps and sales channels"**
2. Click on it
3. You'll see a page with apps listed

### Step 4: Access Develop Apps
1. Look for a button that says **"Develop apps"** (usually top right)
2. Click **"Develop apps"**
3. You'll see a list of custom apps (if any exist)

### Step 5: Check if App Exists
**Option A: App Already Exists**
- Look for an app named "Email Marketing Integration" or similar
- Click on the app name
- Skip to Step 8

**Option B: Need to Create App**
- ⚠️ **Note:** As of 2026, you may not be able to create new legacy apps
- If you see "Create an app" button, try it:
  1. Click **"Create an app"**
  2. Name: `Email Marketing Integration`
  3. Click **"Create app"**
- If you DON'T see "Create an app", you'll need to use Dev Dashboard (see below)

### Step 6: Configure API Scopes (If Creating New)
1. Click **"Configure Admin API scopes"** tab
2. Scroll down to find **"Customer"** section
3. Check these boxes:
   - ✅ `read_customers`
   - ✅ `write_customers`
4. Click **"Save"**

### Step 7: Install the App
1. Click **"Install app"** button (top right)
2. Review the permissions
3. Click **"Install"** to confirm

### Step 8: Get the Token ⭐
1. Click the **"API credentials"** tab
2. Scroll down to find **"Admin API access token"** section
3. You'll see a button that says:
   - **"Reveal token once"** OR
   - **"Reveal"** OR
   - **"Show token"**
4. Click that button
5. **IMMEDIATELY COPY THE TOKEN** - it starts with `shpat_`
6. The token looks like: `shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Step 9: Add to .env.local
1. Open `.env.local` file
2. Find the line: `# SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token_here`
3. Remove the `#` and replace with your token:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_paste_your_actual_token_here
   ```
4. Save the file

### Step 10: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Alternative: If You Can't Create Legacy App (2026)

If the "Create an app" button is gone, you need to use **Shopify Dev Dashboard**:

1. Go to: **https://partners.shopify.com**
2. Log in with your Shopify Partners account
3. Create a new app in the Dev Dashboard
4. Use OAuth authentication instead

**OR** use an existing app's token if you have one.

## Visual Navigation Path

```
Shopify Admin
  └─ ⚙️ Settings (bottom left)
      └─ Apps and sales channels
          └─ Develop apps (button, top right)
              └─ [Your App Name]
                  └─ API credentials (tab)
                      └─ Admin API access token
                          └─ Reveal token once
                              └─ COPY TOKEN
```

## Direct URLs to Try

1. **Apps Settings:**
   ```
   https://27ut15-e9.myshopify.com/admin/settings/apps
   ```

2. **Develop Apps:**
   ```
   https://27ut15-e9.myshopify.com/admin/settings/apps/develop
   ```

## What You're Looking For

The token section will show:
- **Label:** "Admin API access token"
- **Button:** "Reveal token once" or "Reveal"
- **Token format:** `shpat_` followed by ~40 characters

## Troubleshooting

### "I don't see 'Develop apps'"
- Make sure you're logged in as admin
- Try the direct URL: https://27ut15-e9.myshopify.com/admin/settings/apps/develop
- Look for "Custom apps" instead

### "I can't create a new app"
- This is expected in 2026 - legacy custom apps are deprecated
- Use an existing app if you have one
- Or use Shopify Partners Dev Dashboard

### "I see the app but no token"
- Make sure the app is **installed** (not just created)
- Click "Install app" first
- Then go to API credentials tab

### "The interface looks different"
- Shopify updates their UI frequently
- Use the search bar: type "API" or "token"
- Look for "API credentials" or "Access tokens"

---

**Still stuck?** Describe what you see when you go to Settings → Apps and sales channels, and I can help you find the exact location!
