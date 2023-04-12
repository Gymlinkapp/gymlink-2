// Import the tRPC Express Adatper
import * as trpcExpress from '@trpc/server/adapters/express';
import { createClient } from '@supabase/supabase-js';

// Import Express
import express from 'express';

// Import our App Router
import { appRouter } from './routers';

// Initialize Express
const app = express();

export const supabase = createClient(
  `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
  process.env.SUPABASE_API_KEY || ''
);

// Tell Express to parse incoming requests using JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Tell Express to let the tRPC adapter handle all incoming requests to `/trpc`
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

// Start the server under the port 3000
app.listen(3000);
console.log('Server started on port 3000');
