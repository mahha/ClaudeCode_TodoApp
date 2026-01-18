import { TodoItem } from "./TodoItem";
import { Tabs } from "./Tabs";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  activeTab: "incomplete" | "complete";
}

export function TodoList({ todos, activeTab }: TodoListProps) {
  const emptyMessage =
    activeTab === "incomplete"
      ? "未完了のタスクはありません"
      : "完了したタスクはありません";

  return (
    <div>
      <Tabs activeTab={activeTab} />

      {todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              description={todo.description}
              completed={todo.completed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
