import { getItemAsync } from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PanResponder,
} from 'react-native';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import { COLORS } from '../utils/colors';
import { useAuth } from '../utils/context';
import {
  Barbell,
  CaretLeft,
  MapPin,
  PaperPlaneRight,
  X,
} from 'phosphor-react-native';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';
import Split from '../components/Split';
import { WeekSplit } from '../utils/split';
import Button from '../components/button';
import { useGym } from '../hooks/useGym';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { keyboardVerticalOffset } from '../utils/ui';
import * as Haptics from 'expo-haptics';
import { User } from '../utils/users';

export function ProfileHeader({
  user,
  currentImageIndex,
  navigation,
}: {
  user: User;
  currentImageIndex: number;
  navigation;
}) {
  return (
    <View className='absolute ml-6 py-2 flex-row mt-10 w-[56%] items-center justify-between z-50'>
      <BlurView
        className='flex-row items-center justify-center rounded-full py-2 w-12 h-12 overflow-hidden bg-primaryDark/20'
        intensity={20}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <CaretLeft color='#fff' weight='regular' />
        </TouchableOpacity>
      </BlurView>
      <BlurView
        className='flex-row justify-self-center items-center rounded-full overflow-hidden px-6 h-8 bg-primaryDark/20'
        intensity={20}
      >
        {/* indicator of images */}
        {user.images.length > 1 &&
          user.images.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-secondaryWhite'
              }`}
            ></View>
          ))}
      </BlurView>
    </View>
  );
}

// This is a user's profile screen displayed when 'Show More' is pressed.
export default function ProfileScreen({
  navigation,
  route,
}: {
  navigation?: any;
  route?: any;
}) {
  const { user, isFriend } = route.params;
  const { user: currUser, socket, token } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userSplit, setUserSplit] = useState<WeekSplit[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [gestureState, setGestureState] = useState({ dx: 0, dy: 0 });
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: gym, isLoading: gymLoading } = useGym(user.gymId);

  const createLink = useMutation(
    async ({
      fromUserId,
      toUserId,
    }: {
      toUserId: string;
      fromUserId: string;
    }) => {
      const { data } = await api.post(`/social/link`, {
        toUserId,
        fromUserId,
        token,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        console.log('chat', data.chat);
        navigation.navigate('Chat', {
          socket: socket,
          user: currUser,
          roomName: data.chat.name,
          toUser: data.chat.participants.toUser,
          userImage: data.chat.participants.toUser.images[0],
          uiName: data.chat.name,
          roomId: data.chat.id,
          message,
        });
        queryClient.invalidateQueries('user');
      },
    }
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        setGestureState(gesture);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -50) {
          navigation.navigate('ProfileInfo', {
            user,
            gymId: user.gymId,
          });
        }
        setGestureState({ dx: 0, dy: 0 });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    })
  ).current;

  useEffect(() => {
    if (user.split) {
      const userSplit = Object.keys(user.split).map((day) => {
        // dont include 'id' as a day in the key
        if (day === 'id') return;
        return {
          day,
          exercises: user.split[day],
        };
      }) as WeekSplit[];
      setUserSplit(userSplit);
    }
  }, [user]);
  return (
    <View className='relative w-full h-full' {...panResponder.panHandlers}>
      <ProfileHeader
        user={user}
        currentImageIndex={currentImageIndex}
        navigation={navigation}
      />
      <View
        className={`absolute top-28 left-0 w-full -translate-y-1/2 my-auto z-50 flex-row transform ${
          isTyping ? 'h-[15%]' : 'h-[75%]'
        }`}
      >
        <View className='z-40 w-full h-full'>
          <TouchableOpacity
            className='flex-1 z-40'
            onPress={() => {
              setCurrentImageIndex((prev) => {
                if (prev === user.images.length - 1) {
                  return 0;
                }
                return prev + 1;
              });

              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          ></TouchableOpacity>
          <TouchableOpacity
            className='flex-1 z-40'
            onPress={() => {
              setCurrentImageIndex((prev) => {
                if (prev === 0) {
                  return user.images.length - 1;
                }
                return prev - 1;
              });

              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          ></TouchableOpacity>
        </View>
      </View>
      <View className='absolute top-0 left-0 w-full h-full pointer-events-none'>
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
          className='absolute bottom-0 left-0 z-50 w-full h-full'
          locations={isTyping ? [0.1, 1] : [0, 0.5]}
          start={[0, 1]}
          end={[1, 0]}
        />
        <Image
          source={{ uri: user.images[currentImageIndex] }}
          className='w-full h-full object-cover'
        />
      </View>

      {/* user info: */}
      <View className='px-6 justify-between z-40 absolute bottom-0 w-full pointer-events-none h-full'>
        <KeyboardAvoidingView
          className='flex-1'
          behavior='padding'
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <SafeAreaView className='flex-1 h-full'>
            <KeyboardAvoidingView
              behavior='height'
              className='flex-1 justify-end'
            >
              <View>
                <Text className='text-white font-MontserratRegular text-2xl mb-6'>
                  {user.age}
                </Text>
                <View>
                  <Text className='text-white font-MontserratBold text-5xl'>
                    {user.firstName}
                  </Text>
                  <Text className='text-white font-MontserratBold text-5xl'>
                    {user.lastName}
                  </Text>
                </View>
                <View className='flex-row items-center mb-6'>
                  <MapPin color='#CCC9C9' weight='regular' size={16} />
                  <Text className='text-secondaryWhite font-MontserratRegular text-md'>
                    {gym?.name}
                  </Text>
                </View>
              </View>
              <View className='flex-row items-center'>
                <View className='flex-1 overflow-hidden rounded-full mr-6'>
                  <BlurView intensity={15} className='bg-primaryWhite/10'>
                    <TextInput
                      value={message}
                      onChangeText={(text) => setMessage(text)}
                      className='p-2 px-4 rounded-full text-white z-50'
                      placeholder='Shoot a message and link up'
                      onFocus={() => setIsTyping(true)}
                    />
                  </BlurView>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    createLink.mutate({
                      toUserId: user.id,
                      fromUserId: currUser.id,
                    });
                    // create haptic feedback
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                  }}
                >
                  <PaperPlaneRight
                    color='#CCC9C9'
                    weight='regular'
                    size={18}
                    style={{
                      flex: 0.25,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
