import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";

describe("TodoList", () => {
  const mockTodos = [
    {
      id: 1,
      title: "First Todo",
      description: "First description",
      completed: false,
    },
    {
      id: 2,
      title: "Second Todo",
      description: "Second description",
      completed: true,
    },
    {
      id: 3,
      title: "Third Todo",
      description: null,
      completed: false,
    },
  ];

  it("renders all todos", () => {
    render(<TodoList todos={mockTodos} />);

    expect(screen.getByText("First Todo")).toBeInTheDocument();
    expect(screen.getByText("Second Todo")).toBeInTheDocument();
    expect(screen.getByText("Third Todo")).toBeInTheDocument();
  });

  it("renders empty state when no todos", () => {
    render(<TodoList todos={[]} />);

    expect(
      screen.getByText("No todos yet. Add one to get started!")
    ).toBeInTheDocument();
  });

  it("renders correct number of todo items", () => {
    render(<TodoList todos={mockTodos} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("renders todos with descriptions", () => {
    render(<TodoList todos={mockTodos} />);

    expect(screen.getByText("First description")).toBeInTheDocument();
    expect(screen.getByText("Second description")).toBeInTheDocument();
  });

  it("handles todos without descriptions", () => {
    const todosWithoutDesc = [
      {
        id: 1,
        title: "Todo without description",
        description: null,
        completed: false,
      },
    ];

    render(<TodoList todos={todosWithoutDesc} />);

    expect(screen.getByText("Todo without description")).toBeInTheDocument();
  });
});
