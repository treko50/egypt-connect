"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

interface TimeSlot {
  time: string
  available: boolean
  timezone: string
}

interface CalendarEvent {
  id: string
  date: Date
  time: string
  title: string
  type: string
  duration: number
}

export interface EnhancedCalendarProps {
  onDateSelect?: (date: Date) => void
  onTimeSelect?: (time: string) => void
  timezone?: string
  events?: CalendarEvent[]
}

export function EnhancedCalendar({
  onDateSelect,
  onTimeSelect,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  events = []
}: EnhancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [userTimezone, setUserTimezone] = useState(timezone)

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

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

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
    onDateSelect?.(today)
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

  const isPast = (day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(year, month, day)
    return checkDate < today
  }

  const hasEvent = (day: number) => {
    return events.some(event => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      )
    })
  }

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      )
    })
  }

  const handleDateClick = (day: number) => {
    if (isPast(day)) return
    const date = new Date(year, month, day)
    setSelectedDate(date)
    setSelectedTimeSlot(null)
    onDateSelect?.(date)
  }

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time)
    onTimeSelect?.(time)
  }

  const getAvailableTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [
      { time: '9:00 AM', available: true, timezone: userTimezone },
      { time: '10:00 AM', available: true, timezone: userTimezone },
      { time: '11:00 AM', available: true, timezone: userTimezone },
      { time: '12:00 PM', available: false, timezone: userTimezone },
      { time: '1:00 PM', available: true, timezone: userTimezone },
      { time: '2:00 PM', available: true, timezone: userTimezone },
      { time: '3:00 PM', available: true, timezone: userTimezone },
      { time: '4:00 PM', available: true, timezone: userTimezone },
      { time: '5:00 PM', available: false, timezone: userTimezone },
    ]

    if (selectedDate) {
      const dayEvents = getEventsForDay(selectedDate.getDate())
      dayEvents.forEach(event => {
        const slotIndex = slots.findIndex(s => s.time === event.time)
        if (slotIndex !== -1) {
          slots[slotIndex].available = false
        }
      })
    }

    return slots
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-20 md:h-24" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day)
    const past = isPast(day)

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={past}
        className={cn(
          "h-20 md:h-24 rounded-xl flex flex-col items-center justify-start p-2 font-medium transition-all duration-200 border",
          "hover:shadow-lg hover:scale-105",
          isToday(day) && "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-700",
          isSelected(day) && !isToday(day) && "bg-primary-50 text-primary-700 ring-2 ring-primary-500 border-primary-300",
          !isToday(day) && !isSelected(day) && !past && "text-gray-700 bg-white border-gray-200 hover:bg-gray-50",
          past && "text-gray-400 bg-gray-50 cursor-not-allowed opacity-50 border-gray-100",
          hasEvent(day) && !past && "border-secondary-400"
        )}
      >
        <span className={cn(
          "text-lg font-semibold mb-1",
          isToday(day) && "text-white"
        )}>
          {day}
        </span>

        {dayEvents.length > 0 && (
          <div className="flex flex-col gap-0.5 w-full">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className="text-xs px-1 py-0.5 rounded bg-secondary-100 text-secondary-800 truncate w-full"
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-600">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        )}

        {hasEvent(day) && dayEvents.length === 0 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-secondary-500" />
          </div>
        )}
      </button>
    )
  }

  const availableSlots = getAvailableTimeSlots()

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {MONTHS[month]} {year}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {userTimezone}
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                  className="text-xs"
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="text-xs"
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="text-xs"
                >
                  Day
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="text-sm"
              >
                Today
              </Button>

              <div className="flex gap-1">
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
          </div>
        </CardHeader>

        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-10 flex items-center justify-center font-bold text-sm text-gray-700 bg-gray-50 rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">{days}</div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-primary-500" />
              <span className="text-xs text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded ring-2 ring-primary-500 bg-primary-50" />
              <span className="text-xs text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-secondary-400 bg-white" />
              <span className="text-xs text-gray-600">Has Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-50 opacity-50" />
              <span className="text-xs text-gray-600">Past</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Available Time Slots
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  onClick={() => handleTimeSlotClick(slot.time)}
                  className={cn(
                    "h-16 flex flex-col items-center justify-center gap-1 transition-all",
                    !slot.available && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="font-semibold">{slot.time}</span>
                  {!slot.available && (
                    <Badge variant="secondary" className="text-xs">Booked</Badge>
                  )}
                </Button>
              ))}
            </div>

            {availableSlots.every(slot => !slot.available) && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No available time slots</p>
                <p className="text-sm">Please select a different date</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Booking Summary */}
      {selectedDate && selectedTimeSlot && (
        <Card className="shadow-lg border-primary-200 bg-gradient-to-br from-primary-50 to-white">
          <CardHeader>
            <CardTitle className="text-xl">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <CalendarIcon className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600">Date</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Clock className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">{selectedTimeSlot}</p>
                <p className="text-sm text-gray-600">{userTimezone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
