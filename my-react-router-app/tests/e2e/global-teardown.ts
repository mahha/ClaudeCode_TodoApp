// Note: This file runs in Node.js environment (not Cloudflare Workers)
// It's safe to use Node.js APIs like execSync here for test orchestration
import { chromium, type FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

/**
 * Global teardown function that runs after all tests
 * Resets the database and seeds it with initial data
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up database after tests...');

  // Get the base URL from config
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:5173';

  // Start a browser to call the reset API
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Reset the database
    const response = await page.request.post(`${baseURL}/api/test/reset`);
    if (!response.ok()) {
      console.error('❌ Failed to reset database:', response.status());
    } else {
      console.log('✅ Database reset successfully');
    }
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await browser.close();
  }

  // Seed the database with initial data (optional)
  console.log('🌱 Seeding database with initial data...');
  try {
    // Check if the seed script exists before running
    const packageJsonPath = new URL('../../package.json', import.meta.url);
    const packageJson = await import(packageJsonPath.href, {
      with: { type: 'json' }
    });

    if (packageJson.default.scripts?.['db:seed']) {
      execSync('npm run db:seed', { stdio: 'inherit' });
      console.log('✅ Database seeded successfully');
    } else {
      console.log('ℹ️  No db:seed script found, skipping seed');
    }
  } catch (error) {
    // Seeding is optional - tests don't depend on seed data
    console.log('ℹ️  Skipping database seed (not critical for tests):', (error as Error).message);
  }
}

export default globalTeardown;
