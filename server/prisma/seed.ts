import { Sex, faker } from '@faker-js/faker';
import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

function randomGender(): Sex {
  const genders = ['male', 'female'];
  return genders[Math.floor(Math.random() * genders.length)] as Sex;
}

const generateEmail = (firstName: string, lastName: string) => {
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}@gmail.com`;
};

function getRandomProfilePicture() {
  const randomId = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 1000
  return `https://source.unsplash.com/random/1200x1200?sig=${randomId}&portrait`;
}

function generateRandomUserData(): Prisma.UserCreateInput {
  // random gender
  const gender = randomGender();
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName();

  return {
    email: generateEmail(firstName, lastName),
    firstName,
    lastName,
    password: 'password',
    bio: faker.lorem.sentence(),
    gender,
    age: Number(faker.random.numeric(2)),
    tags: {
      create: [
        { name: 'Shoulder Press' },
        { name: 'Gobblin Squats' },
        { name: 'Dips' },
      ],
    },
    authSteps: 7,
    phoneNumber: faker.phone.phoneNumber(),
    verified: true,
    isBot: true,
    images: [
      getRandomProfilePicture(),
      getRandomProfilePicture(),
      getRandomProfilePicture(),
    ],
    split: {
      create: {
        monday: ['chest', 'back'],
        tuesday: ['legs'],
        wednesday: ['chest', 'back'],
        thursday: ['legs'],
        friday: ['chest', 'back'],
        saturday: ['legs'],
        sunday: ['chest', 'back'],
      },
    },
    filterGender: {
      create: [],
    },
    filterGoals: {
      create: [],
    },
    filterSkillLevel: {
      create: [],
    },
    filterWorkout: {
      create: [],
    },
    filterGoingToday: false,
    gym: {
      create: {
        name: 'Fit4Less',
        location: {
          create: {
            lat: 42.300916870848894,
            long: -82.97919754434378,
          },
        },
      },
    },
  };
}

async function createUser(prisma: any, userData: Prisma.UserCreateInput) {
  return await prisma.user.upsert({
    where: { email: userData.email },
    update: {},
    create: userData,
  });
}

async function main() {
  const numberOfUsers = 10; // Change this value to create more or fewer users

  for (let i = 0; i < numberOfUsers; i++) {
    const randomUserData = generateRandomUserData();
    const newUser = await createUser(prisma, randomUserData);
    console.log(`Created user: ${newUser.firstName} ${newUser.lastName}`);
  }

  const barbraJanson = await prisma.user.upsert({
    where: { email: 'barbrajanson@gmail.com' },
    update: {},
    create: {
      email: 'barbrajanson@gmail.com',
      firstName: 'Barbra',
      lastName: 'Janson',
      password: 'password',
      bio: faker.lorem.sentence(),
      age: 21,
      filterGender: { create: [] },
      filterGoals: { create: [] },
      filterSkillLevel: { create: [] },
      filterWorkout: { create: [] },
      filterGoingToday: false,
      images: [
        getRandomProfilePicture(),
        getRandomProfilePicture(),
        getRandomProfilePicture(),
      ],
      gym: {
        create: {
          name: 'Fit4Less',
          location: {
            create: {
              lat: 42.300916870848894,
              long: -82.97919754434378,
            },
          },
        },
      },

      tags: {
        create: [
          { name: 'Shoulder Press' },
          { name: 'Gobblin Squats' },
          { name: 'Dips' },
        ],
      },
      split: {
        create: {
          monday: ['chest', 'back'],
          tuesday: ['legs'],
          wednesday: ['chest', 'back'],
          thursday: ['legs'],
          friday: ['chest', 'back'],
          saturday: ['legs'],
          sunday: ['chest', 'back'],
        },
      },
      authSteps: 7,
      phoneNumber: faker.phone.phoneNumber(),
      verified: true,
      isBot: true,
    },
  });
}

main()
  .then(() => {
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();

    process.exit(1);
  });
