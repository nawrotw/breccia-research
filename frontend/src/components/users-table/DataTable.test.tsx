import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "@/components/users-table/DataTable";
import { columns } from "@/components/users-table/columns";
import type { User } from "@shared";

const testUsers: User[] = [
  { name: "Alice Smith", email: "alice@test.com", password: "secret1", age: 30, isAdmin: true },
  { name: "Bob Jones", email: "bob@test.com", password: "secret2", age: 25, isAdmin: false },
  { name: "Carol Davis", email: "carol@test.com", password: "secret3", age: 40, isAdmin: true },
];

const defaultProps = {
  columns,
  data: testUsers,
  page: 1,
  pageSize: 10,
  totalPages: 3,
  totalUsers: 25,
  onPageChange: () => {},
  onPageSizeChange: () => {},
};

describe("DataTable", () => {
  it("renders all user data in the table", () => {
    render(<DataTable {...defaultProps} />);

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("bob@test.com")).toBeInTheDocument();
    expect(screen.getByText("secret3")).toBeInTheDocument();
  });

  it("renders isAdmin as Yes/No", () => {
    render(<DataTable {...defaultProps} />);

    const yesCells = screen.getAllByText("Yes");
    const noCells = screen.getAllByText("No");

    expect(yesCells).toHaveLength(2); // Alice and Carol
    expect(noCells).toHaveLength(1); // Bob
  });

  it("renders pagination info", () => {
    render(<DataTable {...defaultProps} />);

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByText(/25 total users/i)).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    render(<DataTable {...defaultProps} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("disables Next button on last page", () => {
    render(<DataTable {...defaultProps} page={3} totalPages={3} />);

    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChange when navigating", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();

    render(<DataTable {...defaultProps} onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("filters data with global filter", async () => {
    const user = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const filterInput = screen.getByPlaceholderText(/filter all columns/i);
    await user.type(filterInput, "Alice");

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.queryByText("Bob Jones")).not.toBeInTheDocument();
  });

  it("sorts by name column", async () => {
    const user = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const nameHeader = screen.getByRole("button", { name: /name/i });
    await user.click(nameHeader);

    const rows = screen.getAllByRole("row");
    // header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it("selects individual rows with checkboxes", async () => {
    const user = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    // 1 header checkbox + 3 row checkboxes
    expect(checkboxes).toHaveLength(4);

    await user.click(checkboxes[1]); // select first data row

    expect(screen.getByText(/1 of 3 row\(s\) selected/i)).toBeInTheDocument();
  });

  it("selects all rows with header checkbox", async () => {
    const user = userEvent.setup();
    render(<DataTable {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]); // header checkbox

    expect(screen.getByText(/3 of 3 row\(s\) selected/i)).toBeInTheDocument();
  });

  it("renders no results when data is empty", () => {
    render(<DataTable {...defaultProps} data={[]} />);

    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("renders page size picker with current value", () => {
    render(<DataTable {...defaultProps} pageSize={10} />);

    expect(screen.getByText("Rows per page")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("10");
  });

  it("calls onPageSizeChange when selecting a new page size", async () => {
    const onPageSizeChange = vi.fn();
    const user = userEvent.setup();

    render(<DataTable {...defaultProps} onPageSizeChange={onPageSizeChange} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    // Radix Select uses pointerdown - find the option in the portal
    const option = await screen.findByText("20");
    await user.click(option);

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });
});
