# 🔑 How to Get Shopify Admin API Token in 2026

**⚠️ IMPORTANT UPDATE (2026):** Starting January 1, 2026, you can no longer create NEW legacy custom apps in the Shopify admin. However, **existing apps still work**. If you already have an app, you can still get its token. If not, you may need to use the Dev Dashboard method.

## Quick Path (If You Have an Existing App)

If you already created an app before 2026:
1. Go to: **Settings → Apps and sales channels → Develop apps**
2. Click on your app
3. Click **"API credentials"** tab
4. Click **"Reveal token once"**
5. Copy the token (starts with `shpat_`)

## Method 1: Through Apps Settings (For Existing Apps)

## Method 1: Through Apps Settings (Most Common)

### Step 1: Access Settings
1. Go to: **https://27ut15-e9.myshopify.com/admin**
2. Log in to your Shopify admin
3. Look for **"Settings"** in the bottom left corner (⚙️ icon)
4. Click **"Settings"**

### Step 2: Navigate to Apps
1. In Settings, look for **"Apps and sales channels"**
2. Click on it
3. You should see a list of apps or an option to develop apps

### Step 3: Develop Apps
1. Look for **"Develop apps"** button (usually top right)
2. If you don't see it, look for **"Custom apps"** or **"Private apps"**
3. Click **"Develop apps"** or **"Create an app"**

### Step 4: Create/Select App
1. If creating new: Click **"Create an app"**
   - Name: `Email Marketing Integration`
   - Click **"Create app"**
2. If app exists: Click on your app name

### Step 5: Configure API Scopes
1. Click **"Configure Admin API scopes"** tab
2. Scroll to find **"Customer"** section
3. Check:
   - ✅ `read_customers`
   - ✅ `write_customers`
4. Click **"Save"**

### Step 6: Install App
1. Click **"Install app"** button (top right)
2. Review permissions
3. Click **"Install"**

### Step 7: Get Token
1. Click **"API credentials"** tab
2. Look for **"Admin API access token"** section
3. Click **"Reveal token once"** or **"Reveal"**
4. **COPY THE TOKEN** (starts with `shpat_`)

## Method 2: Direct URL (If Available)

Try these direct URLs:

1. **Apps Settings:**
   ```
   https://27ut15-e9.myshopify.com/admin/settings/apps
   ```

2. **Develop Apps:**
   ```
   https://27ut15-e9.myshopify.com/admin/settings/apps/develop
   ```

3. **Custom Apps (Alternative):**
   ```
   https://27ut15-e9.myshopify.com/admin/apps/custom
   ```

## Method 3: Search in Admin

1. In Shopify Admin, use the **search bar** (top)
2. Type: `apps` or `develop apps` or `API`
3. Look for relevant results

## Method 4: New Shopify Admin (2026 Interface)

If Shopify has updated their interface:

1. Look for **"Apps"** in the main navigation
2. Or look for **"Integrations"**
3. Or check **"Settings"** → **"Integrations"** or **"API"**

## What the Token Looks Like

The token will:
- Start with `shpat_`
- Be about 40-50 characters long
- Look like: `shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

## Common Locations in 2026 Interface

### Option A: Settings → Apps
```
Settings → Apps and sales channels → Develop apps
```

### Option B: Apps Menu
```
Apps → Develop apps (or Custom apps)
```

### Option C: Integrations
```
Settings → Integrations → API → Custom apps
```

## Troubleshooting

### "I can't find Develop apps"
- Look for **"Custom apps"** instead
- Check **"Private apps"** section
- Try searching for "API" in settings

### "I see 'API access' instead"
- That's the right place!
- Look for **"Admin API access token"**
- Click to reveal

### "The interface looks different"
- Shopify updates their UI frequently
- Try the search bar: type "API" or "token"
- Look for any section about "API credentials" or "Access tokens"

### "I need to create a new app"
1. Go to Apps → Develop apps
2. Click "Create an app"
3. Name it: `Email Marketing Integration`
4. Configure scopes: `read_customers`, `write_customers`
5. Install app
6. Get token from API credentials tab

## Alternative: Use Shopify CLI (If Available)

If you have Shopify CLI installed:

```bash
shopify app generate token
```

## Still Can't Find It?

1. **Contact Shopify Support:**
   - They can guide you to the exact location
   - Support knows the latest interface changes

2. **Check Shopify Documentation:**
   - https://shopify.dev/docs/api/admin-graphql
   - Search for "Admin API access token"

3. **Try Different Browser:**
   - Sometimes cache issues hide new UI elements
   - Try incognito/private mode

## Quick Checklist

- [ ] Logged into Shopify Admin
- [ ] Found Settings menu
- [ ] Found Apps section
- [ ] Created or selected app
- [ ] Configured API scopes (read_customers, write_customers)
- [ ] Installed the app
- [ ] Found API credentials tab
- [ ] Revealed Admin API access token
- [ ] Copied token (starts with shpat_)
- [ ] Added to .env.local file

---

**Need Help?** Describe what you see in your Shopify admin and I can provide more specific guidance!
