/**
 * Environment Variable Validator
 */

interface EnvValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

function isPlaceholderValue(value: string | undefined): boolean {
  if (!value) return true
  const placeholders = ['your-', 'your_', 'xxxx', 'example', 'placeholder', 'change-me', 'replace-me']
  const lowerValue = value.toLowerCase()
  return placeholders.some(placeholder => lowerValue.includes(placeholder))
}

function validateShopifyCredentials(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

  if (!domain || isPlaceholderValue(domain)) {
    errors.push('SHOPIFY_STORE_DOMAIN is not configured or uses placeholder value')
  }
  if (!storefrontToken || isPlaceholderValue(storefrontToken)) {
    errors.push('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured or uses placeholder value')
  }
  if (!adminToken || isPlaceholderValue(adminToken)) {
    warnings.push('SHOPIFY_ADMIN_ACCESS_TOKEN is not configured. Order creation will be disabled.')
  }
  if (domain && !domain.includes('myshopify.com')) {
    errors.push('SHOPIFY_STORE_DOMAIN must be a valid myshopify.com domain')
  }
  if (adminToken && !isPlaceholderValue(adminToken) && !adminToken.startsWith('shpat_')) {
    errors.push('SHOPIFY_ADMIN_ACCESS_TOKEN must start with "shpat_"')
  }

  return { isValid: errors.length === 0, errors, warnings }
}

function validateBillplzCredentials(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const apiKey = process.env.BILLPLZ_API_KEY
  const collectionId = process.env.BILLPLZ_COLLECTION_ID
  const xSignatureKey = process.env.BILLPLZ_XSIGNATURE_KEY
  const isSandbox = process.env.BILLPLZ_SANDBOX === 'true'

  if (!apiKey || isPlaceholderValue(apiKey)) {
    errors.push('BILLPLZ_API_KEY is not configured or uses placeholder value')
  }
  if (!collectionId || isPlaceholderValue(collectionId)) {
    errors.push('BILLPLZ_COLLECTION_ID is not configured or uses placeholder value')
  }
  if (!xSignatureKey || isPlaceholderValue(xSignatureKey)) {
    warnings.push('BILLPLZ_XSIGNATURE_KEY is not configured. Webhook signature verification will be skipped (SECURITY RISK)')
  }
  if (process.env.NODE_ENV === 'production') {
    if (isSandbox) {
      warnings.push('BILLPLZ_SANDBOX is set to "true" in PRODUCTION. You are using TEST credentials!')
    }
    if (!xSignatureKey || isPlaceholderValue(xSignatureKey)) {
      errors.push('BILLPLZ_XSIGNATURE_KEY is REQUIRED in production for webhook security')
    }
  }

  return { isValid: errors.length === 0, errors, warnings }
}

function validateCORSConfiguration(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const allowedOrigins = process.env.ALLOWED_ORIGINS

  if (process.env.NODE_ENV === 'production') {
    if (!allowedOrigins || allowedOrigins.trim() === '') {
      errors.push('ALLOWED_ORIGINS must be configured in production to prevent CSRF attacks')
    } else if (allowedOrigins.includes('localhost') || allowedOrigins.includes('127.0.0.1')) {
      warnings.push('ALLOWED_ORIGINS contains localhost in production. This should be removed.')
    }
  }

  return { isValid: errors.length === 0, errors, warnings }
}

function validateSiteURL(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (process.env.NODE_ENV === 'production') {
    if (!siteUrl) {
      errors.push('NEXT_PUBLIC_SITE_URL must be set in production for proper callback URLs')
    } else if (siteUrl.includes('localhost')) {
      errors.push('NEXT_PUBLIC_SITE_URL contains localhost in production')
    } else if (!siteUrl.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_SITE_URL must use HTTPS in production')
    }
  }

  return { isValid: errors.length === 0, errors, warnings }
}

export function validateEnvironment(): EnvValidationResult {
  const allErrors: string[] = []
  const allWarnings: string[] = []

  const results = [
    validateShopifyCredentials(),
    validateBillplzCredentials(),
    validateCORSConfiguration(),
    validateSiteURL(),
  ]

  for (const result of results) {
    allErrors.push(...result.errors)
    allWarnings.push(...result.warnings)
  }

  return { isValid: allErrors.length === 0, errors: allErrors, warnings: allWarnings }
}

export function logValidationResults(result: EnvValidationResult): void {
  if (result.errors.length > 0) {
    console.error('\nENVIRONMENT CONFIGURATION ERRORS:')
    result.errors.forEach(error => console.error(`  - ${error}`))
  }
  if (result.warnings.length > 0) {
    console.warn('\nENVIRONMENT CONFIGURATION WARNINGS:')
    result.warnings.forEach(warning => console.warn(`  - ${warning}`))
  }
  if (result.isValid && result.warnings.length === 0) {
    console.log('\nEnvironment configuration validated successfully')
  }
  if (process.env.NODE_ENV === 'production' && !result.isValid) {
    console.error('\nCRITICAL: Cannot start application with invalid environment configuration')
    throw new Error('Invalid environment configuration')
  }
}

if (typeof window === 'undefined') {
  const result = validateEnvironment()
  if (process.env.NODE_ENV === 'development' || process.env.VALIDATE_ENV === 'true') {
    logValidationResults(result)
  }
}
