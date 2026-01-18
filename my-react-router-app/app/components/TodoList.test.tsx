import { render, screen } from "@testing-library/react";
import { TodoList } from "./TodoList";

// Mock react-router
vi.mock("react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useSearchParams: () => [new URLSearchParams()],
}));

// Mock fetch
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
  } as Response)
);

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
    render(<TodoList todos={mockTodos} activeTab="incomplete" />);

    expect(screen.getByText("First Todo")).toBeInTheDocument();
    expect(screen.getByText("Second Todo")).toBeInTheDocument();
    expect(screen.getByText("Third Todo")).toBeInTheDocument();
  });

  it("renders incomplete empty state when no incomplete todos", () => {
    render(<TodoList todos={[]} activeTab="incomplete" />);

    expect(screen.getByText("未完了のタスクはありません")).toBeInTheDocument();
  });

  it("renders complete empty state when no complete todos", () => {
    render(<TodoList todos={[]} activeTab="complete" />);

    expect(screen.getByText("完了したタスクはありません")).toBeInTheDocument();
  });

  it("renders correct number of todo items", () => {
    render(<TodoList todos={mockTodos} activeTab="incomplete" />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });

  it("renders todos with descriptions", () => {
    render(<TodoList todos={mockTodos} activeTab="incomplete" />);

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

    render(<TodoList todos={todosWithoutDesc} activeTab="incomplete" />);

    expect(screen.getByText("Todo without description")).toBeInTheDocument();
  });

  it("renders tabs", () => {
    render(<TodoList todos={mockTodos} activeTab="incomplete" />);

    expect(screen.getByText("未完了")).toBeInTheDocument();
    expect(screen.getByText("完了")).toBeInTheDocument();
  });

  it("renders with complete tab active", () => {
    render(<TodoList todos={mockTodos} activeTab="complete" />);

    const completeTab = screen.getByText("完了");
    expect(completeTab).toBeInTheDocument();
  });
});
