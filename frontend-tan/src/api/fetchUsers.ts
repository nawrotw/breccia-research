import type { UsersRequest, UsersResponse } from "@shared";

export async function fetchUsers(
  params: UsersRequest
): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();

  if (params.total) searchParams.set("total", params.total);
  if (params.page) searchParams.set("page", params.page);
  if (params.pageSize) searchParams.set("pageSize", params.pageSize);

  const response = await fetch(`/api/users?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}
