import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../utils/axiosStore';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import { useMutation, useQueryClient } from 'react-query';
import { setItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';
const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export default function EmailLoginScreen({ navigation }) {
  const { setIsVerified } = useAuth();
  const queryClient = useQueryClient();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const signIn = useMutation(
    async (data: any) => {
      try {
        return await api.post('/auth/signin', data);
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          setItemAsync('token', data.data.token);
          setIsVerified(true);
          queryClient.invalidateQueries('user');
        }
      },
    }
  );
  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
    try {
      signIn.mutate(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView className='w-full h-full flex-1 relative '>
      <View className='py-6'>
        <Text className='text-2xl font-MontserratBold text-primaryWhite'>
          Login with Email
        </Text>
        <Text className='text-base font-MontserratRegular text-secondaryWhite'>
          Enter your email and password to login
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior='position'
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <FlatList
          className='bg-primaryDark'
          data={[1]}
          renderItem={() => (
            <>
              <Controller
                control={control}
                name='email'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
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
                      onChangeText={onChange}
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
                name='password'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Password
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
                      cursorColor={COLORS.mainWhite}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                    {error && (
                      <Text className='text-red-500 font-MontserratRegular'>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </>
          )}
        />

        <Button variant='primary' onPress={handleSubmit(onSubmit)}>
          Login
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
