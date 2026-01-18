import { toggleTodoCompleted } from "../lib/db.server";
import type { ActionFunctionArgs } from "react-router";

/**
 * PATCH /api/todos/:id/toggle - Toggle todo completed status
 */
export async function action({ request, params, context }: ActionFunctionArgs) {
  const db = context.cloudflare.env.DB;
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (request.method === "PATCH") {
    try {
      const todo = await toggleTodoCompleted(db, id);

      if (!todo) {
        return Response.json({ error: "Todo not found" }, { status: 404 });
      }

      return Response.json({ todo });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      return Response.json(
        { error: "Failed to toggle todo" },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
