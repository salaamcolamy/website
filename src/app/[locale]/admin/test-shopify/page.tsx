'use client'

import { useState, useEffect } from 'react'

// Force dynamic rendering for this admin page
export const dynamic = 'force-dynamic'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { fadeInUp } from '@/lib/animations'

interface TestResult {
  configured: boolean
  connected?: boolean
  shop?: {
    name: string
    email: string
  }
  error?: string
  message?: string
  steps?: string[]
  troubleshooting?: string[]
}

export default function TestShopifyAdminPage() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-shopify-admin')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        configured: false,
        error: error instanceof Error ? error.message : 'Failed to test connection',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopify Admin API Test
          </h1>
          <p className="text-gray-600">
            Verify your Shopify Admin API configuration
          </p>
        </motion.div>

        <GlassCard className="p-8">
          <div className="space-y-6">
            {/* Test Button */}
            <div className="flex justify-center">
              <GlassButton
                onClick={runTest}
                disabled={loading}
                isLoading={loading}
                size="lg"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </GlassButton>
            </div>

            {/* Results */}
            {result && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Status */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50">
                  {result.configured && result.connected ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-semibold text-green-700">Success!</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </>
                  ) : result.configured && !result.connected ? (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="font-semibold text-red-700">Connection Failed</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-yellow-700">Not Configured</p>
                        <p className="text-sm text-gray-600">{result.message}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Shop Info */}
                {result.shop && (
                  <div className="p-4 rounded-lg bg-white/30">
                    <h3 className="font-semibold text-gray-900 mb-2">Shop Information</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {result.shop.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {result.shop.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Details */}
                {result.error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <h3 className="font-semibold text-red-900 mb-2">Error Details</h3>
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                )}

                {/* Setup Steps */}
                {result.steps && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">Setup Steps</h3>
                    <ol className="space-y-2 text-sm text-blue-800">
                      {result.steps.map((step, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-medium">{step.split('.')[0]}.</span>
                          <span>{step.split('.').slice(1).join('.').trim()}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Troubleshooting */}
                {result.troubleshooting && (
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h3 className="font-semibold text-yellow-900 mb-3">
                      Troubleshooting
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      {result.troubleshooting.map((tip, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="font-medium">{tip.split('.')[0]}.</span>
                          <span>{tip.split('.').slice(1).join('.').trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-8 h-8 text-salaam-red-500 animate-spin" />
                <p className="text-gray-600">Testing connection...</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Quick Links */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">
            Need help? Check the{' '}
            <a
              href="/docs/SHOPIFY-EMAIL-MARKETING-SETUP.md"
              className="text-salaam-red-500 hover:underline"
            >
              setup guide
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
