import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("create", "routes/create.tsx"),
  route("api/test/reset", "routes/api.test.reset.tsx"),
  route("api/todos", "routes/api.todos.ts"),
  route("api/todos/:id", "routes/api.todos.$id.ts"),
  route("api/todos/:id/toggle", "routes/api.todos.$id.toggle.ts"),
] satisfies RouteConfig;
