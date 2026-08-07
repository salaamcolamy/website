import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { localeDirection, Locale } from '@/i18n/config'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { PageTransition } from '@/components/layout/PageTransition'
import { SplashScreen } from '@/components/layout/SplashScreen'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://salaamcolamy.com'),
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Get messages for the current locale
  const messages = await getMessages()

  // Get text direction
  const direction = localeDirection[locale as Locale]
  const isRTL = direction === 'rtl'

  return (
    <html
      lang={locale}
      dir={direction}
    >
      <body className={`antialiased ${isRTL ? 'font-arabic' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <SplashScreen>
              <SmoothScroll>
                <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
                  <Header />
                  <main className="flex-1">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </main>
                  <Footer />
                  <CartDrawer />
                </div>
              </SmoothScroll>
            </SplashScreen>
          </CartProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
