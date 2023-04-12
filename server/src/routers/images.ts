// Import our tRPC instance
import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { decode } from 'jsonwebtoken';
import { JWT } from '../types/JWT';
import { supabase } from '..';

const prisma = new PrismaClient();
export const imageRouter = t.router({
  upload: t.procedure
    .input(
      z.object({
        image: z.any(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const decoded = decode(input.token) as JWT;
      const user = await prisma.user.findFirst({
        where: {
          email: decoded.email,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }
      const userImages = user.images as string[];
      if (userImages.length > 5) {
        throw new Error('You can only have 5 images');
      }

      const buffer = Buffer.from(input.image, 'base64');
      const bucketPath = `user-${user.id}-${Math.random()}`;
      try {
        const { data, error } = await supabase.storage
          .from('user-images/public')
          .upload(bucketPath, buffer);
        if (error) {
          console.log(error);
        }
        if (data) {
          const url = supabase.storage
            .from('user-images/public')
            .getPublicUrl(bucketPath);

          const updatedImages = [...userImages, url];

          const updatedUser = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              images: {
                set: updatedImages,
              },
            },
          });

          return {
            user: updatedUser,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }),
});
