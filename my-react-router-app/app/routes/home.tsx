import type { Route } from "./+types/home";
import { TodoList } from "../components/TodoList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ToDo App" },
    { name: "description", content: "Manage your tasks efficiently" },
  ];
}

// Mock data for initial implementation
const MOCK_TODOS = [
  {
    id: 1,
    title: "Grocery Shopping",
    description: "Buy vegetables and fruits",
    completed: false,
  },
  {
    id: 2,
    title: "Finish Report",
    description: "Due by EOD",
    completed: false,
  },
  {
    id: 3,
    title: "Call Plumber",
    description: "Fix kitchen sink",
    completed: false,
  },
  {
    id: 4,
    title: "Workout",
    description: "1hour of cardio",
    completed: false,
  },
  {
    id: 5,
    title: "Read Book",
    description: "Chapter 5 of 'Atomic Habits'",
    completed: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-center text-xl font-bold text-black mb-8">
          ToDo App
        </h1>

        {/* Todo List */}
        <TodoList todos={MOCK_TODOS} />

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
