import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import { TodoList } from "../components/TodoList";
import { getAllTodos } from "../lib/db.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ToDo App" },
    { name: "description", content: "Manage your tasks efficiently" },
  ];
}

// Loader function to fetch todos from D1 database
export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const todos = await getAllTodos(db);
  return { todos };
}

export default function Home() {
  const { todos } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-center text-xl font-bold text-black mb-8">
          ToDo App
        </h1>

        {/* Todo List - Data from D1 database */}
        <TodoList todos={todos} />

        {/* Add Task Button */}
        <button
          className="fixed bottom-8 right-8 bg-[#2920af] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#221a8f] transition-colors font-medium"
          aria-label="Add new task"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
}
