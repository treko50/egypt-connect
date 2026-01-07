"use client"

import { useState, useEffect } from 'react'
import { useBookingFlow } from './BookingFlowProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Calendar, User } from 'lucide-react'

interface CompletedAppointment {
  id: string
  title: string
  start_time: string
  consultation_type: string
  assigned_judge: {
    first_name: string
    last_name: string
    judge_title: string
  }
}

export function DocumentReviewSelector() {
  const { formData, updateFormData } = useBookingFlow()
  const [completedAppointments, setCompletedAppointments] = useState<CompletedAppointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCompletedAppointments() {
      try {
        const response = await fetch('/api/appointments/completed')
        if (response.ok) {
          const data = await response.json()
          setCompletedAppointments(data.appointments)
        }
      } catch (error) {
        console.error('Failed to fetch completed appointments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (formData.consultationType === 'documentReview') {
      fetchCompletedAppointments()
    }
  }, [formData.consultationType])

  if (formData.consultationType !== 'documentReview') {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (completedAppointments.length === 0) {
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">No Completed Appointments</CardTitle>
          <CardDescription className="text-yellow-800">
            Document review can only be booked after completing an initial consultation.
            Please book an initial consultation first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => updateFormData({ consultationType: 'initial' })}
            variant="outline"
          >
            Switch to Initial Consultation
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Related Appointment</CardTitle>
        <CardDescription>
          Choose which appointment these documents relate to. The judge will review your documents
          and provide brief guidance on next steps.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {completedAppointments.map((appointment) => (
          <button
            key={appointment.id}
            onClick={() => {
              updateFormData({
                parentAppointmentId: appointment.id,
              })
            }}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              formData.parentAppointmentId === appointment.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1">{appointment.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(appointment.start_time).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {appointment.assigned_judge.first_name} {appointment.assigned_judge.last_name}
                  </span>
                </div>
              </div>
              {formData.parentAppointmentId === appointment.id && (
                <div className="flex-shrink-0">
                  <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Selected
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
