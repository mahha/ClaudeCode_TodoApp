import { test, expect } from '@playwright/test';

test.describe('Todo List', () => {
  test('should display the home page with title', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/ToDo App/);

    // Check main heading
    await expect(page.locator('h1')).toHaveText('ToDo App');
  });

  test('should show empty state message when no todos exist', async ({ page }) => {
    await page.goto('/');

    // Look for empty state message
    const emptyMessage = page.getByText(/No todos yet/i);

    // If there are existing todos, we skip this check
    const hasTodos = await page.locator('[class*="border-b"]').count() > 0;
    if (!hasTodos) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('should display "Add Task" button', async ({ page }) => {
    await page.goto('/');

    // Check for Add Task button with aria-label
    const addButton = page.getByRole('link', { name: /add new task/i });
    await expect(addButton).toBeVisible();
    await expect(addButton).toHaveText(/Add Task/);
  });

  test('should navigate to create page when clicking Add Task button', async ({ page }) => {
    await page.goto('/');

    // Click the Add Task button
    await page.getByRole('link', { name: /add new task/i }).click();

    // Verify navigation to create page
    await expect(page).toHaveURL('/create');
    await expect(page.locator('h1')).toHaveText('Create Task');
  });

  test('should display existing todos if any', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if there are any todo items (they have a checkbox)
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    // If there are todos, verify they have titles
    if (checkboxCount > 0) {
      const firstCheckbox = checkboxes.first();
      await expect(firstCheckbox).toBeVisible();

      // Verify todo items have proper structure
      const todoItems = page.locator('[class*="border-b"]');
      await expect(todoItems.first()).toBeVisible();
    }
  });

  test('should create a new todo and display it in the list', async ({ page }) => {
    await page.goto('/');

    // Navigate to create page
    await page.getByRole('link', { name: /add new task/i }).click();
    await expect(page).toHaveURL('/create');

    // Generate unique task name to avoid conflicts
    const uniqueTaskName = `Test Task ${Date.now()}`;
    const taskDescription = 'This is a test description';

    // Fill in the form
    await page.getByLabel(/task name/i).fill(uniqueTaskName);
    await page.getByLabel(/notes/i).fill(taskDescription);

    // Submit the form
    await page.getByRole('button', { name: /add/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Wait for the new todo to appear
    await page.waitForLoadState('networkidle');

    // Verify the new todo is displayed
    await expect(page.getByText(uniqueTaskName)).toBeVisible();
    await expect(page.getByText(taskDescription)).toBeVisible();
  });
});
