import {
  ClockClockwise,
  Eye,
  Gear,
  SignOut,
  User,
} from 'phosphor-react-native';
import { SafeAreaView, Text, View } from 'react-native';
import { useMutation } from 'react-query';
import Button from '../components/button';
import { COLORS } from '../utils/colors';
import api from '../utils/axiosStore';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import useSignout from '../hooks/useSignout';
import { useAuth } from '../utils/context';

export default function SettingsScreen({ navigation }) {
  const { setIsVerified, token, user } = useAuth();
  const signout = useSignout(token);

  return (
    <SafeAreaView className='w-full h-full items-center flex-col-reverse'>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');

          api.delete(`/users/${token}`);

          navigation.popToTop();
          setIsVerified(false);
        }}
        variant='danger'
        icon={<User weight='fill' color='rgb(239, 68, 68)' />}
      >
        Delete
      </Button>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');

          signout.mutate();
          navigation.popToTop();
          setIsVerified(false);
        }}
        variant='menu'
        icon={<SignOut weight='fill' color={COLORS.mainWhite} />}
      >
        Signout
      </Button>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');
          signout.mutate();

          navigation.popToTop();
          setIsVerified(false);
        }}
        variant='menu'
        icon={<ClockClockwise weight='fill' color={COLORS.mainWhite} />}
      >
        Reset
      </Button>
      <Button
        onPress={() => {
          navigation.navigate('EditAccount');
        }}
        variant='menu'
        icon={<Gear weight='fill' color={COLORS.mainWhite} />}
      >
        Edit
      </Button>
      <Button
        onPress={() => {
          navigation.popToTop();

          navigation.navigate('Profile', {
            user: user,
          });
        }}
        variant='menu'
        icon={<Eye weight='fill' color={COLORS.mainWhite} />}
      >
        Preview
      </Button>
    </SafeAreaView>
  );
}
