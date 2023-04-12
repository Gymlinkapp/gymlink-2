export type User = {
  chats: any;
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
  bio: string | null;
  gender: string;
  race: string;
  images: string[];
  tags: string[];
  longitude: number | null;
  latitude: number | null;
  tempJWT: string | null;
  verificationCode: string | null;
  verified: boolean | null;
  gymId: string;
  createdAt: Date;
  updatedAt: Date;
  chatId: string | null;
  authSteps: number;
  splitId: string | null;
  split: Split | null;
  feed: User[];
  seen: string[];
  filterGoingToday: boolean;
  filterWorkout: string[];
  filterSkillLevel: string[];
  filterGender: string[];
  filterGoals: string[];
};

export type Split = {
  id: string;
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  User: User;
};

export const AUTH_STEPS = 7;
