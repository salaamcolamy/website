import { NextRequest, NextResponse } from 'next/server'
import { subscribeEmailToMarketing, isAdminApiConfigured } from '@/lib/shopify/queries/customer'

/**
 * API Route: POST /api/subscribe
 * 
 * Subscribes an email address to Shopify email marketing.
 * Creates a customer if they don't exist, or updates their consent if they do.
 * 
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email subscription service not configured',
        },
        { status: 503 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      )
    }

    // Subscribe to marketing
    const customer = await subscribeEmailToMarketing(email.toLowerCase().trim())

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to email marketing',
        customer: {
          id: customer.id,
          email: customer.email,
          acceptsMarketing: customer.acceptsMarketing,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Subscribe API error:', error)

    // Handle specific Shopify errors
    if (error instanceof Error) {
      // Check if it's a duplicate email error - this is already handled by subscribeEmailToMarketing
      // but we'll provide a user-friendly error message
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        return NextResponse.json(
          {
            success: false,
            error: 'This email is already subscribed',
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to subscribe email',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST.',
    },
    { status: 405 }
  )
}
