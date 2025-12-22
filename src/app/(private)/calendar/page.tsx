"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShopifyBookingWidget } from "@/components/ShopifyBookingWidget"
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [consultationType, setConsultationType] = useState<'initial' | 'followUp' | 'extended'>('initial')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    )
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-14" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <button
        key={day}
        onClick={() => setSelectedDate(new Date(year, month, day))}
        className={cn(
          "h-14 rounded-lg flex items-center justify-center font-medium transition-all duration-200 hover:bg-primary-50 relative",
          isToday(day) && "bg-primary-500 text-white hover:bg-primary-600",
          isSelected(day) && !isToday(day) && "bg-primary-100 text-primary-700 ring-2 ring-primary-500",
          !isToday(day) && !isSelected(day) && "text-gray-700"
        )}
      >
        {day}
        {/* Sample event indicator */}
        {(day === 15 || day === 22 || day === 28) && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="h-1 w-1 rounded-full bg-secondary-500" />
          </div>
        )}
      </button>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600 mt-2">Manage your schedule and appointments</p>
            </div>
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Event
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {MONTHS[month]} {year}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={previousMonth}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextMonth}
                      className="rounded-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="h-10 flex items-center justify-center font-semibold text-sm text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">{days}</div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's date card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary-600">
                    {new Date().getDate()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {MONTHS[new Date().getMonth()]} {new Date().getFullYear()}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date & Time Slots */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Available Time Slots
                    </CardTitle>
                    <CardDescription>
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'].map((time) => (
                      <Button
                        key={time}
                        variant={selectedTimeSlot === time ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Consultation Type Selection */}
              {selectedDate && selectedTimeSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Consultation Type</CardTitle>
                    <CardDescription>Choose your consultation duration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={consultationType === 'initial' ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setConsultationType('initial')}
                    >
                      Initial (60 min) - 500 EGP
                    </Button>
                    <Button
                      variant={consultationType === 'followUp' ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setConsultationType('followUp')}
                    >
                      Follow-up (30 min) - 300 EGP
                    </Button>
                    <Button
                      variant={consultationType === 'extended' ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setConsultationType('extended')}
                    >
                      Extended (120 min) - 900 EGP
                    </Button>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}