import { loader, action } from "../../app/routes/api.todos";
import * as dbServer from "../../app/lib/db.server";

describe("API /api/todos", () => {
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

  describe("GET /api/todos", () => {
    it("should return all todos", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test",
          description: null,
          completed: false,
          created_at: 123,
          updated_at: 123,
        },
      ];

      const getAllTodosSpy = vi
        .spyOn(dbServer, "getAllTodos")
        .mockResolvedValue(mockTodos);

      const response = await loader({
        context: mockContext,
        params: {},
        request: new Request("http://localhost/api/todos"),
      } as any);

      expect(getAllTodosSpy).toHaveBeenCalledWith(mockDb);

      const json = await response.json();
      expect(json).toEqual({ todos: mockTodos });

      getAllTodosSpy.mockRestore();
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        id: 1,
        title: "New Todo",
        description: "Test",
        completed: false,
        created_at: 123,
        updated_at: 123,
      };

      const createTodoSpy = vi
        .spyOn(dbServer, "createTodo")
        .mockResolvedValue(newTodo);

      const request = new Request("http://localhost/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: "New Todo", description: "Test" }),
      });

      const response = await action({
        context: mockContext,
        params: {},
        request,
      } as any);

      expect(response.status).toBe(201);
      const json = await response.json();
      expect(json).toEqual({ todo: newTodo });
      expect(createTodoSpy).toHaveBeenCalledWith(mockDb, {
        title: "New Todo",
        description: "Test",
      });

      createTodoSpy.mockRestore();
    });

    it("should return 400 for missing title", async () => {
      const request = new Request("http://localhost/api/todos", {
        method: "POST",
        body: JSON.stringify({ description: "Test" }),
      });

      const response = await action({
        context: mockContext,
        params: {},
        request,
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Title is required" });
    });

    it("should return 400 for empty title", async () => {
      const request = new Request("http://localhost/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: "   " }),
      });

      const response = await action({
        context: mockContext,
        params: {},
        request,
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Title is required" });
    });

    it("should return 400 for invalid description type", async () => {
      const request = new Request("http://localhost/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: "Test", description: 123 }),
      });

      const response = await action({
        context: mockContext,
        params: {},
        request,
      } as any);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({ error: "Invalid description" });
    });

    it("should trim title and description", async () => {
      const newTodo = {
        id: 1,
        title: "New Todo",
        description: "Test",
        completed: false,
        created_at: 123,
        updated_at: 123,
      };

      const createTodoSpy = vi
        .spyOn(dbServer, "createTodo")
        .mockResolvedValue(newTodo);

      const request = new Request("http://localhost/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: "  New Todo  ", description: "  Test  " }),
      });

      await action({
        context: mockContext,
        params: {},
        request,
      } as any);

      expect(createTodoSpy).toHaveBeenCalledWith(mockDb, {
        title: "New Todo",
        description: "Test",
      });

      createTodoSpy.mockRestore();
    });
  });
});
