// Import our tRPC instance
import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const usersRouter = t.router({
  all: t.procedure.query(() => {
    const users = prisma.user.findMany();
    return users;
  }),
});
