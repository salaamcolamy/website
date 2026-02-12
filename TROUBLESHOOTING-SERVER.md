# Troubleshooting Server & Deployment Issues

## Common Issues & Fixes

### Issue 1: Server Won't Start

**Symptoms:**
- `npm run dev` fails or hangs
- Port 3000 already in use
- Build errors

**Solutions:**

1. **Kill existing process:**
   ```bash
   # Find and kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   # Or on Windows:
   # netstat -ano | findstr :3000
   # taskkill /PID <PID> /F
   ```

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check for syntax errors:**
   ```bash
   npm run lint
   ```

### Issue 2: Google Fonts Build Error

**Error:** `getaddrinfo ENOTFOUND fonts.googleapis.com`

**Cause:** Network restrictions preventing font loading during build

**Fix Applied:**
- Added `display: 'swap'` and `fallback` fonts
- Fonts will use fallbacks if Google Fonts unavailable
- Dev server should still work

**If still failing:**
- Check internet connection
- Try building with: `SKIP_ENV_VALIDATION=true npm run build`

### Issue 3: Environment Variables Not Loading

**Symptoms:**
- API calls fail
- "Not configured" errors

**Solutions:**

1. **Verify .env.local exists:**
   ```bash
   cat .env.local
   ```

2. **Check variables are set:**
   ```bash
   npm run verify-shopify
   ```

3. **Restart server after changing .env.local:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Issue 4: Deployment Errors

**Common causes:**

1. **Missing environment variables in production**
   - Add to Vercel/Netlify environment variables
   - Don't commit .env.local to git

2. **Build-time errors**
   - Check build logs
   - Verify all dependencies installed
   - Check for TypeScript errors

3. **API route errors**
   - Check server logs
   - Verify API endpoints are accessible
   - Check CORS settings if needed

### Issue 5: Port Already in Use

**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## Quick Fixes

### Reset Everything
```bash
# Stop server
pkill -f "next dev"

# Clear cache
rm -rf .next node_modules/.cache

# Reinstall (if needed)
npm install

# Restart
npm run dev
```

### Check Server Status
```bash
# See if server is running
lsof -i :3000

# Check for errors
npm run lint
npm run build 2>&1 | head -50
```

## Deployment Checklist

- [ ] All environment variables set in hosting platform
- [ ] `.env.local` NOT committed to git
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors
- [ ] No linting errors (or ignored in config)
- [ ] API routes work locally
- [ ] Test production build: `npm run build && npm start`

## Getting Help

1. **Check logs:**
   - Browser console (F12)
   - Server terminal output
   - Build logs

2. **Verify setup:**
   ```bash
   npm run verify-shopify
   ```

3. **Test endpoints:**
   - `/api/test-shopify-admin`
   - `/en/admin/test-shopify`

4. **Common fixes:**
   - Restart server
   - Clear .next cache
   - Check .env.local
   - Verify port availability
