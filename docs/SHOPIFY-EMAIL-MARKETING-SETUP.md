# Shopify Email Marketing Integration Setup

This guide explains how to connect the email subscription form (Ramadan popup) with Shopify's internal email marketing system.

## Overview

The email subscription feature uses Shopify's **Admin API** to:
- Create customers with email marketing consent
- Update existing customers' marketing consent
- Manage subscriptions through Shopify's customer database

## Prerequisites

1. **Shopify Store** with Admin API access
2. **Admin API Access Token** (different from Storefront API token)

## Setup Steps

### 1. Create a Custom App in Shopify Admin

1. Go to your Shopify Admin: `https://[your-store].myshopify.com/admin`
2. Navigate to **Settings** → **Apps and sales channels**
3. Click **Develop apps** → **Create an app**
4. Name it something like "Email Marketing Integration"
5. Click **Create app**

### 2. Configure API Scopes

1. In your app settings, go to **Configuration** → **API scopes**
2. Add the following scopes:
   - `write_customers` - Required to create/update customers
   - `read_customers` - Required to check if customer exists
3. Click **Save**

### 3. Install the App

1. Click **Install app** in the top right
2. Review and confirm the permissions
3. After installation, you'll see the **API credentials**

### 4. Get Admin API Access Token

1. In your app settings, go to **API credentials**
2. Under **Admin API access token**, click **Reveal token once**
3. Copy the token (you won't be able to see it again!)

### 5. Add Environment Variables

Add the Admin API token to your `.env.local` file:

```env
# Existing Storefront API (keep this)
SHOPIFY_STORE_DOMAIN=27ut15-e9.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token

# New Admin API (add this)
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_token
```

**Important:** Never commit `.env.local` to git! It contains sensitive credentials.

## How It Works

### Flow

1. **User submits email** in the Ramadan popup
2. **Frontend calls** `/api/subscribe` API route
3. **API route** checks if customer exists:
   - If **new customer**: Creates customer with `acceptsMarketing: true`
   - If **existing customer**: Updates their marketing consent to subscribed
4. **Shopify stores** the customer with marketing consent
5. **Customer appears** in Shopify Admin → Customers
6. **Email marketing tools** (Shopify Email, Klaviyo, etc.) can use this data

### API Endpoint

**POST** `/api/subscribe`

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to email marketing",
  "customer": {
    "id": "gid://shopify/Customer/123456",
    "email": "customer@example.com",
    "acceptsMarketing": true
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Testing

### Test Locally

1. Start your dev server: `npm run dev`
2. Open the homepage
3. Submit an email in the Ramadan popup
4. Check the browser console for any errors
5. Check Shopify Admin → Customers to verify the customer was created

### Verify in Shopify Admin

1. Go to **Customers** in Shopify Admin
2. Search for the email you submitted
3. Check that:
   - Customer exists
   - **Accepts marketing** is checked ✓
   - **Email marketing consent** shows "Subscribed"

## Using with Shopify Email Marketing

Once customers are subscribed:

1. **Shopify Email** (built-in):
   - Go to **Marketing** → **Email campaigns**
   - Create a campaign
   - Select "Subscribed customers" as the audience
   - Your subscribed emails will be available

2. **Third-party integrations** (Klaviyo, Mailchimp, etc.):
   - These apps sync with Shopify customers
   - Subscribed customers will automatically appear
   - Check each app's documentation for sync settings

## Troubleshooting

### Error: "Shopify Admin API not configured"

**Solution:** Make sure `SHOPIFY_ADMIN_ACCESS_TOKEN` is set in `.env.local` and restart your dev server.

### Error: "Insufficient permissions"

**Solution:** Check that your app has `write_customers` and `read_customers` scopes enabled.

### Error: "Customer already exists"

**Solution:** This is handled automatically - the API will update the existing customer's consent. If you see this error, check the API logs.

### Customers not appearing in Shopify

**Possible causes:**
- API token doesn't have correct permissions
- Store domain is incorrect
- Network/firewall blocking API calls

**Check:**
- Verify token in Shopify Admin → Apps → Your App → API credentials
- Test API call with curl or Postman
- Check server logs for detailed error messages

## Security Notes

- **Never expose** Admin API token in client-side code
- **Always use** server-side API routes (`/api/subscribe`)
- **Validate** email format on both client and server
- **Rate limit** subscription requests to prevent abuse
- **Store tokens** securely in environment variables

## Files Created

- `src/lib/shopify/admin-client.ts` - Admin API client
- `src/lib/shopify/queries/customer.ts` - Customer queries/mutations
- `src/app/api/subscribe/route.ts` - Subscription API endpoint
- `src/components/layout/RamadanPopup.tsx` - Updated to call API

## Next Steps

1. Set up email campaigns in Shopify Email
2. Configure automated welcome emails
3. Set up segmentation based on customer tags
4. Integrate with advanced email marketing tools if needed

## Resources

- [Shopify Admin API Documentation](https://shopify.dev/docs/api/admin-graphql)
- [Customer Email Marketing Consent](https://shopify.dev/docs/api/admin-graphql/latest/input-objects/CustomerEmailMarketingConsentInput)
- [Shopify Email Marketing](https://help.shopify.com/en/manual/promoting-marketing/email-marketing)
