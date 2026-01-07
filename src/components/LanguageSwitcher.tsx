"use client"

import { useLanguage } from '@/components/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useState } from 'react'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const switchLocale = (newLocale: 'en' | 'ar') => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {locale === 'ar' ? 'العربية' : 'English'}
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
            <button
              onClick={() => switchLocale('en')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg transition-colors ${
                locale === 'en' ? 'bg-primary-50 text-primary-600 font-medium' : ''
              }`}
            >
              English
            </button>
            <button
              onClick={() => switchLocale('ar')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg transition-colors ${
                locale === 'ar' ? 'bg-primary-50 text-primary-600 font-medium' : ''
              }`}
            >
              العربية
            </button>
          </div>
        </>
      )}
    </div>
  )
}
