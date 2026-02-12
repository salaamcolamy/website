import { NextRequest, NextResponse } from 'next/server'
import { subscribeEmailToMarketing } from '@/lib/shopify/queries/customer'
import { isAdminApiConfigured } from '@/lib/shopify/admin-client'

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
    // Parse request body first
    const body = await request.json()
    const { email } = body

    // Check if Admin API is configured
    if (!isAdminApiConfigured()) {
      // In development/demo mode, still accept the subscription but log it
      // This allows testing the UI without Shopify configured
      console.log('📧 Email subscription (demo mode):', email)
      
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you! Your email has been recorded.',
          demo: true,
          note: 'Shopify Admin API not configured - email logged to console',
        },
        { status: 200 }
      )
    }

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
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Handle specific Shopify errors
    if (error instanceof Error) {
      const errorMessage = error.message || 'Failed to subscribe email'
      
      // Check for common Shopify API errors
      if (errorMessage.includes('already exists') || errorMessage.includes('duplicate') || errorMessage.includes('Email has already been taken')) {
        return NextResponse.json(
          {
            success: false,
            error: 'This email is already subscribed to our newsletter.',
          },
          { status: 400 }
        )
      }

      // Check for authentication/authorization errors
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid API key') || errorMessage.includes('Access denied')) {
        console.error('Shopify Admin API authentication error - check SHOPIFY_ADMIN_ACCESS_TOKEN')
        return NextResponse.json(
          {
            success: false,
            error: 'Service configuration error. Please contact support.',
          },
          { status: 500 }
        )
      }

      // Check for network/connection errors
      if (errorMessage.includes('fetch failed') || errorMessage.includes('network') || errorMessage.includes('ENOTFOUND')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Connection error. Please try again later.',
          },
          { status: 503 }
        )
      }

      // Check for Shopify API errors
      if (errorMessage.includes('Shopify Admin API') || errorMessage.includes('not configured')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Service temporarily unavailable. Please try again later.',
          },
          { status: 503 }
        )
      }

      // Return the error message for other cases
      return NextResponse.json(
        {
          success: false,
          error: errorMessage.includes('Failed to') ? errorMessage : `Unable to subscribe: ${errorMessage}`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
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
