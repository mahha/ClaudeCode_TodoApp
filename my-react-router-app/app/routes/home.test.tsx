import Home, { loader } from "./home";
import * as dbServer from "../lib/db.server";
import { render, screen } from "@testing-library/react";

const mockTodos = [
  {
    id: 1,
    title: "Test Todo 1",
    description: "First test todo",
    completed: false,
    created_at: 123,
    updated_at: 123,
  },
  {
    id: 2,
    title: "Test Todo 2",
    description: "Second test todo",
    completed: true,
    created_at: 124,
    updated_at: 124,
  },
  {
    id: 3,
    title: "Test Todo 3",
    description: null,
    completed: false,
    created_at: 125,
    updated_at: 125,
  },
];

describe("Home", () => {
  describe("loader", () => {
    it("should fetch todos from D1", async () => {
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

  describe("component", () => {
    beforeEach(() => {
      vi.mock("react-router", async () => {
        const actual = await vi.importActual("react-router");
        return {
          ...actual,
          useLoaderData: () => ({ todos: mockTodos }),
          Link: ({ to, children, ...props }: any) => (
            <a href={to} {...props}>
              {children}
            </a>
          ),
        };
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("renders ToDo App header", () => {
      render(<Home />);
      expect(screen.getByRole("heading", { name: "ToDo App" })).toBeInTheDocument();
    });

    it("renders Add Task link", () => {
      render(<Home />);
      const addTaskLink = screen.getByRole("link", { name: "Add new task" });
      expect(addTaskLink).toBeInTheDocument();
      expect(addTaskLink).toHaveAttribute("href", "/create");
    });

    it("renders mock todos", () => {
      render(<Home />);
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 3")).toBeInTheDocument();
    });

    it("renders correct number of todos", () => {
      render(<Home />);
      // Each todo has a checkbox input
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("renders todo descriptions", () => {
      render(<Home />);
      expect(screen.getByText("First test todo")).toBeInTheDocument();
      expect(screen.getByText("Second test todo")).toBeInTheDocument();
      // Third todo has no description, should not be rendered
    });

    it("all todos are initially in correct state", () => {
      render(<Home />);
      const checkboxes = screen.getAllByRole("checkbox");
      // First todo is unchecked
      expect(checkboxes[0]).not.toBeChecked();
      // Second todo is checked
      expect(checkboxes[1]).toBeChecked();
      // Third todo is unchecked
      expect(checkboxes[2]).not.toBeChecked();
    });
  });
});
