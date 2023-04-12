export const checkIfEmptyDays = (split: WeekSplit[]) => {
  const emptyDays = split.filter((day) => day.exercises.length === 0);
  return emptyDays.length === 0;
};
export const exercises = [
  'Chest',
  'Back',
  'Shoulders',
  'Abs',
  'Rest',
  'Cardio',
  'Triceps',
  'Biceps',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Rear Dealts',
];
export const preSelectedSplits = [
  'Push Pull Legs',
  'Bro Split',
  'Upper Lower',
  'Full Body',
];

export type WeekSplit = {
  day: string;
  exercises: string[];
};

export const BroSplit = [
  {
    day: 'Monday',
    exercises: ['Chest'],
  },
  {
    day: 'Tuesday',
    exercises: ['Back'],
  },
  {
    day: 'Wednesday',
    exercises: ['Arms'],
  },
  {
    day: 'Thursday',
    exercises: ['Rest'],
  },
  {
    day: 'Friday',
    exercises: ['Legs'],
  },
  {
    day: 'Saturday',
    exercises: ['Shoulders'],
  },
  {
    day: 'Sunday',
    exercises: ['Abs'],
  },
];

export const PushPullLegsSplit = [
  {
    day: 'Monday',
    exercises: ['Chest', 'Shoulders', 'Triceps'],
  },
  {
    day: 'Tuesday',
    exercises: ['Back', 'Biceps', 'Rear Dealts'],
  },
  {
    day: 'Wednesday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
  {
    day: 'Thursday',
    exercises: ['Rest'],
  },
  {
    day: 'Friday',
    exercises: ['Chest', 'Shoulders', 'Triceps'],
  },
  {
    day: 'Saturday',
    exercises: ['Back', 'Biceps', 'Rear Dealts'],
  },
  {
    day: 'Sunday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
];

export const UpperLowerSplit = [
  {
    day: 'Monday',
    exercises: ['Chest', 'Shoulders', 'Triceps'],
  },
  {
    day: 'Tuesday',
    exercises: ['Back', 'Biceps', 'Rear Dealts'],
  },
  {
    day: 'Wednesday',
    exercises: ['Rest'],
  },
  {
    day: 'Thursday',
    exercises: ['Chest', 'Shoulders', 'Triceps'],
  },
  {
    day: 'Friday',
    exercises: ['Back', 'Biceps', 'Rear Dealts'],
  },
  {
    day: 'Saturday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
  {
    day: 'Sunday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
];

export const FullBodySplit = [
  {
    day: 'Monday',
    exercises: [
      'Chest',
      'Shoulders',
      'Triceps',
      'Back',
      'Biceps',
      'Rear Dealts',
    ],
  },
  {
    day: 'Tuesday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
  {
    day: 'Wednesday',
    exercises: [
      'Chest',
      'Shoulders',
      'Triceps',
      'Back',
      'Biceps',
      'Rear Dealts',
    ],
  },
  {
    day: 'Thursday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
  {
    day: 'Friday',
    exercises: [
      'Chest',
      'Shoulders',
      'Triceps',
      'Back',
      'Biceps',
      'Rear Dealts',
    ],
  },
  {
    day: 'Saturday',
    exercises: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
  },
  {
    day: 'Sunday',
    exercises: [
      'Chest',
      'Shoulders',
      'Triceps',
      'Back',
      'Biceps',
      'Rear Dealts',
    ],
  },
];
