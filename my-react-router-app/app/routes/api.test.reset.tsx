import type { Route } from "./+types/api.test.reset";

/**
 * Test-only API endpoint to reset the database
 * Only available in development/test environments
 * Controlled by ENABLE_TEST_ENDPOINTS environment variable
 */
export async function action({ context }: Route.ActionArgs) {
  // Check both build-time and runtime environment variables for security
  // This prevents the endpoint from being exposed in production even if
  // a development build is accidentally deployed
  const isTestEnvEnabled = context.cloudflare.env.ENABLE_TEST_ENDPOINTS === 'true';
  const isProdBuild = import.meta.env.PROD;

  if (isProdBuild || !isTestEnvEnabled) {
    return new Response('Not found', { status: 404 });
  }

  const db = context.cloudflare.env.DB;

  try {
    // Delete all todos
    await db.prepare('DELETE FROM todos').run();

    return new Response(JSON.stringify({ success: true, message: 'Database reset' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to reset database:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to reset database' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
