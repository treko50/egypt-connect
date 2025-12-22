"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Clock, DollarSign } from "lucide-react"

interface ShopifyBookingProps {
  date?: Date
  timeSlot?: string
  consultationType?: 'initial' | 'standard' | 'premium' | 'followUp' | 'documentReview'
}

const CONSULTATION_TYPES = {
  initial: {
    title: "Initial Consultation",
    duration: "60 minutes",
    price: "$299",
    description: "Comprehensive initial consultation to understand your legal needs",
  },
  standard: {
    title: "Standard Consultation",
    duration: "90 minutes",
    price: "$449",
    description: "Extended session for complex legal matters",
  },
  premium: {
    title: "Premium Consultation",
    duration: "120 minutes",
    price: "$649",
    description: "Comprehensive consultation with extended support",
  },
  followUp: {
    title: "Follow-up Session",
    duration: "30 minutes",
    price: "$149",
    description: "Quick check-in for existing clients",
  },
  documentReview: {
    title: "Document Review",
    duration: "45 minutes",
    price: "$199",
    description: "Focused review of legal documents",
  },
}

export function ShopifyBookingWidget({ date, timeSlot, consultationType = 'initial' }: Readonly<ShopifyBookingProps>) {
  const [isLoading, setIsLoading] = useState(false)
  const consultation = CONSULTATION_TYPES[consultationType]

  const handleBooking = async () => {
    setIsLoading(true)
    
    try {
      // In a production environment, this would integrate with Shopify's Storefront API
      // For now, we'll simulate the booking process
      
      // Step 1: Create cart with consultation product
      const cartData = {
        consultationType,
        date: date?.toISOString(),
        timeSlot,
        price: consultation.price,
      }

      console.log('Creating Shopify booking:', cartData)

      // Step 2: Redirect to Shopify checkout
      // In production, use Shopify Buy Button SDK or Storefront API
      const checkoutUrl = await createShopifyCheckout(cartData)
      
      if (checkoutUrl) {
        globalThis.location.href = checkoutUrl
      } else {
        alert('Booking system ready! Connect your Shopify store to enable payments.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Unable to process booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Book & Pay
        </CardTitle>
        <CardDescription>
          Secure payment through Shopify
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Consultation Details */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-lg mb-3">{consultation.title}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Duration: {consultation.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold text-primary-600">
                {consultation.price}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-3">
            {consultation.description}
          </p>
        </div>

        {/* Selected Date & Time */}
        {date && timeSlot && (
          <div className="p-4 border-2 border-primary-200 rounded-xl bg-primary-50">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Selected Appointment:
            </p>
            <p className="font-semibold text-primary-700">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-primary-600 mt-1">
              {timeSlot}
            </p>
          </div>
        )}

        {/* Booking Button */}
        <Button
          onClick={handleBooking}
          disabled={isLoading || !date || !timeSlot}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Book & Pay with Shopify
            </>
          )}
        </Button>

        {/* Payment Info */}
        <div className="text-xs text-center text-gray-500 space-y-1">
          <p>Secure payment powered by Shopify</p>
          <p>💳 Credit Card • 📱 Digital Wallets • 🏦 Bank Transfer</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Simulated Shopify checkout creation
async function createShopifyCheckout(bookingData: any): Promise<string | null> {
  // In production, implement actual Shopify Storefront API integration:
  // 
  // 1. Create checkout with Shopify Storefront API
  // 2. Add consultation product to cart
  // 3. Add custom attributes (date, time, consultation type)
  // 4. Return checkout URL
  //
  // Example implementation:
  // const response = await fetch(`https://${SHOPIFY_CONFIG.domain}/api/2024-01/graphql.json`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
  //   },
  //   body: JSON.stringify({
  //     query: CREATE_CHECKOUT_MUTATION,
  //     variables: { ... }
  //   })
  // })

  console.log('Shopify checkout would be created with:', bookingData)
  
  // Return null to show setup message
  return null
}
