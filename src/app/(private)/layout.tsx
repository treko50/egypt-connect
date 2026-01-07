import { ReactNode } from "react"

export const dynamic = 'force-dynamic'

export default function PrivateLayout({ children }: { readonly children: ReactNode }) {
  return <>{children}</>
}