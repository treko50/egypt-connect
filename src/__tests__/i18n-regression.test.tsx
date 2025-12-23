/**
 * Regression Test Suite for i18n Implementation
 *
 * This suite ensures that the client-side i18n implementation works correctly
 * and prevents regressions in language switching, translations, and RTL support.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage, useTranslations } from '../components/LanguageProvider';

describe('i18n Regression Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });

  describe('Critical Path: Language Persistence', () => {
    it('REGRESSION: Language selection persists across page reloads', async () => {
      const TestApp = () => {
        const { locale, setLocale } = useLanguage();
        return (
          <div>
            <div data-testid="locale">{locale}</div>
            <button onClick={() => setLocale('ar')}>Switch</button>
          </div>
        );
      };

      const { unmount } = render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      // Switch to Arabic
      await act(async () => {
        await userEvent.setup().click(screen.getByText('Switch'));
      });

      await waitFor(() => {
        expect(localStorage.getItem('locale')).toBe('ar');
      });

      // Unmount and remount (simulating page reload)
      unmount();

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      // Verify Arabic is still selected
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('ar');
      });
    });
  });

  describe('Critical Path: RTL Support', () => {
    it('REGRESSION: Document direction changes to RTL for Arabic', async () => {
      const TestApp = () => {
        const { setLocale } = useLanguage();
        return <button onClick={() => setLocale('ar')}>Switch to Arabic</button>;
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await act(async () => {
        await userEvent.setup().click(screen.getByText('Switch to Arabic'));
      });

      await waitFor(() => {
        expect(document.documentElement.dir).toBe('rtl');
        expect(document.documentElement.lang).toBe('ar');
      });
    });

    it('REGRESSION: Document direction changes back to LTR for English', async () => {
      localStorage.setItem('locale', 'ar');

      const TestApp = () => {
        const { setLocale } = useLanguage();
        return <button onClick={() => setLocale('en')}>Switch to English</button>;
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await act(async () => {
        await userEvent.setup().click(screen.getByText('Switch to English'));
      });

      await waitFor(() => {
        expect(document.documentElement.dir).toBe('ltr');
        expect(document.documentElement.lang).toBe('en');
      });
    });
  });

  describe('Critical Path: Translation Loading', () => {
    it('REGRESSION: Translations load correctly for English', async () => {
      const TestApp = () => {
        const { t } = useLanguage();
        return (
          <div>
            <div data-testid="nav-home">{t('navigation.home')}</div>
            <div data-testid="nav-calendar">{t('navigation.calendar')}</div>
            <div data-testid="nav-profile">{t('navigation.profile')}</div>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('nav-home')).toHaveTextContent('Home');
        expect(screen.getByTestId('nav-calendar')).toHaveTextContent('Calendar');
        expect(screen.getByTestId('nav-profile')).toHaveTextContent('Profile');
      });
    });

    it('REGRESSION: Translations load correctly for Arabic', async () => {
      localStorage.setItem('locale', 'ar');

      const TestApp = () => {
        const { t } = useLanguage();
        return (
          <div>
            <div data-testid="nav-home">{t('navigation.home')}</div>
            <div data-testid="nav-calendar">{t('navigation.calendar')}</div>
            <div data-testid="nav-profile">{t('navigation.profile')}</div>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('nav-home')).toHaveTextContent('الرئيسية');
        expect(screen.getByTestId('nav-calendar')).toHaveTextContent('التقويم');
        expect(screen.getByTestId('nav-profile')).toHaveTextContent('الملف الشخصي');
      });
    });

    it('REGRESSION: Translations update when language changes', async () => {
      const user = userEvent.setup();

      const TestApp = () => {
        const { t, setLocale } = useLanguage();
        return (
          <div>
            <div data-testid="nav-home">{t('navigation.home')}</div>
            <button onClick={() => setLocale('ar')}>Switch to Arabic</button>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      // Verify English first
      await waitFor(() => {
        expect(screen.getByTestId('nav-home')).toHaveTextContent('Home');
      });

      // Switch to Arabic
      await act(async () => {
        await user.click(screen.getByText('Switch to Arabic'));
      });

      // Verify Arabic translation loaded
      await waitFor(() => {
        expect(screen.getByTestId('nav-home')).toHaveTextContent('الرئيسية');
      });
    });
  });

  describe('Critical Path: Nested Translations', () => {
    it('REGRESSION: Nested translation keys work correctly', async () => {
      const TestApp = () => {
        const { t } = useLanguage();
        return (
          <div>
            <div data-testid="home-title">{t('home.title')}</div>
            <div data-testid="home-features-title">{t('home.features.title')}</div>
            <div data-testid="calendar-title">{t('calendar.title')}</div>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('home-title')).toHaveTextContent('Schedule Your Legal Consultation');
        expect(screen.getByTestId('home-features-title')).toHaveTextContent('Why Choose Our Platform');
        expect(screen.getByTestId('calendar-title')).toHaveTextContent('Calendar');
      });
    });

    it('REGRESSION: Deeply nested translations work correctly', async () => {
      const TestApp = () => {
        const { t } = useLanguage();
        return (
          <div data-testid="deep">
            {t('home.features.scheduling.description')}
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('deep')).toHaveTextContent(
          'AI-powered calendar management that adapts to your needs and preferences.'
        );
      });
    });
  });

  describe('Critical Path: useTranslations Hook with Namespace', () => {
    it('REGRESSION: Scoped translations work correctly', async () => {
      const TestApp = () => {
        const { t } = useTranslations('navigation');
        return (
          <div>
            <div data-testid="home">{t('home')}</div>
            <div data-testid="calendar">{t('calendar')}</div>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('home')).toHaveTextContent('Home');
        expect(screen.getByTestId('calendar')).toHaveTextContent('Calendar');
      });
    });
  });

  describe('Critical Path: Error Handling', () => {
    it('REGRESSION: Missing translation keys return the key itself', async () => {
      const TestApp = () => {
        const { t } = useLanguage();
        return <div data-testid="missing">{t('nonexistent.translation.key')}</div>;
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('missing')).toHaveTextContent('nonexistent.translation.key');
      });
    });

    it('REGRESSION: Invalid locale values are ignored', async () => {
      // @ts-expect-error - Testing invalid input
      localStorage.setItem('locale', 'invalid-locale');

      const TestApp = () => {
        const { locale } = useLanguage();
        return <div data-testid="locale">{locale}</div>;
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      await waitFor(() => {
        // Should fall back to default 'en'
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });
    });
  });

  describe('Critical Path: Multiple Language Switches', () => {
    it('REGRESSION: Handles rapid language switching correctly', async () => {
      const user = userEvent.setup();

      const TestApp = () => {
        const { locale, setLocale, t } = useLanguage();
        return (
          <div>
            <div data-testid="locale">{locale}</div>
            <div data-testid="translation">{t('navigation.home')}</div>
            <button onClick={() => setLocale('ar')}>Arabic</button>
            <button onClick={() => setLocale('en')}>English</button>
          </div>
        );
      };

      render(
        <LanguageProvider>
          <TestApp />
        </LanguageProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
      });

      // Switch to Arabic
      await act(async () => {
        await user.click(screen.getByText('Arabic'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('ar');
        expect(screen.getByTestId('translation')).toHaveTextContent('الرئيسية');
      });

      // Switch back to English
      await act(async () => {
        await user.click(screen.getByText('English'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('en');
        expect(screen.getByTestId('translation')).toHaveTextContent('Home');
      });

      // Switch to Arabic again
      await act(async () => {
        await user.click(screen.getByText('Arabic'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('locale')).toHaveTextContent('ar');
        expect(screen.getByTestId('translation')).toHaveTextContent('الرئيسية');
      });
    });
  });
});
