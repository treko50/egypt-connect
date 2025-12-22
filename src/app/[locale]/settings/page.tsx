"use client"

import { useState } from "react"
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
  Upload as UploadIcon,
  Settings as SettingsIcon,
  FileText
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'documents' | 'billing'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (202) 555-0123",
    location: "Washington, DC",
    timezone: "America/New_York",
    language: "en",
  })

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailBookingConfirmation: true,
    emailReminders: true,
    emailUpdates: false,
    smsReminders: true,
    smsConfirmation: false,
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  // const handleFileUpload = async (files: File[]) => {
  //   console.log('Uploading files:', files)
  //   await new Promise(resolve => setTimeout(resolve, 2000))
  // }

  // const handleFileDelete = async (fileId: string) => {
  //   console.log('Deleting file:', fileId)
  // }

  // const handleFileDownload = async (fileId: string) => {
  //   console.log('Downloading file:', fileId)
  // }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'account' as const, label: 'Account', icon: SettingsIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your account and preferences
              </p>
            </div>
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
                        <CardTitle className="text-2xl">Profile Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? (
                              <>Saving...</>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
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
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {isEditing && (
                        <Button variant="outline" className="gap-2">
                          <UploadIcon className="h-4 w-4" />
                          Change Photo
                        </Button>
                      )}
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
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
                          Location
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
                          Timezone
                        </Label>
                        <Input
                          id="timezone"
                          value={profileData.timezone}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
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
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your account security and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Security</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Enable Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                          Delete Account
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-lg mb-4">Account Status</h3>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <p className="font-medium text-green-900">Account Active</p>
                          <p className="text-sm text-green-700">Member since December 2024</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
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
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Email Notifications</h3>
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
                      <h3 className="font-semibold text-lg mb-4">SMS Notifications</h3>
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
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl">Documents</CardTitle>
                    <CardDescription>Upload and manage your documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">Document upload feature coming soon</p>
                  </CardContent>
                </Card>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      Billing & Payments
                    </CardTitle>
                    <CardDescription>Manage payment methods and view invoices</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Payment Methods</h3>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <CreditCard className="h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-semibold text-lg mb-4">Billing History</h3>
                      <p className="text-gray-500 text-center py-8">No billing history yet</p>
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
