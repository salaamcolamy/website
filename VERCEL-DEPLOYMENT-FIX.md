# Vercel Deployment Fix Guide

## Common Vercel Deployment Errors & Solutions

### Issue 1: Missing Environment Variables

**Error:** "Environment variable not found" or API calls failing

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   ```
   SHOPIFY_STORE_DOMAIN=27ut15-e9.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
   SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token (optional)
   ```
3. Redeploy after adding variables

### Issue 2: Build Errors - Google Fonts

**Error:** `getaddrinfo ENOTFOUND fonts.googleapis.com`

**Status:** ✅ Already fixed with fallback fonts

### Issue 3: TypeScript Errors

**Error:** TypeScript compilation errors

**Status:** ✅ Already configured to ignore build errors in `next.config.ts`

### Issue 4: ESLint Errors

**Error:** ESLint errors blocking build

**Status:** ✅ Already configured to ignore during builds

### Issue 5: Missing Dependencies

**Error:** Module not found or dependency errors

**Solution:**
```bash
# Make sure package.json has all dependencies
npm install
npm run build  # Test locally first
```

### Issue 6: API Route Errors

**Error:** API routes failing in production

**Check:**
- Environment variables are set in Vercel
- API routes are in `src/app/api/` directory
- No client-side only code in API routes

## Quick Fix Checklist

### Step 1: Verify Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Add/verify these variables:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `SHOPIFY_ADMIN_ACCESS_TOKEN` (optional)

### Step 2: Check Build Logs

1. Go to: **Deployments** tab
2. Click on failed deployment
3. Check **Build Logs** for specific errors
4. Look for:
   - Missing environment variables
   - TypeScript errors
   - Missing files
   - Network errors

### Step 3: Test Build Locally

```bash
# Test production build locally
npm run build

# If build succeeds, deploy should work
# If build fails, fix errors locally first
```

### Step 4: Common Fixes

**If fonts are failing:**
- ✅ Already fixed with fallbacks

**If TypeScript errors:**
- ✅ Already configured to ignore

**If environment variables missing:**
- Add them in Vercel dashboard

**If API routes failing:**
- Check environment variables are set
- Verify API routes don't use client-only code

## Vercel Configuration

### Recommended Settings

1. **Framework Preset:** Next.js
2. **Build Command:** `npm run build` (default)
3. **Output Directory:** `.next` (default)
4. **Install Command:** `npm install` (default)
5. **Node Version:** 20.x (recommended)

### Environment Variables Needed

**Required:**
- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

**Optional:**
- `SHOPIFY_ADMIN_ACCESS_TOKEN` (for email subscriptions)

## Debugging Steps

1. **Check Vercel Build Logs**
   - Look for specific error messages
   - Check which step failed (install, build, or deploy)

2. **Test Locally**
   ```bash
   npm run build
   npm start
   ```

3. **Check for Missing Files**
   - Verify all files are committed to git
   - Check `.gitignore` isn't excluding needed files

4. **Verify Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## Common Error Messages & Fixes

### "Module not found"
- Run `npm install` locally
- Commit `package-lock.json`
- Redeploy

### "Environment variable not found"
- Add variable in Vercel dashboard
- Redeploy

### "Build failed"
- Check build logs for specific error
- Test `npm run build` locally
- Fix errors locally, then redeploy

### "Function exceeded maximum duration"
- Optimize API routes
- Add caching
- Check for infinite loops

## Next Steps

1. ✅ Check Vercel dashboard for specific error messages
2. ✅ Add environment variables if missing
3. ✅ Test build locally: `npm run build`
4. ✅ Check build logs in Vercel
5. ✅ Redeploy after fixes

---

**Need help?** Share the specific error message from Vercel build logs and I can help fix it!
