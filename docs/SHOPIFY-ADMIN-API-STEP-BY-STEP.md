# Shopify Admin API Setup - Step by Step

Follow these exact steps to set up the Shopify Admin API for email subscriptions.

## Prerequisites
- Access to your Shopify Admin panel
- Store domain: `27ut15-e9.myshopify.com`

## Step 1: Access Shopify Admin

1. Go to: **https://27ut15-e9.myshopify.com/admin**
2. Log in with your admin credentials

## Step 2: Navigate to Apps Section

1. In the left sidebar, click **"Settings"** (gear icon at the bottom)
2. Click **"Apps and sales channels"**
3. Click **"Develop apps"** button (top right)

## Step 3: Create New App

1. Click **"Create an app"** button
2. Enter app name: `Email Marketing Integration`
3. Enter app developer: Your name or company name
4. Click **"Create app"**

## Step 4: Configure API Scopes

1. Click **"Configure Admin API scopes"** tab
2. Scroll down to find **"Customer"** section
3. Check these boxes:
   - ✅ `read_customers` - Read customer data
   - ✅ `write_customers` - Create/update customers
4. Click **"Save"** button

## Step 5: Install the App

1. Click **"Install app"** button (top right)
2. Review the permissions requested
3. Click **"Install"** to confirm

## Step 6: Get Admin API Access Token

1. After installation, you'll see **"API credentials"** tab
2. Scroll to **"Admin API access token"** section
3. Click **"Reveal token once"** button
4. **IMPORTANT:** Copy the token immediately (it starts with `shpat_`)
   - You won't be able to see it again!
   - It looks like: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 7: Add Token to .env.local

1. Open your project folder
2. Open `.env.local` file (create it if it doesn't exist)
3. Add this line:
   ```env
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_actual_token_here
   ```
4. Replace `shpat_your_actual_token_here` with the token you copied
5. Save the file

## Step 8: Verify Setup

Run the verification script:
```bash
npm run verify-shopify
```

Or visit: `http://localhost:3000/en/admin/test-shopify`

## Step 9: Restart Dev Server

1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. This loads the new environment variable

## Step 10: Test Email Subscription

1. Visit: `http://localhost:3000/en`
2. Wait for Ramadan popup to appear
3. Enter an email address
4. Click "Subscribe"
5. Check Shopify Admin → Customers to verify the customer was created

## Troubleshooting

### "Token not found" error
- Make sure you copied the entire token (starts with `shpat_`)
- Check that `.env.local` is in the project root
- Verify there are no extra spaces in the token

### "Insufficient permissions" error
- Go back to your app settings
- Verify `read_customers` and `write_customers` are checked
- Re-install the app if needed

### "Connection failed" error
- Verify `SHOPIFY_STORE_DOMAIN` is correct in `.env.local`
- Check that the token is correct
- Make sure the app is installed

### Customer not appearing in Shopify
- Check browser console for errors
- Verify token has correct permissions
- Test connection at `/en/admin/test-shopify`

## Security Notes

⚠️ **Never commit `.env.local` to git!**
- It contains sensitive credentials
- Already in `.gitignore` (should be)
- Keep tokens secure and private

## What Happens When Configured

Once `SHOPIFY_ADMIN_ACCESS_TOKEN` is set:
- Email subscriptions create customers in Shopify
- Customers appear in Shopify Admin → Customers
- Marketing consent is properly recorded
- Ready for Shopify Email campaigns

## Need Help?

1. Check `docs/SHOPIFY-EMAIL-MARKETING-SETUP.md` for detailed docs
2. Run `npm run verify-shopify` to check configuration
3. Visit `/en/admin/test-shopify` to test connection
