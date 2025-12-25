"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Appointment {
  id: string
  title: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  consultation_type: string
  user: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
}

export function JudgeDashboard() {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'pending' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    setIsLoading(true)
    try {
      // Fetch ALL appointments for the judge
      const url = '/api/appointments?assignedOnly=true'

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setAllAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter appointments client-side based on active filter
  const filteredAppointments = allAppointments.filter((appointment) => {
    const now = new Date()
    const startTime = new Date(appointment.start_time)

    if (activeFilter === 'all') {
      return true
    } else if (activeFilter === 'upcoming') {
      return appointment.status === 'confirmed' && startTime > now
    } else if (activeFilter === 'pending') {
      return appointment.status === 'pending'
    } else if (activeFilter === 'completed') {
      return appointment.status === 'completed'
    } else if (activeFilter === 'cancelled') {
      return appointment.status === 'cancelled'
    }
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <AlertCircle className="h-3 w-3" />
            Pending
          </span>
        )
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="h-3 w-3" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview - Clickable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''
          }`}
          onClick={() => setActiveFilter('pending')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {allAppointments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'upcoming' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setActiveFilter('upcoming')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allAppointments.filter(a => {
                    const now = new Date()
                    const startTime = new Date(a.start_time)
                    return a.status === 'confirmed' && startTime > now
                  }).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'completed' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => setActiveFilter('completed')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {allAppointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'cancelled' ? 'ring-2 ring-red-500' : ''
          }`}
          onClick={() => setActiveFilter('cancelled')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {allAppointments.filter(a => a.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeFilter === 'all' ? 'ring-2 ring-gray-500' : ''
          }`}
          onClick={() => setActiveFilter('all')}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{allAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeFilter === 'upcoming' && 'Upcoming Appointments'}
            {activeFilter === 'pending' && 'Pending Appointments'}
            {activeFilter === 'completed' && 'Completed Appointments'}
            {activeFilter === 'cancelled' && 'Cancelled Appointments'}
            {activeFilter === 'all' && 'All Appointments'}
          </CardTitle>
          <CardDescription>
            {activeFilter === 'upcoming' && 'Confirmed appointments scheduled for the future'}
            {activeFilter === 'pending' && 'Appointments awaiting your confirmation'}
            {activeFilter === 'completed' && 'Past appointments that have been completed'}
            {activeFilter === 'cancelled' && 'Appointments that have been cancelled'}
            {activeFilter === 'all' && 'Click a stat card above to filter appointments'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const datetime = formatDateTime(appointment.start_time)
                return (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                          {getStatusBadge(appointment.status)}
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {appointment.consultation_type}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>
                              {appointment.user.first_name} {appointment.user.last_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{datetime.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{datetime.time}</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/admin/appointments/${appointment.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
