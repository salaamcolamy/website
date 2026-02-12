#!/usr/bin/env node

/**
 * Pre-deployment check script for Vercel
 * Run with: node scripts/check-vercel-build.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Vercel Deployment Pre-Check\n')
console.log('='.repeat(60))

let hasErrors = false
let hasWarnings = false

// Check 1: Required files exist
console.log('\n📁 Checking required files...')
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  'middleware.ts',
  'src/app/[locale]/layout.tsx',
  'src/app/[locale]/page.tsx',
]

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} - MISSING`)
    hasErrors = true
  }
})

// Check 2: Package.json has build script
console.log('\n📦 Checking package.json...')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  if (packageJson.scripts?.build) {
    console.log(`  ✅ Build script: ${packageJson.scripts.build}`)
  } else {
    console.log('  ❌ Missing build script')
    hasErrors = true
  }
  
  if (packageJson.dependencies?.next) {
    console.log(`  ✅ Next.js version: ${packageJson.dependencies.next}`)
  } else {
    console.log('  ❌ Next.js not found in dependencies')
    hasErrors = true
  }
} catch (error) {
  console.log(`  ❌ Error reading package.json: ${error.message}`)
  hasErrors = true
}

// Check 3: Environment variables (warn if missing)
console.log('\n🔐 Checking environment variables...')
const envFile = '.env.local'
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8')
  const requiredVars = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
  ]
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`  ✅ ${varName} found in .env.local`)
    } else {
      console.log(`  ⚠️  ${varName} not found (add in Vercel dashboard)`)
      hasWarnings = true
    }
  })
} else {
  console.log('  ⚠️  .env.local not found (add env vars in Vercel dashboard)')
  hasWarnings = true
}

// Check 4: Next.js config
console.log('\n⚙️  Checking next.config.ts...')
try {
  const configContent = fs.readFileSync('next.config.ts', 'utf8')
  
  if (configContent.includes('ignoreBuildErrors: true')) {
    console.log('  ✅ TypeScript errors will be ignored')
  }
  
  if (configContent.includes('ignoreDuringBuilds: true')) {
    console.log('  ✅ ESLint errors will be ignored')
  }
  
  if (configContent.includes('output: \'standalone\'')) {
    console.log('  ⚠️  Standalone output detected (may cause issues on Vercel)')
    hasWarnings = true
  }
} catch (error) {
  console.log(`  ❌ Error reading next.config.ts: ${error.message}`)
  hasErrors = true
}

// Check 5: Middleware
console.log('\n🛡️  Checking middleware.ts...')
try {
  const middlewareContent = fs.readFileSync('middleware.ts', 'utf8')
  
  if (middlewareContent.includes('matcher')) {
    console.log('  ✅ Middleware matcher configured')
  } else {
    console.log('  ⚠️  Middleware matcher not found')
    hasWarnings = true
  }
} catch (error) {
  console.log(`  ⚠️  Error reading middleware.ts: ${error.message}`)
  hasWarnings = true
}

// Summary
console.log('\n' + '='.repeat(60))
console.log('\n📊 Summary\n')

if (hasErrors) {
  console.log('❌ ERRORS FOUND - Fix these before deploying!')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️  WARNINGS FOUND - Review these before deploying')
  console.log('\n💡 Next steps:')
  console.log('   1. Add environment variables in Vercel dashboard')
  console.log('   2. Test build locally: npm run build')
  console.log('   3. Deploy to Vercel')
  process.exit(0)
} else {
  console.log('✅ All checks passed! Ready to deploy.')
  console.log('\n💡 Next steps:')
  console.log('   1. Add environment variables in Vercel dashboard')
  console.log('   2. Push to GitHub')
  console.log('   3. Vercel will auto-deploy')
  process.exit(0)
}
