import { POST } from '../route'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'
import { headers } from 'next/headers'

// Mock dependencies
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}))
jest.mock('stripe')
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}))

const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>
const mockStripe = Stripe as jest.MockedClass<typeof Stripe>
const mockHeaders = headers as jest.MockedFunction<typeof headers>

// Stripe test webhook event IDs from official documentation
const STRIPE_TEST_WEBHOOKS = {
  PAYMENT_SUCCEEDED: 'evt_test_payment_succeeded',
  PAYMENT_FAILED: 'evt_test_payment_failed',
  CHARGE_REFUNDED: 'evt_test_charge_refunded',
}

describe('POST /api/webhooks/stripe', () => {
  let mockConstructEvent: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup Stripe webhook mock
    mockConstructEvent = jest.fn()
    mockStripe.prototype.webhooks = {
      constructEvent: mockConstructEvent,
    } as any
  })

  it('should return 400 if stripe-signature header is missing', async () => {
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    } as any)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing stripe-signature header')
  })

  it('should return 400 if webhook signature is invalid', async () => {
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('invalid_signature'),
    } as any)

    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({ type: 'payment_intent.succeeded' }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid signature')
  })

  it('should handle payment_intent.succeeded event and create appointment', async () => {
    const validSignature = 't=1614556800,v1=test_signature'
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(validSignature),
    } as any)

    const paymentIntent: Stripe.PaymentIntent = {
      id: 'pi_test_123456789',
      object: 'payment_intent',
      amount: 50000, // $500 in cents
      currency: 'usd',
      status: 'succeeded',
      metadata: {
        user_id: 'user-123',
        clerk_id: 'clerk-user-123',
        consultation_type: 'initial',
        title: 'Legal Consultation',
        description: 'Contract review',
        start_time: '2024-02-15T10:00:00Z',
        end_time: '2024-02-15T11:00:00Z',
        customer_email: 'client@example.com',
        customer_name: 'John Doe',
      },
    } as any

    const event: Stripe.Event = {
      id: STRIPE_TEST_WEBHOOKS.PAYMENT_SUCCEEDED,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: paymentIntent,
      },
    } as any

    mockConstructEvent.mockReturnValue(event)

    // Mock appointment creation
    const mockInsertQuery = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'appt-123',
          user_id: 'user-123',
          title: 'Legal Consultation',
          status: 'pending',
          payment_status: 'paid',
          payment_intent_id: 'pi_test_123456789',
        },
        error: null,
      }),
    }

    mockSupabaseAdmin.from.mockReturnValueOnce(mockInsertQuery as any)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)

    // Verify appointment was created with correct data
    expect(mockInsertQuery.insert).toHaveBeenCalledWith({
      user_id: 'user-123',
      title: 'Legal Consultation',
      description: 'Contract review',
      start_time: '2024-02-15T10:00:00Z',
      end_time: '2024-02-15T11:00:00Z',
      consultation_type: 'initial',
      status: 'pending',
      payment_status: 'paid',
      payment_intent_id: 'pi_test_123456789',
      amount_paid: 500, // Converted from cents
      currency: 'usd',
    })
  })

  it('should handle payment_intent.payment_failed event', async () => {
    const validSignature = 't=1614556800,v1=test_signature'
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(validSignature),
    } as any)

    const paymentIntent: Stripe.PaymentIntent = {
      id: 'pi_test_failed_123',
      object: 'payment_intent',
      amount: 50000,
      currency: 'usd',
      status: 'requires_payment_method',
      last_payment_error: {
        message: 'Your card was declined',
      },
      metadata: {
        user_id: 'user-456',
        consultation_type: 'initial',
      },
    } as any

    const event: Stripe.Event = {
      id: STRIPE_TEST_WEBHOOKS.PAYMENT_FAILED,
      object: 'event',
      type: 'payment_intent.payment_failed',
      data: {
        object: paymentIntent,
      },
    } as any

    mockConstructEvent.mockReturnValue(event)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
  })

  it('should handle charge.refunded event and update appointment', async () => {
    const validSignature = 't=1614556800,v1=test_signature'
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(validSignature),
    } as any)

    const charge: Stripe.Charge = {
      id: 'ch_test_refund_123',
      object: 'charge',
      amount: 50000,
      currency: 'usd',
      refunded: true,
      payment_intent: 'pi_test_original_payment',
    } as any

    const event: Stripe.Event = {
      id: STRIPE_TEST_WEBHOOKS.CHARGE_REFUNDED,
      object: 'event',
      type: 'charge.refunded',
      data: {
        object: charge,
      },
    } as any

    mockConstructEvent.mockReturnValue(event)

    // Mock finding the appointment
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'appt-789' },
        error: null,
      }),
    }

    mockSupabaseAdmin.from.mockReturnValueOnce(mockSelectQuery as any)

    // Mock updating the appointment
    const mockUpdateQuery = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    }

    mockSupabaseAdmin.from.mockReturnValueOnce(mockUpdateQuery as any)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)

    // Verify appointment was found and updated
    expect(mockSelectQuery.eq).toHaveBeenCalledWith('payment_intent_id', 'pi_test_original_payment')
    expect(mockUpdateQuery.update).toHaveBeenCalledWith({
      payment_status: 'refunded',
      status: 'cancelled',
    })
    expect(mockUpdateQuery.eq).toHaveBeenCalledWith('id', 'appt-789')
  })

  it('should handle unhandled event types gracefully', async () => {
    const validSignature = 't=1614556800,v1=test_signature'
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(validSignature),
    } as any)

    const event: Stripe.Event = {
      id: 'evt_test_unhandled',
      object: 'event',
      type: 'customer.created' as any,
      data: {
        object: {} as any,
      },
    } as any

    mockConstructEvent.mockReturnValue(event)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
  })

  it('should handle appointment creation failure gracefully', async () => {
    const validSignature = 't=1614556800,v1=test_signature'
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(validSignature),
    } as any)

    const paymentIntent: Stripe.PaymentIntent = {
      id: 'pi_test_db_error',
      object: 'payment_intent',
      amount: 50000,
      currency: 'usd',
      status: 'succeeded',
      metadata: {
        user_id: 'user-999',
        consultation_type: 'initial',
        title: 'Test',
      },
    } as any

    const event: Stripe.Event = {
      id: 'evt_test_db_error',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: paymentIntent,
      },
    } as any

    mockConstructEvent.mockReturnValue(event)

    // Mock database error
    const mockInsertQuery = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    }

    mockSupabaseAdmin.from.mockReturnValueOnce(mockInsertQuery as any)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const response = await POST(request)
    const data = await response.json()

    // Webhook should still return success even if appointment creation fails
    // (to prevent Stripe from retrying)
    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
  })

  it('should handle refund when appointment not found', async () => {
    const validSignature = 't=1614556800,v1=test_signature'
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(validSignature),
    } as any)

    const charge: Stripe.Charge = {
      id: 'ch_test_no_appt',
      object: 'charge',
      amount: 50000,
      currency: 'usd',
      refunded: true,
      payment_intent: 'pi_test_nonexistent',
    } as any

    const event: Stripe.Event = {
      id: 'evt_test_no_appt',
      object: 'event',
      type: 'charge.refunded',
      data: {
        object: charge,
      },
    } as any

    mockConstructEvent.mockReturnValue(event)

    // Mock appointment not found
    const mockSelectQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      }),
    }

    mockSupabaseAdmin.from.mockReturnValueOnce(mockSelectQuery as any)

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify(event),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.received).toBe(true)
  })
})
