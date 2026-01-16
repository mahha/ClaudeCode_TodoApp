import { render, screen } from "@testing-library/react";
import { TodoItem } from "./TodoItem";

describe("TodoItem", () => {
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
});
