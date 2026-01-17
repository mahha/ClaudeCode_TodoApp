# Cloudflare Workers Deployment Guide

This guide covers deploying the React Router ToDo app to Cloudflare Workers.

## Prerequisites

Before deploying, ensure you have:

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/sign-up
2. **Node.js and npm**: Already installed (verified by running `node --version`)
3. **Project Built**: Run `npm run build` to verify the project builds successfully

## Deployment Steps

### Step 1: Verify Build and Type Checking

Before deploying, ensure the project is ready:

```bash
# Build the project
npm run build

# Run type checking
npm run typecheck
```

Both commands should complete without errors.

### Step 2: Authenticate with Cloudflare

You have two options for authentication:

#### Option A: Interactive Login (Recommended)

```bash
npx wrangler login
```

This will:
- Open your browser automatically
- Prompt you to log in to Cloudflare
- Request permission for Wrangler to access your account
- Store authentication credentials locally in `~/.wrangler/config/`

**No API token setup is required with this method.**

#### Option B: API Token (Advanced)

If you prefer using an API token:

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create a new token with "Edit Cloudflare Workers" permissions
3. Set the environment variable:

```bash
export CLOUDFLARE_API_TOKEN="your-api-token-here"
```

**Important**: Never commit API tokens to version control.

### Step 3: Deploy to Cloudflare Workers

Once authenticated, deploy the application:

```bash
npm run deploy
```

This command will:
1. Build the application (`npm run build`)
2. Deploy to Cloudflare Workers (`wrangler deploy`)
3. Output a Workers URL where your app is hosted

Expected output:
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded my-react-router-app (X.XX sec)
Deployed my-react-router-app triggers (X.XX sec)
  https://my-react-router-app.<your-subdomain>.workers.dev
Current Version ID: <version-id>
```

### Step 4: Verify Deployment

1. Open the Workers URL provided in the deployment output
2. Verify the ToDo app loads correctly
3. Check that the mock todos are displayed
4. Verify styling is applied correctly
5. Open browser DevTools and check for console errors (there should be none)

## Deployment Configuration

### Current Configuration

The app is configured in `wrangler.jsonc`:

```jsonc
{
  "name": "my-react-router-app",
  "compatibility_date": "2025-04-04",
  "main": "./workers/app.ts",
  "vars": {
    "VALUE_FROM_CLOUDFLARE": "Hello from Cloudflare"
  },
  "observability": {
    "enabled": true
  }
}
```

### What's Deployed

- **Worker Entry**: `workers/app.ts` - React Router request handler
- **Client Assets**: Built React application (HTML, CSS, JS)
- **SSR**: Server-side rendering enabled for fast initial page loads

### What's NOT Included (Current Scope)

- D1 Database connection (commented out - to be added in future issues)
- Environment-specific configurations (dev/staging/prod)
- CI/CD pipeline

## Performance Expectations

Target metrics for this deployment:

- **Cold Start**: ~0ms (Cloudflare Workers advantage)
- **Response Time**: <200ms for dynamic requests
- **Global Distribution**: Available on 300+ edge locations

## Troubleshooting

### Authentication Issues

**Problem**: `wrangler login` doesn't open browser

**Solution**: Use API token method (Option B above)

---

**Problem**: "Not authenticated" error

**Solution**:
```bash
npx wrangler whoami  # Check authentication status
npx wrangler login   # Re-authenticate
```

### Build Errors

**Problem**: Build fails with type errors

**Solution**:
```bash
npm run typecheck   # Identify type errors
npm run cf-typegen  # Regenerate Cloudflare types
```

### Deployment Errors

**Problem**: "Worker name already exists"

**Solution**: Change the `name` field in `wrangler.jsonc` to a unique value

---

**Problem**: Assets not loading (404 errors)

**Solution**: Ensure `npm run build` completed successfully before deploying

## Resource Limits (Free Tier)

Cloudflare Workers Free Tier includes:

- **Requests**: 100,000 requests/day
- **CPU Time**: 10ms per request
- **Memory**: 128MB per request
- **Script Size**: 1MB after compression

This is sufficient for development and small-scale production use.

## Next Steps

After successful deployment, consider:

1. **Custom Domain**: Add a custom domain in Cloudflare dashboard
2. **D1 Database**: Integrate database for persistent todo storage (separate issue)
3. **CI/CD**: Set up automated deployments with GitHub Actions (separate issue)
4. **Monitoring**: Use Cloudflare Analytics to monitor usage and performance

## Useful Commands

```bash
# Check Wrangler version
npx wrangler --version

# View deployment list
npx wrangler deployments list

# View worker logs (tail)
npx wrangler tail

# Delete deployment
npx wrangler delete my-react-router-app

# Check authentication status
npx wrangler whoami
```

## Support

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)
- [React Router v7 Cloudflare Guide](https://reactrouter.com/start/deploying/cloudflare)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands)

## Security Notes

1. **Never commit**:
   - `.wrangler/` directory (already in .gitignore)
   - API tokens or secrets
   - `.dev.vars` file (if created)

2. **Use Wrangler Secrets** for sensitive data:
   ```bash
   npx wrangler secret put SECRET_NAME
   ```

3. **Enable Cloudflare WAF** in dashboard for production deployments
