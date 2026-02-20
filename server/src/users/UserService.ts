import { faker } from "@faker-js/faker";
import type { User, UsersResponse } from "@shared";

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ min: 18, max: 80 }),
    isAdmin: faker.datatype.boolean(),
  }))
}

export interface GetUsersInput {
  total: number;
  page: number;
  pageSize: number;
}

export function getUsers(input: GetUsersInput): UsersResponse {
  const totalUsers = Math.max(0, input.total);
  const page = Math.max(1, input.page);
  const pageSize = Math.max(1, input.pageSize);

  const totalPages = totalUsers === 0 ? 0 : Math.ceil(totalUsers / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalUsers);
  const count = Math.max(0, endIndex - startIndex);

  const data: User[] = generateUsers(count);

  return {
    totalUsers,
    page,
    totalPages,
    data,
  };
}
