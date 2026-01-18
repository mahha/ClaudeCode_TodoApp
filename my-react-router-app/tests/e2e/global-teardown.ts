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

  // Seed the database with initial data
  console.log('🌱 Seeding database with initial data...');
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
  }
}

export default globalTeardown;
