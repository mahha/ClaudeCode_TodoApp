import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("create", "routes/create.tsx"),
  route("api/test/reset", "routes/api.test.reset.tsx"),
] satisfies RouteConfig;
