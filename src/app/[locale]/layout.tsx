import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate locale
  if (!['en', 'ar'].includes(locale)) {
    notFound()
  }

  const messages = await getMessages()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={direction} className={inter.className}>
      <body className="min-h-screen bg-white">
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
