"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useTranslations } from "@/components/LanguageProvider"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Save,
  Settings as SettingsIcon,
} from "lucide-react"

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const { t } = useTranslations('settings')
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'billing'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Set active tab from query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['profile', 'account', 'notifications', 'billing'].includes(tabParam)) {
      setActiveTab(tabParam as 'profile' | 'account' | 'notifications' | 'billing')
    }
  }, [searchParams])

  // Profile state - will be loaded from Supabase
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: "en",
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Load user data from Supabase when available
  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded || !user) return

      setIsLoadingProfile(true)
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          setProfileData({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || user.emailAddresses[0]?.emailAddress || "",
            phone: data.phone || "",
            location: data.location || "",
            timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: data.language || "en",
          })
        } else {
          // Fallback to Clerk data if Supabase fails
          setProfileData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            phone: user.phoneNumbers[0]?.phoneNumber || "",
            location: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: "en",
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [isLoaded, user])

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailBookingConfirmation: true,
    emailReminders: true,
    emailUpdates: false,
    smsReminders: true,
    smsConfirmation: false,
  })

  const handleSaveProfile = async () => {
    if (!user) {
      alert('User not loaded. Please refresh the page.')
      return
    }

    // Validate required fields
    if (!profileData.firstName?.trim()) {
      alert('First name is required.')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName?.trim() || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          timezone: profileData.timezone,
          language: profileData.language,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      setIsEditing(false)

      // Show success message
      alert('Profile updated successfully!')
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      console.error('Error details:', error.message, error.errors)

      // More detailed error message
      let errorMsg = 'Failed to update profile. '
      if (error.errors && Array.isArray(error.errors)) {
        errorMsg += error.errors.map((e: any) => e.message).join(', ')
      } else if (error.message) {
        errorMsg += error.message
      }

      alert(errorMsg)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile' as const, label: t('tabs.profile'), icon: User },
    { id: 'account' as const, label: t('tabs.account'), icon: SettingsIcon },
    { id: 'notifications' as const, label: t('tabs.notifications'), icon: Bell },
    { id: 'billing' as const, label: t('tabs.billing'), icon: CreditCard },
  ]

  if (!isLoaded || isLoadingProfile) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your settings...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <Card className="lg:col-span-1 h-fit shadow-lg border-gray-200">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{t('profile.title')}</CardTitle>
                        <CardDescription>{t('profile.subtitle')}</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>{t('profile.editProfile')}</Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            {t('profile.cancel')}
                          </Button>
                          <Button onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? (
                              <>{t('profile.saving')}</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                {t('profile.save')}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={`${profileData.firstName} ${profileData.lastName}`}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                          {profileData.firstName[0]}{profileData.lastName[0]}
                        </div>
                      )}
                      {isEditing && (
                        <div className="text-sm text-gray-600">
                          <p>{t('profile.photoInstruction')}</p>
                        </div>
                      )}
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t('profile.firstName')}
                        </Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t('profile.lastName')}
                        </Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t('profile.email')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">{t('profile.emailHelper')}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t('profile.phone')}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t('profile.location')}
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {t('profile.timezone')}
                        </Label>
                        <Input
                          id="timezone"
                          value={profileData.timezone}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">{t('profile.language')}</Label>
                        <Input
                          id="language"
                          value={profileData.language === 'en' ? 'English' : 'Arabic'}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Shield className="h-6 w-6" />
                      {t('account.title')}
                    </CardTitle>
                    <CardDescription>{t('account.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">{t('account.security')}</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          {t('account.changePassword')}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          {t('account.twoFactor')}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-lg mb-4">{t('account.accountInfo')}</h3>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <p className="font-medium text-green-900">{t('account.accountStatus')}</p>
                          <p className="text-sm text-green-700">
                            {t('account.memberSince')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {user?.emailAddresses[0]?.verification?.status === 'verified' ? t('account.verified') : t('account.unverified')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Bell className="h-6 w-6" />
                      {t('notifications.title')}
                    </CardTitle>
                    <CardDescription>{t('notifications.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">{t('notifications.email')}</h3>
                      <div className="space-y-4">
                        {Object.entries(notifications)
                          .filter(([key]) => key.startsWith('email'))
                          .map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <span className="font-medium text-gray-700">
                                {key.replace('email', '').replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                                className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                              />
                            </label>
                          ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-lg mb-4">{t('notifications.sms')}</h3>
                      <div className="space-y-4">
                        {Object.entries(notifications)
                          .filter(([key]) => key.startsWith('sms'))
                          .map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <span className="font-medium text-gray-700">
                                {key.replace('sms', '').replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                                className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                              />
                            </label>
                          ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      {t('notifications.savePreferences')}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      {t('billing.title')}
                    </CardTitle>
                    <CardDescription>{t('billing.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">{t('billing.paymentMethods')}</h3>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <CreditCard className="h-4 w-4" />
                        {t('billing.addPaymentMethod')}
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-lg mb-4">{t('billing.billingHistory')}</h3>
                      <p className="text-gray-500 text-center py-8">{t('billing.noBillingHistory')}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
