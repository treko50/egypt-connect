"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Calendar, Home, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  const navigation = [
    { name: 'Home', href: `/`, icon: Home },
    { name: 'Calendar', href: `/calendar`, icon: Calendar },
    { name: 'Profile', href: `/profile`, icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 glass-effect">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <span className="text-xl font-bold text-white">EC</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Egypt Connect
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center space-x-3">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <SignInButton />
              </Button>
              <Button size="sm" asChild>
                <SignUpButton />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
