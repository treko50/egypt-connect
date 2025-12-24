import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefund(charge)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)

  const metadata = paymentIntent.metadata

  // Create the appointment in database now that payment is confirmed
  const { data: appointment, error } = await (supabaseAdmin
    .from('appointments') as any)
    .insert({
      user_id: metadata.user_id,
      title: metadata.title,
      description: metadata.description,
      start_time: metadata.start_time,
      end_time: metadata.end_time,
      consultation_type: metadata.consultation_type,
      status: 'pending', // Pending judge confirmation
      payment_status: 'paid',
      payment_intent_id: paymentIntent.id,
      amount_paid: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create appointment:', error)
    // TODO: Send alert - payment succeeded but appointment creation failed
    return
  }

  console.log('Appointment created:', appointment.id)

  // TODO: Send confirmation email to client
  // TODO: Send notification to judge about new appointment
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)

  // TODO: Log failed payment attempt
  // TODO: Send email to client about payment failure
}

async function handleRefund(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id)

  // Extract payment intent ID
  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id

  if (!paymentIntentId) {
    console.error('No payment intent ID found in charge')
    return
  }

  // Find appointment by payment_intent_id
  const { data: appointmentData } = await supabaseAdmin
    .from('appointments')
    .select('id')
    .eq('payment_intent_id', paymentIntentId)
    .single()

  if (appointmentData) {
    const appointment: { id: string } = appointmentData
    // Update appointment status
    await (supabaseAdmin
      .from('appointments') as any)
      .update({
        payment_status: 'refunded',
        status: 'cancelled',
      })
      .eq('id', appointment.id)

    console.log('Appointment marked as refunded:', appointment.id)
    // TODO: Send refund confirmation email
  }
}
