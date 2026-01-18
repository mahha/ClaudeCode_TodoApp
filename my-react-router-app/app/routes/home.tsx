import type { Route } from "./+types/home";
import { useLoaderData, Link } from "react-router";
import { TodoList } from "../components/TodoList";
import { getTodosByStatus } from "../lib/db.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ToDo App" },
    { name: "description", content: "Manage your tasks efficiently" },
  ];
}

// Loader function to fetch todos from D1 database
export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "incomplete";
  const activeTab: "incomplete" | "complete" = tab === "complete" ? "complete" : "incomplete";
  const completed = activeTab === "complete";

  const todos = await getTodosByStatus(db, completed);
  return { todos, activeTab };
}

export default function Home() {
  const { todos, activeTab } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-center text-xl font-bold text-black mb-8">
          ToDo App
        </h1>

        {/* Todo List - Data from D1 database */}
        <TodoList todos={todos} activeTab={activeTab} />

        {/* Add Task Button */}
        <Link
          to="/create"
          className="fixed bottom-8 right-8 bg-[#2920af] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#221a8f] transition-colors font-medium"
          aria-label="Add new task"
        >
          + Add Task
        </Link>
      </div>
    </div>
  );
}
