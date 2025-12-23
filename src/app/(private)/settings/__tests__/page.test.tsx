import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useUser } from '@clerk/nextjs'
import SettingsPage from '../page'

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  UserButton: () => <div data-testid="user-button">User Button</div>,
}))

// Mock components
jest.mock('@/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

jest.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}))

jest.mock('@/components/DocumentUpload', () => ({
  DocumentUpload: ({ onUpload, onDelete, onDownload }: any) => (
    <div data-testid="document-upload">
      <button data-testid="upload-file" onClick={() => onUpload([new File(['test'], 'test.pdf')])}>
        Upload
      </button>
      <button data-testid="delete-file" onClick={() => onDelete('file123')}>
        Delete
      </button>
      <button data-testid="download-file" onClick={() => onDownload('file123')}>
        Download
      </button>
    </div>
  ),
}))

describe('SettingsPage', () => {
  const mockUser = {
    id: 'user_123',
    firstName: 'John',
    lastName: 'Doe',
    emailAddresses: [
      {
        emailAddress: 'john@example.com',
        verification: { status: 'verified' },
      },
    ],
    phoneNumbers: [],
    imageUrl: 'https://example.com/avatar.jpg',
    unsafeMetadata: {
      lastName: 'Doe',
      location: 'New York',
      phone: '+1234567890',
    },
    createdAt: new Date('2024-01-01'),
    update: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner when user is not loaded', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: false,
        user: null,
      })

      render(<SettingsPage />)

      expect(screen.getByText(/Loading your settings/i)).toBeInTheDocument()
    })
  })

  describe('Profile Display', () => {
    it('should display user information correctly', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('New York')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument()
    })

    it('should show user avatar if imageUrl is present', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      const avatar = screen.getByAltText('John Doe')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('should show initials if no imageUrl', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: { ...mockUser, imageUrl: null },
      })

      render(<SettingsPage />)

      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should display verification status correctly', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      // Switch to account tab
      fireEvent.click(screen.getByText('Account'))

      expect(screen.getByText('Verified')).toBeInTheDocument()
    })
  })

  describe('Profile Editing', () => {
    it('should enable editing when Edit Profile is clicked', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      const firstNameInput = screen.getByLabelText(/First Name/i)
      expect(firstNameInput).toBeDisabled()

      fireEvent.click(screen.getByText('Edit Profile'))

      expect(firstNameInput).not.toBeDisabled()
    })

    it('should cancel editing when Cancel is clicked', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))
      fireEvent.click(screen.getByText('Cancel'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      expect(firstNameInput).toBeDisabled()
    })

    it('should validate that first name is required', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      // Mock window.alert
      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: '' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      expect(alertMock).toHaveBeenCalledWith('First name is required.')
      expect(mockUser.update).not.toHaveBeenCalled()

      alertMock.mockRestore()
    })
  })

  describe('Profile Updates', () => {
    it('should successfully update user profile', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)
      const locationInput = screen.getByLabelText(/Location/i)

      fireEvent.change(firstNameInput, { target: { value: 'Jane' } })
      fireEvent.change(lastNameInput, { target: { value: 'Smith' } })
      fireEvent.change(locationInput, { target: { value: 'San Francisco' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(mockUser.update).toHaveBeenCalledWith({
          firstName: 'Jane',
          unsafeMetadata: {
            lastName: 'Doe',
            location: 'New York',
            phone: '+1234567890',
            lastName: 'Smith',
            location: 'San Francisco',
            phone: '+1234567890',
          },
        })
      })

      expect(alertMock).toHaveBeenCalledWith('Profile updated successfully!')

      alertMock.mockRestore()
    })

    it('should handle update errors gracefully', async () => {
      const errorMessage = 'Network error'
      mockUser.update.mockRejectedValueOnce(new Error(errorMessage))

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          expect.stringContaining('Failed to update profile')
        )
      })

      expect(consoleErrorMock).toHaveBeenCalled()

      alertMock.mockRestore()
      consoleErrorMock.mockRestore()
    })

    it('should handle Clerk API errors with detailed messages', async () => {
      const clerkError = {
        message: 'Validation failed',
        errors: [
          { message: 'First name is too long' },
          { message: 'Invalid phone format' },
        ],
      }
      mockUser.update.mockRejectedValueOnce(clerkError)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'J'.repeat(300) } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          'Failed to update profile. First name is too long, Invalid phone format'
        )
      })

      alertMock.mockRestore()
      consoleErrorMock.mockRestore()
    })
  })

  describe('Tab Navigation', () => {
    it('should switch between tabs correctly', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      // Default tab should be profile
      expect(screen.getByText('Profile Information')).toBeInTheDocument()

      // Switch to notifications
      fireEvent.click(screen.getByText('Notifications'))
      expect(screen.getByText('Notification Preferences')).toBeInTheDocument()

      // Switch to account
      fireEvent.click(screen.getByText('Account'))
      expect(screen.getByText('Account Settings')).toBeInTheDocument()

      // Switch to documents
      fireEvent.click(screen.getByText('Documents'))
      expect(screen.getByTestId('document-upload')).toBeInTheDocument()

      // Switch to billing
      fireEvent.click(screen.getByText('Billing'))
      expect(screen.getByText('Billing & Payments')).toBeInTheDocument()
    })
  })

  describe('Email Field', () => {
    it('should disable email editing with helper text', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const emailInput = screen.getByLabelText(/Email Address/i)
      expect(emailInput).toBeDisabled()
      expect(
        screen.getByText(/Email changes must be done through your account settings/i)
      ).toBeInTheDocument()
    })
  })

  describe('Metadata Handling', () => {
    it('should handle missing metadata gracefully', () => {
      const userWithoutMetadata = {
        ...mockUser,
        unsafeMetadata: {},
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithoutMetadata,
      })

      render(<SettingsPage />)

      // Should not crash and should display empty values
      expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    })

    it('should preserve existing metadata when updating', async () => {
      const existingMetadata = {
        customField: 'custom value',
        anotherField: 123,
      }

      const userWithMetadata = {
        ...mockUser,
        unsafeMetadata: {
          ...existingMetadata,
          lastName: 'Doe',
          location: 'NYC',
        },
      }

      userWithMetadata.update = jest.fn().mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithMetadata,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(userWithMetadata.update).toHaveBeenCalledWith(
          expect.objectContaining({
            unsafeMetadata: expect.objectContaining({
              customField: 'custom value',
              anotherField: 123,
            }),
          })
        )
      })

      alertMock.mockRestore()
    })

    it('should update phone and location in metadata', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const phoneInput = screen.getByLabelText(/Phone Number/i)
      const locationInput = screen.getByLabelText(/Location/i)

      fireEvent.change(phoneInput, { target: { value: '+9876543210' } })
      fireEvent.change(locationInput, { target: { value: 'Los Angeles' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(mockUser.update).toHaveBeenCalledWith(
          expect.objectContaining({
            unsafeMetadata: expect.objectContaining({
              phone: '+9876543210',
              location: 'Los Angeles',
            }),
          })
        )
      })

      alertMock.mockRestore()
    })

    it('should handle empty location and phone', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const phoneInput = screen.getByLabelText(/Phone Number/i)
      const locationInput = screen.getByLabelText(/Location/i)

      fireEvent.change(phoneInput, { target: { value: '' } })
      fireEvent.change(locationInput, { target: { value: '' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(mockUser.update).toHaveBeenCalledWith(
          expect.objectContaining({
            unsafeMetadata: expect.objectContaining({
              phone: '',
              location: '',
            }),
          })
        )
      })

      alertMock.mockRestore()
    })
  })

  describe('Notifications Tab', () => {
    beforeEach(() => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })
    })

    it('should display notification preferences', () => {
      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Notifications'))

      expect(screen.getByText('Email Notifications')).toBeInTheDocument()
      expect(screen.getByText('SMS Notifications')).toBeInTheDocument()
    })

    it('should toggle email notification preferences', () => {
      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Notifications'))

      const checkboxes = screen.getAllByRole('checkbox')
      const emailCheckboxes = checkboxes.filter((_, idx) => idx < 3) // First 3 are email

      emailCheckboxes.forEach((checkbox) => {
        const initialState = (checkbox as HTMLInputElement).checked
        fireEvent.click(checkbox)
        expect((checkbox as HTMLInputElement).checked).toBe(!initialState)
      })
    })

    it('should toggle SMS notification preferences', () => {
      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Notifications'))

      const checkboxes = screen.getAllByRole('checkbox')
      const smsCheckboxes = checkboxes.filter((_, idx) => idx >= 3) // Last 2 are SMS

      smsCheckboxes.forEach((checkbox) => {
        const initialState = (checkbox as HTMLInputElement).checked
        fireEvent.click(checkbox)
        expect((checkbox as HTMLInputElement).checked).toBe(!initialState)
      })
    })

    it('should have save preferences button', () => {
      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Notifications'))

      expect(screen.getByText(/Save Preferences/i)).toBeInTheDocument()
    })
  })

  describe('Documents Tab', () => {
    it('should display document upload component', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Documents'))

      expect(screen.getByTestId('document-upload')).toBeInTheDocument()
    })
  })

  describe('Billing Tab', () => {
    it('should display billing section', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Billing'))

      expect(screen.getByText('Billing & Payments')).toBeInTheDocument()
      expect(screen.getByText('Payment Methods')).toBeInTheDocument()
      expect(screen.getByText('Billing History')).toBeInTheDocument()
    })

    it('should show no billing history message', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Billing'))

      expect(screen.getByText('No billing history yet')).toBeInTheDocument()
    })

    it('should display add payment method button', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Billing'))

      expect(screen.getByText('Add Payment Method')).toBeInTheDocument()
    })
  })

  describe('Account Tab', () => {
    it('should display security options', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Account'))

      expect(screen.getByText('Change Password')).toBeInTheDocument()
      expect(screen.getByText('Enable Two-Factor Authentication')).toBeInTheDocument()
      expect(screen.getByText('Delete Account')).toBeInTheDocument()
    })

    it('should show unverified status for unverified email', () => {
      const unverifiedUser = {
        ...mockUser,
        emailAddresses: [
          {
            emailAddress: 'john@example.com',
            verification: { status: 'unverified' },
          },
        ],
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: unverifiedUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Account'))

      expect(screen.getByText('Unverified')).toBeInTheDocument()
    })
  })

  describe('Profile Picture', () => {
    it('should show photo change instruction when editing', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      expect(screen.getByText(/To change your photo/i)).toBeInTheDocument()
      expect(screen.getByText(/use the profile button/i)).toBeInTheDocument()
    })

    it('should not show photo instruction when not editing', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      expect(screen.queryByText(/To change your photo/i)).not.toBeInTheDocument()
    })
  })

  describe('Field Trimming', () => {
    it('should trim whitespace from first name', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: '  Jane  ' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(mockUser.update).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Jane',
          })
        )
      })

      alertMock.mockRestore()
    })

    it('should trim whitespace from last name', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const lastNameInput = screen.getByLabelText(/Last Name/i)
      fireEvent.change(lastNameInput, { target: { value: '  Smith  ' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(mockUser.update).toHaveBeenCalledWith(
          expect.objectContaining({
            unsafeMetadata: expect.objectContaining({
              lastName: 'Smith',
            }),
          })
        )
      })

      alertMock.mockRestore()
    })
  })

  describe('Console Logging', () => {
    it('should log update data to console', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      const alertMock = jest.spyOn(window, 'alert').mockImplementation()

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const firstNameInput = screen.getByLabelText(/First Name/i)
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Updating user with data:',
          expect.objectContaining({
            firstName: 'Jane',
          })
        )
      })

      consoleSpy.mockRestore()
      alertMock.mockRestore()
    })
  })

  describe('User Not Loaded', () => {
    it('should handle null user gracefully', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: null,
      })

      render(<SettingsPage />)

      // Page should render even with null user
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should display N/A for missing createdAt', () => {
      const userWithoutCreatedAt = {
        ...mockUser,
        createdAt: undefined,
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithoutCreatedAt,
      })

      render(<SettingsPage />)

      // Navigate to account tab
      const accountTab = screen.getByRole('button', { name: /Account/i })
      fireEvent.click(accountTab)

      expect(screen.getByText(/Member since N\/A/i)).toBeInTheDocument()
    })

    it('should handle user with empty firstName', () => {
      const userWithEmptyName = {
        ...mockUser,
        firstName: '',
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithEmptyName,
      })

      render(<SettingsPage />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should handle user with null lastName', () => {
      const userWithNullLastName = {
        ...mockUser,
        lastName: null,
        unsafeMetadata: {},
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithNullLastName,
      })

      render(<SettingsPage />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should handle user with empty email address array', () => {
      const userWithNoEmail = {
        ...mockUser,
        emailAddresses: [],
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithNoEmail,
      })

      render(<SettingsPage />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should handle user with no phone numbers', () => {
      const userWithNoPhone = {
        ...mockUser,
        phoneNumbers: [],
        unsafeMetadata: {},
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithNoPhone,
      })

      render(<SettingsPage />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should handle saving with null/undefined lastName', async () => {
      mockUser.update.mockResolvedValueOnce(undefined)

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      fireEvent.click(screen.getByText('Edit Profile'))

      const lastNameInput = screen.getByLabelText(/Last Name/i)
      fireEvent.change(lastNameInput, { target: { value: '' } })

      fireEvent.click(screen.getByText(/Save Changes/i))

      await waitFor(() => {
        expect(mockUser.update).toHaveBeenCalledWith(
          expect.objectContaining({
            unsafeMetadata: expect.objectContaining({
              lastName: '',
            }),
          })
        )
      })
    })

    it('should handle user with no unsafeMetadata', () => {
      const userWithoutMetadata = {
        ...mockUser,
        unsafeMetadata: undefined,
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithoutMetadata,
      })

      render(<SettingsPage />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should handle user with null firstName', () => {
      const userWithNullFirstName = {
        ...mockUser,
        firstName: null,
      }

      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: userWithNullFirstName,
      })

      render(<SettingsPage />)

      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  describe('Timezone and Language Fields', () => {
    it('should display timezone as disabled', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      const timezoneInput = screen.getByLabelText(/Timezone/i)
      expect(timezoneInput).toBeDisabled()
      expect(timezoneInput).toHaveClass('bg-gray-50')
    })

    it('should display language as disabled', () => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })

      render(<SettingsPage />)

      const languageInput = screen.getByLabelText(/Language/i)
      expect(languageInput).toBeDisabled()
      expect(languageInput).toHaveClass('bg-gray-50')
    })
  })

  describe('File Operations', () => {
    beforeEach(() => {
      ;(useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      })
      jest.spyOn(console, 'log').mockImplementation()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should handle file upload', async () => {
      render(<SettingsPage />)

      // Navigate to documents tab
      const documentsTab = screen.getByRole('button', { name: /Documents/i })
      fireEvent.click(documentsTab)

      await waitFor(() => {
        const uploadButton = screen.getByTestId('upload-file')
        expect(uploadButton).toBeInTheDocument()
      })

      const uploadButton = screen.getByTestId('upload-file')
      fireEvent.click(uploadButton)

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith('Uploading files:', expect.any(Array))
      })
    })

    it('should handle file deletion', async () => {
      render(<SettingsPage />)

      // Navigate to documents tab
      const documentsTab = screen.getByRole('button', { name: /Documents/i })
      fireEvent.click(documentsTab)

      await waitFor(() => {
        const deleteButton = screen.getByTestId('delete-file')
        expect(deleteButton).toBeInTheDocument()
      })

      const deleteButton = screen.getByTestId('delete-file')
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith('Deleting file:', 'file123')
      })
    })

    it('should handle file download', async () => {
      render(<SettingsPage />)

      // Navigate to documents tab
      const documentsTab = screen.getByRole('button', { name: /Documents/i })
      fireEvent.click(documentsTab)

      await waitFor(() => {
        const downloadButton = screen.getByTestId('download-file')
        expect(downloadButton).toBeInTheDocument()
      })

      const downloadButton = screen.getByTestId('download-file')
      fireEvent.click(downloadButton)

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith('Downloading file:', 'file123')
      })
    })
  })
})
