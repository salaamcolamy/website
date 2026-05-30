import { NextRequest, NextResponse } from 'next/server'
import { isEmailConfigured, sanitizeField, sendFormEmail, validateEmail } from '@/lib/email'
import { createErrorResponse, createValidationError } from '@/lib/error-handler'
import { withSecurity } from '@/lib/security'

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const name = sanitizeField(body.name, 120)
    const email = sanitizeField(body.email, 254)
    const subject = sanitizeField(body.subject, 200)
    const message = sanitizeField(body.message, 5000)

    if (!name) return createValidationError('Name is required')
    const emailError = validateEmail(email)
    if (emailError) return createValidationError(emailError)
    if (!subject) return createValidationError('Subject is required')
    if (!message) return createValidationError('Message is required')

    if (!isEmailConfigured()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Contact form - demo mode]', { name, email, subject, message })
        return NextResponse.json({
          success: true,
          message: 'Message recorded (email not configured in development).',
          demo: true,
        })
      }
      return NextResponse.json(
        { success: false, error: 'Email service is temporarily unavailable. Please email hello@salaamcolamy.com directly.' },
        { status: 503 }
      )
    }

    await sendFormEmail({
      subject: `Contact: ${subject}`,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Subject', value: subject },
        { label: 'Message', value: message },
      ],
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully.',
    })
  } catch (error) {
    return createErrorResponse(error, { endpoint: '/api/contact', method: 'POST' })
  }
}

export const POST = withSecurity(handler, { maxRequests: 5, endpoint: 'contact' })
