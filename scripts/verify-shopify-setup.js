#!/usr/bin/env node

/**
 * Verification script for Shopify Admin API setup
 * Run with: node scripts/verify-shopify-setup.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Shopify Admin API Setup...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExamplePath = path.join(process.cwd(), '.env.example')

let envExists = false
let envContent = ''

try {
  if (fs.existsSync(envPath)) {
    envExists = true
    envContent = fs.readFileSync(envPath, 'utf8')
    console.log('✅ Found .env.local file\n')
  } else {
    console.log('⚠️  .env.local file not found\n')
  }
} catch (error) {
  console.log('⚠️  Could not read .env.local file\n')
}

// Check for required variables
const requiredVars = {
  'SHOPIFY_STORE_DOMAIN': 'Your Shopify store domain (e.g., 27ut15-e9.myshopify.com)',
  'SHOPIFY_STOREFRONT_ACCESS_TOKEN': 'Storefront API access token (for products/cart)',
  'SHOPIFY_ADMIN_ACCESS_TOKEN': 'Admin API access token (for email subscriptions)',
}

const foundVars = {}
const missingVars = []

console.log('📋 Checking environment variables:\n')

for (const [varName, description] of Object.entries(requiredVars)) {
  const regex = new RegExp(`${varName}=(.+)`, 'i')
  const match = envContent.match(regex)
  
  if (match && match[1] && match[1].trim() !== '') {
    foundVars[varName] = true
    const value = match[1].trim()
    const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value
    console.log(`  ✅ ${varName}`)
    console.log(`     Value: ${displayValue}`)
  } else {
    foundVars[varName] = false
    missingVars.push(varName)
    console.log(`  ❌ ${varName} - MISSING`)
    console.log(`     ${description}`)
  }
  console.log('')
}

// Summary
console.log('\n' + '='.repeat(60))
console.log('📊 Summary\n')

if (missingVars.length === 0) {
  console.log('✅ All required environment variables are set!')
  console.log('\n💡 Next steps:')
  console.log('   1. Restart your dev server: npm run dev')
  console.log('   2. Visit /en/admin/test-shopify to test the connection')
  console.log('   3. Try subscribing an email in the Ramadan popup')
} else {
  console.log(`⚠️  Missing ${missingVars.length} environment variable(s):\n`)
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`)
  })
  
  console.log('\n📖 Setup Instructions:\n')
  
  if (!envExists) {
    console.log('   1. Create a .env.local file in the project root')
  }
  
  if (missingVars.includes('SHOPIFY_ADMIN_ACCESS_TOKEN')) {
    console.log('\n   To get SHOPIFY_ADMIN_ACCESS_TOKEN:')
    console.log('   1. Go to Shopify Admin → Settings → Apps → Develop apps')
    console.log('   2. Create a new app (or use existing)')
    console.log('   3. Configure API scopes: write_customers, read_customers')
    console.log('   4. Install the app')
    console.log('   5. Copy the Admin API access token')
    console.log('   6. Add to .env.local: SHOPIFY_ADMIN_ACCESS_TOKEN=your_token')
  }
  
  console.log('\n   See docs/SHOPIFY-EMAIL-MARKETING-SETUP.md for detailed instructions')
}

console.log('\n' + '='.repeat(60))
