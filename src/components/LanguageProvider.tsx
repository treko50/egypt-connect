'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import enMessages from '../../messages/en.json'
import arMessages from '../../messages/ar.json'

type Locale = 'en' | 'ar'

interface Translation {
  [key: string]: Translation | string
}

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  translations: Translation
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Message map for static imports
const messages: Record<Locale, Translation> = {
  en: enMessages,
  ar: arMessages,
}

// Get initial locale from localStorage (client-side only)
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const savedLocale = localStorage.getItem('locale') as Locale
  return savedLocale && (savedLocale === 'en' || savedLocale === 'ar') ? savedLocale : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [translations, setTranslations] = useState<Translation>(() => {
    // Initialize with the correct locale's translations
    const initialLocale = getInitialLocale()
    return messages[initialLocale]
  })
  const [mounted, setMounted] = useState(false)

  // Mark as mounted after first render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load translations when locale changes
  useEffect(() => {
    console.log('[LanguageProvider] Loading translations for locale:', locale)
    setTranslations(messages[locale])
    console.log('[LanguageProvider] Translations loaded:', messages[locale])
  }, [locale])

  // Update localStorage and HTML attributes when locale changes (only after mount)
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale, mounted])

  // Helper function to get nested translation
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: Translation | string = translations

    for (const k of keys) {
      if (typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key
  }

  const setLocale = (newLocale: Locale) => {
    console.log('[LanguageProvider] Setting locale to:', newLocale)
    setLocaleState(newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, translations, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function useTranslations(namespace?: string) {
  const { t, locale } = useLanguage()

  if (!namespace) {
    return { t, locale }
  }

  const scopedT = (key: string) => t(`${namespace}.${key}`)
  return { t: scopedT, locale }
}
