import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { COLORS } from '../../utils/colors';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { save } from '../../utils/secureStore';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/button';
import api from '../../utils/axiosStore';

import { useMutation, useQueryClient } from 'react-query';
import { setItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';

let OTPSchema = z.object({
  otp: z.string().min(6).max(6),
});
export default function OTPScreen({ navigation, route }) {
  const [number, setNumber] = useState<string>('');
  const [incorrectCode, setIncorrectCode] = useState<Boolean>(false);
  const { setIsVerified, setToken, phoneNumber } = useAuth();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: '',
    },
  });

  const sendSMS = useMutation(
    async () => {
      try {
        return await api.post(
          '/trpc/authentication.sendSMS',
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
        }
      },
    }
  );

  const verifyCode = useMutation(
    async (data: z.infer<typeof OTPSchema>) => {
      try {
        return await api.post(
          '/authentication.verifyOTP',
          {
            phoneNumber: phoneNumber,
            verificationCode: data.otp,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.log(error);
        setIncorrectCode(true);
      }
    },
    {
      onSuccess: (data) => {
        console.log(data);
        if (data) {
          if (data.data.token) {
            setItemAsync('token', data.data.token);
            setToken(data.data.token);
            setIsVerified(true);
            // queryClient.invalidateQueries('user');
          } else {
            navigation.navigate('InitialUserDetails', {
              phoneNumber: phoneNumber,
            });
          }
        }
      },
      onError: (error) => {
        console.log(error);
        // @ts-expect-error -- not sure what the error is
        const { response } = error;
        if (response) {
          if (response.status === 400) {
            setIncorrectCode(true);
          }
        }
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    try {
      return await verifyCode.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  const resendCode = async () => {
    // clear the OTP value
    // remove the error message
    // mutation to sendSMS
    setValue('otp', '');
    setIncorrectCode(false);
    try {
      await sendSMS.mutateAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className='w-full px-6 flex-col'>
      <View className='pt-12'>
        <Text className='font-[MontserratBold] text-xl text-white'>
          Verification Code
        </Text>
        <Text className='font-MontserratRegular text-secondaryWhite'>
          We have sent a verification code to {phoneNumber}. Please enter the
          code below.
        </Text>
      </View>
      <View className='h-1/3 w-full'>
        <Controller
          control={control}
          name='otp'
          render={({ field: { onChange, onBlur, value } }) => (
            <OTPInputView
              style={{ width: '100%' }}
              pinCount={6}
              code={value}
              onCodeChanged={onChange}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.borderStyleHighLighted}
              onCodeFilled={(c) => {
                onSubmit({ otp: c });
              }}
            />
          )}
        />
        <Text className='font-MontserratRegular text-secondaryWhite'>
          Code can be entered automaically from messages above your keyboard.
        </Text>

        {incorrectCode && (
          <>
            <Text className='font-MontserratRegular text-red-500'>
              Incorrect Code
            </Text>

            <Button variant='primary' onPress={() => resendCode()}>
              Try again. Resend Code.
            </Button>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  borderStyleHighLighted: {
    borderColor: COLORS.secondaryWhite,
    borderWidth: 2,
    borderRadius: 10,
  },

  underlineStyleBase: {
    borderRadius: 10,
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: COLORS.tertiaryDark,
  },
});
