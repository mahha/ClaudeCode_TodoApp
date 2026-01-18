import type { Route } from "./+types/api.test.reset";

/**
 * Test-only API endpoint to reset the database
 * Only available in development/test environments
 */
export async function action({ context }: Route.ActionArgs) {
  // Only allow in non-production environments
  if (import.meta.env.PROD) {
    return new Response('Not available in production', { status: 403 });
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
