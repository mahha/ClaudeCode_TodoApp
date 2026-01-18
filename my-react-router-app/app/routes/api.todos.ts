import { getAllTodos, createTodo } from "../lib/db.server";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

/**
 * GET /api/todos - Get all todos
 */
export async function loader({ context }: LoaderFunctionArgs) {
  const db = context.cloudflare.env.DB;
  const todos = await getAllTodos(db);
  return Response.json({ todos });
}

/**
 * POST /api/todos - Create a new todo
 */
export async function action({ request, context }: ActionFunctionArgs) {
  const db = context.cloudflare.env.DB;

  if (request.method === "POST") {
    const body = (await request.json()) as Record<string, any>;

    // Validation
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    if (body.description && typeof body.description !== "string") {
      return Response.json({ error: "Invalid description" }, { status: 400 });
    }

    const todo = await createTodo(db, {
      title: body.title.trim(),
      description: body.description?.trim(),
    });

    return Response.json({ todo }, { status: 201 });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
