import { GET, POST } from '../route'
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

describe('GET /api/appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const request = new Request('http://localhost:3000/api/appointments')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return client appointments when user is a client', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const mockAppointments = [
      {
        id: 'appt-1',
        title: 'Legal Consultation',
        start_time: '2024-01-15T10:00:00Z',
        end_time: '2024-01-15T11:00:00Z',
        status: 'confirmed',
        consultation_type: 'initial',
      },
    ]

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'user-123', role: 'client' },
        error: null,
      }),
    } as any)

    // Mock appointments query
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockAppointments,
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.appointments).toEqual(mockAppointments)
  })

  it('should return all appointments when user is a judge', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-judge-123' })

    const mockAppointments = [
      {
        id: 'appt-1',
        title: 'Legal Consultation 1',
        start_time: '2024-01-15T10:00:00Z',
        status: 'confirmed',
      },
      {
        id: 'appt-2',
        title: 'Legal Consultation 2',
        start_time: '2024-01-16T14:00:00Z',
        status: 'pending',
      },
    ]

    // Mock user lookup
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'judge-123', role: 'judge' },
        error: null,
      }),
    } as any)

    // Mock appointments query
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockAppointments,
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.appointments).toHaveLength(2)
  })

  it('should filter appointments by status', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'user-123', role: 'client' },
        error: null,
      }),
    } as any)

    const mockFilterQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }

    mockSupabaseAdmin.from.mockReturnValueOnce(mockFilterQuery as any)

    const request = new Request('http://localhost:3000/api/appointments?status=completed')
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockFilterQuery.eq).toHaveBeenCalledWith('status', 'completed')
  })
})

describe('POST /api/appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const request = new Request('http://localhost:3000/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Appointment',
        start_time: '2024-01-15T10:00:00Z',
        end_time: '2024-01-15T11:00:00Z',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should create appointment for authenticated client', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const appointmentData = {
      title: 'Legal Consultation',
      description: 'Contract review',
      start_time: '2024-01-15T10:00:00Z',
      end_time: '2024-01-15T11:00:00Z',
      consultation_type: 'initial',
      client_notes: 'Need help with contract',
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

    // Mock appointment creation
    mockSupabaseAdmin.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'appt-123', ...appointmentData, user_id: 'user-123', status: 'pending' },
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.id).toBe('appt-123')
    expect(data.status).toBe('pending')
  })

  it('should reject follow-up without completed parent', async () => {
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

    // Mock parent appointment lookup (pending status, not completed)
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'parent-123', status: 'pending', user_id: 'user-123' },
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Follow-up',
        start_time: '2024-01-20T10:00:00Z',
        end_time: '2024-01-20T11:00:00Z',
        consultation_type: 'followUp',
        parent_appointment_id: 'parent-123',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('completed')
  })

  it('should allow follow-up with completed parent', async () => {
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

    // Mock parent appointment lookup (completed status)
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'parent-123', status: 'completed', user_id: 'user-123' },
        error: null,
      }),
    } as any)

    // Mock appointment creation
    mockSupabaseAdmin.from.mockReturnValueOnce({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'followup-123',
          title: 'Follow-up Session',
          parent_appointment_id: 'parent-123',
          consultation_type: 'followUp',
          status: 'pending',
        },
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Follow-up Session',
        start_time: '2024-01-20T10:00:00Z',
        end_time: '2024-01-20T11:00:00Z',
        consultation_type: 'followUp',
        parent_appointment_id: 'parent-123',
      }),
    })
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.consultation_type).toBe('followUp')
    expect(data.parent_appointment_id).toBe('parent-123')
  })
})
