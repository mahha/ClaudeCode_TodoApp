import { action } from "../../app/routes/api.todos.$id_.toggle";
import * as dbServer from "../../app/lib/db.server";

describe("API /api/todos/:id/toggle", () => {
  let mockDb: any;
  let mockContext: any;

  beforeEach(() => {
    mockDb = {};
    mockContext = {
      cloudflare: {
        env: { DB: mockDb },
        ctx: {} as any,
      },
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("PATCH /api/todos/:id/toggle", () => {
    it("should toggle todo completed status", async () => {
      const toggledTodo = {
        id: 1,
        title: "Test",
        description: "Test description",
        completed: true,
        created_at: 123,
        updated_at: 456,
      };

      const toggleTodoCompletedSpy = vi
        .spyOn(dbServer, "toggleTodoCompleted")
        .mockResolvedValue(toggledTodo);

      const request = new Request("http://localhost/api/todos/1/toggle", {
        method: "PATCH",
      });

      const response = await action({
        context: mockContext,
        params: { id: "1" },
        request,
      } as any);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ todo: toggledTodo });
      expect(toggleTodoCompletedSpy).toHaveBeenCalledWith(mockDb, 1);

      toggleTodoCompletedSpy.mockRestore();
    });

    it("should return 404 for non-existent todo", async () => {
      const toggleTodoCompletedSpy = vi
        .spyOn(dbServer, "toggleTodoCompleted")
        .mockResolvedValue(null);

      const request = new Request("http://localhost/api/todos/999/toggle", {
        method: "PATCH",
      });

      const response = await action({
        context: mockContext,
        params: { id: "999" },
        request,
      } as any);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json).toEqual({ error: "Todo not found" });

      toggleTodoCompletedSpy.mockRestore();
    });

    it("should return 400 for invalid ID", async () => {
      const request = new Request("http://localhost/api/todos/abc/toggle", {
        method: "PATCH",
      });

      const response = await action({
        context: mockContext,
        params: { id: "abc" },
        request,
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Invalid ID" });
    });

    it("should return 405 for non-PATCH methods", async () => {
      const request = new Request("http://localhost/api/todos/1/toggle", {
        method: "GET",
      });

      const response = await action({
        context: mockContext,
        params: { id: "1" },
        request,
      } as any);

      expect(response.status).toBe(405);
      const json = await response.json();
      expect(json).toEqual({ error: "Method not allowed" });
    });
  });
});
