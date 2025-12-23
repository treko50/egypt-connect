'use client'

import { useLanguage, useTranslations } from '@/components/LanguageProvider'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'

export default function TestLangPage() {
  const { locale, translations } = useLanguage()
  const { t: tHome } = useTranslations('home')
  const { t: tNav } = useTranslations('navigation')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Language Test Page</h1>
        <LanguageSwitcher />
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-2">Current State</h2>
          <p>Locale: <code className="bg-white px-2 py-1 rounded">{locale}</code></p>
          <p>Direction: <code className="bg-white px-2 py-1 rounded">{typeof document !== 'undefined' ? document.documentElement.dir : 'N/A'}</code></p>
          <p>Lang: <code className="bg-white px-2 py-1 rounded">{typeof document !== 'undefined' ? document.documentElement.lang : 'N/A'}</code></p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-2">Navigation Translations</h2>
          <p>home: {tNav('home')}</p>
          <p>calendar: {tNav('calendar')}</p>
          <p>profile: {tNav('profile')}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-2">Home Translations</h2>
          <p>badge: {tHome('badge')}</p>
          <p>title: {tHome('title')}</p>
          <p>scheduleButton: {tHome('scheduleButton')}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-2">Features Translations</h2>
          <p>features.title: {tHome('features.title')}</p>
          <p>features.scheduling.title: {tHome('features.scheduling.title')}</p>
          <p>features.scheduling.description: {tHome('features.scheduling.description')}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold text-xl mb-2">Raw Translations Object</h2>
          <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(translations, null, 2)}
          </pre>
        </div>

        <Button onClick={() => window.location.href = '/'}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}
