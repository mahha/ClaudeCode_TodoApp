import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";

// Mock useNavigate and useSearchParams
const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams();

// Mock fetch
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
  } as Response)
);

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

describe("TodoItem", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });
  it("renders title and description correctly", () => {
    render(
      <TodoItem
        id={1}
        title="Test Todo"
        description="Test description"
        completed={false}
      />
    );

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders without description", () => {
    render(
      <TodoItem id={1} title="Test Todo" description={null} completed={false} />
    );

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });

  it("renders unchecked checkbox for incomplete todo", () => {
    render(
      <TodoItem
        id={1}
        title="Test Todo"
        description="Test description"
        completed={false}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checked checkbox for completed todo", () => {
    render(
      <TodoItem
        id={1}
        title="Test Todo"
        description="Test description"
        completed={true}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("has accessible label for checkbox", () => {
    render(
      <TodoItem
        id={1}
        title="Test Todo"
        description="Test description"
        completed={false}
      />
    );

    const checkbox = screen.getByLabelText(
      'Mark "Test Todo" as complete'
    );
    expect(checkbox).toBeInTheDocument();
  });

  it("calls toggle API when checkbox is clicked", async () => {
    render(
      <TodoItem
        id={42}
        title="Test Todo"
        description="Test description"
        completed={false}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/todos/42/toggle",
      {
        method: "PATCH",
      }
    );
  });

  it("checkbox is clickable (not readonly)", async () => {
    render(
      <TodoItem
        id={1}
        title="Test Todo"
        description="Test description"
        completed={false}
      />
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).not.toHaveAttribute("readonly");
    // Should be able to trigger onChange
    fireEvent.click(checkbox);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(globalThis.fetch).toHaveBeenCalled();
  });
});
