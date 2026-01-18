import { test, expect } from '@playwright/test';
import { resetDatabase } from './helpers';

test.describe('Todo Completion and Tabs', () => {
  test.beforeEach(async ({ page }) => {
    // Reset database to ensure clean state
    await resetDatabase(page);
  });

  test('should display incomplete and complete tabs', async ({ page }) => {
    await page.goto('/');

    // Check that both tabs are visible using exact match
    const incompleteTab = page.getByRole('link', { name: '未完了', exact: true });
    const completeTab = page.getByRole('link', { name: '完了', exact: true });

    await expect(incompleteTab).toBeVisible();
    await expect(completeTab).toBeVisible();
  });

  test('should show incomplete todos by default', async ({ page }) => {
    await page.goto('/');

    // URL should have ?tab=incomplete or no tab param (defaults to incomplete)
    const url = page.url();
    expect(url.includes('tab=incomplete') || !url.includes('tab=')).toBeTruthy();
  });

  test('should create todo and verify checkbox is clickable', async ({ page }) => {
    await page.goto('/');

    // Create a new todo
    await page.getByRole('link', { name: /add new task/i }).click();

    const timestamp = Date.now();
    const uniqueTaskName = `Completion Test Task ${timestamp}`;

    await page.getByLabel(/task name/i).fill(uniqueTaskName);
    await page.getByRole('button', { name: /add/i }).click();

    // Should be back on home page with incomplete tab active
    await expect(page).toHaveURL(/\//);
    await page.waitForLoadState('networkidle');

    // Verify the new todo appears in incomplete tab
    await expect(page.getByText(uniqueTaskName)).toBeVisible();

    // Find the checkbox for this todo and verify it's unchecked
    const todoItem = page.locator(`text=${uniqueTaskName}`).locator('..').locator('..');
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();

    // Verify checkbox is not readonly (interactive)
    await expect(checkbox).not.toHaveAttribute('readonly');
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/');

    // Switch to complete tab
    await page.getByRole('link', { name: '完了', exact: true }).click();
    await expect(page).toHaveURL('/?tab=complete');

    // Switch back to incomplete tab
    await page.getByRole('link', { name: '未完了', exact: true }).click();
    await expect(page).toHaveURL(/tab=incomplete|\/$/);
  });

  test('should show correct empty state messages', async ({ page }) => {
    // Start with clean database
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check incomplete tab empty state (should show if no incomplete todos)
    const incompleteEmpty = page.getByText('未完了のタスクはありません');
    const hasIncompleteTodos = await page.locator('input[type="checkbox"]').count() > 0;

    if (!hasIncompleteTodos) {
      await expect(incompleteEmpty).toBeVisible();
    }

    // Switch to complete tab
    await page.getByRole('link', { name: '完了', exact: true }).click();
    await expect(page).toHaveURL('/?tab=complete');
    await page.waitForLoadState('networkidle');

    // Check complete tab empty state (should show if no complete todos)
    const completeEmpty = page.getByText('完了したタスクはありません');
    const hasCompleteTodos = await page.locator('input[type="checkbox"]').count() > 0;

    if (!hasCompleteTodos) {
      await expect(completeEmpty).toBeVisible();
    }
  });

  test('should maintain tab state when navigating back and forth', async ({ page }) => {
    await page.goto('/');

    // Go to complete tab
    await page.getByRole('link', { name: '完了', exact: true }).click();
    await expect(page).toHaveURL('/?tab=complete');

    // Click the Add Task button
    await page.getByRole('link', { name: /add new task/i }).click();
    await expect(page).toHaveURL('/create');

    // Go back
    await page.goBack();

    // Should still be on complete tab
    await expect(page).toHaveURL('/?tab=complete');
  });

});
