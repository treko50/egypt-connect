"use client"

import { useBookingFlow } from './BookingFlowProvider'
import { Check } from 'lucide-react'

const steps = [
  { number: 1, name: 'Date & Type', shortName: 'Date' },
  { number: 2, name: 'Documents', shortName: 'Docs' },
  { number: 3, name: 'Notes', shortName: 'Notes' },
  { number: 4, name: 'Payment', shortName: 'Pay' },
]

export function BookingFlowStepper() {
  const { currentStep, setCurrentStep, canProceedToStep } = useBookingFlow()

  return (
    <div className="w-full mb-8">
      {/* Current Step Indicator */}
      <div className="mb-6 text-center">
        <div className="text-sm font-medium text-gray-500 mb-1">
          Step {currentStep} of {steps.length}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {steps[currentStep - 1].name}
        </div>
      </div>

      {/* Step Indicators with Progress Bar */}
      <nav aria-label="Progress" className="relative">
        <div className="flex items-center justify-between relative">
          {/* Background Progress Bar */}
          <div className="absolute left-0 right-0 top-5 flex items-center px-5">
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number
            const canAccess = canProceedToStep(step.number)

            return (
              <div key={step.name} className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => canAccess && setCurrentStep(step.number)}
                  disabled={!canAccess}
                  className={`relative transition-all duration-300 ${
                    canAccess ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  {/* Step Circle */}
                  <div
                    className={`
                      flex items-center justify-center rounded-full transition-all duration-300 border-4 border-white
                      ${
                        isCurrent
                          ? 'w-12 h-12 bg-primary-600 shadow-lg shadow-primary-600/50 scale-110'
                          : isCompleted
                          ? 'w-10 h-10 bg-primary-600'
                          : 'w-10 h-10 bg-gray-200'
                      }
                      ${canAccess && !isCurrent ? 'hover:scale-105 hover:shadow-md' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" strokeWidth={3} />
                    ) : (
                      <span
                        className={`text-sm font-bold ${
                          isCurrent ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <div
                      className={`text-xs font-medium transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'text-primary-600 font-semibold'
                          : isCompleted
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      <span className="hidden sm:inline">{step.name}</span>
                      <span className="sm:hidden">{step.shortName}</span>
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
