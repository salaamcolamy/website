'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useCart } from '@/context/CartContext'
// import { LanguageSwitcher } from './LanguageSwitcher' // Disabled - English only
import { cn } from '@/lib/utils'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'
import Image from 'next/image'

type NavItem = {
  href?: string
  key: string
  dropdown?: { href: string; key: string }[]
}

const navItems: NavItem[] = [
  { href: '/', key: 'home' },
  { href: '/shop', key: 'shop' },
  {
    key: 'programs',
    dropdown: [
      { href: '/programs', key: 'whereYourSipGoes' },
      { href: '/join-us', key: 'joinUs' },
    ]
  },
  { href: '/about', key: 'about' },
  { href: '/join-us#career', key: 'career' },
  { href: '/contact', key: 'support' },
]

export function Header() {
  const t = useTranslations('navigation')
  const { cart, toggleCart } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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
                item.dropdown ? (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "relative font-medium transition-colors duration-200 group flex items-center gap-1",
                        useDarkStyle
                          ? "text-gray-700 hover:text-salaam-red-500"
                          : "text-white hover:text-white/80"
                      )}
                    >
                      {t(item.key)}
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        openDropdown === item.key && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.key && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 py-2 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[180px]"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.key}
                              href={subItem.href}
                              className="block px-4 py-2 text-gray-700 hover:text-salaam-red-500 hover:bg-gray-50 transition-colors"
                            >
                              {t(subItem.key)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href!}
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
                )
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Language switcher hidden - English only */}

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
                      {item.dropdown ? (
                        <div className="border-b border-gray-100">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                            className="w-full flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-salaam-red-500 transition-colors"
                          >
                            {t(item.key)}
                            <ChevronDown className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              openDropdown === item.key && "rotate-180"
                            )} />
                          </button>
                          <AnimatePresence>
                            {openDropdown === item.key && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.key}
                                    href={subItem.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 pl-4 text-gray-600 hover:text-salaam-red-500 transition-colors"
                                  >
                                    {t(subItem.key)}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href!}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 text-lg font-medium text-gray-700 hover:text-salaam-red-500 transition-colors border-b border-gray-100"
                        >
                          {t(item.key)}
                        </Link>
                      )}
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
