import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Egypt Connect',
  description: 'Connect with Egypt - Tours, Services & Experiences',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" dir="ltr" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-background antialiased`} suppressHydrationWarning>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
