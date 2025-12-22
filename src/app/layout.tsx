import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Egypt Connect',
  description: 'Connect with Egypt - Tours, Services & Experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
