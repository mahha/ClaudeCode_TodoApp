import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";

// Mock useFetcher
const mockSubmit = vi.fn();
const mockFetcher = {
  submit: mockSubmit,
  state: 'idle' as 'idle' | 'submitting' | 'loading',
  data: undefined,
  formData: undefined,
};

vi.mock("react-router", () => ({
  useFetcher: () => mockFetcher,
}));

describe("TodoItem", () => {
  beforeEach(() => {
    mockSubmit.mockClear();
    mockFetcher.state = 'idle';
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

  it("calls fetcher.submit when checkbox is clicked", () => {
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

    expect(mockSubmit).toHaveBeenCalledWith(
      {},
      {
        method: "PATCH",
        action: "/api/todos/42/toggle",
      }
    );
  });

  it("checkbox is clickable (not readonly)", () => {
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
    expect(mockSubmit).toHaveBeenCalled();
  });

  it("shows optimistic UI while fetcher is submitting", () => {
    // Set fetcher state to submitting
    mockFetcher.state = 'submitting';

    render(
      <TodoItem
        id={1}
        title="Test Todo"
        description="Test description"
        completed={false}
      />
    );

    // Should show opposite state optimistically
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });
});
