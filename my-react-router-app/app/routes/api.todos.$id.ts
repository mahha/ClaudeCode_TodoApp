import { getTodoById, updateTodo, deleteTodo } from "../lib/db.server";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

/**
 * GET /api/todos/:id - Get a specific todo by ID
 */
export async function loader({ params, context }: LoaderFunctionArgs) {
  const db = context.cloudflare.env.DB;
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const todo = await getTodoById(db, id);

    if (!todo) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    return Response.json({ todo });
  } catch (error) {
    console.error("Failed to fetch todo:", error);
    return Response.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/todos/:id - Update a todo
 * DELETE /api/todos/:id - Delete a todo
 */
export async function action({ request, params, context }: ActionFunctionArgs) {
  const db = context.cloudflare.env.DB;
  const id = parseInt(params.id as string);

  if (isNaN(id)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  if (request.method === "PUT") {
    try {
      const body = (await request.json()) as Record<string, any>;

      // Validation
      if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim() === "")) {
        return Response.json({ error: "Invalid title" }, { status: 400 });
      }

      if (body.description !== undefined && body.description !== null && typeof body.description !== "string") {
        return Response.json({ error: "Invalid description" }, { status: 400 });
      }

      if (body.completed !== undefined && typeof body.completed !== "boolean") {
        return Response.json({ error: "Invalid completed status" }, { status: 400 });
      }

      const todo = await updateTodo(db, id, {
        title: body.title?.trim(),
        description: body.description?.trim(),
        completed: body.completed,
      });

      if (!todo) {
        return Response.json({ error: "Todo not found" }, { status: 404 });
      }

      return Response.json({ todo });
    } catch (error) {
      console.error("Failed to update todo:", error);
      return Response.json(
        { error: "Failed to update todo" },
        { status: 500 }
      );
    }
  }

  if (request.method === "DELETE") {
    try {
      const success = await deleteTodo(db, id);

      if (!success) {
        return Response.json({ error: "Todo not found" }, { status: 404 });
      }

      return Response.json({ success: true });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      return Response.json(
        { error: "Failed to delete todo" },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
