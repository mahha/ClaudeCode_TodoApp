# Database Setup

This directory contains the database schema and migrations for the ToDo application.

## Structure

```
/db
  /migrations       - SQL migration files (versioned)
  schema.sql        - Current database schema (for reference)
  README.md         - This file
```

## Local Development Setup

### 1. Initialize Local D1 Database

Run the initial migration to create the database schema:

```bash
npm run db:migrate
```

This creates a local SQLite database in `.wrangler/state/v3/d1/` directory.

### 2. Verify Database

Check that the database was created successfully:

```bash
npm run db:console
```

## Production Setup

### 1. Create D1 Database on Cloudflare

First, create the D1 database on Cloudflare:

```bash
npm run db:create
```

This will output a database ID. **Important:** Copy this ID and update `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "todo-db",
    "database_id": "YOUR_DATABASE_ID_HERE"  // Replace with the actual ID
  }
]
```

### 2. Run Production Migration

After updating the database ID, run the migration on the remote database:

```bash
npm run db:migrate:remote
```

### 3. Verify Production Database

```bash
npm run db:console:remote
```

## Database Schema

### Todos Table

| Column      | Type    | Description                           |
|-------------|---------|---------------------------------------|
| id          | INTEGER | Primary key (auto-increment)          |
| title       | TEXT    | Todo title (required)                 |
| description | TEXT    | Todo description (optional)           |
| completed   | INTEGER | Completion status (0=false, 1=true)   |
| created_at  | INTEGER | Unix timestamp (auto-generated)       |
| updated_at  | INTEGER | Unix timestamp (auto-updated)         |

### Indexes

- `idx_todos_completed` - Fast filtering by completion status
- `idx_todos_created_at` - Fast sorting by creation date

## Migrations

### Creating New Migrations

1. Create a new SQL file in `/db/migrations` with format: `NNNN_description.sql`
2. Write your migration SQL (CREATE, ALTER, etc.)
3. Update `/db/schema.sql` to reflect the current state
4. Add the migration command to `package.json` scripts

### Migration Best Practices

- Always test migrations locally first (`npm run db:migrate`)
- Migrations should be idempotent when possible (use `IF NOT EXISTS`)
- Never modify existing migration files after they've been deployed
- Document breaking changes in migration file comments

## Using the Database in Code

Import the database helper functions from `/app/lib/db.server.ts`:

```typescript
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '~/lib/db.server';

// In a loader
export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const todos = await getAllTodos(db);
  return { todos };
}

// In an action
export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;
  const formData = await request.formData();
  const title = formData.get('title') as string;

  const todo = await createTodo(db, { title });
  return { todo };
}
```

## Security Notes

- Always use prepared statements (already implemented in `db.server.ts`)
- Never use `db.exec()` with user input
- Validate all user input before database operations
- Use parameterized queries to prevent SQL injection

## Troubleshooting

### "Database not found" error

- For local: Run `npm run db:migrate` to initialize the database
- For remote: Ensure you've created the database and updated the ID in `wrangler.jsonc`

### "Table already exists" error

This is normal if you run migrations multiple times. The schema uses `IF NOT EXISTS` to handle this.

### TypeScript errors for DB binding

Run `npm run cf-typegen` to regenerate type definitions after changing `wrangler.jsonc`.
