# E2E Tests with Playwright

This directory contains end-to-end tests for the ToDo application using Playwright.

## Overview

The E2E tests focus on critical user paths:

1. **View Todos** - Display home page and list todos
2. **Create Todo** - Create new tasks with validation
3. **Navigation** - Navigate between pages

## Test Files

- `todos.spec.ts` - General CRUD operations and todo list display
- `create-todo.spec.ts` - Detailed tests for the create todo flow

## Running Tests

### Prerequisites

Make sure you have installed Playwright and its browser dependencies:

```bash
npm install -D @playwright/test
npx playwright install chromium
```

**Note**: In containerized environments (Docker, etc.), you may need to install system dependencies:

```bash
npx playwright install-deps chromium
```

### Run Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed
```

### Test Configuration

The Playwright configuration is in `playwright.config.ts` at the project root:

- Runs tests in Chromium by default
- Automatically starts the dev server before tests
- Base URL: `http://localhost:5173`
- Screenshots on failure
- Trace on first retry

## Test Coverage

### Critical Paths Covered

✅ **Home Page Display**
- Page loads with correct title
- Empty state message shown when no todos
- "Add Task" button is visible and functional

✅ **Navigation**
- Navigate from home to create page
- Redirect back to home after creating todo

✅ **Create Todo**
- Form displays correctly with all fields
- Required field validation
- Whitespace validation
- Successful todo creation with/without notes
- Form value preservation on errors
- Focus management
- Keyboard (Enter) submission
- Whitespace trimming

✅ **Todo Display**
- Newly created todos appear in the list
- Todo title and description are visible
- Empty state vs populated state

## Test Data Strategy

Tests use unique timestamps in task names to avoid conflicts:

```typescript
const uniqueTaskName = `Test Task ${Date.now()}`;
```

This approach:
- Prevents test interference
- Works in parallel execution
- No need for database cleanup between tests

## Best Practices

1. **Use Accessibility Selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Wait for Navigation**: Use `await expect(page).toHaveURL()` and `waitForLoadState('networkidle')`
3. **Unique Test Data**: Use timestamps to create unique test data
4. **Focus on Critical Paths**: Don't test every edge case, focus on user journeys
5. **Keep Tests Simple**: Avoid over-abstraction for this simple app

## Troubleshooting

### Browser Not Found

If you get errors about missing browsers:

```bash
npx playwright install chromium
```

### System Library Errors (Linux)

If you see errors like `libnspr4.so: cannot open shared object file`:

```bash
# Ubuntu/Debian
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2

# Or use Playwright's installer
npx playwright install-deps chromium
```

### Dev Server Issues

If tests fail to start the dev server:

- Make sure port 5173 is not in use
- Check that `npm run dev` works manually
- Increase `webServer.timeout` in `playwright.config.ts` if needed

## CI/CD Integration

The tests are configured for CI environments:

- `forbidOnly`: Prevents accidental `.only()` in CI
- `retries`: 2 retries on CI, 0 locally
- `workers`: Sequential execution on CI
- Screenshots and traces saved on failure

Add to your GitHub Actions workflow:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
```
