import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { TopBar } from "@/components/TopBar";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("TopBar", () => {
  it("renders the theme toggle", async () => {
    render(renderWithRouter(<TopBar />));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    });
  });

  it("renders navigation links", async () => {
    render(renderWithRouter(<TopBar />));

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /^users$/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /create user/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ant users/i })).toBeInTheDocument();
  });
});
