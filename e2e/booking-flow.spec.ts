import { test, expect } from '@playwright/test';

test.describe('Complete Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full booking flow', async ({ page }) => {
    // Navigate to calendar page
    await page.click('text=Book Consultation');
    await expect(page).toHaveURL(/.*calendar/);

    // Select a date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const day = futureDate.getDate().toString();

    await page.click(`button:has-text("${day}")`);

    // Select a time slot
    await page.click('button:has-text("9:00 AM")');

    // Select consultation type
    await page.click('button:has-text("Initial Consultation")');

    // Verify booking summary is displayed
    await expect(page.locator('text=Booking Summary')).toBeVisible();

    // Verify selected date is displayed
    await expect(page.locator('text=Date')).toBeVisible();

    // Verify selected time is displayed
    await expect(page.locator('text=9:00 AM')).toBeVisible();
  });

  test('should show available time slots when date is selected', async ({ page }) => {
    await page.goto('/calendar');

    // Select today + 1 day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = tomorrow.getDate().toString();

    await page.click(`button:has-text("${day}")`);

    // Verify time slots are visible
    await expect(page.locator('text=Available Time Slots')).toBeVisible();
    await expect(page.locator('button:has-text("9:00 AM")')).toBeVisible();
  });

  test('should show consultation types when date and time are selected', async ({ page }) => {
    await page.goto('/calendar');

    // Select date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const day = futureDate.getDate().toString();
    await page.click(`button:has-text("${day}")`);

    // Select time
    await page.click('button:has-text("2:00 PM")');

    // Verify consultation types are visible
    await expect(page.locator('text=Select Service')).toBeVisible();
    await expect(page.locator('text=Initial Consultation')).toBeVisible();
    await expect(page.locator('text=Standard Consultation')).toBeVisible();
    await expect(page.locator('text=Premium Consultation')).toBeVisible();
  });

  test('should display DMV pricing in USD', async ({ page }) => {
    await page.goto('/calendar');

    // Select date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const day = futureDate.getDate().toString();
    await page.click(`button:has-text("${day}")`);

    // Select time
    await page.click('button:has-text("10:00 AM")');

    // Verify USD pricing
    await expect(page.locator('text=$299')).toBeVisible();
    await expect(page.locator('text=$449')).toBeVisible();
    await expect(page.locator('text=$649')).toBeVisible();
  });
});
