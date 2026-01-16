import { render, screen } from "@testing-library/react";
import Home from "./home";

describe("Home", () => {
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
      screen.getByText("Chapter 5 pof 'Atomic Habits'")
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
