import { render, screen } from "@testing-library/react";
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

  describe("component", () => {
    beforeEach(() => {
      vi.mock("react-router", () => ({
        useLoaderData: () => ({
          todos: [
            {
              id: 1,
              title: "Grocery Shopping",
              description: "Buy vegetables and fruits",
              completed: false,
            },
            {
              id: 2,
              title: "Finish Report",
              description: "Due by EOD",
              completed: false,
            },
            {
              id: 3,
              title: "Call Plumber",
              description: "Fix kitchen sink",
              completed: false,
            },
            {
              id: 4,
              title: "Workout",
              description: "1hour of cardio",
              completed: false,
            },
            {
              id: 5,
              title: "Read Book",
              description: "Chapter 5 of 'Atomic Habits'",
              completed: false,
            },
          ],
        }),
      }));
    });

  it("renders ToDo App header", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "ToDo App" })
    ).toBeInTheDocument();
  });

  it("renders Add Task button", () => {
    render(<Home />);

    expect(
      screen.getByRole("button", { name: "Add new task" })
    ).toBeInTheDocument();
    expect(screen.getByText("+ Add Task")).toBeInTheDocument();
  });

  it("renders mock todos", () => {
    render(<Home />);

    expect(screen.getByText("Grocery Shopping")).toBeInTheDocument();
    expect(screen.getByText("Finish Report")).toBeInTheDocument();
    expect(screen.getByText("Call Plumber")).toBeInTheDocument();
    expect(screen.getByText("Workout")).toBeInTheDocument();
    expect(screen.getByText("Read Book")).toBeInTheDocument();
  });

  it("renders correct number of todos", () => {
    render(<Home />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(5);
  });

  it("renders todo descriptions", () => {
    render(<Home />);

    expect(screen.getByText("Buy vegetables and fruits")).toBeInTheDocument();
    expect(screen.getByText("Due by EOD")).toBeInTheDocument();
    expect(screen.getByText("Fix kitchen sink")).toBeInTheDocument();
    expect(screen.getByText("1hour of cardio")).toBeInTheDocument();
    expect(
      screen.getByText("Chapter 5 of 'Atomic Habits'")
    ).toBeInTheDocument();
  });

  it("all todos are initially unchecked", () => {
    render(<Home />);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });
  });
});
