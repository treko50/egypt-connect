"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type ConsultationType = 'initial' | 'followUp' | 'premium' | 'documentReview'

export interface BookingFormData {
  // Step 1: Date/Time/Type Selection
  selectedDate?: Date
  selectedTime?: string
  consultationType: ConsultationType
  title: string
  description: string
  parentAppointmentId?: string | null

  // Step 2: Document Upload
  documents: Array<{
    name: string
    type: string
    file_url: string
    file_size: number
    mime_type: string
    description?: string
  }>

  // Step 3: Client Notes
  clientNotes: string

  // Step 4: Payment (placeholder for future)
  paymentCompleted: boolean
}

interface BookingFlowContextType {
  currentStep: number
  formData: BookingFormData
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<BookingFormData>) => void
  resetBooking: () => void
  canProceedToStep: (step: number) => boolean
}

const initialFormData: BookingFormData = {
  consultationType: 'initial',
  title: '',
  description: '',
  documents: [],
  clientNotes: '',
  paymentCompleted: false,
}

const BookingFlowContext = createContext<BookingFlowContextType | undefined>(undefined)

interface BookingFlowProviderProps {
  children: ReactNode
  initialData?: Partial<BookingFormData>
  initialStep?: number
}

export function BookingFlowProvider({ children, initialData, initialStep = 1 }: BookingFlowProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [formData, setFormData] = useState<BookingFormData>({
    ...initialFormData,
    ...initialData,
  })

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const resetBooking = () => {
    setFormData(initialFormData)
    setCurrentStep(1)
  }

  const canProceedToStep = (step: number): boolean => {
    const hasRequiredFields = !!(formData.selectedDate && formData.selectedTime && formData.title)
    const needsParentAppointment = formData.consultationType === 'followUp' || formData.consultationType === 'documentReview'
    const hasParentAppointment = !!formData.parentAppointmentId

    // For follow-up and document review, parent appointment is required
    const meetsParentRequirement = !needsParentAppointment || hasParentAppointment

    switch (step) {
      case 1:
        return true
      case 2:
        // Can proceed to documents if date/time/type are selected
        // AND if followUp or documentReview, must have parent appointment selected
        return hasRequiredFields && meetsParentRequirement
      case 3:
        // Can proceed to notes (documents are optional)
        return hasRequiredFields && meetsParentRequirement
      case 4:
        // Can proceed to payment if all previous steps are done
        return hasRequiredFields && meetsParentRequirement
      default:
        return false
    }
  }

  return (
    <BookingFlowContext.Provider
      value={{
        currentStep,
        formData,
        setCurrentStep,
        updateFormData,
        resetBooking,
        canProceedToStep,
      }}
    >
      {children}
    </BookingFlowContext.Provider>
  )
}

export function useBookingFlow() {
  const context = useContext(BookingFlowContext)
  if (!context) {
    throw new Error('useBookingFlow must be used within BookingFlowProvider')
  }
  return context
}
