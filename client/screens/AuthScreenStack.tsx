import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import RegisterScreen from './auth/Register';
import OTPScreen from './auth/OTP';
import InitialUserDetails from './auth/Details';
import UserImageUpload from './auth/UserImageUpload';
import UserGymLocation from './auth/UserGymLocation';
import UserFavoriteMovements from './auth/UserFavoriteMovements';
import EmailLoginScreen from './auth/EmailLoginScreen';
import { useAuth } from '../utils/context';
import CreateSplit from './auth/CreateGymSplit';
import AssignExcercise from './auth/AssignExcercise';
import { AUTH_STEPS } from '../utils/users';

// create a proper type for above object so I can access it by `stepToScreen.Register` instead of `stepToScreen[0]`
type StepToScreen = {
  [key: number]: string;
};

export const stepToScreen: StepToScreen = {
  0: 'Register',
  1: 'OTPScreen',
  2: 'InitialUserDetails',
  3: 'UserImageUpload',
  4: 'UserGymLocation',
  5: 'UserGymSplit',
  6: 'UserFavoriteMovements',
  7: 'EmailLoginScreen',
};

const AuthStack = createNativeStackNavigator();

export default function AuthStackScreen({ navigation, route }) {
  const { setIsVerified } = route.params;
  const [step, setStep] = useState('Register');
  const { token } = useAuth();
  const { data: user, isLoading } = useUser(token);

  useEffect(() => {
    if (!isLoading && user && user.authSteps !== AUTH_STEPS) {
      console.log('step', step);
      setStep(stepToScreen[user.authSteps]);
      navigation.navigate(step);
    }
  }, [token, user, isLoading, step]);
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name={stepToScreen[0]}
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[1]}
        component={OTPScreen}
        initialParams={{ setIsVerified }}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[2]}
        component={InitialUserDetails}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[3]}
        component={UserImageUpload}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[4]}
        component={UserGymLocation}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[5]}
        component={CreateSplit}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[6]}
        component={UserFavoriteMovements}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name='EmailLoginScreen'
        component={EmailLoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Group
        screenOptions={{
          headerBlurEffect: 'dark',
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <AuthStack.Screen
          name='AssignExcercise'
          component={AssignExcercise}
          initialParams={{ setIsVerified }}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
}
