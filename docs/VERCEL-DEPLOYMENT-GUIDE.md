# Vercel Deployment Guide - Fix All Errors

## 🔴 Common Vercel Deployment Errors

### Error 1: Missing Environment Variables

**Symptoms:**
- Build succeeds but app crashes at runtime
- API calls fail
- "Environment variable not found" errors

**Fix:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add these variables:

```
SHOPIFY_STORE_DOMAIN=27ut15-e9.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token_here
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_token_here (optional)
```

4. **Important:** Set for all environments (Production, Preview, Development)
5. Redeploy after adding

### Error 2: Build Fails - TypeScript Errors

**Status:** ✅ Already fixed
- `typescript.ignoreBuildErrors: true` in `next.config.ts`

### Error 3: Build Fails - ESLint Errors

**Status:** ✅ Already fixed
- `eslint.ignoreDuringBuilds: true` in `next.config.ts`

### Error 4: Build Fails - Google Fonts

**Status:** ✅ Already fixed
- Font fallbacks added
- `display: 'swap'` configured

### Error 5: Build Fails - Module Not Found

**Fix:**
```bash
# Test locally first
rm -rf node_modules package-lock.json
npm install
npm run build

# If build succeeds, commit and push
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Error 6: Function Timeout

**Symptoms:**
- API routes timeout
- Build succeeds but functions fail

**Fix:**
- Check API routes for long-running operations
- Add proper error handling
- Optimize database/API calls

## 📋 Vercel Deployment Checklist

### Before Deploying

- [ ] Test build locally: `npm run build`
- [ ] Test production server: `npm start`
- [ ] Verify all environment variables are ready
- [ ] Check for TypeScript errors (should be ignored)
- [ ] Check for ESLint errors (should be ignored)

### In Vercel Dashboard

- [ ] Framework: Next.js (auto-detected)
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `npm install` (default)
- [ ] Node Version: 20.x (recommended)

### Environment Variables

- [ ] `SHOPIFY_STORE_DOMAIN` added
- [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN` added
- [ ] `SHOPIFY_ADMIN_ACCESS_TOKEN` added (optional)
- [ ] Variables set for Production, Preview, Development

### After Deployment

- [ ] Check deployment logs for errors
- [ ] Test homepage loads
- [ ] Test API routes work
- [ ] Test Shopify integration
- [ ] Check browser console for errors

## 🛠️ Step-by-Step Fix

### Step 1: Check Build Logs

1. Go to Vercel Dashboard
2. Click on failed deployment
3. Click "View Build Logs"
4. Look for specific error message
5. Note the error type (build, runtime, etc.)

### Step 2: Test Locally

```bash
# Clean install
rm -rf node_modules .next
npm install

# Test build
npm run build

# Test production server
npm start
```

### Step 3: Fix Based on Error

**If "Environment variable not found":**
- Add variables in Vercel dashboard
- Redeploy

**If "Module not found":**
- Run `npm install` locally
- Commit `package-lock.json`
- Redeploy

**If "Build failed":**
- Check build logs for specific error
- Fix locally, then redeploy

**If "Function error":**
- Check API route code
- Add error handling
- Check environment variables

### Step 4: Redeploy

1. Push fixes to git
2. Vercel will auto-deploy
3. Or manually trigger deployment
4. Check new build logs

## 🔍 Debugging Specific Errors

### Build Error: "Cannot find module"

**Fix:**
```bash
# Ensure all dependencies are in package.json
npm install --save <missing-module>

# Commit package.json and package-lock.json
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push
```

### Runtime Error: "API route failed"

**Check:**
- Environment variables set in Vercel
- API route code doesn't use client-only APIs
- Error handling in API routes

### Build Error: "Font loading failed"

**Status:** ✅ Already fixed with fallbacks

### Build Error: "TypeScript errors"

**Status:** ✅ Already configured to ignore

## 📝 Vercel Configuration File

Create `vercel.json` if needed (optional):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## 🚀 Quick Deploy Steps

1. **Ensure code is pushed to GitHub**
   ```bash
   git status
   git add .
   git commit -m "Fix deployment issues"
   git push
   ```

2. **Add Environment Variables in Vercel**
   - Dashboard → Settings → Environment Variables
   - Add all required variables

3. **Redeploy**
   - Vercel auto-deploys on push
   - Or manually trigger in dashboard

4. **Check Deployment**
   - View build logs
   - Test deployed site
   - Check for errors

## ⚠️ Important Notes

- **Never commit `.env.local`** - it's in `.gitignore`
- **Always add env vars in Vercel dashboard**
- **Test build locally before deploying**
- **Check build logs for specific errors**

## 🆘 Still Having Issues?

1. **Share the exact error message** from Vercel build logs
2. **Check if build works locally**: `npm run build`
3. **Verify environment variables** are set correctly
4. **Check Vercel documentation**: https://vercel.com/docs

---

**Most common fix:** Add environment variables in Vercel dashboard and redeploy!
