import { postRouter } from "~/server/api/routers/post";
import { travelRouter } from "~/server/api/routers/travel";
import { placesRouter } from "~/server/api/routers/places";
import { routesRouter } from "~/server/api/routers/routes";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  travel: travelRouter,
  places: placesRouter,
  routes: routesRouter,
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
