import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const DEFAULT_TO = 'hello@salaamcolamy.com'

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL)
}

export function getContactEmailTo(): string {
  return process.env.CONTACT_EMAIL_TO?.trim() || DEFAULT_TO
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string' || !email.trim()) return 'Email is required'
  const normalized = email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(normalized)) return 'Invalid email format'
  return null
}

export function sanitizeField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatField(label: string, value: string): string {
  if (!value) return ''
  return `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#111827;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`
}

export interface SendFormEmailInput {
  subject: string
  replyTo: string
  fields: Array<{ label: string; value: string }>
}

export async function sendFormEmail(input: SendFormEmailInput): Promise<void> {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    throw new Error('Email service is not configured')
  }

  const rows = input.fields
    .filter((f) => f.value)
    .map((f) => formatField(f.label, f.value))
    .join('')

  const textBody = input.fields
    .filter((f) => f.value)
    .map((f) => `${f.label}: ${f.value}`)
    .join('\n')

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#c21316;margin-bottom:16px;">${escapeHtml(input.subject)}</h2>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;">
        ${rows}
      </table>
      <p style="color:#6b7280;font-size:12px;margin-top:24px;">Sent from salaamcolamy.com</p>
    </div>
  `

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [getContactEmailTo()],
    replyTo: input.replyTo,
    subject: input.subject,
    text: textBody,
    html,
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}

export const CAREER_POSITION_LABELS: Record<string, string> = {
  sales: 'Sales',
  marketing: 'Marketing',
  operations: 'Operations',
  logistics: 'Logistics',
  other: 'Other',
}
