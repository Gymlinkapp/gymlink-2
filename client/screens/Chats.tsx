import { ChatsTeardrop, Check, X } from 'phosphor-react-native';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../utils/users';
import EmptyScreen from '../components/EmptyScreen';
import { useAuth } from '../utils/context';
import { Image } from 'react-native';
import { useState } from 'react';
import { truncate } from '../utils/ui';
import {
  RectButton,
  Swipeable,
  TouchableOpacity as RNGHOpacity,
} from 'react-native-gesture-handler';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';
import * as Haptics from 'expo-haptics';

export type Message = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  chatId?: string;
  senderId?: string;
  sender?: User;
  content: string;
};

export interface Chat {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  messages: Message[];
}

export default function Chats({ navigation, route }: any) {
  const { socket } = route.params;
  const queryClient = useQueryClient();
  const [chatId, setChatId] = useState<string | null>(null);

  const { user, token } = useAuth();

  const createLink = useMutation(
    async ({ chatId }: { chatId: string }) => {
      const { data } = await api.delete(`/chats/${chatId}`);
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('user');
      },
    }
  );

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 75, 100],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <RectButton>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
              height: '100%',
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <RNGHOpacity
            className='bg-primarydark p-4 rounded-full'
            onPress={() => {
              createLink.mutate({
                chatId: chatId,
              });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <X color='#fff' weight='fill' />
          </RNGHOpacity>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <View className='flex-1'>
      {user && user.chats && user.chats.length ? (
        <View>
          <FlatList
            className='p-4'
            data={user.chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // chats don't have messages by default, so we need to check if they exist
              let recentMessage: Message | undefined;
              if (item.messages && item.messages.length) {
                recentMessage = item.messages[item.messages.length - 1];
              }
              const otherUser = item.participants.find(
                (u: User) => u.id !== user.id
              ) as User;
              return (
                <Swipeable
                  renderRightActions={renderRightActions}
                  onSwipeableOpen={() => {
                    setChatId(item.id);
                  }}
                >
                  <TouchableOpacity
                    className='flex-row items-center my-2 bg-secondaryDark p-4 rounded-md'
                    onPress={() => {
                      navigation.navigate('Chat', {
                        socket: socket,
                        user: user,
                        roomName: item.name,
                        toUser: otherUser,
                        userImage: otherUser.images[0],
                        uiName: `${otherUser.firstName} ${otherUser.lastName}`,
                        roomId: item.id,
                      });
                    }}
                  >
                    <Image
                      source={{ uri: otherUser.images[0] }}
                      className='w-[50px] h-[50px] rounded-full mr-4'
                    />
                    <View className='flex-col'>
                      <Text className='text-white text-xl'>
                        {otherUser.firstName} {otherUser.lastName}
                      </Text>
                      {recentMessage && (
                        <View className='flex-col items-left'>
                          <Text className='text-secondaryWhite text-xs mr-2'>
                            {new Date(
                              recentMessage.createdAt
                            ).toLocaleDateString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                          <Text className='text-white text-md'>
                            {recentMessage.content.length > 15
                              ? truncate(recentMessage.content, 30)
                              : recentMessage.content}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              );
            }}
          />
        </View>
      ) : (
        <EmptyScreen
          icon={
            <ChatsTeardrop weight='fill' color='rgb(204,201,201)' size={48} />
          }
          text='You have no chats yet'
        />
      )}
    </View>
  );
}
