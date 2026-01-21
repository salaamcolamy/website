import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { localeDirection, Locale } from '@/i18n/config'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { PageTransition } from '@/components/layout/PageTransition'
import { SplashScreen } from '@/components/layout/SplashScreen'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoArabic = Noto_Sans_Arabic({
  variable: '--font-noto-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
})

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
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable}`}
    >
      <body className={`antialiased ${isRTL ? 'font-arabic' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <SplashScreen>
              <SmoothScroll>
                <div className="flex min-h-screen flex-col">
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
      </body>
    </html>
  )
}
