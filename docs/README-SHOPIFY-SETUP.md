# Shopify Admin API Setup - Complete Guide

This guide will help you set up the Shopify Admin API for email marketing subscriptions.

## 🚀 Quick Start

**Fastest way to get started:**

```bash
# 1. Run the setup helper
npm run setup-shopify-admin

# 2. Follow the instructions shown
# 3. Get your Admin API token from Shopify
# 4. Add it to .env.local
# 5. Verify setup
npm run verify-shopify

# 6. Test the connection
# Visit: http://localhost:3000/en/admin/test-shopify
```

## 📚 Documentation Files

Choose the guide that fits your needs:

| File | Purpose | Best For |
|------|---------|----------|
| `QUICK-SETUP-GUIDE.md` | 5-minute quick start | Fast setup |
| `SHOPIFY-ADMIN-API-STEP-BY-STEP.md` | Detailed step-by-step | First-time setup |
| `SHOPIFY-SETUP-CHECKLIST.md` | Checklist format | Ensuring nothing is missed |
| `SHOPIFY-EMAIL-MARKETING-SETUP.md` | Complete documentation | Reference & troubleshooting |

## 🛠️ Helper Commands

```bash
# Check your current setup
npm run verify-shopify

# Get setup instructions
npm run setup-shopify-admin

# Test connection (after setup)
# Visit: http://localhost:3000/en/admin/test-shopify
```

## ⚡ What You Need

1. **Shopify Admin Access**
   - Store: `27ut15-e9.myshopify.com`
   - Admin credentials

2. **Required Scopes**
   - `read_customers`
   - `write_customers`

3. **Environment Variable**
   - `SHOPIFY_ADMIN_ACCESS_TOKEN` in `.env.local`

## 📋 Setup Steps Summary

1. **Create App** in Shopify Admin
2. **Configure Scopes** (read/write customers)
3. **Install App**
4. **Get Token** (starts with `shpat_`)
5. **Add to .env.local**
6. **Restart Dev Server**
7. **Test Connection**

## ✅ Verification

After setup, verify everything works:

1. **Check Environment Variables:**
   ```bash
   npm run verify-shopify
   ```

2. **Test API Connection:**
   Visit: `http://localhost:3000/en/admin/test-shopify`

3. **Test Email Subscription:**
   - Visit homepage
   - Submit email in Ramadan popup
   - Check Shopify Admin → Customers

## 🐛 Common Issues

### "Token not found"
- Make sure token is in `.env.local`
- Check for typos
- Restart dev server

### "Connection failed"
- Verify token is correct
- Check app has correct scopes
- Ensure app is installed

### "Customer not created"
- Check browser console for errors
- Verify token permissions
- Test connection endpoint

## 🎯 What Happens When Configured

✅ Email subscriptions create customers in Shopify  
✅ Customers appear in Shopify Admin  
✅ Marketing consent is recorded  
✅ Ready for Shopify Email campaigns  
✅ Works with third-party email tools (Klaviyo, etc.)

## 📞 Need Help?

1. Run: `npm run setup-shopify-admin`
2. Check: `docs/SHOPIFY-SETUP-CHECKLIST.md`
3. Visit: `/en/admin/test-shopify` for connection test
4. Review: Browser console for detailed errors

---

**Ready to start?** Run `npm run setup-shopify-admin` now!
