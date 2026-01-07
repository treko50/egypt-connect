import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage, useTranslations } from '../LanguageProvider';

// Test component to access context
function TestComponent() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="translation">{t('navigation.home')}</div>
      <button onClick={() => setLocale('ar')}>Switch to Arabic</button>
      <button onClick={() => setLocale('en')}>Switch to English</button>
    </div>
  );
}

// Test component using useTranslations
function TestTranslationsComponent() {
  const { t, locale } = useTranslations('navigation');
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="scoped-translation">{t('home')}</div>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document attributes
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  describe('Initialization', () => {
    it('initializes with default locale (en)', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });
    });

    it('loads locale from localStorage if available', async () => {
      localStorage.setItem('locale', 'ar');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('ar');
      });
    });

    it('ignores invalid locale from localStorage', async () => {
      localStorage.setItem('locale', 'invalid');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });
    });
  });

  describe('Language Switching', () => {
    it('switches from English to Arabic', async () => {
      const user = userEvent.setup();

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });

      await act(async () => {
        await user.click(screen.getByText('Switch to Arabic'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('ar');
      });
    });

    it('switches from Arabic to English', async () => {
      const user = userEvent.setup();
      localStorage.setItem('locale', 'ar');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('ar');
      });

      await act(async () => {
        await user.click(screen.getByText('Switch to English'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });
    });

    it('persists locale to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Switch to Arabic'));
      });

      await waitFor(() => {
        expect(localStorage.getItem('locale')).toBe('ar');
      });
    });
  });

  describe('HTML Attributes', () => {
    it('sets HTML lang attribute to en by default', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
      });
    });

    it('sets HTML dir attribute to ltr for English', async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.dir).toBe('ltr');
      });
    });

    it('sets HTML lang attribute to ar when switching to Arabic', async () => {
      const user = userEvent.setup();

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Switch to Arabic'));
      });

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('ar');
      });
    });

    it('sets HTML dir attribute to rtl for Arabic', async () => {
      const user = userEvent.setup();

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      await act(async () => {
        await user.click(screen.getByText('Switch to Arabic'));
      });

      await waitFor(() => {
        expect(document.documentElement.dir).toBe('rtl');
      });
    });
  });

  describe('useTranslations Hook', () => {
    it('provides scoped translation function', async () => {
      render(
        <LanguageProvider>
          <TestTranslationsComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('scoped-translation')).toHaveTextContent('Home');
      });
    });

    it('returns locale', async () => {
      render(
        <LanguageProvider>
          <TestTranslationsComponent />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when useLanguage is used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLanguage must be used within a LanguageProvider');

      consoleError.mockRestore();
    });

    it('returns key when translation is not found', async () => {
      const TestMissingTranslation = () => {
        const { t } = useLanguage();
        return <div data-testid="missing">{t('nonexistent.key')}</div>;
      };

      render(
        <LanguageProvider>
          <TestMissingTranslation />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('missing')).toHaveTextContent('nonexistent.key');
      });
    });
  });
});
