import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { CreateUserPage } from "@/pages/CreateUserPage";
import type { UsersResponse } from "@shared";

const mockUsersResponse: UsersResponse = {
  totalUsers: 5,
  page: 1,
  totalPages: 1,
  data: [
    { name: "User 1", email: "u1@test.com", password: "p", age: 20, isAdmin: false },
    { name: "User 2", email: "u2@test.com", password: "p", age: 25, isAdmin: false },
    { name: "User 3", email: "u3@test.com", password: "p", age: 30, isAdmin: true },
    { name: "User 4", email: "u4@test.com", password: "p", age: 35, isAdmin: false },
    { name: "User 5", email: "u5@test.com", password: "p", age: 40, isAdmin: true },
  ],
};

vi.mock("@/api/fetchUsers", () => ({
  fetchUsers: vi.fn(() => Promise.resolve(mockUsersResponse)),
}));

function renderCreateUserPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(
    [
      {
        path: "/create-user",
        element: (
          <QueryClientProvider client={queryClient}>
            <CreateUserPage />
          </QueryClientProvider>
        ),
      },
    ],
    { initialEntries: ["/create-user"] }
  );
  return render(<RouterProvider router={router} />);
}

describe("CreateUserPage", () => {
  it("renders the page heading", async () => {
    renderCreateUserPage();

    expect(await screen.findByRole("heading", { name: /create user/i })).toBeInTheDocument();
  });

  it("displays the number of fetched users", async () => {
    renderCreateUserPage();

    expect(await screen.findByText("5 users fetched")).toBeInTheDocument();
  });

  it("renders all form fields from User model", async () => {
    renderCreateUserPage();

    expect(await screen.findByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Age")).toBeInTheDocument();
    expect(screen.getByLabelText("Administrator")).toBeInTheDocument();
  });

  it("renders a submit button", async () => {
    renderCreateUserPage();

    expect(await screen.findByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("allows typing in text fields", async () => {
    const user = userEvent.setup();
    renderCreateUserPage();

    const nameInput = await screen.findByLabelText("Name");
    await user.type(nameInput, "John Doe");
    expect(nameInput).toHaveValue("John Doe");

    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "john@test.com");
    expect(emailInput).toHaveValue("john@test.com");
  });

  it("allows typing in password field", async () => {
    const user = userEvent.setup();
    renderCreateUserPage();

    const passwordInput = await screen.findByLabelText("Password");
    await user.type(passwordInput, "secret123");
    expect(passwordInput).toHaveValue("secret123");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("allows entering age", async () => {
    const user = userEvent.setup();
    renderCreateUserPage();

    const ageInput = await screen.findByLabelText("Age");
    await user.type(ageInput, "30");
    expect(ageInput).toHaveValue(30);
  });

  it("allows toggling isAdmin checkbox", async () => {
    const user = userEvent.setup();
    renderCreateUserPage();

    const adminCheckbox = await screen.findByRole("checkbox");
    expect(adminCheckbox).not.toBeChecked();

    await user.click(adminCheckbox);
    expect(adminCheckbox).toBeChecked();

    await user.click(adminCheckbox);
    expect(adminCheckbox).not.toBeChecked();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderCreateUserPage();

    await user.click(await screen.findByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByText("Age is required")).toBeInTheDocument();

    const resultEl = screen.getByTestId("form-result");
    expect(resultEl).toHaveTextContent("Error");
  });

  it("shows success message and logs data on successful submit", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const user = userEvent.setup();
    renderCreateUserPage();

    await user.type(await screen.findByLabelText("Name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@test.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Age"), "25");
    await user.click(screen.getByRole("checkbox"));

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByTestId("form-result")).toHaveTextContent("Success");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Form submitted successfully:",
      expect.objectContaining({
        name: "Jane Doe",
        email: "jane@test.com",
        password: "password123",
        age: 25,
        isAdmin: true,
      })
    );

    consoleSpy.mockRestore();
  });
});
