"use client"

import { useBookingFlow } from './BookingFlowProvider'
import { Check } from 'lucide-react'

const steps = [
  { number: 1, name: 'Date & Type', description: 'Select date, time, and consultation type' },
  { number: 2, name: 'Documents', description: 'Upload relevant documents (optional)' },
  { number: 3, name: 'Notes', description: 'Add questions or context for the judge' },
  { number: 4, name: 'Payment', description: 'Complete your booking' },
]

export function BookingFlowStepper() {
  const { currentStep, setCurrentStep, canProceedToStep } = useBookingFlow()

  return (
    <div className="w-full py-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number
            const canAccess = canProceedToStep(step.number)

            return (
              <li
                key={step.name}
                className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
              >
                {/* Connector line */}
                {stepIdx !== steps.length - 1 && (
                  <div
                    className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full ${
                        isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}

                <button
                  onClick={() => canAccess && setCurrentStep(step.number)}
                  disabled={!canAccess}
                  className={`group relative flex flex-col items-center ${
                    canAccess ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  {/* Step circle */}
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                      isCompleted
                        ? 'bg-primary-600 group-hover:bg-primary-700'
                        : isCurrent
                        ? 'border-2 border-primary-600 bg-white'
                        : 'border-2 border-gray-300 bg-white group-hover:border-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-primary-600' : 'text-gray-500'
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                  </span>

                  {/* Step name and description */}
                  <span className="mt-2 flex flex-col items-center text-center">
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-primary-600' : 'text-gray-900'
                      }`}
                    >
                      {step.name}
                    </span>
                    <span className="hidden sm:block text-xs text-gray-500 mt-1 max-w-[120px]">
                      {step.description}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
