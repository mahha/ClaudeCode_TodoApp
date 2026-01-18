import { expect, type Page } from '@playwright/test';

/**
 * Reset the database by calling the test API endpoint
 * This ensures each test starts with a clean state
 */
export async function resetDatabase(page: Page) {
  const response = await page.request.post('/api/test/reset');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.success).toBe(true);
}
