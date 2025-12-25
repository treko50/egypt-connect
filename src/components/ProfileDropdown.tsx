"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import { User, Settings, Bell, CreditCard, LogOut, ChevronDown, Briefcase } from 'lucide-react'

export function ProfileDropdown() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isJudge, setIsJudge] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if user is a judge
  useEffect(() => {
    async function checkJudgeStatus() {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setIsJudge(data.role === 'judge')
        }
      } catch (error) {
        console.error('Failed to check judge status:', error)
      }
    }

    if (user) {
      checkJudgeStatus()
    }
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    ...(isJudge
      ? [
          {
            icon: Briefcase,
            label: 'Judge Dashboard',
            onClick: () => {
              router.push('/admin/dashboard')
              setIsOpen(false)
            },
            highlight: true,
          },
        ]
      : []),
    {
      icon: User,
      label: 'Profile',
      onClick: () => {
        router.push('/settings?tab=profile')
        setIsOpen(false)
      },
    },
    {
      icon: Settings,
      label: 'Account Settings',
      onClick: () => {
        router.push('/settings?tab=account')
        setIsOpen(false)
      },
    },
    {
      icon: Bell,
      label: 'Notifications',
      onClick: () => {
        router.push('/settings?tab=notifications')
        setIsOpen(false)
      },
    },
    {
      icon: CreditCard,
      label: 'Billing',
      onClick: () => {
        router.push('/settings?tab=billing')
        setIsOpen(false)
      },
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) return null

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
      >
        <div className="flex items-center gap-2">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200">
              {initials}
            </div>
          )}
          <span className="hidden lg:block text-sm font-medium text-gray-700">
            {user.firstName || 'My Profile'}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const highlight = 'highlight' in item && item.highlight
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    highlight
                      ? 'text-primary-700 bg-primary-50 hover:bg-primary-100 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${highlight ? 'text-primary-600' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
