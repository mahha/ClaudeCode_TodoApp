-- Migration: Seed data for ToDo app
-- Created: 2026-01-18
-- Purpose: Insert initial mock data into todos table

-- Insert the same data as MOCK_TODOS from home.tsx
INSERT INTO todos (title, description, completed) VALUES
  ('Grocery Shopping', 'Buy vegetables and fruits', 0),
  ('Finish Report', 'Due by EOD', 0),
  ('Call Plumber', 'Fix kitchen sink', 0),
  ('Workout', '1hour of cardio', 0),
  ('Read Book', 'Chapter 5 of ''Atomic Habits''', 0);
