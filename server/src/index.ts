import Fastify from "fastify";
import type { UsersRequest, UsersResponse } from "@shared";
import { getUsers } from "./users/UserService";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./trpc/router";

const server = Fastify({ logger: true });

server.get("/date", async () => {
  return { date: new Date().toISOString() };
});

server.get<{
  Querystring: UsersRequest;
  Reply: UsersResponse;
}>("/users", async (request) => {
  const total = Number.parseInt(request.query.total ?? "0", 10) || 0;
  const page = Number.parseInt(request.query.page ?? "1", 10) || 1;
  const pageSize = Number.parseInt(request.query.pageSize ?? "10", 10) || 10;

  return getUsers({ total, page, pageSize });
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter },
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
