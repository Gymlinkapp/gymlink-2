import { useForm, Controller } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-native-phone-number-input';
import { COLORS } from '../../utils/colors';
import Button from '../../components/button';
import api from '../../utils/axiosStore';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useAuth } from '../../utils/context';

let phoneNumberSchema = z.object({
  phoneNumber: z.string().min(10).max(10),
  callingCode: z.string().min(1).max(3),
});

export default function RegisterScreen({ navigation }) {
  const { setPhoneNumber, phoneNumber } = useAuth();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: '',
      callingCode: '1',
    },
  });
  const sendSMS = useMutation(
    async (phoneNumber: string) => {
      setPhoneNumber(phoneNumber);

      console.log(phoneNumber);
      try {
        return await api.post(
          '/authentication.sendOTP',
          {
            phoneNumber: phoneNumber,
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
      onSuccess: (data) => {
        if (data) {
          navigation.navigate('OTPScreen', {
            code: data.data.code,
            phoneNumber: phoneNumber,
          });
        }
      },
    }
  );
  const onSubmit = async (data: z.infer<typeof phoneNumberSchema>) => {
    return await sendSMS.mutateAsync(data.callingCode + data.phoneNumber);
    // mutation.mutate({
    //   phoneNumber: data.callingCode + data.phoneNumber,
    // });
  };

  return (
    <View className='px-4'>
      <SafeAreaView>
        <KeyboardAvoidingView className='justify-center h-3/4 '>
          <Controller
            control={control}
            name='phoneNumber'
            rules={{ maxLength: 10 }}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <View>
                <Text className='text-white font-[MontserratBold] text-l pb-4'>
                  Sign up with your phone number
                </Text>
                <PhoneInput
                  onChangeCountry={(country) => {
                    setValue('callingCode', country.callingCode[0]);
                  }}
                  value={value}
                  onChangeText={(val) => {
                    setValue('phoneNumber', val);
                  }}
                  defaultCode='US'
                  withDarkTheme
                  placeholder='902 291 011'
                  codeTextStyle={{ color: COLORS.mainWhite }}
                  disableArrowIcon
                  containerStyle={{
                    borderRadius: 999,
                    width: '100%',
                    backgroundColor: COLORS.secondaryDark,
                  }}
                  textInputStyle={{
                    color: COLORS.mainWhite,
                    fontFamily: 'MontserratRegular',
                  }}
                  textContainerStyle={{
                    backgroundColor: COLORS.secondaryDark,
                    borderRadius: 999,
                  }}
                />
                {errors.phoneNumber && (
                  <Text className='text-red-500 text-sm'>
                    {errors.phoneNumber.message}
                  </Text>
                )}
              </View>
            )}
          />
          <Button variant='primary' onPress={handleSubmit(onSubmit)}>
            Send code
          </Button>
          <Button
            variant='secondary'
            onPress={() => {
              navigation.navigate('EmailLoginScreen');
            }}
          >
            Signin with Email
          </Button>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
