import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getUsers } from "../users/UserService";

const t = initTRPC.create();

export const appRouter = t.router({
  users: t.procedure
    .input(
      z.object({
        total: z.number().int().min(0).default(0),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).default(10),
      })
    )
    .query(({ input }) => {
      return getUsers(input);
    }),
});

export type AppRouter = typeof appRouter;
