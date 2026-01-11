/**
 * Database type definitions for ToDo app
 */

// Todo model matching database schema
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: number; // SQLite stores boolean as INTEGER (0 or 1)
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}

// Todo with computed boolean field for easier use in UI
export interface TodoWithBoolean extends Omit<Todo, 'completed'> {
  completed: boolean;
}

// Input type for creating a new todo
export interface CreateTodoInput {
  title: string;
  description?: string;
}

// Input type for updating a todo
export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}
