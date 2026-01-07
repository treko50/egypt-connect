"use client"

import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BookingFlowProvider, useBookingFlow, ConsultationType, BookingFormData } from '@/components/BookingFlowProvider'
import { BookingFlowStepper } from '@/components/BookingFlowStepper'
import { DocumentUploadStep } from '@/components/DocumentUploadStep'
import { ClientNotesStep } from '@/components/ClientNotesStep'
import { PaymentStep } from '@/components/PaymentStep'
import { EnhancedCalendar } from '@/components/EnhancedCalendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FollowUpSelector } from '@/components/FollowUpSelector'
import { DocumentReviewSelector } from '@/components/DocumentReviewSelector'
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react'

const CONSULTATION_TYPES = {
  initial: {
    name: 'Initial Consultation',
    duration: '60 minutes',
    price: '$50',
    description: 'For most regular cases - comprehensive legal consultation to understand your needs',
  },
  premium: {
    name: 'Premium Initial Consultation',
    duration: '90 minutes',
    price: '$70',
    description: 'For complex cases requiring deeper analysis - ideal for matters with 3+ documents or multiple legal issues',
  },
  followUp: {
    name: 'Follow-up Session',
    duration: '30 minutes',
    price: '$30',
    description: 'When requested by the Judge or when you need more details regarding a previous consultation',
  },
  documentReview: {
    name: 'Document Review',
    duration: '15 minutes',
    price: '$20',
    description: 'Submit new documents for the Judge to review and prepare - focused on document analysis with brief guidance on next steps',
  },
}

function BookingStepContent() {
  const { currentStep, formData, updateFormData, setCurrentStep, canProceedToStep } = useBookingFlow()
  const [isDateTimeExpanded, setIsDateTimeExpanded] = useState(!formData.selectedDate || !formData.selectedTime)

  // Step 1: Date, Time, and Type Selection
  if (currentStep === 1) {
    const hasPrefilledDateTime = formData.selectedDate && formData.selectedTime

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Consultation Type</CardTitle>
            <CardDescription>Choose the type of consultation you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(CONSULTATION_TYPES).map(([key, type]) => (
              <div key={key} className="space-y-1">
                <Button
                  variant={formData.consultationType === key ? 'default' : 'outline'}
                  className="w-full justify-between h-auto py-4 px-4"
                  onClick={() => updateFormData({ consultationType: key as any })}
                >
                  <div className="text-left">
                    <div className="font-semibold">{type.name}</div>
                    <div className="text-xs opacity-80">{type.duration}</div>
                  </div>
                  <div className="font-bold">{type.price}</div>
                </Button>
                <p className="text-xs text-gray-500 px-2">({type.description})</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Follow-up Selector (if follow-up type selected) */}
        {formData.consultationType === 'followUp' && <FollowUpSelector />}

        {/* Document Review Selector (if document review type selected) */}
        {formData.consultationType === 'documentReview' && <DocumentReviewSelector />}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>
                  {hasPrefilledDateTime && !isDateTimeExpanded
                    ? 'Your selected appointment time'
                    : 'Choose when you\'d like your consultation'}
                </CardDescription>
              </div>
              {hasPrefilledDateTime && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDateTimeExpanded(!isDateTimeExpanded)}
                  className="ml-2"
                >
                  {isDateTimeExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Change
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hasPrefilledDateTime && !isDateTimeExpanded ? (
              // Collapsed view showing selected date/time
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-primary-700">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <div className="font-semibold">
                        {formData.selectedDate?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary-700">
                    <Clock className="h-5 w-5" />
                    <div className="font-semibold">{formData.selectedTime}</div>
                  </div>
                </div>
              </div>
            ) : (
              // Expanded view with calendar
              <EnhancedCalendar
                onDateSelect={(date) => updateFormData({ selectedDate: date })}
                onTimeSelect={(time) => updateFormData({ selectedTime: time })}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
            <CardDescription>Provide details about your legal matter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Case Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Employment Contract Dispute, Immigration Application, Property Sale"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Brief title describing your legal matter</p>
            </div>
            <div>
              <Label htmlFor="description">Additional Details (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any specific details or questions you'd like to discuss..."
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => setCurrentStep(2)}
            disabled={!canProceedToStep(2)}
            size="lg"
          >
            Continue to Documents →
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Document Upload
  if (currentStep === 2) {
    return <DocumentUploadStep />
  }

  // Step 3: Client Notes
  if (currentStep === 3) {
    return <ClientNotesStep />
  }

  // Step 4: Payment
  if (currentStep === 4) {
    return <PaymentStep />
  }

  return null
}

function BookingContent() {
  return (
    <div className="space-y-8">
      {/* Progress Stepper */}
      <BookingFlowStepper />

      {/* Step Content */}
      <BookingStepContent />
    </div>
  )
}

export default function BookingPage() {
  const searchParams = useSearchParams()

  // Parse query parameters from calendar page
  const { initialData, initialStep } = useMemo(() => {
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    const typeParam = searchParams.get('type')

    // If we have all params from calendar, pre-populate and skip to step 2
    if (dateParam && timeParam && typeParam) {
      const selectedDate = new Date(dateParam)
      const consultationType = typeParam as ConsultationType

      const data: Partial<BookingFormData> = {
        selectedDate,
        selectedTime: timeParam,
        consultationType,
        title: '',
        description: '',
      }

      return { initialData: data, initialStep: 1 } // Start at step 1 with pre-filled data
    }

    return { initialData: undefined, initialStep: 1 }
  }, [searchParams])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Book Your Consultation
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Schedule a legal consultation with Judge Hatem Elnahal
            </p>
          </div>

          <BookingFlowProvider initialData={initialData} initialStep={initialStep}>
            <BookingContent />
          </BookingFlowProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
