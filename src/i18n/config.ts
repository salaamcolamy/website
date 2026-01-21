export const locales = ['en', 'ms', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ms: 'Bahasa Melayu',
  ar: 'العربية'
}

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ms: 'ltr',
  ar: 'rtl'
}

export const localeFonts: Record<Locale, string> = {
  en: 'font-sans',
  ms: 'font-sans',
  ar: 'font-arabic'
}
