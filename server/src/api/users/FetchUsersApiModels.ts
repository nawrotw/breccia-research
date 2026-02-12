import type { User } from "../../users/UserModel";

export interface UsersRequest {
  total?: string;
  page?: string;
  pageSize?: string;
}

export interface UsersResponse {
  totalUsers: number;
  page: number;
  totalPages: number;
  data: User[];
}
