# ToDo App - Project Documentation

## Project Overview

A simple, full-stack ToDo application built with modern web technologies and deployed to Cloudflare's edge network.

**Purpose**: Manage personal tasks with create, read, update, and delete operations.

## Tech Stack

- **Frontend Framework**: React Router v7 (full-stack framework)
- **Database**: SQLite (via Cloudflare D1 for production)
- **Testing**:
  - Unit/Integration: Vitest
  - E2E: Playwright
- **Deployment**: Cloudflare Workers
- **Runtime**: Cloudflare Workers runtime (V8 isolates)

## Project Structure

```
/app              - React Router application code
  /routes         - Route handlers and UI components
  /components     - Reusable React components
  /lib            - Utility functions and database helpers
/db               - Database schema and migrations
/tests            - Test files
  /unit           - Vitest unit tests
  /e2e            - Playwright E2E tests
/public           - Static assets
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit/integration tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy

# Run database migrations locally
npm run db:migrate

# Run database migrations on Cloudflare D1
npm run db:migrate:remote
```

## Database Setup

- Local development uses SQLite via `better-sqlite3`
- Production uses Cloudflare D1 (SQLite-compatible)
- Migrations are version-controlled in `/db/migrations`
- Always test migrations locally before deploying

## Testing Guidelines

**Unit Tests (Vitest)**:
- Test business logic and utility functions
- Mock external dependencies and database calls
- Run before committing: `npm run test`

**E2E Tests (Playwright)**:
- Test critical user flows
- Run against local dev server
- Keep tests fast and focused

## Cloudflare Workers Considerations

- No Node.js APIs available (use Web APIs instead)
- No filesystem access (use KV, D1, or R2 for storage)
- Request/Response must use Web Fetch API standards
- Environment variables via `wrangler.toml` and Cloudflare dashboard
- 128MB memory limit per request
- Use `wrangler dev` for local testing with Workers runtime

## Development Workflow

1. Create feature branch from `main`
2. Make changes and add tests
3. Run `npm run test` to verify unit tests
4. Run `npm run test:e2e` for critical flows
5. Build locally with `npm run build` to check for errors
6. Commit with descriptive message
7. Deploy to preview environment: `npm run deploy -- --env preview`
8. Test preview deployment
9. Create PR for review

## Quality Checks (CRITICAL)

**After completing ANY task, you MUST run these checks and ensure they ALWAYS pass:**

1. **Type Check**: Run `npm run typecheck` (or `tsc --noEmit`)
   - Fix all TypeScript type errors before considering task complete
   - Ensure type safety across the codebase

2. **Lint**: Run `npm run lint`
   - Fix all linting errors and warnings
   - Maintain consistent code style and quality

**These checks are MANDATORY** - do not mark tasks as complete until both pass successfully. This ensures code quality and prevents type errors from being introduced.

## Common Patterns

**Database Queries**: Use parameterized queries to prevent SQL injection
```typescript
db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
```

**Error Handling**: Return appropriate HTTP status codes
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

**Type Safety**: Leverage TypeScript for type checking
- Define types for database models
- Use Zod or similar for runtime validation

## Project-Specific Notes

- This is a simple CRUD app - avoid over-engineering
- Focus on core functionality: create, read, update, delete todos
- Keep UI minimal and functional
- Prioritize fast page loads (leverage edge deployment)
- Use progressive enhancement where possible

## Security Best Practices

**SQL Injection Prevention** (Critical):
- ALWAYS use prepared statements with parameter binding: `db.prepare('SELECT * FROM todos WHERE id = ?').bind(id)`
- NEVER use `db.exec()` with user input - it's vulnerable to SQL injection
- D1 supports `?` (anonymous) and `?NNNN` (ordered) parameter binding

**Data Security**:
- All D1 data is encrypted at rest automatically
- Use `wrangler secret` for storing API keys and credentials, never commit secrets to git
- Validate and sanitize all user input (use Zod or similar)
- Implement proper authentication before deploying to production

**Rate Limiting**:
- Use Cloudflare's built-in Rate Limiting binding for production
- Rate limit by API key, user ID, or IP address
- Protect against brute force and DoS attacks

**OWASP Top 10 Considerations**:
- Broken Access Control: Verify user permissions on every request
- Cryptographic Failures: Use HTTPS only, never expose sensitive data in URLs
- Security Misconfiguration: Don't expose verbose error messages in production
- Cross-Site Scripting (XSS): Sanitize user input, use React's built-in XSS protection

**Environment-Specific**:
- Use different D1 databases for dev/staging/production
- Never use production credentials in local development
- Enable Cloudflare's Web Application Firewall (WAF) for production

## Performance Optimization

**Edge Computing Benefits**:
- Cloudflare Workers achieve ~0ms cold starts (vs 200-1000ms for traditional serverless)
- Target <50ms response time for dynamic requests
- Leverage 300+ global edge locations

**Caching Strategy**:
- Cache static assets aggressively (CSS, JS, images)
- Use Cloudflare's Cache API for frequently accessed data
- Consider Workers KV for read-heavy configuration data
- D1 is optimized for transactional data, not caching

**Database Optimization**:
- Use prepared statements (they're cached and reusable)
- Add indexes on frequently queried columns
- Batch operations when possible with D1's `.batch()` method
- Avoid N+1 queries - fetch related data in single queries

**Workers-Specific**:
- Minimize external API calls (each adds latency)
- Use `ctx.waitUntil()` for non-blocking background tasks
- Workers bill by CPU time, not duration - optimize compute, not waiting
- Keep bundle size small (<1MB) for fast script deployment

**React Router v7**:
- Use loader functions for data fetching (prevents waterfall requests)
- Implement proper loading states
- Leverage type-safe route parameters
- Use framework mode for SSR benefits

**Monitoring**:
- Track P95/P99 latency, not just averages
- Monitor D1 query performance
- Set up alerts for error rates and slow requests

## Common Issues & Solutions

**React Router v7 Migration**:
- Import from `react-router` instead of `react-router-dom` in v7
- Enable future flags when upgrading from v6 for gradual migration
- Test thoroughly - routing logic changes can have subtle effects

**Cloudflare Workers Runtime**:
- Error: "Cannot find module 'fs'" → Use Web APIs, not Node.js APIs
- Error: "dynamic code evaluation" → Avoid `eval()`, `new Function()`, etc.
- Local dev differs from production → Always test with `wrangler dev`

**D1 Database**:
- "Database locked" → D1 handles one write at a time, use transactions wisely
- "Too many SQL variables" → D1 limits parameters per query (typically 100-999)
- Migrations fail → Test locally first, D1 doesn't support all SQLite features

**Development Workflow**:
- Types not updating → Restart TypeScript server, regenerate types with `wrangler types`
- Preview deployment not working → Check wrangler.toml bindings match production
- Tests failing in CI → Ensure test environment matches local setup

**Performance Issues**:
- Slow initial page load → Check bundle size, implement code splitting
- High latency → Add caching, reduce external API calls, optimize queries
- Cold start problems → Workers have near-zero cold starts, check application code

## References

- [React Router v7 Docs](https://reactrouter.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
