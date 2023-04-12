// Import our tRPC instance
import { t } from '../trpc';

// Import our todo Router
import { usersRouter } from './users';
import { imageRouter } from './images';
import { authenticationRouter } from './authentication';

// Create an appRouter which will be used to tie together all our different routers
// In our case, we will only have one router, our todo router. This todo router will be exported under the namespace `todo`.
export const appRouter = t.router({
  users: usersRouter,
  images: imageRouter,
  authentication: authenticationRouter,
});

// Export only the **type** of a router to avoid importing server code on the client
export type AppRouter = typeof appRouter;
