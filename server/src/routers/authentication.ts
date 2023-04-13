import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Twilio } from 'twilio';
import { decode } from 'jsonwebtoken';
import { JWT } from '../types/JWT';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

const prisma = new PrismaClient();
const randomVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const code = randomVerificationCode();

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
      console.log('first code', code);
      try {
        await client.messages.create({
          body: `Your verification code is ${code}`,
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
              verificationCode: code,

              authSteps: 1,
            },
          });

          console.log('saved code', newUser.verificationCode);

          return {
            message: 'SMS Sent',
            authStep: newUser.authSteps,
            code: newUser.verificationCode,
          };
        }

        const existingUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            verificationCode: code,
          },
        });

        console.log(
          'saved code on existing user',
          existingUser.verificationCode
        );

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

  verifyOTP: t.procedure
    .input(
      z.object({
        phoneNumber: z.string(),
        verificationCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('code from screen', input.verificationCode);
      console.log('number from screen', input.phoneNumber);
      const user = await prisma.user.findUnique({
        where: {
          phoneNumber: input.phoneNumber,
        },
      });

      if (!user) throw new Error('User not found');
      if (user.verificationCode !== input.verificationCode) {
        console.log('wrong');
        throw new Error('Incorrect verification code');
      }
      if (!user.verified || !user.email) {
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            authSteps: 2,
            verified: true,
          },
        });

        return {
          message: 'User verified',
          authStep: updatedUser.authSteps,
        };
      }

      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1d',
        }
      );
      const signedInUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          tempJWT: token,
        },
      });

      return {
        token: signedInUser.tempJWT,
      };
    }),
  userInitialDetails: t.procedure
    .input(
      z.object({
        phoneNumber: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        bio: z.string(),
        age: z.number(),
        gender: z.string(),
        race: z.string(),
        longitude: z.number(),
        latitude: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('input', input);
      try {
        const user = await prisma.user.findUnique({
          where: {
            phoneNumber: input.phoneNumber,
          },
        });

        console.log('user', user);

        if (!user) throw new Error('User not found');
        if (!user.verified) throw new Error('User not verified');

        const updatedUser = await prisma.user.update({
          where: {
            phoneNumber: input.phoneNumber,
          },
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            bio: input.bio,
            age: input.age,
            gender: input.gender,
            race: input.race,
            longitude: input.longitude,
            authSteps: 3,
            latitude: input.latitude,
          },
        });

        return {
          message: 'User details updated',
          authStep: updatedUser.authSteps,
          token: updatedUser.tempJWT,
        };
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),
});
