"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/components/LanguageProvider"

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
  const { t } = useTranslations('calendar')
  const { t: tCommon } = useTranslations('common')

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [userTimezone, setUserTimezone] = useState(timezone)
  const timeSlotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  // Auto-scroll to time slots when date is selected
  useEffect(() => {
    if (selectedDate && timeSlotsRef.current) {
      setTimeout(() => {
        timeSlotsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }, [selectedDate])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const DAYS = [
    tCommon('days.sun'),
    tCommon('days.mon'),
    tCommon('days.tue'),
    tCommon('days.wed'),
    tCommon('days.thu'),
    tCommon('days.fri'),
    tCommon('days.sat')
  ]

  const MONTHS = [
    tCommon('months.january'),
    tCommon('months.february'),
    tCommon('months.march'),
    tCommon('months.april'),
    tCommon('months.may'),
    tCommon('months.june'),
    tCommon('months.july'),
    tCommon('months.august'),
    tCommon('months.september'),
    tCommon('months.october'),
    tCommon('months.november'),
    tCommon('months.december')
  ]

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

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      )
    })
  }

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time)
    onTimeSelect?.(time)
  }

  const getWeekDays = () => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      weekDays.push(date)
    }
    return weekDays
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

  // Generate days based on view mode
  const renderDayCell = (date: Date, isInCurrentMonth = true) => {
    const day = date.getDate()
    const dayMonth = date.getMonth()
    const dayYear = date.getFullYear()
    const dayEvents = events.filter(event => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === dayMonth &&
        event.date.getFullYear() === dayYear
      )
    })
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const past = date < today
    const isCurrentDay = day === today.getDate() && dayMonth === today.getMonth() && dayYear === today.getFullYear()
    const isSelectedDay = selectedDate && day === selectedDate.getDate() && dayMonth === selectedDate.getMonth() && dayYear === selectedDate.getFullYear()

    const handleClick = () => {
      if (past) return
      setSelectedDate(date)
      setSelectedTimeSlot(null)
      onDateSelect?.(date)
    }

    return (
      <button
        key={`${dayYear}-${dayMonth}-${day}`}
        onClick={handleClick}
        disabled={past}
        className={cn(
          "h-20 md:h-24 rounded-xl flex flex-col items-center justify-start p-2 font-medium transition-all duration-200 border",
          "hover:shadow-lg hover:scale-105",
          isCurrentDay && "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-700",
          isSelectedDay && !isCurrentDay && "bg-primary-50 text-primary-700 ring-2 ring-primary-500 border-primary-300",
          !isCurrentDay && !isSelectedDay && !past && isInCurrentMonth && "text-gray-700 bg-white border-gray-200 hover:bg-gray-50",
          !isInCurrentMonth && "text-gray-400 bg-gray-50",
          past && "text-gray-400 bg-gray-50 cursor-not-allowed opacity-50 border-gray-100",
          dayEvents.length > 0 && !past && "border-secondary-400"
        )}
      >
        <span className={cn(
          "text-lg font-semibold mb-1",
          isCurrentDay && "text-white"
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
                +{dayEvents.length - 2} {t('moreEvents')}
              </div>
            )}
          </div>
        )}
      </button>
    )
  }

  const days = []

  if (viewMode === 'month') {
    // Month view - show full month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 md:h-24" />)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push(renderDayCell(date, true))
    }
  } else if (viewMode === 'week') {
    // Week view - show current week
    const weekDays = getWeekDays()
    weekDays.forEach(date => {
      days.push(renderDayCell(date, date.getMonth() === month))
    })
  } else if (viewMode === 'day') {
    // Day view - show selected day or today with larger display
    const displayDate = selectedDate || currentDate
    const dayEvents = events.filter(event => {
      return (
        event.date.getDate() === displayDate.getDate() &&
        event.date.getMonth() === displayDate.getMonth() &&
        event.date.getFullYear() === displayDate.getFullYear()
      )
    })

    days.push(
      <div key="day-view" className="w-full max-w-md">
        <div className="bg-white border-2 border-primary-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {displayDate.getDate()}
            </div>
            <div className="text-xl font-semibold text-gray-700">
              {MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {DAYS[displayDate.getDay()]}
            </div>
          </div>

          {dayEvents.length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 mb-3">{t('timeSlots')}</h3>
              {dayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-secondary-50 border border-secondary-200 rounded-lg"
                >
                  <div className="font-semibold text-secondary-800">{event.title}</div>
                  <div className="text-sm text-secondary-600 mt-1">{event.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              {t('timeSlot.noAvailable')}
            </p>
          )}
        </div>
      </div>
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
                  {t('viewMode.month')}
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="text-xs"
                >
                  {t('viewMode.week')}
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className="text-xs"
                >
                  {t('viewMode.day')}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="text-sm"
              >
                {t('today')}
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
          {(viewMode === 'month' || viewMode === 'week') && (
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
          )}

          {/* Calendar grid */}
          <div className={cn(
            "gap-2",
            viewMode === 'month' && "grid grid-cols-7",
            viewMode === 'week' && "grid grid-cols-7",
            viewMode === 'day' && "flex justify-center"
          )}>{days}</div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-primary-500" />
              <span className="text-xs text-gray-600">{t('legend.today')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded ring-2 ring-primary-500 bg-primary-50" />
              <span className="text-xs text-gray-600">{t('legend.selected')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-secondary-400 bg-white" />
              <span className="text-xs text-gray-600">{t('legend.hasEvents')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-50 opacity-50" />
              <span className="text-xs text-gray-600">{t('legend.past')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <Card ref={timeSlotsRef} className="shadow-lg border-gray-200 scroll-mt-20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              {t('timeSlots')}
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
                    <Badge variant="secondary" className="text-xs">{t('timeSlot.booked')}</Badge>
                  )}
                </Button>
              ))}
            </div>

            {availableSlots.every(slot => !slot.available) && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">{t('timeSlot.noAvailable')}</p>
                <p className="text-sm">{t('timeSlot.selectDifferent')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Booking Summary */}
      {selectedDate && selectedTimeSlot && (
        <Card className="shadow-lg border-primary-200 bg-gradient-to-br from-primary-50 to-white">
          <CardHeader>
            <CardTitle className="text-xl">{t('booking.summary')}</CardTitle>
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
                <p className="text-sm text-gray-600">{t('booking.date')}</p>
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
