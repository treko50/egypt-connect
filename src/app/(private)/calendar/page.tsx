"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShopifyBookingWidget } from "@/components/ShopifyBookingWidget"
import { EnhancedCalendar } from "@/components/EnhancedCalendar"

const DMV_PRICING = {
  initial: { duration: 60, price: 299, name: "Initial Consultation" },
  standard: { duration: 90, price: 449, name: "Standard Consultation" },
  premium: { duration: 120, price: 649, name: "Premium Consultation" },
  followUp: { duration: 30, price: 149, name: "Follow-up Session" },
  documentReview: { duration: 45, price: 199, name: "Document Review" }
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [consultationType, setConsultationType] = useState<keyof typeof DMV_PRICING>('initial')

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
              Calendar & Scheduling
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Book your consultation and manage appointments
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
              {/* Consultation Type Selection */}
              {selectedDate && selectedTimeSlot && (
                <Card className="shadow-lg border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-xl">Select Service</CardTitle>
                    <CardDescription>Choose your consultation type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(DMV_PRICING).map(([key, value]) => (
                      <Button
                        key={key}
                        variant={consultationType === key ? "default" : "outline"}
                        className="w-full justify-between h-auto py-4 px-4"
                        onClick={() => setConsultationType(key as keyof typeof DMV_PRICING)}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{value.name}</div>
                          <div className="text-xs opacity-80">{value.duration} minutes</div>
                        </div>
                        <div className="font-bold">${value.price}</div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Shopify Booking Widget */}
              {selectedDate && selectedTimeSlot && (
                <ShopifyBookingWidget
                  date={selectedDate}
                  timeSlot={selectedTimeSlot}
                  consultationType={consultationType}
                />
              )}

              {/* Info Card */}
              <Card className="shadow-lg border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    All times are shown in your local timezone. You can upload relevant documents before or after booking.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}