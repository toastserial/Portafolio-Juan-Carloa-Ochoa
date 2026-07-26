import type { Locale } from '../types/content'

export const DEFAULT_LOCALE: Locale = 'es'
export const SUPPORTED_LOCALES: Locale[] = ['es', 'en']

export function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

