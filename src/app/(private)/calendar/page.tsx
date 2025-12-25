"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedCalendar } from "@/components/EnhancedCalendar"
import { useTranslations } from "@/components/LanguageProvider"
import { CreditCard } from "lucide-react"

const DMV_PRICING_KEYS = {
  initial: "initial",
  premium: "premium",
  followUp: "followUp",
  documentReview: "documentReview"
} as const

export default function CalendarPage() {
  const router = useRouter()
  const { t } = useTranslations('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [consultationType, setConsultationType] = useState<keyof typeof DMV_PRICING_KEYS>('initial')

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Calendar */}
            <div className="lg:col-span-2">
              <EnhancedCalendar
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card - Always visible at top */}
              <Card className="shadow-lg border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardHeader>
                  <CardTitle className="text-lg">{t('help.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    {t('help.description')}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('help.faq')}
                  </Button>
                </CardContent>
              </Card>

              {/* Sticky Booking Section */}
              {selectedDate && selectedTimeSlot && (
                <div className="sticky top-6 space-y-6">
                  {/* Consultation Type Selection */}
                  <Card className="shadow-lg border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl">{t('booking.selectService')}</CardTitle>
                      <CardDescription>{t('booking.chooseType')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(DMV_PRICING_KEYS).map(([key, typeKey]) => (
                        <Button
                          key={key}
                          variant={consultationType === key ? "default" : "outline"}
                          className="w-full justify-between h-auto py-4 px-4"
                          onClick={() => setConsultationType(key as keyof typeof DMV_PRICING_KEYS)}
                        >
                          <div className="text-left">
                            <div className="font-semibold">{t(`consultationTypes.${typeKey}.name`)}</div>
                            <div className="text-xs opacity-80">{t(`consultationTypes.${typeKey}.duration`)}</div>
                          </div>
                          <div className="font-bold">{t(`consultationTypes.${typeKey}.price`)}</div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Book Appointment Button */}
                  <Card className="shadow-lg border-primary-200">
                    <CardContent className="pt-6">
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => {
                          // Navigate to booking page with selected data
                          const params = new URLSearchParams({
                            date: selectedDate.toISOString(),
                            time: selectedTimeSlot,
                            type: consultationType,
                          })
                          router.push(`/booking?${params.toString()}`)
                        }}
                      >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Book & Pay with Stripe
                      </Button>
                      <p className="text-xs text-center text-gray-500 mt-3">
                        🔒 Secure payment powered by Stripe
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}