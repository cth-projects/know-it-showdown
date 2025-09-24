import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { testRouter } from "./routers/test";
import { answersRouter } from "./routers/answers";
import { gameRouter } from "./routers/game";
import { advanceRouter } from "./routers/advance";
import { advanceRouter } from "./routers/advance";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  test: testRouter,
  answers: answersRouter,
  game: gameRouter,
  advance: advanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
