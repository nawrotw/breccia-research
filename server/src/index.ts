import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/date", async () => {
  return { date: new Date().toISOString() };
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
