import { NextResponse } from 'next/server'
import { isAdminApiConfigured } from '@/lib/shopify/admin-client'
import { shopifyAdminFetch } from '@/lib/shopify/admin-client'

/**
 * Test endpoint to verify Shopify Admin API configuration
 * GET /api/test-shopify-admin
 */
export async function GET() {
  try {
    // Check if configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        {
          configured: false,
          error: 'Shopify Admin API not configured',
          message: 'Please add SHOPIFY_ADMIN_ACCESS_TOKEN to your .env.local file',
          steps: [
            '1. Go to Shopify Admin → Settings → Apps → Develop apps',
            '2. Create a new app or use existing app',
            '3. Configure API scopes: write_customers, read_customers',
            '4. Install the app',
            '5. Copy the Admin API access token',
            '6. Add SHOPIFY_ADMIN_ACCESS_TOKEN=your_token to .env.local',
            '7. Restart your dev server',
          ],
        },
        { status: 200 }
      )
    }

    // Test API connection with a simple query
    const testQuery = `
      query {
        shop {
          name
          email
        }
      }
    `

    const data = await shopifyAdminFetch<{
      shop: {
        name: string
        email: string
      }
    }>({
      query: testQuery,
    })

    return NextResponse.json(
      {
        configured: true,
        connected: true,
        shop: {
          name: data.shop.name,
          email: data.shop.email,
        },
        message: 'Shopify Admin API is configured and working!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Shopify Admin API test error:', error)

    return NextResponse.json(
      {
        configured: true,
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Shopify Admin API is configured but connection failed',
        troubleshooting: [
          '1. Verify SHOPIFY_STORE_DOMAIN is correct (e.g., 27ut15-e9.myshopify.com)',
          '2. Verify SHOPIFY_ADMIN_ACCESS_TOKEN is correct',
          '3. Check that your app has the required scopes (write_customers, read_customers)',
          '4. Make sure the app is installed',
          '5. Check server logs for detailed error messages',
        ],
      },
      { status: 200 }
    )
  }
}
