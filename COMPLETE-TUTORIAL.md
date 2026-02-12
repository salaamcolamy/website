# 📚 Complete Tutorial: Shopify Email Marketing Integration

## 🎯 What We're Building

A way for your website to automatically add email subscribers to Shopify, so you can email them using Shopify's built-in email marketing (or any email tool).

## 🧠 Understanding the Big Picture

### The Problem
- Users subscribe on your website (Ramadan popup)
- You want to email them
- You want to use Shopify's email marketing tools

### The Solution
- Create a "bridge" (custom app) between your website and Shopify
- When users subscribe, your website adds them to Shopify
- Now you can email them using Shopify Email or any tool

### Visual Flow

```
┌─────────────────┐
│  Your Website   │
│  (Ramadan Popup)│
└────────┬─────────┘
         │ User enters email
         │ Clicks "Subscribe"
         ▼
┌─────────────────┐
│  Your Code      │
│  (API Call)     │
└────────┬─────────┘
         │ Uses custom app token
         │ Calls Shopify API
         ▼
┌─────────────────┐
│   Shopify       │
│   Admin API     │
└────────┬─────────┘
         │ Creates/updates customer
         │ Sets "Accepts Marketing" = YES
         ▼
┌─────────────────┐
│  Shopify Admin  │
│  → Customers    │
└────────┬─────────┘
         │ Customer now in Shopify
         ▼
┌─────────────────┐
│  You Can Email! │
│  - Shopify Email│
│  - Klaviyo      │
│  - Mailchimp    │
│  - Any tool     │
└─────────────────┘
```

## 📋 Step-by-Step Setup

### Part 1: Create Custom App in Shopify (5 minutes)

**What is a custom app?**
- It's NOT an email marketing tool
- It's just a "key" that lets your website talk to Shopify
- Think of it like a password that gives your website permission

**Steps:**

1. **Go to Shopify Admin**
   ```
   https://27ut15-e9.myshopify.com/admin
   ```

2. **Open Settings**
   - Click ⚙️ Settings (bottom left)
   - Click "Apps and sales channels"

3. **Create Custom App**
   - Click "Develop apps" (top right)
   - Click "Create an app"
   - Name: `Email Marketing Integration`
   - Click "Create app"

4. **Give It Permissions**
   - Click "Configure Admin API scopes"
   - Find "Customer" section
   - Check: ✅ `read_customers`
   - Check: ✅ `write_customers`
   - Click "Save"

5. **Install the App**
   - Click "Install app" (top right)
   - Click "Install" to confirm

6. **Get the Token** ⭐
   - Click "API credentials" tab
   - Find "Admin API access token"
   - Click "Reveal token once"
   - **COPY THE TOKEN** (starts with `shpat_`)
   - It looks like: `shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Part 2: Add Token to Your Website (2 minutes)

1. **Open `.env.local` file**
   - In your project folder
   - Find the line: `# SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_token_here`

2. **Add Your Token**
   - Remove the `#` at the start
   - Replace `shpat_your_token_here` with your actual token
   - Should look like:
     ```env
     SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
     ```

3. **Save the file**

### Part 3: Restart Your Server (1 minute)

```bash
# Stop your server (press Ctrl+C)
# Then start it again:
npm run dev
```

### Part 4: Test It! (2 minutes)

1. **Visit your website**
   ```
   http://localhost:3000/en
   ```

2. **Wait for Ramadan popup**

3. **Enter a test email**
   - Use your own email to test
   - Click "Subscribe"

4. **Check if it worked**
   - Go to Shopify Admin → Customers
   - Look for the email you entered
   - Check that "Accepts marketing" is ✅ checked

## 🎉 What Happens Now

### When Users Subscribe

1. User sees Ramadan popup on your website
2. User enters email and clicks "Subscribe"
3. Your website automatically:
   - Creates customer in Shopify (if new)
   - OR updates existing customer
   - Sets "Accepts Marketing" = YES
4. Customer appears in Shopify Admin → Customers

### You Can Now Email Them!

**Option 1: Shopify Email (Built-in)**
1. Go to: Marketing → Email campaigns
2. Click "Create email"
3. Select audience: "Subscribed customers"
4. Your website subscribers are in that list!
5. Create and send campaign

**Option 2: Klaviyo, Mailchimp, etc.**
- These tools automatically sync with Shopify customers
- Your subscribers will appear automatically
- No extra setup needed!

## 🔍 Understanding the Code

### What Happens Behind the Scenes

1. **User submits email** → Ramadan popup form
2. **Frontend sends request** → `/api/subscribe` endpoint
3. **Backend checks** → Is Shopify Admin API configured?
4. **If yes** → Calls Shopify API to create/update customer
5. **If no** → Works in demo mode (logs to console)

### Key Files

- `src/components/layout/RamadanPopup.tsx` - The popup form
- `src/app/api/subscribe/route.ts` - Handles subscription
- `src/lib/shopify/queries/customer.ts` - Talks to Shopify API
- `src/lib/shopify/admin-client.ts` - Shopify API connection

## ❓ Common Questions

### Q: Do I need to install an email marketing app?
**A:** No! The custom app is just for API access. You can use Shopify's built-in email marketing.

### Q: Can I use Shopify Email?
**A:** Yes! That's the whole point. Once customers are in Shopify, you can use Shopify Email.

### Q: What if I want to use Klaviyo/Mailchimp?
**A:** They automatically sync with Shopify customers, so your subscribers will appear there too!

### Q: Do I need to pay for Shopify Email?
**A:** Shopify Email is free for basic use. Check Shopify's pricing for advanced features.

### Q: What if the token doesn't work?
**A:** 
- Make sure you copied the entire token
- Check there are no extra spaces
- Verify it starts with `shpat_`
- Restart your dev server after adding it

### Q: Can I test without Shopify?
**A:** Yes! The code works in "demo mode" - it will log emails to the console instead of creating customers.

## 🐛 Troubleshooting

### "Something went wrong" error
- Check browser console (F12) for errors
- Verify token is in `.env.local`
- Make sure server was restarted

### "Email subscription service not configured"
- Token is missing or commented out in `.env.local`
- Add token and restart server

### Customer not appearing in Shopify
- Check browser console for errors
- Verify token has correct permissions
- Test connection at `/en/admin/test-shopify`

## 📊 Verification Checklist

- [ ] Custom app created in Shopify
- [ ] App has `read_customers` and `write_customers` scopes
- [ ] App is installed
- [ ] Token copied (starts with `shpat_`)
- [ ] Token added to `.env.local` (not commented out)
- [ ] Dev server restarted
- [ ] Tested subscription on website
- [ ] Customer appears in Shopify Admin → Customers
- [ ] Customer has "Accepts marketing" checked

## 🎓 Key Concepts

### Custom App
- Just a "key" for API access
- Not an email marketing tool
- Lets your website talk to Shopify

### API Token
- Like a password
- Gives your website permission
- Must be kept secret (in `.env.local`)

### Marketing Consent
- When customer subscribes, we set "Accepts Marketing" = YES
- This tells Shopify the customer wants emails
- Required for email marketing tools

### Demo Mode
- Works without Shopify configured
- Logs emails to console
- Good for testing UI

## 🚀 Next Steps

1. ✅ Complete the setup (get token, add to `.env.local`)
2. ✅ Test subscription on your website
3. ✅ Verify customer appears in Shopify
4. ✅ Create your first email campaign in Shopify Email
5. ✅ Send to your subscribers!

---

**Remember:** The custom app is just a bridge. Once customers are in Shopify, you can use ANY email tool you want, including Shopify's built-in email marketing!
