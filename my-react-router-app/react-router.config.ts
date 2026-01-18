import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
  },
  // Note: API routes are resource routes and work without explicit configuration
  // They are accessed directly via fetch, not through React Router's routing
  // The routes defined in app/routes/api.* export loader/action functions
  // and return Response objects, making them function as API endpoints
} satisfies Config;
