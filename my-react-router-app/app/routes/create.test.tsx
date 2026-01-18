import CreateTask, { action } from "./create";
import * as dbServer from "../lib/db.server";

describe("CreateTask", () => {
  describe("action", () => {
    it("should return error when title is empty", async () => {
      const formData = new FormData();
      formData.append("title", "");
      formData.append("description", "Test description");

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const request = new Request("http://localhost/create", {
        method: "POST",
        body: formData,
      });

      const result = await action({
        request,
        context,
        params: {},
      } as any);

      expect(result).toEqual({ error: "Task name is required" });
    });

    it("should return error when title is only whitespace", async () => {
      const formData = new FormData();
      formData.append("title", "   ");
      formData.append("description", "Test description");

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const request = new Request("http://localhost/create", {
        method: "POST",
        body: formData,
      });

      const result = await action({
        request,
        context,
        params: {},
      } as any);

      expect(result).toEqual({ error: "Task name is required" });
    });

    it("should create todo and redirect on success", async () => {
      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: "Test description",
        completed: false,
        created_at: 123,
        updated_at: 123,
      };

      const createTodoSpy = vi
        .spyOn(dbServer, "createTodo")
        .mockResolvedValue(mockTodo);

      const formData = new FormData();
      formData.append("title", "Test Todo");
      formData.append("description", "Test description");

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const request = new Request("http://localhost/create", {
        method: "POST",
        body: formData,
      });

      const result = await action({
        request,
        context,
        params: {},
      } as any);

      expect(createTodoSpy).toHaveBeenCalledWith(mockDb, {
        title: "Test Todo",
        description: "Test description",
      });
      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(302);

      createTodoSpy.mockRestore();
    });

    it("should trim title and description before saving", async () => {
      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: "Test description",
        completed: false,
        created_at: 123,
        updated_at: 123,
      };

      const createTodoSpy = vi
        .spyOn(dbServer, "createTodo")
        .mockResolvedValue(mockTodo);

      const formData = new FormData();
      formData.append("title", "  Test Todo  ");
      formData.append("description", "  Test description  ");

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const request = new Request("http://localhost/create", {
        method: "POST",
        body: formData,
      });

      await action({
        request,
        context,
        params: {},
      } as any);

      expect(createTodoSpy).toHaveBeenCalledWith(mockDb, {
        title: "Test Todo",
        description: "Test description",
      });

      createTodoSpy.mockRestore();
    });

    it("should handle empty description", async () => {
      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: null,
        completed: false,
        created_at: 123,
        updated_at: 123,
      };

      const createTodoSpy = vi
        .spyOn(dbServer, "createTodo")
        .mockResolvedValue(mockTodo);

      const formData = new FormData();
      formData.append("title", "Test Todo");
      formData.append("description", "");

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const request = new Request("http://localhost/create", {
        method: "POST",
        body: formData,
      });

      await action({
        request,
        context,
        params: {},
      } as any);

      expect(createTodoSpy).toHaveBeenCalledWith(mockDb, {
        title: "Test Todo",
        description: undefined,
      });

      createTodoSpy.mockRestore();
    });

    it("should return error when database operation fails", async () => {
      const createTodoSpy = vi
        .spyOn(dbServer, "createTodo")
        .mockRejectedValue(new Error("Database error"));

      const formData = new FormData();
      formData.append("title", "Test Todo");
      formData.append("description", "Test description");

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const request = new Request("http://localhost/create", {
        method: "POST",
        body: formData,
      });

      const result = await action({
        request,
        context,
        params: {},
      } as any);

      expect(result).toEqual({
        error: "Failed to create task. Please try again.",
      });

      createTodoSpy.mockRestore();
    });
  });
});
