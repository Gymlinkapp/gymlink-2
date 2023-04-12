export type FilterValue = {
  filter?: string;
  name: string;
  value: string | boolean;
};

export type Filter = {
  filter: string;
  name?: string;
  values: FilterValue[];
};

export enum FilterType {
  GOING_TODAY = 'goingToday',
  WORKOUT_TYPE = 'workoutType',
  SKILL_LEVEL = 'skillLevel',
  GENDER = 'gender',
  GOALS = 'goals',
}

export const defaultFilters: Filter[] = [
  {
    filter: FilterType.GOING_TODAY,
    name: 'Going Today',
    values: [],
  },
  {
    filter: FilterType.WORKOUT_TYPE,
    name: 'Workout Type',
    values: [],
  },
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'Workout Skill Level',
    values: [],
  },
  {
    filter: FilterType.GENDER,
    name: 'Gender',
    values: [],
  },
  {
    filter: FilterType.GOALS,
    name: 'Goals',
    values: [],
  },
];

export const goingTodayValues = [
  {
    filter: FilterType.GOING_TODAY,
    name: 'Yes',
    value: true,
  },
  {
    filter: FilterType.GOING_TODAY,
    name: 'No',
    value: false,
  },
];

export const workoutTypeValues = [
  {
    filter: FilterType.WORKOUT_TYPE,
    name: 'Cardio',
    value: 'cardio',
  },
  {
    filter: FilterType.WORKOUT_TYPE,
    name: 'Bench',
    value: 'bench',
  },
  {
    filter: FilterType.WORKOUT_TYPE,
    name: 'Squat',
    value: 'squat',
  },
];

export const skillLevelValues = [
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'Low',
    value: 'low',
  },
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'Medium',
    value: 'medium',
  },
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'High',
    value: 'high',
  },
];

export const genderValues = [
  {
    filter: FilterType.GENDER,
    name: 'Male',
    value: 'male',
  },
  {
    filter: FilterType.GENDER,
    name: 'Female',
    value: 'female',
  },
];
export const goalValues = [
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'Weight Loss',
    value: 'weightLoss',
  },
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'Muscle Gain',
    value: 'muscleGain',
  },
  {
    filter: FilterType.SKILL_LEVEL,
    name: 'Toning',
    value: 'toning',
  },
];
