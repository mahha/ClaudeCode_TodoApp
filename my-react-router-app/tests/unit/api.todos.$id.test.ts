import { loader, action } from "../../app/routes/api.todos.$id";
import * as dbServer from "../../app/lib/db.server";

describe("API /api/todos/:id", () => {
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

  describe("GET /api/todos/:id", () => {
    it("should return a todo by ID", async () => {
      const mockTodo = {
        id: 1,
        title: "Test",
        description: "Test description",
        completed: false,
        created_at: 123,
        updated_at: 123,
      };

      const getTodoByIdSpy = vi
        .spyOn(dbServer, "getTodoById")
        .mockResolvedValue(mockTodo);

      const response = await loader({
        context: mockContext,
        params: { id: "1" },
        request: new Request("http://localhost/api/todos/1"),
      } as any);

      expect(getTodoByIdSpy).toHaveBeenCalledWith(mockDb, 1);

      const json = await response.json();
      expect(json).toEqual({ todo: mockTodo });

      getTodoByIdSpy.mockRestore();
    });

    it("should return 404 for non-existent todo", async () => {
      const getTodoByIdSpy = vi
        .spyOn(dbServer, "getTodoById")
        .mockResolvedValue(null);

      const response = await loader({
        context: mockContext,
        params: { id: "999" },
        request: new Request("http://localhost/api/todos/999"),
      } as any);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json).toEqual({ error: "Todo not found" });

      getTodoByIdSpy.mockRestore();
    });

    it("should return 400 for invalid ID", async () => {
      const response = await loader({
        context: mockContext,
        params: { id: "abc" },
        request: new Request("http://localhost/api/todos/abc"),
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Invalid ID" });
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("should update a todo", async () => {
      const updatedTodo = {
        id: 1,
        title: "Updated Todo",
        description: "Updated description",
        completed: true,
        created_at: 123,
        updated_at: 456,
      };

      const updateTodoSpy = vi
        .spyOn(dbServer, "updateTodo")
        .mockResolvedValue(updatedTodo);

      const request = new Request("http://localhost/api/todos/1", {
        method: "PUT",
        body: JSON.stringify({
          title: "Updated Todo",
          description: "Updated description",
          completed: true,
        }),
      });

      const response = await action({
        context: mockContext,
        params: { id: "1" },
        request,
      } as any);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ todo: updatedTodo });
      expect(updateTodoSpy).toHaveBeenCalledWith(mockDb, 1, {
        title: "Updated Todo",
        description: "Updated description",
        completed: true,
      });

      updateTodoSpy.mockRestore();
    });

    it("should return 404 for non-existent todo", async () => {
      const updateTodoSpy = vi
        .spyOn(dbServer, "updateTodo")
        .mockResolvedValue(null);

      const request = new Request("http://localhost/api/todos/999", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated" }),
      });

      const response = await action({
        context: mockContext,
        params: { id: "999" },
        request,
      } as any);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json).toEqual({ error: "Todo not found" });

      updateTodoSpy.mockRestore();
    });

    it("should return 400 for invalid title", async () => {
      const request = new Request("http://localhost/api/todos/1", {
        method: "PUT",
        body: JSON.stringify({ title: "" }),
      });

      const response = await action({
        context: mockContext,
        params: { id: "1" },
        request,
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Invalid title" });
    });

    it("should return 400 for invalid completed type", async () => {
      const request = new Request("http://localhost/api/todos/1", {
        method: "PUT",
        body: JSON.stringify({ completed: "yes" }),
      });

      const response = await action({
        context: mockContext,
        params: { id: "1" },
        request,
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Invalid completed status" });
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo", async () => {
      const deleteTodoSpy = vi
        .spyOn(dbServer, "deleteTodo")
        .mockResolvedValue(true);

      const request = new Request("http://localhost/api/todos/1", {
        method: "DELETE",
      });

      const response = await action({
        context: mockContext,
        params: { id: "1" },
        request,
      } as any);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ success: true });
      expect(deleteTodoSpy).toHaveBeenCalledWith(mockDb, 1);

      deleteTodoSpy.mockRestore();
    });

    it("should return 404 for non-existent todo", async () => {
      const deleteTodoSpy = vi
        .spyOn(dbServer, "deleteTodo")
        .mockResolvedValue(false);

      const request = new Request("http://localhost/api/todos/999", {
        method: "DELETE",
      });

      const response = await action({
        context: mockContext,
        params: { id: "999" },
        request,
      } as any);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json).toEqual({ error: "Todo not found" });

      deleteTodoSpy.mockRestore();
    });

    it("should return 400 for invalid ID", async () => {
      const request = new Request("http://localhost/api/todos/abc", {
        method: "DELETE",
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
  });
});
