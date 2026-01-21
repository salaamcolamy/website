'use client'

import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
    >
      <div className="text-center space-y-6">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-1"
        >
          <span className="text-4xl font-bold text-salaam-red-500">Salaam</span>
          <span className="text-4xl font-bold text-gray-900">Cola</span>
        </motion.div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mx-auto">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'easeInOut',
            }}
            className="h-full w-1/2 bg-salaam-red-500 rounded-full"
          />
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-sm"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  )
}

// Skeleton components for content loading
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-6 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

export function SectionSkeleton() {
  return (
    <div className="py-20 animate-pulse">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-gray-100 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
