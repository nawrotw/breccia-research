import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersPage } from "@/pages/UsersPage";
import { renderWithProviders } from "@/test/renderWithRouter";
import type { UsersResponse } from "@shared";

const mockResponse: UsersResponse = {
  totalUsers: 25,
  page: 1,
  totalPages: 3,
  data: [
    { name: "Alice Smith", email: "alice@test.com", password: "p1", age: 30, isAdmin: true },
    { name: "Bob Jones", email: "bob@test.com", password: "p2", age: 25, isAdmin: false },
  ],
};

const page2Response: UsersResponse = {
  totalUsers: 25,
  page: 2,
  totalPages: 3,
  data: [
    { name: "Carol Davis", email: "carol@test.com", password: "p3", age: 40, isAdmin: true },
  ],
};

function renderPage() {
  return render(<UsersPage />, {
    wrapper: renderWithProviders,
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("UsersPage", () => {
  it("renders the controls panel with count input and fetch button", () => {
    renderPage();

    expect(screen.getByLabelText("Users count:")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton")).toHaveValue(50);
    expect(screen.getByRole("button", { name: "Fetch" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fetch tRPC" })).toBeInTheDocument();
  });

  it("fetches and displays users when Fetch is clicked", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Fetch" }));

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/api/users?")
    );
  });

  it("shows error message when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error",
    } as Response);

    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Fetch" }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("allows changing the user count input", async () => {
    renderPage();
    const user = userEvent.setup();
    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "100");

    expect(input).toHaveValue(100);
  });

  it("navigates between pages", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(page2Response),
      } as Response);

    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Fetch" }));

    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });

    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText("Carol Davis")).toBeInTheDocument();
    });

    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
  });
});
