import { render, screen, act } from '@testing-library/react'
import { BookingFlowProvider, useBookingFlow } from '../BookingFlowProvider'

// Test component that uses the context
function TestComponent() {
  const {
    currentStep,
    formData,
    setCurrentStep,
    updateFormData,
    canProceedToStep,
    resetBookingFlow,
  } = useBookingFlow()

  return (
    <div>
      <div data-testid="current-step">{currentStep}</div>
      <div data-testid="consultation-type">{formData.consultationType}</div>
      <div data-testid="title">{formData.title}</div>
      <div data-testid="can-proceed-step-2">{canProceedToStep(2).toString()}</div>
      <div data-testid="can-proceed-step-3">{canProceedToStep(3).toString()}</div>

      <button onClick={() => setCurrentStep(2)}>Go to Step 2</button>
      <button onClick={() => updateFormData({ title: 'Updated Title' })}>
        Update Title
      </button>
      <button onClick={() => updateFormData({
        selectedDate: new Date('2024-02-15'),
        selectedTime: '10:00',
        title: 'Consultation'
      })}>
        Fill Required
      </button>
      <button onClick={resetBookingFlow}>Reset</button>
    </div>
  )
}

describe('BookingFlowProvider', () => {
  it('should provide initial values', () => {
    render(
      <BookingFlowProvider>
        <TestComponent />
      </BookingFlowProvider>
    )

    expect(screen.getByTestId('current-step')).toHaveTextContent('1')
    expect(screen.getByTestId('consultation-type')).toHaveTextContent('initial')
    expect(screen.getByTestId('title')).toHaveTextContent('')
  })

  it('should allow changing current step', () => {
    render(
      <BookingFlowProvider>
        <TestComponent />
      </BookingFlowProvider>
    )

    const goToStep2Button = screen.getByText('Go to Step 2')

    act(() => {
      goToStep2Button.click()
    })

    expect(screen.getByTestId('current-step')).toHaveTextContent('2')
  })

  it('should allow updating form data', () => {
    render(
      <BookingFlowProvider>
        <TestComponent />
      </BookingFlowProvider>
    )

    const updateButton = screen.getByText('Update Title')

    act(() => {
      updateButton.click()
    })

    expect(screen.getByTestId('title')).toHaveTextContent('Updated Title')
  })

  it('should validate step progression - cannot proceed without required fields', () => {
    render(
      <BookingFlowProvider>
        <TestComponent />
      </BookingFlowProvider>
    )

    expect(screen.getByTestId('can-proceed-step-2')).toHaveTextContent('false')
    expect(screen.getByTestId('can-proceed-step-3')).toHaveTextContent('false')
  })

  it('should validate step progression - can proceed with required fields', () => {
    render(
      <BookingFlowProvider>
        <TestComponent />
      </BookingFlowProvider>
    )

    const fillRequiredButton = screen.getByText('Fill Required')

    act(() => {
      fillRequiredButton.click()
    })

    expect(screen.getByTestId('can-proceed-step-2')).toHaveTextContent('true')
    expect(screen.getByTestId('can-proceed-step-3')).toHaveTextContent('true')
  })

  it('should reset booking flow', () => {
    render(
      <BookingFlowProvider>
        <TestComponent />
      </BookingFlowProvider>
    )

    // First, update some data
    const updateButton = screen.getByText('Update Title')
    const goToStep2Button = screen.getByText('Go to Step 2')

    act(() => {
      updateButton.click()
      goToStep2Button.click()
    })

    expect(screen.getByTestId('current-step')).toHaveTextContent('2')
    expect(screen.getByTestId('title')).toHaveTextContent('Updated Title')

    // Now reset
    const resetButton = screen.getByText('Reset')

    act(() => {
      resetButton.click()
    })

    expect(screen.getByTestId('current-step')).toHaveTextContent('1')
    expect(screen.getByTestId('title')).toHaveTextContent('')
    expect(screen.getByTestId('consultation-type')).toHaveTextContent('initial')
  })

  it('should merge form data on update', () => {
    function MergeTestComponent() {
      const { formData, updateFormData } = useBookingFlow()

      return (
        <div>
          <div data-testid="title">{formData.title}</div>
          <div data-testid="description">{formData.description}</div>
          <button onClick={() => updateFormData({ title: 'Title 1' })}>
            Set Title
          </button>
          <button onClick={() => updateFormData({ description: 'Description 1' })}>
            Set Description
          </button>
        </div>
      )
    }

    render(
      <BookingFlowProvider>
        <MergeTestComponent />
      </BookingFlowProvider>
    )

    act(() => {
      screen.getByText('Set Title').click()
    })
    expect(screen.getByTestId('title')).toHaveTextContent('Title 1')
    expect(screen.getByTestId('description')).toHaveTextContent('')

    act(() => {
      screen.getByText('Set Description').click()
    })
    expect(screen.getByTestId('title')).toHaveTextContent('Title 1')
    expect(screen.getByTestId('description')).toHaveTextContent('Description 1')
  })

  it('should throw error when used outside provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useBookingFlow must be used within a BookingFlowProvider')

    consoleErrorSpy.mockRestore()
  })
})
