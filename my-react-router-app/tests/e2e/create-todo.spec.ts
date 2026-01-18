import { test, expect } from '@playwright/test';

test.describe('Create Todo Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the create page before each test
    await page.goto('/create');
  });

  test('should display the create form with all fields', async ({ page }) => {
    // Check heading
    await expect(page.locator('h1')).toHaveText('Create Task');

    // Check form fields
    await expect(page.getByLabel(/task name/i)).toBeVisible();
    await expect(page.getByLabel(/notes/i)).toBeVisible();

    // Check submit button
    await expect(page.getByRole('button', { name: /add/i })).toBeVisible();
  });

  test('should have required attribute on task name field', async ({ page }) => {
    const taskNameInput = page.getByLabel(/task name/i);
    await expect(taskNameInput).toHaveAttribute('required', '');
  });

  test('should show validation error when submitting empty task name', async ({ page }) => {
    // Leave task name empty and submit
    await page.getByRole('button', { name: /add/i }).click();

    // Browser's built-in validation should prevent submission
    // We check if we're still on the create page
    await expect(page).toHaveURL('/create');

    // The form should not be submitted (we stay on the same page)
    await expect(page.locator('h1')).toHaveText('Create Task');
  });

  test('should show validation error when submitting whitespace-only task name', async ({ page }) => {
    // Fill with only whitespace
    await page.getByLabel(/task name/i).fill('   ');
    await page.getByRole('button', { name: /add/i }).click();

    // Should stay on create page and show error
    await expect(page).toHaveURL('/create');

    // Look for error message
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/required/i);
  });

  test('should create todo with only task name (notes optional)', async ({ page }) => {
    const uniqueTaskName = `Task without notes ${Date.now()}`;

    // Fill only task name
    await page.getByLabel(/task name/i).fill(uniqueTaskName);

    // Submit form
    await page.getByRole('button', { name: /add/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify the new todo appears
    await expect(page.getByText(uniqueTaskName)).toBeVisible();
  });

  test('should create todo with task name and notes', async ({ page }) => {
    const uniqueTaskName = `Complete Task ${Date.now()}`;
    const notes = 'This task has both name and notes';

    // Fill both fields
    await page.getByLabel(/task name/i).fill(uniqueTaskName);
    await page.getByLabel(/notes/i).fill(notes);

    // Submit form
    await page.getByRole('button', { name: /add/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify both task name and notes are visible
    await expect(page.getByText(uniqueTaskName)).toBeVisible();
    await expect(page.getByText(notes)).toBeVisible();
  });

  test('should preserve form values when validation fails', async ({ page }) => {
    const taskName = '   '; // Whitespace only
    const notes = 'Some notes';

    // Fill form with invalid data
    await page.getByLabel(/task name/i).fill(taskName);
    await page.getByLabel(/notes/i).fill(notes);

    // Submit form
    await page.getByRole('button', { name: /add/i }).click();

    // Should stay on create page
    await expect(page).toHaveURL('/create');

    // Notes field should still have the value
    await expect(page.getByLabel(/notes/i)).toHaveValue(notes);
  });

  test('should have proper focus management', async ({ page }) => {
    // Task name input should be focusable
    const taskNameInput = page.getByLabel(/task name/i);
    await taskNameInput.focus();
    await expect(taskNameInput).toBeFocused();

    // Notes input should be focusable
    const notesInput = page.getByLabel(/notes/i);
    await notesInput.focus();
    await expect(notesInput).toBeFocused();

    // Submit button should be focusable
    const submitButton = page.getByRole('button', { name: /add/i });
    await submitButton.focus();
    await expect(submitButton).toBeFocused();
  });

  test('should handle form submission with Enter key', async ({ page }) => {
    const uniqueTaskName = `Task via Enter ${Date.now()}`;

    // Fill task name
    await page.getByLabel(/task name/i).fill(uniqueTaskName);

    // Press Enter to submit
    await page.getByLabel(/task name/i).press('Enter');

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify the new todo appears
    await expect(page.getByText(uniqueTaskName)).toBeVisible();
  });

  test('should trim whitespace from task name', async ({ page }) => {
    const taskName = '  Task with spaces  ';
    const trimmedName = 'Task with spaces';

    // Fill with extra whitespace
    await page.getByLabel(/task name/i).fill(taskName);
    await page.getByRole('button', { name: /add/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify trimmed version appears (not the version with extra spaces)
    await expect(page.getByText(trimmedName)).toBeVisible();
  });
});
