"use client"

import { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useBookingFlow } from './BookingFlowProvider'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { CheckCircle, CreditCard, DollarSign, Loader2 } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Pricing configuration (matches backend)
const PRICING = {
  initial: 500,
  standard: 300,
  followUp: 200,
  premium: 750,
  documentReview: 250,
} as const

interface CheckoutFormProps {
  clientSecret: string
  amount: number
  onSuccess: () => void
}

function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please try again.')
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        onSuccess()
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)} USD</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Payment Details</h3>
        </div>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay ${amount.toFixed(2)} USD
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-500">
          🔒 Secure payment powered by Stripe. Your payment information is encrypted and secure.
        </p>
      </div>
    </form>
  )
}

export function PaymentStep() {
  const { formData, updateFormData, setCurrentStep } = useBookingFlow()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const amount = PRICING[formData.consultationType as keyof typeof PRICING] || 500

  const createPaymentIntent = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationType: formData.consultationType,
          title: formData.title,
          description: formData.description,
          startTime: formData.selectedDate?.toISOString(),
          endTime: formData.selectedDate?.toISOString(), // Will be calculated based on duration
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (err) {
      console.error('Payment intent error:', err)
      setError('Failed to initialize payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData.consultationType, formData.title, formData.description, formData.selectedDate])

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent()
  }, [createPaymentIntent])

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    updateFormData({ paymentCompleted: true })

    // Show success message for 2 seconds then redirect
    setTimeout(() => {
      window.location.href = '/booking/success'
    }, 2000)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
            <p className="text-gray-600">Initializing secure payment...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-800 mb-4">{error}</p>
              <Button onClick={createPaymentIntent} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 text-center max-w-md">
              Your appointment has been booked. You will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Secure Payment</CardTitle>
          <CardDescription>
            Complete your payment to confirm your consultation booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Booking Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Type:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {formData.consultationType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium text-gray-900">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {formData.selectedDate?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium text-gray-900">{formData.selectedTime}</span>
              </div>
              {formData.documents.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium text-gray-900">
                    {formData.documents.length} uploaded
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stripe Payment Form */}
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                    borderRadius: '12px',
                  },
                },
              }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                amount={amount}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => setCurrentStep(3)}
        disabled={isLoading || paymentSuccess}
      >
        ← Back to Notes
      </Button>
    </div>
  )
}
