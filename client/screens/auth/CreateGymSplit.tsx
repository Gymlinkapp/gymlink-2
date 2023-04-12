import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import { useEffect, useState } from 'react';
import {
  exercises,
  preSelectedSplits,
  PushPullLegsSplit,
  BroSplit,
  WeekSplit,
  checkIfEmptyDays,
} from '../../utils/split';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@tanstack/react-query';
import api from '../../utils/axiosStore';
import Button from '../../components/button';
import { useAuth } from '../../utils/context';

export default function CreateSplit({ navigation, route }) {
  const { token } = useAuth();
  const { width, height } = Dimensions.get('window');
  const [selectedSplit, setSelectedSplit] = useState<string>(
    preSelectedSplits[0]
  );
  const [error, setError] = useState<string>('');

  const [weekSplit, setWeekSplit] = useState<WeekSplit[]>(PushPullLegsSplit);

  useEffect(() => {
    if (route.params?.assignExercise) {
      const { assignExercise } = route.params;
      const newWeekSplit = weekSplit.map((day) => {
        const { day: d } = day;

        // if the day is selected from the previous screen, add the exercise to the array.
        if (
          assignExercise.days.includes(d.toLowerCase()) &&
          !day.exercises.includes(assignExercise.exercise)
        ) {
          return {
            ...day,
            exercises: [...day.exercises, assignExercise.exercise],
          };
        }
        return day;
      });

      setWeekSplit([...newWeekSplit]);
    }
  }, [route.params?.assignExercise]);

  const saveSplit = useMutation(
    async (data: WeekSplit[]) => {
      try {
        if (!checkIfEmptyDays(data)) {
          setError(
            'Please fill out all days of the week. Mark empty days as rest days as needed.'
          );
          return;
        }
        return await api.post('/users/split', {
          split: data,
          token,
          authSteps: route.params?.authStep ? route.params?.authStep : 6,
        });
      } catch (error) {
        console.log(error);
      }
    },
    {
      onError: (error) => {
        console.log(error);
      },
    }
  );
  const isCustom = selectedSplit === 'Custom';
  const setCustomSplit = () => {
    // clear all exercises from the week split
    setWeekSplit(
      weekSplit.map((day) => ({
        ...day,
        exercises: [],
      }))
    );
    setSelectedSplit('Custom');
  };

  return (
    <AuthLayout
      title='What is your current split.'
      description="Fill out what you're hitting this week."
    >
      <View>
        <Text className='text-secondaryWhite mb-2 font-MontserratRegular'>
          Already know you're split? Select it!
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {preSelectedSplits.map((split, idx) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedSplit(split);
                if (split === 'Push Pull Legs') {
                  setWeekSplit(PushPullLegsSplit);
                }
                if (split === 'Bro Split') {
                  setWeekSplit(BroSplit);
                }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className={`mr-1 ${
                selectedSplit === split ? 'bg-primaryWhite' : 'bg-secondaryDark'
              } px-4 py-2 rounded-full`}
              key={idx}
            >
              <Text
                className={`${
                  selectedSplit === split ? 'text-primaryDark' : 'text-white'
                } font-MontserratMedium`}
              >
                {split}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          className={`mt-1 ${
            selectedSplit === 'Custom' ? 'bg-primaryWhite' : 'bg-secondaryDark'
          } px-4 py-2 rounded-full`}
          onPress={setCustomSplit}
        >
          <Text
            className={`${
              selectedSplit === 'Custom' ? 'text-primaryDark' : 'text-white'
            } font-MontserratMedium text-center`}
          >
            Custom
          </Text>
        </TouchableOpacity>
      </View>
      {error.length > 0 && (
        <Text className='text-red-500 font-MontserratMedium'>{error}</Text>
      )}

      {/* if custom is selected, show excercises to assign to days */}
      {isCustom && (
        <View>
          <Text className='text-secondaryWhite my-2 font-MontserratRegular'>
            Choose your exercises. Tap and select the days you want to hit them.
            Tap and hold to remove.
          </Text>
          <View className='flex-row flex-wrap'>
            {exercises.map((exercise, idx) => (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const days = weekSplit.filter((day) =>
                    day.exercises.includes(exercise)
                  );
                  navigation.navigate('AssignExcercise', {
                    exercise: exercise,
                    days: days.map((day) => day.day.toLowerCase()),
                  });
                }}
                key={idx}
                className='px-4 py-2 rounded-full bg-secondaryDark m-1'
              >
                <Text className='text-white'>{exercise}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <ScrollView
        className='mt-12'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: height / 1.25, paddingBottom: 50 }}
      >
        {weekSplit.map((day, idx) => (
          <View key={idx} className='mb-2 flex-row'>
            <View className='bg-secondaryDark w-16 h-16 rounded-md justify-center items-center'>
              <Text className='text-white font-MontserratBold'>
                {day.day[0]}
              </Text>
            </View>
            <ScrollView
              horizontal
              className='ml-2 bg-secondaryDark rounded-md'
              contentContainerStyle={{
                alignItems: 'center',
                paddingHorizontal: 8,
              }}
            >
              {day?.exercises?.map((exercise, idx) => (
                <TouchableOpacity
                  key={idx}
                  onLongPress={() => {
                    // remove exercise from day
                    const newWeekSplit = weekSplit.map((d) => {
                      const { day: dName } = d;
                      if (dName === day.day) {
                        return {
                          ...d,
                          exercises: d.exercises.filter((e) => e !== exercise),
                        };
                      }
                      return d;
                    });
                    setWeekSplit([...newWeekSplit]);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className='bg-primaryDark rounded-full px-6 py-4'
                >
                  <Text className='text-white font-MontserratRegular'>
                    {exercise}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      <View
        className='absolute bottom-0 left-0 bg-primaryDark flex'
        style={{
          width: width,
        }}
      >
        <Button
          variant='primary'
          className='flex-1 mb-1'
          onPress={() => {
            saveSplit.mutate(weekSplit);
          }}
        >
          Continue
        </Button>
        <Button
          variant='secondary'
          className='flex-1'
          onPress={async () => {
            try {
              await api.post(`/users/authSteps`, {
                token,
                authSteps: 6,
              });
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Skip
        </Button>
      </View>
    </AuthLayout>
  );
}
