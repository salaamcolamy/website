'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import { locales, localeNames, Locale } from '@/i18n/config'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  isScrolled?: boolean
}

export function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 transition-colors rounded-full hover:bg-white/20",
          isScrolled
            ? "text-gray-700 hover:text-salaam-red-500"
            : "text-white hover:text-white/80"
        )}
        aria-label={t('language')}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">
          {localeNames[locale]}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[150px] bg-white/90 backdrop-blur-xl rounded-xl border border-white/20 shadow-glass overflow-hidden"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={cn(
                    'w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-salaam-red-500/10',
                    locale === loc
                      ? 'text-salaam-red-500 bg-salaam-red-500/5'
                      : 'text-gray-700'
                  )}
                >
                  {localeNames[loc]}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
