import { NextRequest, NextResponse } from 'next/server'
import {
  CAREER_POSITION_LABELS,
  isEmailConfigured,
  sanitizeField,
  sendFormEmail,
  validateEmail,
} from '@/lib/email'
import { createErrorResponse, createValidationError } from '@/lib/error-handler'
import { withSecurity } from '@/lib/security'

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const name = sanitizeField(body.name, 120)
    const email = sanitizeField(body.email, 254)
    const phone = sanitizeField(body.phone, 40)
    const position = sanitizeField(body.position, 40)
    const message = sanitizeField(body.message, 5000)

    if (!name) return createValidationError('Full name is required')
    const emailError = validateEmail(email)
    if (emailError) return createValidationError(emailError)
    if (!phone) return createValidationError('Phone number is required')
    if (!position || !CAREER_POSITION_LABELS[position]) {
      return createValidationError('Please select a valid position')
    }

    if (!isEmailConfigured()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Career form - demo mode]', { name, email, phone, position, message })
        return NextResponse.json({
          success: true,
          message: 'Application recorded (email not configured in development).',
          demo: true,
        })
      }
      return NextResponse.json(
        { success: false, error: 'Email service is temporarily unavailable. Please email hello@salaamcolamy.com directly.' },
        { status: 503 }
      )
    }

    const positionLabel = CAREER_POSITION_LABELS[position]

    await sendFormEmail({
      subject: `Career Application: ${positionLabel} — ${name}`,
      replyTo: email,
      fields: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'Position', value: positionLabel },
        { label: 'Message', value: message },
      ],
    })

    return NextResponse.json({
      success: true,
      message: 'Application sent successfully.',
    })
  } catch (error) {
    return createErrorResponse(error, { endpoint: '/api/career', method: 'POST' })
  }
}

export const POST = withSecurity(handler, { maxRequests: 5, endpoint: 'career' })
