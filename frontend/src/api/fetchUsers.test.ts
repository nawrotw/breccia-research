import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchUsers } from "@/api/fetchUsers";
import type { UsersResponse } from "@shared";

const mockResponse: UsersResponse = {
  totalUsers: 50,
  page: 1,
  totalPages: 5,
  data: [
    { name: "Test User", email: "test@test.com", password: "pass", age: 30, isAdmin: false },
  ],
};

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchUsers", () => {
  it("calls /api/users with query params", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await fetchUsers({ total: "50", page: "1", pageSize: "10" });

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/users?total=50&page=1&pageSize=10"
    );
  });

  it("returns parsed response data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await fetchUsers({ total: "50", page: "1", pageSize: "10" });

    expect(result).toEqual(mockResponse);
  });

  it("throws on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    } as Response);

    await expect(
      fetchUsers({ total: "50", page: "1", pageSize: "10" })
    ).rejects.toThrow("Failed to fetch users: Not Found");
  });

  it("omits undefined params", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await fetchUsers({});

    expect(fetchSpy).toHaveBeenCalledWith("/api/users?");
  });
});
