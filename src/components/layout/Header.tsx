'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useCart } from '@/context/CartContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'
import { Menu, X, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/', key: 'home' },
  { href: '/shop', key: 'shop' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
]

export function Header() {
  const t = useTranslations('navigation')
  const { cart, toggleCart } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if on landing page (home page) - matches /, /en, /ms, /ar, etc.
  const isLandingPage = pathname === '/' || /^\/[a-z]{2}$/.test(pathname)

  // Use dark style if not on landing page OR if scrolled
  const useDarkStyle = !isLandingPage || isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          useDarkStyle
            ? 'bg-white/70 backdrop-blur-xl shadow-glass border-b border-white/20'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Image
                  src="/Header-Logo-White-New.svg"
                  alt="Salaam Cola"
                  width={180}
                  height={48}
                  className="h-12 w-auto transition-all duration-300"
                  style={useDarkStyle ? {
                    filter: 'brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(6000%) hue-rotate(355deg) brightness(90%) contrast(115%)'
                  } : undefined}
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "relative font-medium transition-colors duration-200 group",
                    useDarkStyle
                      ? "text-gray-700 hover:text-salaam-red-500"
                      : "text-white hover:text-white/80"
                  )}
                >
                  {t(item.key)}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    useDarkStyle ? "bg-salaam-red-500" : "bg-white"
                  )} />
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher isScrolled={useDarkStyle} />

              {/* Cart button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className={cn(
                  "relative p-2 transition-colors",
                  useDarkStyle
                    ? "text-gray-700 hover:text-salaam-red-500"
                    : "text-white hover:text-white/80"
                )}
                aria-label={t('cart')}
              >
                <ShoppingBag className="w-6 h-6" />
                {cart && cart.totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-medium",
                      useDarkStyle
                        ? "bg-salaam-red-500 text-white"
                        : "bg-white text-salaam-red-500"
                    )}
                  >
                    {cart.totalQuantity}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 transition-colors",
                  useDarkStyle
                    ? "text-gray-700 hover:text-salaam-red-500"
                    : "text-white hover:text-white/80"
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 md:hidden"
          >
            <div className="bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-glass">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-lg font-medium text-gray-700 hover:text-salaam-red-500 transition-colors border-b border-gray-100"
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
