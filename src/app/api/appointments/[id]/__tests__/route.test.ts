import { GET, PATCH } from '../route'
import { auth } from '@clerk/nextjs'
import { supabaseAdmin } from '@/lib/supabase'

// Mock dependencies
jest.mock('@clerk/nextjs')
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>

describe('GET /api/appointments/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const request = new Request('http://localhost:3000/api/appointments/123')
    const response = await GET(request, { params: { id: '123' } })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return appointment details for client (without internal notes)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const mockAppointment = {
      id: 'appt-123',
      title: 'Legal Consultation',
      description: 'Contract review',
      start_time: '2024-01-15T10:00:00Z',
      end_time: '2024-01-15T11:00:00Z',
      status: 'confirmed',
      consultation_type: 'initial',
      client_notes: 'Need help',
      judge_notes: 'Review completed',
      internal_notes: 'Client seems serious', // Should be filtered out
      user_id: 'user-123',
      user: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '555-0123',
        location: 'Cairo',
      },
    }

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'user-123', role: 'client' },
        error: null,
      }),
    } as any)

    // Mock appointment fetch
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockAppointment,
        error: null,
      }),
    } as any)

    // Mock documents fetch
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/appt-123')
    const response = await GET(request, { params: { id: 'appt-123' } })
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData.id).toBe('appt-123')
    expect(responseData.client_notes).toBe('Need help')
    expect(responseData.judge_notes).toBe('Review completed')
    expect(responseData.internal_notes).toBeUndefined() // Should be filtered for clients
  })

  it('should return appointment details for judge (with internal notes)', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-judge-123' })

    const mockAppointment = {
      id: 'appt-123',
      title: 'Legal Consultation',
      client_notes: 'Need help',
      judge_notes: 'Review completed',
      internal_notes: 'Client seems serious', // Should be included for judges
      user: {
        first_name: 'John',
        last_name: 'Doe',
      },
    }

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'judge-123', role: 'judge' },
        error: null,
      }),
    } as any)

    // Mock appointment fetch
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockAppointment,
        error: null,
      }),
    } as any)

    // Mock documents fetch
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/appt-123')
    const response = await GET(request, { params: { id: 'appt-123' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.internal_notes).toBe('Client seems serious') // Should be included for judges
  })

  it('should return 404 if appointment not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'user-123', role: 'client' },
        error: null,
      }),
    } as any)

    // Mock appointment fetch (not found)
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/nonexistent')
    const response = await GET(request, { params: { id: 'nonexistent' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toContain('not found')
  })
})

describe('PATCH /api/appointments/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const request = new Request('http://localhost:3000/api/appointments/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' }),
    })
    const response = await PATCH(request, { params: { id: '123' } })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should allow client to update client_notes only', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'user-123', role: 'client' },
        error: null,
      }),
    } as any)

    // Mock appointment fetch
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'appt-123', user_id: 'user-123' },
        error: null,
      }),
    } as any)

    const mockUpdate = jest.fn().mockReturnThis()
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockReturnThis()
    const mockSingle = jest.fn().mockResolvedValue({
      data: { id: 'appt-123', client_notes: 'Updated notes' },
      error: null,
    })

    // Mock appointment update
    mockSupabaseAdmin.from.mockReturnValueOnce({
      update: mockUpdate,
      eq: mockEq,
      select: mockSelect,
      single: mockSingle,
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/appt-123', {
      method: 'PATCH',
      body: JSON.stringify({
        client_notes: 'Updated notes',
        status: 'confirmed', // Should be ignored for clients
        judge_notes: 'Hacking attempt', // Should be ignored for clients
      }),
    })
    const response = await PATCH(request, { params: { id: 'appt-123' } })
    await response.json()

    expect(response.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        client_notes: 'Updated notes',
      })
    )
    expect(mockUpdate).not.toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'confirmed',
        judge_notes: 'Hacking attempt',
      })
    )
  })

  it('should allow judge to update status, judge_notes, and internal_notes', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-judge-123' })

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'judge-123', role: 'judge' },
        error: null,
      }),
    } as any)

    // Mock appointment fetch
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'appt-123', assigned_judge_id: 'judge-123' },
        error: null,
      }),
    } as any)

    const mockUpdate = jest.fn().mockReturnThis()

    // Mock appointment update
    mockSupabaseAdmin.from.mockReturnValueOnce({
      update: mockUpdate,
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'appt-123',
          status: 'confirmed',
          judge_notes: 'Session completed',
          internal_notes: 'Good client',
        },
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/appt-123', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'confirmed',
        judge_notes: 'Session completed',
        internal_notes: 'Good client',
      }),
    })
    const response = await PATCH(request, { params: { id: 'appt-123' } })
    await response.json()

    expect(response.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledWith({
      status: 'confirmed',
      judge_notes: 'Session completed',
      internal_notes: 'Good client',
    })
  })

  it('should return 403 if client tries to update another user appointment', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'user-123', role: 'client' },
        error: null,
      }),
    } as any)

    // Mock appointment fetch (belongs to different user)
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'appt-123', user_id: 'different-user' },
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/appt-123', {
      method: 'PATCH',
      body: JSON.stringify({ client_notes: 'Trying to hack' }),
    })
    const response = await PATCH(request, { params: { id: 'appt-123' } })
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toContain('access')
  })
})
