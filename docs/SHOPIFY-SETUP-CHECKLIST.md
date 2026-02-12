# Shopify Admin API Setup Checklist

Use this checklist to ensure everything is set up correctly.

## ✅ Pre-Setup Checklist

- [ ] Have access to Shopify Admin panel
- [ ] Know your store domain: `27ut15-e9.myshopify.com`
- [ ] Have `.env.local` file in project root

## ✅ Step-by-Step Checklist

### Step 1: Access Shopify Admin
- [ ] Go to https://27ut15-e9.myshopify.com/admin
- [ ] Logged in successfully

### Step 2: Navigate to Apps
- [ ] Click "Settings" (bottom left)
- [ ] Click "Apps and sales channels"
- [ ] Click "Develop apps" button

### Step 3: Create App
- [ ] Click "Create an app"
- [ ] Enter name: `Email Marketing Integration`
- [ ] Enter developer name
- [ ] Click "Create app"

### Step 4: Configure Scopes
- [ ] Click "Configure Admin API scopes" tab
- [ ] Find "Customer" section
- [ ] Check `read_customers`
- [ ] Check `write_customers`
- [ ] Click "Save"

### Step 5: Install App
- [ ] Click "Install app" button
- [ ] Review permissions
- [ ] Click "Install" to confirm
- [ ] App installed successfully

### Step 6: Get Token
- [ ] Click "API credentials" tab
- [ ] Find "Admin API access token" section
- [ ] Click "Reveal token once"
- [ ] **Copied token** (starts with `shpat_`)
- [ ] Token saved securely

### Step 7: Add to .env.local
- [ ] Opened `.env.local` file
- [ ] Added line: `SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token`
- [ ] Replaced `shpat_your_token` with actual token
- [ ] Saved file
- [ ] Verified no extra spaces

### Step 8: Verify Setup
- [ ] Ran: `npm run verify-shopify`
- [ ] Or visited: `http://localhost:3000/en/admin/test-shopify`
- [ ] See "✅ All required environment variables are set!"

### Step 9: Restart Server
- [ ] Stopped dev server (Ctrl+C)
- [ ] Started dev server: `npm run dev`
- [ ] Server running without errors

### Step 10: Test Connection
- [ ] Visited: `http://localhost:3000/en/admin/test-shopify`
- [ ] See "✅ Success! Shopify Admin API is configured and working!"
- [ ] Shop name and email displayed correctly

### Step 11: Test Email Subscription
- [ ] Visited homepage: `http://localhost:3000/en`
- [ ] Ramadan popup appeared
- [ ] Entered test email
- [ ] Clicked "Subscribe"
- [ ] Saw success message
- [ ] Checked Shopify Admin → Customers
- [ ] Customer created with email marketing consent

## 🎉 Completion

Once all items are checked:
- ✅ Email subscriptions create customers in Shopify
- ✅ Customers appear in Shopify Admin
- ✅ Marketing consent is recorded
- ✅ Ready for Shopify Email campaigns

## 🐛 Troubleshooting

If something doesn't work:

1. **Run verification:**
   ```bash
   npm run verify-shopify
   ```

2. **Test connection:**
   Visit: `http://localhost:3000/en/admin/test-shopify`

3. **Check common issues:**
   - Token copied correctly? (starts with `shpat_`)
   - No extra spaces in `.env.local`?
   - Server restarted after adding token?
   - App has correct scopes?
   - App is installed?

4. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab

5. **Check server logs:**
   - Look at terminal where `npm run dev` is running
   - Check for error messages

## 📚 Resources

- **Quick Guide:** `docs/QUICK-SETUP-GUIDE.md`
- **Detailed Guide:** `docs/SHOPIFY-ADMIN-API-STEP-BY-STEP.md`
- **Full Documentation:** `docs/SHOPIFY-EMAIL-MARKETING-SETUP.md`
