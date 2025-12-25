import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-12-15.clover',
})

// Consultation type pricing in USD
const PRICING = {
  initial: 50, // Initial consultation: $50
  followUp: 30, // Follow-up session: $30
  premium: 70, // Premium consultation: $70
  documentReview: 20, // Document review: $20
} as const

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('clerk_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user: { id: string; email: string; first_name: string; last_name: string } = userData

    // Get booking details from request
    const {
      consultationType,
      title,
      description,
      startTime,
      endTime,
    } = await request.json()

    // Validate consultation type
    if (!consultationType || !(consultationType in PRICING)) {
      return NextResponse.json(
        { error: 'Invalid consultation type' },
        { status: 400 }
      )
    }

    // Get price for consultation type
    const amount = PRICING[consultationType as keyof typeof PRICING]

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: user.id,
        clerk_id: userId,
        consultation_type: consultationType,
        title: title || '',
        description: description || '',
        start_time: startTime || '',
        end_time: endTime || '',
        customer_email: user.email,
        customer_name: `${user.first_name} ${user.last_name}`,
      },
      receipt_email: user.email,
      description: `Legal Consultation - ${consultationType} - ${title}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: 'usd',
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
