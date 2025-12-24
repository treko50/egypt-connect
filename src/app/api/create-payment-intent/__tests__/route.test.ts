import { POST } from '../route'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

// Mock dependencies
jest.mock('@clerk/nextjs/server')
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}))
jest.mock('stripe')

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>
const mockStripe = Stripe as jest.MockedClass<typeof Stripe>

// Stripe test card numbers from official documentation
const STRIPE_TEST_CARDS = {
  SUCCESS: '4242424242424242',
  REQUIRES_AUTH: '4000002500003155',
  DECLINED: '4000000000000002',
  INSUFFICIENT_FUNDS: '4000000000009995',
}

describe('POST /api/create-payment-intent', () => {
  let mockPaymentIntentsCreate: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup Stripe mock
    mockPaymentIntentsCreate = jest.fn()
    mockStripe.prototype.paymentIntents = {
      create: mockPaymentIntentsCreate,
    } as any
  })

  it('should return 401 if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as any)

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'initial',
        title: 'Legal Consultation',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 404 if user not found in database', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'initial',
        title: 'Legal Consultation',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('User not found')
  })

  it('should return 400 for invalid consultation type', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-123',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
        },
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'invalid_type',
        title: 'Legal Consultation',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid consultation type')
  })

  it('should create payment intent for initial consultation ($500)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' } as any)

    const mockUser = {
      id: 'user-123',
      email: 'client@example.com',
      first_name: 'John',
      last_name: 'Doe',
    }

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockUser,
        error: null,
      }),
    } as any)

    const mockPaymentIntent = {
      id: 'pi_test_123456789',
      client_secret: 'pi_test_123456789_secret_abcdefghijklmnop',
      amount: 50000, // $500 in cents
      currency: 'usd',
      status: 'requires_payment_method',
    }

    mockPaymentIntentsCreate.mockResolvedValue(mockPaymentIntent)

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'initial',
        title: 'Initial Legal Consultation',
        description: 'Need help with contract review',
        startTime: '2024-02-15T10:00:00Z',
        endTime: '2024-02-15T11:00:00Z',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.clientSecret).toBe(mockPaymentIntent.client_secret)
    expect(data.amount).toBe(500)
    expect(data.currency).toBe('usd')
    expect(data.paymentIntentId).toBe('pi_test_123456789')

    // Verify Stripe was called with correct parameters
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: 50000,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: 'user-123',
        clerk_id: 'clerk-user-123',
        consultation_type: 'initial',
        title: 'Initial Legal Consultation',
        description: 'Need help with contract review',
        start_time: '2024-02-15T10:00:00Z',
        end_time: '2024-02-15T11:00:00Z',
        customer_email: 'client@example.com',
        customer_name: 'John Doe',
      },
      receipt_email: 'client@example.com',
      description: 'Legal Consultation - initial - Initial Legal Consultation',
    })
  })

  it('should create payment intent for standard consultation ($300)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-456' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-456',
          email: 'client2@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
        },
        error: null,
      }),
    } as any)

    mockPaymentIntentsCreate.mockResolvedValue({
      id: 'pi_test_standard',
      client_secret: 'pi_test_standard_secret',
      amount: 30000,
      currency: 'usd',
    })

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'standard',
        title: 'Standard Consultation',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.amount).toBe(300)
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 30000,
      })
    )
  })

  it('should create payment intent for follow-up session ($200)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-789' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-789',
          email: 'followup@example.com',
          first_name: 'Bob',
          last_name: 'Johnson',
        },
        error: null,
      }),
    } as any)

    mockPaymentIntentsCreate.mockResolvedValue({
      id: 'pi_test_followup',
      client_secret: 'pi_test_followup_secret',
      amount: 20000,
      currency: 'usd',
    })

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'followUp',
        title: 'Follow-up Session',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.amount).toBe(200)
  })

  it('should create payment intent for premium consultation ($750)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-premium' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-premium',
          email: 'premium@example.com',
          first_name: 'Alice',
          last_name: 'Williams',
        },
        error: null,
      }),
    } as any)

    mockPaymentIntentsCreate.mockResolvedValue({
      id: 'pi_test_premium',
      client_secret: 'pi_test_premium_secret',
      amount: 75000,
      currency: 'usd',
    })

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'premium',
        title: 'Premium Consultation',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.amount).toBe(750)
  })

  it('should create payment intent for document review ($250)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-doc' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-doc',
          email: 'document@example.com',
          first_name: 'Carol',
          last_name: 'Brown',
        },
        error: null,
      }),
    } as any)

    mockPaymentIntentsCreate.mockResolvedValue({
      id: 'pi_test_doc',
      client_secret: 'pi_test_doc_secret',
      amount: 25000,
      currency: 'usd',
    })

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'documentReview',
        title: 'Document Review Session',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.amount).toBe(250)
  })

  it('should handle Stripe API errors gracefully', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-error' } as any)

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'user-error',
          email: 'error@example.com',
          first_name: 'Error',
          last_name: 'User',
        },
        error: null,
      }),
    } as any)

    mockPaymentIntentsCreate.mockRejectedValue(
      new Error('Stripe API error: Card declined')
    )

    const request = new Request('http://localhost:3000/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        consultationType: 'initial',
        title: 'Test Consultation',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to create payment intent')
  })
})
