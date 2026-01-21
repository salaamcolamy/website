export const locales = ['en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
}

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
}

export const localeFonts: Record<Locale, string> = {
  en: 'font-sans',
}
