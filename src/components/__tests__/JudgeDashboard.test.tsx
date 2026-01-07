import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { JudgeDashboard } from '../JudgeDashboard'

// Mock fetch
global.fetch = jest.fn()

const mockAppointments = [
  {
    id: 'appt-1',
    title: 'Legal Consultation 1',
    start_time: '2024-02-15T10:00:00Z',
    end_time: '2024-02-15T11:00:00Z',
    status: 'pending',
    consultation_type: 'initial',
    user: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '555-0123',
    },
  },
  {
    id: 'appt-2',
    title: 'Legal Consultation 2',
    start_time: '2024-02-20T14:00:00Z',
    end_time: '2024-02-20T15:00:00Z',
    status: 'confirmed',
    consultation_type: 'followUp',
    user: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '555-0456',
    },
  },
  {
    id: 'appt-3',
    title: 'Legal Consultation 3',
    start_time: '2024-01-10T09:00:00Z',
    end_time: '2024-01-10T10:00:00Z',
    status: 'completed',
    consultation_type: 'standard',
    user: {
      first_name: 'Bob',
      last_name: 'Johnson',
      email: 'bob@example.com',
      phone: '555-0789',
    },
  },
]

describe('JudgeDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ appointments: mockAppointments }),
    })
  })

  it('should render loading state initially', () => {
    render(<JudgeDashboard />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should fetch and display appointments', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Legal Consultation 1')).toBeInTheDocument()
      expect(screen.getByText('Legal Consultation 2')).toBeInTheDocument()
      expect(screen.getByText('Legal Consultation 3')).toBeInTheDocument()
    })
  })

  it('should display stats overview with correct counts', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Confirmed')).toBeInTheDocument()
      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()

      // Check counts (numbers)
      expect(screen.getByText('1')).toBeInTheDocument() // 1 pending
      expect(screen.getByText('3')).toBeInTheDocument() // 3 total
    })
  })

  it('should filter appointments by status', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ appointments: [mockAppointments[0]] }), // Only pending
    })

    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Legal Consultation 1')).toBeInTheDocument()
    })

    // Click "Pending Approval" filter
    const pendingButton = screen.getByText('Pending Approval')
    fireEvent.click(pendingButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('status=pending')
      )
    })
  })

  it('should filter upcoming appointments', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('assignedOnly=true')
      )
    })

    const upcomingButton = screen.getByText('Upcoming')
    fireEvent.click(upcomingButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/startDate=.*&status=confirmed/)
      )
    })
  })

  it('should display client information', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  it('should display status badges', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Confirmed').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Completed').length).toBeGreaterThan(0)
    })
  })

  it('should display consultation types', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('initial')).toBeInTheDocument()
      expect(screen.getByText('followUp')).toBeInTheDocument()
      expect(screen.getByText('standard')).toBeInTheDocument()
    })
  })

  it('should have "View Details" links for each appointment', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      const viewDetailsButtons = screen.getAllByText('View Details')
      expect(viewDetailsButtons).toHaveLength(3)
    })
  })

  it('should show empty state when no appointments', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ appointments: [] }),
    })

    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('No appointments found')).toBeInTheDocument()
    })
  })

  it('should handle fetch error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch appointments:',
        expect.any(Error)
      )
    })

    consoleErrorSpy.mockRestore()
  })

  it('should refetch when filter changes', async () => {
    render(<JudgeDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Legal Consultation 1')).toBeInTheDocument()
    })

    const completedButton = screen.getByText('Completed')
    fireEvent.click(completedButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2) // Initial + filter change
    })
  })
})
