# Testing Setup Guide

This guide will help you set up and run the comprehensive testing suite for Egypt Connect.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Egypt Connect project cloned locally

---

## Installation

### 1. Install Testing Dependencies

Run the following command to install all required testing packages:

```bash
npm install --save-dev @testing-library/react@^14.1.2 @testing-library/jest-dom@^6.1.5 @testing-library/user-event@^14.5.1 jest@^29.7.0 jest-environment-jsdom@^29.7.0 ts-jest@^29.1.1 @playwright/test@^1.40.1 @types/jest@^29.5.11
```

Or if you prefer yarn:

```bash
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom ts-jest @playwright/test @types/jest
```

### 2. Install Playwright Browsers

After installing Playwright, you need to install the browser binaries:

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers for E2E testing.

---

## Configuration Files

The following configuration files have been created:

- `jest.config.ts` - Jest configuration for unit and integration tests
- `jest.setup.ts` - Test environment setup and mocks
- `playwright.config.ts` - Playwright configuration for E2E tests
- `src/test-utils.tsx` - Custom render utilities for React components

---

## Running Tests

### Unit and Integration Tests (Jest)

#### Run all tests
```bash
npm test
```

#### Run tests in watch mode
```bash
npm test -- --watch
```

#### Run tests with coverage
```bash
npm test -- --coverage
```

#### Run specific test file
```bash
npm test button.test.tsx
```

#### Run tests matching a pattern
```bash
npm test -- --testNamePattern="Button"
```

### End-to-End Tests (Playwright)

#### Run all E2E tests
```bash
npx playwright test
```

#### Run E2E tests in headed mode (see browser)
```bash
npx playwright test --headed
```

#### Run E2E tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

#### Run specific test file
```bash
npx playwright test e2e/booking-flow.spec.ts
```

#### Debug E2E tests
```bash
npx playwright test --debug
```

#### View test report
```bash
npx playwright show-report
```

---

## Package.json Scripts

Add these scripts to your `package.json` for convenience:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

After adding these scripts, you can run:
- `npm test` - Unit/integration tests
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - With coverage report
- `npm run test:e2e` - E2E tests
- `npm run test:all` - All tests

---

## Coverage Thresholds

The project is configured with the following coverage thresholds:

```typescript
{
  lines: 80,      // 80% of lines must be covered
  functions: 80,  // 80% of functions must be covered
  branches: 75,   // 75% of branches must be covered
  statements: 80  // 80% of statements must be covered
}
```

Tests will fail if coverage falls below these thresholds when running with `--coverage`.

---

## Test Structure

### Unit Tests
Located in: `src/**/__tests__/*.test.tsx` or `src/**/*.test.tsx`

Example structure:
```typescript
import { render, screen } from '@/test-utils';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
```

### E2E Tests
Located in: `e2e/*.spec.ts`

Example structure:
```typescript
import { test, expect } from '@playwright/test';

test('should complete action', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page.locator('text')).toBeVisible();
});
```

---

## Writing New Tests

### Unit Test Template

Create a new file: `src/components/YourComponent.test.tsx`

```typescript
import { render, screen, fireEvent } from '@/test-utils';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('should render with default props', () => {
    render(<YourComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<YourComponent onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display correct text', () => {
    render(<YourComponent text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Template

Create a new file: `e2e/your-feature.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should perform action', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('should validate form', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Debugging Tests

### Jest Debugging

1. Add `debugger` statement in your test
2. Run with Node inspector:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```
3. Open `chrome://inspect` in Chrome
4. Click "inspect" on your test

### Playwright Debugging

1. Use `await page.pause()` to pause execution
2. Run with `--debug` flag:
```bash
npx playwright test --debug
```
3. Use Playwright Inspector to step through tests

---

## Best Practices

### Unit Testing
- Test one thing at a time
- Use descriptive test names
- Arrange-Act-Assert pattern
- Mock external dependencies
- Avoid testing implementation details

### E2E Testing
- Test critical user flows
- Use data-testid for stable selectors
- Wait for elements properly
- Clean up test data
- Run tests in isolation

### General
- Write tests as you code
- Aim for high coverage but focus on critical paths
- Keep tests fast and deterministic
- Review test failures before fixing
- Update tests when requirements change

---

## Common Issues

### Issue: Tests timeout
**Solution**: Increase timeout in configuration or use `jest.setTimeout(10000)` in specific tests

### Issue: Element not found in E2E tests
**Solution**: Use proper waiting strategies like `waitForSelector` or `waitForLoadState`

### Issue: Module not found errors
**Solution**: Check `moduleNameMapper` in jest.config.ts and tsconfig.json paths

### Issue: Playwright browsers not installed
**Solution**: Run `npx playwright install`

---

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

---

## Support

For testing-related questions:
1. Check this guide first
2. Review example tests in the codebase
3. Consult official documentation
4. Open an issue in the repository

---

**Last Updated**: December 21, 2024
