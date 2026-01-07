import { requireAuth, requireJudge, getCurrentUser } from '../auth-helpers'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../supabase'

// Mock dependencies
jest.mock('@clerk/nextjs')
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))
jest.mock('../supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>

describe('requireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return userId if user is authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const result = await requireAuth()

    expect(result).toBe('clerk-user-123')
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should redirect to sign-in if user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT: ${url}`)
    })

    await expect(requireAuth()).rejects.toThrow('REDIRECT: /sign-in')
    expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
  })
})

describe('getCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return user from database if authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const mockUser = {
      id: 'user-123',
      clerk_id: 'clerk-user-123',
      role: 'client',
      email: 'test@example.com',
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

    const result = await getCurrentUser()

    expect(result).toEqual(mockUser)
  })

  it('should redirect if user not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT: ${url}`)
    })

    await expect(getCurrentUser()).rejects.toThrow('REDIRECT: /sign-in')
  })

  it('should return null if user not found in database', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      }),
    } as any)

    const result = await getCurrentUser()

    expect(result).toBeNull()
  })
})

describe('requireJudge', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return user if authenticated and has judge role', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-judge-123' })

    const mockJudge = {
      id: 'judge-123',
      clerk_id: 'clerk-judge-123',
      role: 'judge',
      email: 'judge@example.com',
      first_name: 'Hatem',
      last_name: 'Elnahal',
    }

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockJudge,
        error: null,
      }),
    } as any)

    const result = await requireJudge()

    expect(result).toEqual(mockJudge)
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it('should redirect to unauthorized if user is not a judge', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    const mockClient = {
      id: 'user-123',
      clerk_id: 'clerk-user-123',
      role: 'client', // Not a judge
      email: 'client@example.com',
    }

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockClient,
        error: null,
      }),
    } as any)

    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT: ${url}`)
    })

    await expect(requireJudge()).rejects.toThrow('REDIRECT: /unauthorized')
    expect(mockRedirect).toHaveBeenCalledWith('/unauthorized')
  })

  it('should redirect to unauthorized if user not found in database', async () => {
    mockAuth.mockResolvedValue({ userId: 'clerk-user-123' })

    mockSupabaseAdmin.from.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      }),
    } as any)

    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT: ${url}`)
    })

    await expect(requireJudge()).rejects.toThrow('REDIRECT: /unauthorized')
  })

  it('should redirect to sign-in if not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null })
    mockRedirect.mockImplementation((url: string) => {
      throw new Error(`REDIRECT: ${url}`)
    })

    await expect(requireJudge()).rejects.toThrow('REDIRECT: /sign-in')
  })
})
