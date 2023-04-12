import { zodResolver } from '@hookform/resolvers/zod';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { getItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';

type Movement = {
  label: string;
  value: string;
  selected: boolean;
};

const UserFavoriteMovementSchema = z.object({
  favoriteMovments: z.string().array().min(1).max(20),
});

export default function UserFavoriteMovements({ route, navigation }) {
  const { token, setIsVerified } = useAuth();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserFavoriteMovementSchema),
    defaultValues: {
      favoriteMovments: [],
    },
  });
  const onSubmit = (data: z.infer<typeof UserFavoriteMovementSchema>) => {
    api.put(`/users`, {
      tags: data.favoriteMovments,
      authSteps: 7,
      tempJWT: token,
      token: token,
    });
    setIsVerified(true);
  };
  const [items, setItems] = useState<Movement[]>([
    { label: 'Bench Press', value: 'bench-press', selected: false },
    { label: 'Squat', value: 'squat', selected: false },
    { label: 'Deadlift', value: 'deadlift', selected: false },
    { label: 'Overhead Press', value: 'overhead-press', selected: false },
    { label: 'Pull Ups', value: 'pull-ups', selected: false },
    { label: 'Dips', value: 'dips', selected: false },
    { label: 'Barbell Row', value: 'barbell-row', selected: false },
    { label: 'Barbell Curl', value: 'barbell-curl', selected: false },
    {
      label: 'Barbell Tricep Extension',
      value: 'barbell-tricep-extension',
      selected: false,
    },
    { label: 'Cardio', value: 'cardio', selected: false },
    { label: 'Leg Press', value: 'leg-press', selected: false },
    { label: 'Leg Extension', value: 'leg-extension', selected: false },
    { label: 'Leg Curl', value: 'leg-curl', selected: false },
    { label: 'Calf Raises', value: 'calf-raises', selected: false },

    {
      label: 'Dumbell Bicep Curls',
      value: 'dumbell-bicep-curls',
      selected: false,
    },
    { label: 'Lateral Raises', value: 'lateral-raises', selected: false },
    {
      label: 'Dumbell Chest Press',
      value: 'dumbell-chest-press',
      selected: false,
    },
  ]);

  console.log(getValues('favoriteMovments'));
  return (
    <SafeAreaView className='w-full h-full flex-1 relative'>
      <View className='py-6 px-6'>
        <Text className='text-2xl font-MontserratBold text-primaryWhite'>
          Favorite Movements
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{
          flex: 1,
          zIndex: 10,
        }}
        numColumns={2}
        data={items}
        renderItem={({ index, item }) => (
          <TouchableOpacity
            className={`rounded-full m-2 px-6 py-2 z-10 ${
              item.selected ? 'bg-primaryWhite' : 'bg-secondaryDark'
            }`}
            onPress={() => {
              const newItems = [...items];
              setItems(newItems);

              // user can toggle the selected state only if the number of selected items is less than 5 if the item is already selected or if the number of selected items is less than 4 if the item is not selected
              if (
                (item.selected && getValues('favoriteMovments').length < 6) ||
                (!item.selected && getValues('favoriteMovments').length < 5)
              ) {
                newItems[index].selected = !newItems[index].selected;
                setValue(
                  'favoriteMovments',
                  newItems
                    .filter((item) => item.selected)
                    .map((item) => item.value)
                );
              }
            }}

            // user can toggle off a selected item and will also remove from values array
          >
            <View>
              <Text
                className={`${
                  item.selected ? 'text-primaryDark' : 'text-primaryWhite'
                } text-center font-MontserratMedium`}
              >
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View
        pointerEvents='none'
        className={`z-20 absolute inset-0 flex-1 h-${
          Dimensions.get('window').height
        } `}
      >
        <Canvas
          pointerEvents='none'
          style={{
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width * 1.5,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            zIndex: 20,
            flex: 1,
            transform: [{ rotate: '-90deg' }],
          }}
        >
          <Rect
            x={0}
            y={0}
            width={Dimensions.get('screen').width}
            height={Dimensions.get('screen').height}
            color={'#efe'}
          >
            <LinearGradient
              start={vec(0, Dimensions.get('screen').height)}
              end={vec(
                Dimensions.get('screen').width,
                Dimensions.get('screen').height
              )}
              colors={[COLORS.primaryDark, 'rgba(0,0,0,0)']}
            />
          </Rect>
        </Canvas>
      </View>
      {/* if there is a movement display a button counting the number of selected */}
      {getValues('favoriteMovments').length > 0 && (
        <View className='z-30'>
          <TouchableOpacity className='bg-tertiaryDark w-1/2 self-center py-2 rounded-full'>
            <Text className='text-white text-center font-MontserratBold'>
              {getValues('favoriteMovments').length}/5 Movements
            </Text>
          </TouchableOpacity>
          <Button onPress={handleSubmit(onSubmit)} variant='primary'>
            Next
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
