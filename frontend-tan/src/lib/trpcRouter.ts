import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/src/trpc/router";

export const trpcRouter = createTRPCReact<AppRouter>();
