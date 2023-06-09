// Import our tRPC instance
import { z } from 'zod';
import { t } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { decode } from 'jsonwebtoken';
import { JWT } from '../types/JWT';
import { findNearUsers } from '../utils/findNearbyUsers';
import { filterFeedHelper } from '../utils/filterFeedHelper';
import { FilterType } from '../../../client/utils/types/filter';

const prisma = new PrismaClient();

export type Filter = {
  filter: string;
  value: string | boolean;
};

export const usersRouter = t.router({
  all: t.procedure.query(async () => {
    try {
      const users = await prisma.user.findMany();

      if (!users) throw new Error('No users found');
      return users;
    } catch (error) {
      console.log(error);
      return error;
    }
  }),
  getByToken: t.procedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decoded = decode(input.token as string) as JWT;
        const user = await prisma.user.findUnique({
          where: {
            email: decoded.email,
          },
        });

        if (!user) throw new Error('User not found');

        return user;
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),

  updateAuthSteps: t.procedure
    .input(
      z.object({
        token: z.string(),
        authSteps: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decoded = decode(input.token as string) as JWT;
        const user = await prisma.user.update({
          where: {
            email: decoded.email,
          },
          data: {
            authSteps: input.authSteps,
          },
        });
      } catch (error) {}
    }),

  addGym: t.procedure
    .input(
      z.object({
        token: z.string(),
        authSteps: z.number(),
        gym: z.object({
          name: z.string(),
          longitude: z.number(),
          latitude: z.number(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const decoded = decode(input.token as string) as JWT;

      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!user) throw new Error('User not found');

      const gym = await prisma.gym.findFirst({
        where: {
          name: input.gym.name,
        },
      });

      if (!gym) {
        const newGym = await prisma.gym.create({
          data: {
            name: input.gym.name,

            location: {
              create: {
                radius: 5,
                lat: input.gym.longitude,
                long: input.gym.latitude,
              },
            },
          },
        });

        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            gym: {
              connect: {
                id: newGym.id,
              },
            },
            authSteps: input.authSteps,
          },
        });

        return newGym;
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          authSteps: input.authSteps,

          gym: {
            connect: {
              id: gym.id,
            },
          },
        },
      });

      return updatedUser;
    }),

  createSplit: t.procedure
    .input(
      z.object({
        token: z.string(),
        split: z.array(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      if (!input.split) {
        console.log('No split provided');
        throw new Error('No split provided');
      }
      const decoded = decode(input.token as string) as JWT;

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: decoded.email,
          },
        });

        if (!user) {
          console.log('User not found');
          throw new Error('User not found');
        }

        const split = await prisma.split.create({
          data: {
            users: {
              connect: {
                id: user.id,
              },
            },
            monday: {
              create: {
                excercises: input.split[0].excercises,
              },
            },
            tuesday: {
              create: {
                excercises: input.split[1].excercises,
              },
            },
            wednesday: {
              create: {
                excercises: input.split[2].excercises,
              },
            },
            thursday: {
              create: {
                excercises: input.split[3].excercises,
              },
            },
            friday: {
              create: {
                excercises: input.split[4].excercises,
              },
            },
            saturday: {
              create: {
                excercises: input.split[5].excercises,
              },
            },
            sunday: {
              create: {
                excercises: input.split[6].excercises,
              },
            },
          },
        });

        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            authSteps: 6,
          },
        });

        return split;
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),

  update: t.procedure
    .input(
      z.object({
        token: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        tags: z.array(z.string()).optional(),
        authSteps: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(input);
      const decoded = decode(input.token as string) as JWT;

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: decoded.email,
          },
        });

        if (!user) {
          console.log('User not found');
          throw new Error('User not found');
        }

        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            firstName: input.firstName || user.firstName,
            lastName: input.lastName || user.lastName,
            email: input.email || user.email,
            tags: {
              set: input.tags || user.tags,
            },
            authSteps:
              input.authSteps !== undefined ? input.authSteps : user.authSteps,
          },
        });

        return updatedUser;
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),

  getNearByUsers: t.procedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const decoded = decode(input.token as string) as JWT;

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: decoded.email,
          },
          include: {
            chats: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            feed: true,
          },
        });

        if (!user) {
          console.log('User not found');
          throw new Error('User not found');
        }
        const users = await findNearUsers(user);

        // remove users that are already in the user's chat list
        let usersToAdd = users.filter(
          (u) => !user.chats.some((c) => c.user?.id === u.id)
        );

        const userGenderFilers = user.filterGender as string[];
        const userGoalFilters = user.filterGoals as string[];
        const userSkillLevelFilters = user.filterSkillLevel as string[];
        const userWorkoutFilters = user.filterWorkout as string[];
        const userGoingTodayFilters = user.filterGoingToday as boolean;

        if (
          userGenderFilers.length > 0 ||
          userGoalFilters.length > 0 ||
          userSkillLevelFilters.length > 0 ||
          userWorkoutFilters.length > 0 ||
          userGoingTodayFilters === true ||
          userGoingTodayFilters === false
        ) {
          usersToAdd = filterFeedHelper(usersToAdd, user);
        }
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            feed: {
              connect: usersToAdd.map((user) => ({
                id: user.id,
              })),
            },
          },
          include: {
            feed: true,
            split: true,
          },
        });

        return usersToAdd;
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),

  filterFeed: t.procedure
    .input(
      z.object({
        token: z.string(),
        // filters: Filter[]
        filters: z.array(
          z.object({
            filter: z.string(),
            value: z.array(z.string()).or(z.boolean()),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const decoded = decode(input.token as string) as JWT;
      console.log('htting', input.filters);

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: decoded.email,
          },
          include: {
            feed: true,
          },
        });

        if (!user) {
          console.log('User not found');
          throw new Error('User not found');
        }

        const findFilterValue = (filterName: FilterType) => {
          return input.filters.find((filter) => filter.filter === filterName)
            ?.value as string[] | boolean;
        };

        // apply filters to user
        const userWithFilters = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            // @ts-expect-error - it is a boolean in an array
            filterGoingToday: findFilterValue(
              FilterType.GOING_TODAY
            )?.[0] as boolean,
            filterWorkout: findFilterValue(FilterType.WORKOUT_TYPE) as string[],
            filterSkillLevel: findFilterValue(
              FilterType.SKILL_LEVEL
            ) as string[],
            filterGender: findFilterValue(FilterType.GENDER) as string[],
            filterGoals: findFilterValue(FilterType.GOALS) as string[],
          },
        });

        const filteredFeed = filterFeedHelper(user.feed, userWithFilters);

        console.log(filteredFeed.map((user) => user.firstName));

        return {
          feed: filteredFeed.filter((user) => user.id !== userWithFilters.id),
        };
      } catch (error) {
        console.log(error);
        throw new Error('error');
      }
    }),
});
