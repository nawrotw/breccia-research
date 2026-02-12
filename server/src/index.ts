import Fastify from "fastify";
import type { User, UsersRequest, UsersResponse } from "@shared";
import { generateUsers } from "./users/UserService";

const server = Fastify({ logger: true });

server.get("/date", async () => {
  return { date: new Date().toISOString() };
});

server.get<{
  Querystring: UsersRequest;
  Reply: UsersResponse;
}>("/users", async (request) => {
  const totalUsers = Math.max(0, Number.parseInt(request.query.total ?? "0", 10) || 0);
  const page = Math.max(1, Number.parseInt(request.query.page ?? "1", 10) || 1);
  const pageSize = Math.max(1, Number.parseInt(request.query.pageSize ?? "10", 10) || 10);

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
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "127.0.0.1" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
