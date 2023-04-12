import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { useEffect, useState } from 'react';
import { getItemAsync } from 'expo-secure-store';
import axios from 'axios';
import { useAuth } from '../../utils/context';
import { useMutation } from 'react-query';
import { useLocation } from '../../hooks/useLocation';
import AuthLayout from '../../layouts/AuthLayout';

const userGymLocationSchema = z.object({
  // experience: z.string().min(1).max(20),
  enteredGymLocation: z.string().min(1).max(100),
  gymLocation: z.object({
    name: z.string().min(1).max(100),
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export default function UserGymLocation({ navigation }) {
  const location = useLocation();
  const [nearGyms, setNearGyms] = useState([]);
  const { token, long, lat, setLat, setLong } = useAuth();

  useEffect(() => {
    if (location) {
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
    }
  }, [location]);

  const {
    handleSubmit,
    control,
    getValues,
    setValue,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(userGymLocationSchema),
    defaultValues: {
      enteredGymLocation: '',
      gymLocation: null,
    },
  });
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const bottomOfScreen = Dimensions.get('window').height - 100;

  const autoCompleteGymLocations = async (input: string) => {
    // const apiKey = process.env.GOOGLE_API_KEY;
    const apiKey = 'AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA&';
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&location=${lat}%2C${long}&radius=500&key=${apiKey}`;
    if (input === '') {
      setNearGyms([]);
      return;
    }
    try {
      const res = await axios.get(URL);
      setNearGyms(res.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  const saveUserGymLocation = useMutation(
    async (data: z.infer<typeof userGymLocationSchema>) => {
      try {
        return await api.post(
          `/users.addGym`,
          {
            authSteps: 5,
            gym: data.gymLocation,
            tempJWT: token,
            token: token,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: async (data) => {
        if (data && (data.data.step === 5 || data.data.gymId)) {
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof userGymLocationSchema>) => {
    await saveUserGymLocation.mutateAsync(data);
  };

  return (
    <AuthLayout
      title='What is your home gym?'
      description='Put in your home gym to find gym buddies.'
    >
      <FlatList
        className='bg-primaryDark'
        data={[1]}
        renderItem={() => (
          <Controller
            control={control}
            name='enteredGymLocation'
            render={({
              field: { onChange, onBlur, value },
              fieldState: { isTouched, error },
            }) => (
              <View className='my-2 w-full h-full flex-1'>
                <View className='flex-1 w-full'>
                  <Text className='text-white py-2 text-l font-MontserratMedium'>
                    What gym you at?
                  </Text>
                  <TextInput
                    className={`bg-secondaryDark rounded-md p-4 flex-1 text-white font-[MontserratMedium] ${
                      (value.length > 1 || isTouched) &&
                      'rounded-b-none border-2 border-b-0 border-tertiaryDark'
                    } ${
                      nearGyms.length < 1 &&
                      'border-b-2 border-tertiaryDark rounded-md'
                    }`}
                    cursorColor={COLORS.mainWhite}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      onChange(value);
                      autoCompleteGymLocations(value);
                    }}
                  />
                </View>
                {nearGyms.length > 0 && (
                  <View className='bg-secondaryDark rounded-b-md border-2 border-tertiaryDark'>
                    <FlatList
                      data={nearGyms}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          className='px-2 py-6'
                          onPress={() => {
                            setValue('gymLocation', {
                              name: item.description,
                              longitude: long,
                              latitude: lat,
                            });
                            setValue(
                              'enteredGymLocation',
                              getValues('gymLocation').name
                            );
                            setNearGyms([]);
                          }}
                        >
                          <Text className='text-white font-MontserratMedium'>
                            {item.description}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}

                {error && (
                  <Text className='text-red-500 font-MontserratRegular'>
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />
        )}
      />

      {Object.keys(errors).length === 0 && (
        <View className='flex-1 justify-end'>
          <Button variant='primary' onPress={handleSubmit(onSubmit)}>
            Continue
          </Button>
        </View>
      )}
    </AuthLayout>
  );
}
