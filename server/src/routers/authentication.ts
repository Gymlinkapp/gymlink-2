import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

const prisma = new PrismaClient();

export const authenticationRouter = t.router({
  signin: t.procedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!user) throw new Error('User not found');

      const passwordsMatch = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!passwordsMatch) throw new Error('Incorrect password');

      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET as string
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          tempJWT: token,
        },
      });

      return token;
    }),

  sendOTP: t.procedure
    .input(
      z.object({
        phoneNumber: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('hi');
      const randomVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };

      console.log('code', randomVerificationCode());

      try {
        await client.messages.create({
          body: `Your verification code is ${randomVerificationCode()}`,
          from: process.env.TWILIO_PHONE_NUMBER as string,
          to: `+1${input.phoneNumber}`,
        });
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }

      // if the user already exists
      try {
        const user = await prisma.user.findUnique({
          where: {
            phoneNumber: input.phoneNumber,
          },
        });

        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              phoneNumber: input.phoneNumber,
              email: '',
              password: '',
              images: [],
              tempJWT: '',
              age: 0,
              filterGender: [],
              filterGoals: [],
              filterSkillLevel: [],
              filterWorkout: [],
              filterGoingToday: false,
              firstName: '',
              lastName: '',
              tags: [],
              bio: '',
              verificationCode: randomVerificationCode(),

              authSteps: 1,
            },
          });

          return {
            message: 'SMS Sent',
            authStep: newUser.authSteps,
            code: newUser.verificationCode,
          };
        }
        console.log('user', user);

        const existingUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            verificationCode: randomVerificationCode(),
          },
        });

        return {
          message: 'SMS Sent',
          authStep: existingUser.authSteps,
          code: existingUser.verificationCode,
        };
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),
});
