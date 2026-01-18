import Home, { loader } from "./home";
import * as dbServer from "../lib/db.server";

describe("Home", () => {
  describe("loader", () => {
    it("should fetch todos from D1", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test Todo",
          description: "Test",
          completed: false,
          created_at: 123,
          updated_at: 123,
        },
      ];

      const getAllTodosSpy = vi
        .spyOn(dbServer, "getAllTodos")
        .mockResolvedValue(mockTodos);

      const mockDb = {} as any;
      const context = {
        cloudflare: {
          env: { DB: mockDb },
          ctx: {} as any,
        },
      };

      const result = await loader({
        context,
        params: {},
        request: new Request("http://localhost"),
      } as any);

      expect(getAllTodosSpy).toHaveBeenCalledWith(mockDb);
      expect(result).toEqual({ todos: mockTodos });

      getAllTodosSpy.mockRestore();
    });
  });
});
