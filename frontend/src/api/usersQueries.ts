import { queryOptions } from "@tanstack/react-query";
import { fetchUsers } from "@/api/fetchUsers";

export const createUserQuery = queryOptions({
  queryKey: ["users", { total: "100" }],
  queryFn: () => fetchUsers({ total: "100" }),
});
