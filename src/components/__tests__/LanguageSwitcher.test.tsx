import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { LanguageProvider } from '../LanguageProvider';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders language switcher button', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays current language (English by default)', async () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  it('displays current language (Arabic if set in localStorage)', async () => {
    localStorage.setItem('locale', 'ar');

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });
  });

  it('opens dropdown menu when button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('switches to Arabic when Arabic option is clicked', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    // Open dropdown
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    // Click Arabic option
    const arabicOptions = screen.getAllByText('العربية');
    await act(async () => {
      await user.click(arabicOptions[arabicOptions.length - 1]); // Click the one in the dropdown
    });

    await waitFor(() => {
      expect(localStorage.getItem('locale')).toBe('ar');
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  it('switches to English when English option is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem('locale', 'ar');

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    // Open dropdown
    await act(async () => {
      await user.click(screen.getByRole('button'));
    });

    // Click English option
    const englishOptions = screen.getAllByText('English');
    await act(async () => {
      await user.click(englishOptions[englishOptions.length - 1]); // Click the one in the dropdown
    });

    await waitFor(() => {
      expect(localStorage.getItem('locale')).toBe('en');
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });
  });

  it('closes dropdown after selecting a language', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    // Open dropdown - get all buttons and click the first one (main button)
    const buttons = screen.getAllByRole('button');
    await act(async () => {
      await user.click(buttons[0]);
    });

    // Verify dropdown is open (two instances of العربية - one in button, one in dropdown)
    await waitFor(() => {
      expect(screen.getAllByText('العربية').length).toBeGreaterThan(1);
    });

    // Click Arabic option
    const arabicOptions = screen.getAllByText('العربية');
    await act(async () => {
      await user.click(arabicOptions[arabicOptions.length - 1]);
    });

    // Wait for dropdown to close
    await waitFor(() => {
      // After closing, only one instance should remain (in the button)
      expect(screen.getAllByText('العربية').length).toBe(1);
    });
  });

  it('highlights the currently selected language', async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    // Open dropdown - get all buttons and click the first one
    const buttons = screen.getAllByRole('button');
    await act(async () => {
      await user.click(buttons[0]);
    });

    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
    });

    // Find the English button in the dropdown
    const allButtons = screen.getAllByRole('button');
    const englishButton = allButtons.find(
      (btn) => btn.textContent === 'English' && btn.className.includes('bg-primary-50')
    );

    expect(englishButton).toBeDefined();
    expect(englishButton).toHaveClass('bg-primary-50');
    expect(englishButton).toHaveClass('text-primary-600');
  });
});
