import { createTRPCRouter } from "~/server/api/trpc";
import { pollRouter } from "./routers/pollRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pollRouter: pollRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
