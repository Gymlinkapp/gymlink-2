import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { save, getValueFor } from '../../utils/secureStore';
import { useEffect, useState } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';
import AuthLayout from '../../layouts/AuthLayout';
import { CustomSelect } from '../../components/CustomSelect';

export const UserGenderBox = ({
  gender,
  isSelected,
  setSelected,
}: {
  gender: string;
  isSelected: boolean;
  setSelected: (gender: string) => void;
}) => {
  return (
    <TouchableOpacity
      className={`h-12 flex-1 mr-1 rounded-md ${
        isSelected ? 'bg-white' : 'bg-secondaryDark'
      } justify-center items-center`}
      onPress={() => setSelected(gender)}
    >
      <Text
        className={`${
          isSelected ? 'text-primaryDark' : 'text-white'
        } font-MontserratRegular text-xs`}
      >
        {gender}
      </Text>
    </TouchableOpacity>
  );
};

const races = [
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black or African American' },
  { value: 'hispanic', label: 'Hispanic or Latino' },
  { value: 'native', label: 'Native American or Alaska Native' },
  { value: 'pacific', label: 'Native Hawaiian or Pacific Islander' },
  { value: 'white', label: 'White' },
  { value: 'multiracial', label: 'Multiracial' },
  { value: 'other', label: 'Other' },
];

const userDetailsSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  bio: z.string().min(1).max(1000),
  email: z.string().email(),
  age: z.number().min(16).max(100),
});

export default function InitialUserDetails({ route, navigation }) {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [gender, setGender] = useState('');
  const [genderError, setGenderError] = useState(false);
  const [race, setRace] = useState('');
  const [raceError, setRaceError] = useState(false);
  const { token, setToken } = useAuth();
  const queryClient = useQueryClient();
  useEffect(() => {
    getItemAsync('long').then((long) => {
      setLongitude(parseFloat(long));
    });
    getItemAsync('lat').then((lat) => {
      setLatitude(parseFloat(lat));
    });
  }, [latitude, longitude]);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      gender: '',
      race: '',
      age: 18,
    },
  });
  const { code, phoneNumber } = route.params;
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

  const saveUserDetails = useMutation(
    async (data: z.infer<typeof userDetailsSchema>) => {
      try {
        return await api.post(
          '/auth/details',
          {
            phoneNumber: phoneNumber,
            firstName: data.firstName,
            bio: data.bio,
            lastName: data.lastName,
            age: data.age,
            email: data.email,
            gender: gender.toLowerCase(),
            race,
            longitude: longitude,
            latitude: latitude,
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
        if (data) {
          try {
            await setItemAsync('token', data.data.token);
            queryClient.invalidateQueries('user');
            setToken(data.data.token);
          } catch (error) {
            console.log('here', error);
          }
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof userDetailsSchema>) => {
    try {
      Number(data.age);
      return saveUserDetails.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout
      title='Setup your Account'
      description='Enter your details to continue'
    >
      <FlatList
        className='bg-primaryDark flex-1'
        data={[1]}
        renderItem={() => (
          <>
            <Controller
              control={control}
              name='firstName'
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error, isTouched },
              }) => (
                <View className='my-2'>
                  <Text className='text-white py-2 text-l font-MontserratMedium'>
                    First Name
                  </Text>
                  <TextInput
                    className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                      isTouched && 'border-2 border-tertiaryDark'
                    }`}
                    cursorColor={COLORS.mainWhite}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                  />
                  {error && (
                    <Text className='text-red-500 font-MontserratRegular'>
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name='lastName'
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error, isTouched },
              }) => (
                <View className='my-2'>
                  <Text className='text-white py-2 text-l font-MontserratMedium'>
                    Last Name
                  </Text>
                  <TextInput
                    className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                      isTouched && 'border-2 border-tertiaryDark'
                    }`}
                    cursorColor={COLORS.mainWhite}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                  />
                  {error && (
                    <Text className='text-red-500 font-MontserratRegular'>
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name='bio'
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error, isTouched },
              }) => (
                <View className='my-2'>
                  <Text className='text-white py-2 text-l font-MontserratMedium'>
                    Bio
                  </Text>
                  <TextInput
                    className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                      isTouched && 'border-2 border-tertiaryDark'
                    }`}
                    cursorColor={COLORS.mainWhite}
                    value={value}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={10}
                    onChangeText={onChange}
                    returnKeyType='done'
                    returnKeyLabel='done'
                    enablesReturnKeyAutomatically
                  />
                  {error && (
                    <Text className='text-red-500 font-MontserratRegular'>
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View className='my-2 mr-1 flex-[1.5]'>
              <Text className='text-white py-2 text-l font-MontserratMedium'>
                Gender
              </Text>
              <View className='flex-row'>
                <UserGenderBox
                  gender='Male'
                  isSelected={gender === 'Male'}
                  setSelected={setGender}
                />
                <UserGenderBox
                  gender='Female'
                  isSelected={gender === 'Female'}
                  setSelected={setGender}
                />
                <UserGenderBox
                  gender='Other'
                  isSelected={gender === 'Other'}
                  setSelected={setGender}
                />
              </View>

              {genderError && (
                <Text className='text-red-500 font-MontserratRegular'>
                  Must be selected
                </Text>
              )}
            </View>

            <View className='my-2 ml-1 flex-1'>
              <Text className='text-white py-2 text-l font-MontserratMedium'>
                Race
              </Text>
              <CustomSelect
                options={races}
                onSelect={(option) => {
                  setRace(option.value);
                }}
              />
              {raceError && (
                <Text className='text-red-500 font-MontserratRegular'>
                  Must be selected
                </Text>
              )}
            </View>
            <View className='flex-row'>
              <Controller
                control={control}
                name='email'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { isTouched, error },
                }) => (
                  <View className='my-2 flex-1 mr-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Email
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
                      cursorColor={COLORS.mainWhite}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                    />
                    {error && (
                      <Text className='text-red-500 font-MontserratRegular'>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name='age'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { isTouched, error },
                }) => (
                  <View className='my-2 w-1/4'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Age
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
                      cursorColor={COLORS.mainWhite}
                      value={value.toString() || ''}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(parseInt(value) || 0)}
                      keyboardType='numeric'
                    />
                    {error && (
                      <Text className='text-red-500 font-MontserratRegular'>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </>
        )}
      />
      <Button variant='primary' onPress={handleSubmit(onSubmit)}>
        Continue
      </Button>
    </AuthLayout>
  );
}
