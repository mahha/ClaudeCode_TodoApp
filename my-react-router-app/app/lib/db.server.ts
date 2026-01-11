/**
 * Database helper functions for D1
 * Server-side only - do not import in client code
 */

import type { D1Database } from '@cloudflare/workers-types';
import type { Todo, TodoWithBoolean, CreateTodoInput, UpdateTodoInput } from './db.types';

/**
 * Convert Todo from DB (with integer completed) to UI-friendly format (with boolean completed)
 */
function todoToBoolean(todo: Todo): TodoWithBoolean {
  return {
    ...todo,
    completed: todo.completed === 1,
  };
}

/**
 * Get all todos
 */
export async function getAllTodos(db: D1Database): Promise<TodoWithBoolean[]> {
  const result = await db
    .prepare('SELECT * FROM todos ORDER BY created_at DESC')
    .all<Todo>();

  return result.results.map(todoToBoolean);
}

/**
 * Get a single todo by ID
 */
export async function getTodoById(db: D1Database, id: number): Promise<TodoWithBoolean | null> {
  const result = await db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .bind(id)
    .first<Todo>();

  return result ? todoToBoolean(result) : null;
}

/**
 * Create a new todo
 */
export async function createTodo(db: D1Database, input: CreateTodoInput): Promise<TodoWithBoolean> {
  const result = await db
    .prepare('INSERT INTO todos (title, description) VALUES (?, ?) RETURNING *')
    .bind(input.title, input.description ?? null)
    .first<Todo>();

  if (!result) {
    throw new Error('Failed to create todo');
  }

  return todoToBoolean(result);
}

/**
 * Update an existing todo
 */
export async function updateTodo(
  db: D1Database,
  id: number,
  input: UpdateTodoInput
): Promise<TodoWithBoolean | null> {
  // Build dynamic UPDATE query based on provided fields
  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (input.title !== undefined) {
    updates.push('title = ?');
    values.push(input.title);
  }

  if (input.description !== undefined) {
    updates.push('description = ?');
    values.push(input.description);
  }

  if (input.completed !== undefined) {
    updates.push('completed = ?');
    values.push(input.completed ? 1 : 0);
  }

  if (updates.length === 0) {
    // No updates provided, just return the existing todo
    return getTodoById(db, id);
  }

  // Always update the updated_at timestamp
  updates.push('updated_at = unixepoch()');
  values.push(id); // Add id as last parameter for WHERE clause

  const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ? RETURNING *`;

  const result = await db
    .prepare(query)
    .bind(...values)
    .first<Todo>();

  return result ? todoToBoolean(result) : null;
}

/**
 * Delete a todo
 */
export async function deleteTodo(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM todos WHERE id = ?')
    .bind(id)
    .run();

  return result.success && (result.meta.changes ?? 0) > 0;
}

/**
 * Toggle todo completed status
 */
export async function toggleTodoCompleted(db: D1Database, id: number): Promise<TodoWithBoolean | null> {
  const result = await db
    .prepare('UPDATE todos SET completed = NOT completed, updated_at = unixepoch() WHERE id = ? RETURNING *')
    .bind(id)
    .first<Todo>();

  return result ? todoToBoolean(result) : null;
}

/**
 * Get todos filtered by completion status
 */
export async function getTodosByStatus(db: D1Database, completed: boolean): Promise<TodoWithBoolean[]> {
  const result = await db
    .prepare('SELECT * FROM todos WHERE completed = ? ORDER BY created_at DESC')
    .bind(completed ? 1 : 0)
    .all<Todo>();

  return result.results.map(todoToBoolean);
}
