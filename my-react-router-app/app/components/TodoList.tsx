import { TodoItem } from "./TodoItem";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No todos yet. Add one to get started!
      </div>
    );
  }

  return (
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
  );
}
