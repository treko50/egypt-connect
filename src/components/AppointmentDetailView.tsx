"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface AppointmentDetail {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'needs_follow_up'
  consultation_type: string
  client_notes: string | null
  judge_notes: string | null
  internal_notes: string | null
  user: {
    first_name: string
    last_name: string
    email: string
    phone: string
    location: string
  }
  parent_appointment: {
    id: string
    title: string
    start_time: string
    status: string
  } | null
  documents: Array<{
    id: string
    name: string
    file_url: string
    file_size: number
    uploaded_by: string
    uploaded_at: string
    description: string | null
  }>
  parentDocuments?: Array<{
    id: string
    name: string
    file_url: string
    file_size: number
    uploaded_by: string
    uploaded_at: string
  }> | null
}

export function AppointmentDetailView({ appointmentId }: { appointmentId: string }) {
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [judgeNotes, setJudgeNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled' | 'completed' | 'needs_follow_up'>('pending')

  useEffect(() => {
    fetchAppointment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId])

  async function fetchAppointment() {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`)
      if (response.ok) {
        const data = await response.json()
        setAppointment(data)
        setJudgeNotes(data.judge_notes || '')
        setInternalNotes(data.internal_notes || '')
        setStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to fetch appointment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveNotes() {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judge_notes: judgeNotes,
          internal_notes: internalNotes,
          status,
        }),
      })

      if (response.ok) {
        alert('Notes saved successfully!')
        fetchAppointment()
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Failed to save notes:', error)
      alert('Failed to save notes')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            <AlertCircle className="h-4 w-4" />
            Pending
          </span>
        )
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            <CheckCircle className="h-4 w-4" />
            Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <CheckCircle className="h-4 w-4" />
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            <XCircle className="h-4 w-4" />
            Cancelled
          </span>
        )
      case 'needs_follow_up':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
            <AlertCircle className="h-4 w-4" />
            Needs Follow-Up
          </span>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Appointment not found</p>
        <Link href="/admin/dashboard">
          <Button className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const datetime = formatDateTime(appointment.start_time)
  const endtime = formatDateTime(appointment.end_time)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/admin/dashboard">
        <Button variant="outline">← Back to Dashboard</Button>
      </Link>

      {/* Appointment Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{appointment.title}</CardTitle>
              <CardDescription className="text-base">
                {appointment.description || 'No description provided'}
              </CardDescription>
            </div>
            {getStatusBadge(appointment.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{datetime.date}</p>
                <p className="text-sm text-gray-600">Date</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {datetime.time} - {endtime.time}
                </p>
                <p className="text-sm text-gray-600">Time</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
              {appointment.consultation_type}
            </span>
            {appointment.parent_appointment && (
              <Link href={`/admin/appointments/${appointment.parent_appointment.id}`}>
                <Button variant="outline" size="sm">
                  View Parent Appointment
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {appointment.user.first_name} {appointment.user.last_name}
                </p>
                <p className="text-sm text-gray-600">Name</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{appointment.user.email}</p>
                <p className="text-sm text-gray-600">Email</p>
              </div>
            </div>

            {appointment.user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{appointment.user.phone}</p>
                  <p className="text-sm text-gray-600">Phone</p>
                </div>
              </div>
            )}

            {appointment.user.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{appointment.user.location}</p>
                  <p className="text-sm text-gray-600">Location</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Client Notes</CardTitle>
            <CardDescription>Questions and context provided by the client</CardDescription>
          </CardHeader>
          <CardContent>
            {appointment.client_notes ? (
              <p className="text-gray-900 whitespace-pre-wrap">{appointment.client_notes}</p>
            ) : (
              <p className="text-gray-500 italic">No notes provided by client</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            {appointment.documents.length} document(s) for this appointment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointment.documents.length === 0 ? (
            <p className="text-gray-500 italic">No documents uploaded</p>
          ) : (
            <div className="space-y-3">
              {appointment.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-primary-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>•</span>
                        <span>Uploaded by {doc.uploaded_by}</span>
                        <span>•</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Parent Appointment Documents */}
          {appointment.parentDocuments && appointment.parentDocuments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">
                Documents from Parent Appointment ({appointment.parentDocuments.length})
              </h4>
              <div className="space-y-3">
                {appointment.parentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>From previous session</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
          <CardDescription>Confirm or complete this appointment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {['pending', 'confirmed', 'completed', 'cancelled', 'needs_follow_up'].map((s) => (
              <Button
                key={s}
                variant={status === s ? 'default' : 'outline'}
                onClick={() => setStatus(s as any)}
                className="capitalize"
              >
                {s === 'needs_follow_up' ? 'Needs Follow-Up' : s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Judge Notes (Shared) */}
      <Card>
        <CardHeader>
          <CardTitle>Shared Notes</CardTitle>
          <CardDescription>
            These notes will be visible to the client after the appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={judgeNotes}
            onChange={(e) => setJudgeNotes(e.target.value)}
            placeholder="Add session summary, recommendations, next steps, etc.&#10;&#10;Example:&#10;- Reviewed contract terms&#10;- Discussed legal options&#10;- Recommended next steps: gather additional documentation&#10;- Follow-up needed in 2 weeks"
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Internal Notes (Private) */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Notes (Private)</CardTitle>
          <CardDescription>
            These notes are only visible to you and other judges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add private notes, observations, case strategy, etc."
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveNotes} disabled={isSaving} size="lg">
          {isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
