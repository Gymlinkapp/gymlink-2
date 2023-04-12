import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import HomeScreen from './screens/Home';
import Header from './components/header';
import { COLORS } from './utils/colors';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from './screens/Notifications';
import SettingsScreen from './screens/Settings';
import RegisterScreen from './screens/auth/Register';
import { useEffect, useState } from 'react';
import { getValueFor } from './utils/secureStore';
import OTPScreen from './screens/auth/OTP';
import { QueryClient, QueryClientProvider } from 'react-query';
import InitialUserDetails from './screens/auth/Details';
import * as SecureStore from 'expo-secure-store';
import FinishUserBaseAccountScreen from './screens/auth/UserImageUpload';
import UserGymLocation from './screens/auth/UserGymLocation';
import UserFavoriteMovements from './screens/auth/UserFavoriteMovements';
import { useLocation } from './hooks/useLocation';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import EmailLoginScreen from './screens/auth/EmailLoginScreen';
import useToken from './hooks/useToken';
import ChatScreen from './screens/Chat';
import FriendsScreen from './screens/Friends';
import { User } from './utils/users';
import api from './utils/axiosStore';
import { useUser } from './hooks/useUser';
import Loading from './components/Loading';
import Routes from './screens/routes';
import { AuthProvider, useAuth } from './utils/context';
import { URL } from './utils/url';

const queryClient = new QueryClient();

// needs to be this for ios not localhost
const socket = io(URL);
console.log(URL);

export default function App() {
  const [fontsLoaded] = useFonts({
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/fonts/Montserrat-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer
          theme={{
            colors: {
              background: COLORS.primaryDark,
              text: COLORS.mainWhite,
              primary: COLORS.mainWhite,
              card: COLORS.primaryDark,
              border: COLORS.primaryDark,
              notification: COLORS.mainWhite,
            },
            dark: true,
          }}
        >
          <Routes socket={socket} />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
