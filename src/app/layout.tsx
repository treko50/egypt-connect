import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
