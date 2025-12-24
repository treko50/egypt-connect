"use client"

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BookingFlowProvider, useBookingFlow } from '@/components/BookingFlowProvider'
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

const CONSULTATION_TYPES = {
  initial: {
    name: 'Initial Consultation',
    duration: '60 minutes',
    price: '$500',
    description: 'Comprehensive legal consultation for new matters',
  },
  standard: {
    name: 'Standard Consultation',
    duration: '45 minutes',
    price: '$300',
    description: 'Standard legal advice and guidance',
  },
  followUp: {
    name: 'Follow-up Session',
    duration: '30 minutes',
    price: '$200',
    description: 'Continue previous consultation',
  },
  premium: {
    name: 'Premium Consultation',
    duration: '90 minutes',
    price: '$750',
    description: 'Extended session for complex matters',
  },
  documentReview: {
    name: 'Document Review',
    duration: '45 minutes',
    price: '$250',
    description: 'Review and analysis of legal documents',
  },
}

function BookingStepContent() {
  const { currentStep, formData, updateFormData, setCurrentStep, canProceedToStep } = useBookingFlow()

  // Step 1: Date, Time, and Type Selection
  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Consultation Type</CardTitle>
            <CardDescription>Choose the type of consultation you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(CONSULTATION_TYPES).map(([key, type]) => (
              <Button
                key={key}
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
            ))}
          </CardContent>
        </Card>

        {/* Follow-up Selector (if follow-up type selected) */}
        {formData.consultationType === 'followUp' && <FollowUpSelector />}

        <Card>
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>Choose when you&apos;d like your consultation</CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedCalendar
              onDateSelect={(date) => updateFormData({ selectedDate: date })}
              onTimeSelect={(time) => updateFormData({ selectedTime: time })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Provide information about your consultation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Contract Review, Legal Advice"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Provide any additional context about your consultation needs"
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

          <BookingFlowProvider>
            <BookingContent />
          </BookingFlowProvider>
        </div>
      </main>
      <Footer />
    </>
  )
}
