import { GET } from '../route'
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

describe('GET /api/appointments/completed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const request = new Request('http://localhost:3000/api/appointments/completed')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 403 if user is a judge', async () => {
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

    const request = new Request('http://localhost:3000/api/appointments/completed')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toContain('clients')
  })

  it('should return completed appointments for client', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const mockCompletedAppointments = [
      {
        id: 'appt-1',
        title: 'Initial Consultation',
        start_time: '2024-01-10T10:00:00Z',
        consultation_type: 'initial',
        assigned_judge: {
          first_name: 'Hatem',
          last_name: 'Elnahal',
          judge_title: 'Senior Judge',
        },
      },
      {
        id: 'appt-2',
        title: 'Contract Review',
        start_time: '2024-01-05T14:00:00Z',
        consultation_type: 'standard',
        assigned_judge: {
          first_name: 'Hatem',
          last_name: 'Elnahal',
          judge_title: 'Senior Judge',
        },
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
        data: mockCompletedAppointments,
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/completed')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.appointments).toHaveLength(2)
    expect(data.appointments[0].id).toBe('appt-1')
    expect(data.appointments[0].assigned_judge.first_name).toBe('Hatem')
  })

  it('should return empty array if no completed appointments', async () => {
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

    // Mock appointments query (empty)
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/completed')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.appointments).toEqual([])
  })

  it('should only return completed status appointments', async () => {
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

    const mockEq = jest.fn().mockReturnThis()

    // Mock appointments query
    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: mockEq,
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    } as any)

    const request = new Request('http://localhost:3000/api/appointments/completed')
    await GET(request)

    // Verify status filter
    expect(mockEq).toHaveBeenCalledWith('status', 'completed')
  })
})
