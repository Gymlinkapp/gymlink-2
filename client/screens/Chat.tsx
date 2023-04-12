import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/button';
import { useChat } from '../hooks/useChat';
import { keyboardVerticalOffset } from '../utils/ui';
import { User } from '../utils/users';
import { Message } from './Chats';
import { useQueryClient } from 'react-query';
import Loading from '../components/Loading';
import { TouchableOpacity } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';

interface MessageData extends Message {
  roomName: string;
  roomId: string;
  content: string;
}

function ChatItem({ message, user }: { message: Message; user: User }) {
  const [isAuthor, setIsAuthor] = useState(false);
  useEffect(() => {
    setIsAuthor(message.sender?.id === user.id);
  }, []);
  const amIAuthor = (message: Message) =>
    message.sender?.id === user.id ? 'flex-row-reverse' : 'flex-row';
  return (
    <View className={`${amIAuthor(message)} my-2`}>
      <View className='bg-secondaryDark p-4 min-w-[125px] max-w-[310px] rounded-3xl'>
        <View>
          {isAuthor ? (
            <Text className='text-sm text-secondaryWhite'>Me</Text>
          ) : (
            <Text className='text-sm text-secondaryWhite'>
              {message.sender?.firstName} {message.sender?.lastName}
            </Text>
          )}
        </View>
        <Text className='text-sm text-primaryWhite font-MontserratBold'>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen({ route, navigation }) {
  const { socket, user, roomId, roomName, uiName, userImage, toUser, message } =
    route.params;
  const [isTyping, setIsTyping] = useState<Boolean>(false);
  const [messageData, setMessageData] = useState<MessageData>({
    roomName: roomName,
    roomId: roomId,
    sender: user,
    content: '',
  });
  const [messages, setMessages] = useState<MessageData[] | Message[]>(
    message
      ? [
          {
            roomName: roomName,
            roomId: roomId,
            sender: user,
            content: message,
          },
        ]
      : []
  );
  const flatListRef = useRef(null);
  const sendMessage = async () => {
    await socket.emit('chat-message', messageData);
    setMessages((messages) => [...messages, messageData]);
    setMessageData({ ...messageData, content: '' });
  };

  useEffect(() => {
    if (message) {
      socket.emit('join-chat', {
        roomName,
        roomId,
        message: {
          roomName,
          roomId,
          sender: user,
          content: message,
        },
      });
    } else {
      socket.emit('join-chat', {
        roomName,
        roomId,
      });
    }
    socket.on('messages', (data: Message[]) => {
      setMessages(data);
    });

    socket.on('recieve-message', (data: MessageData) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.on('typing', (data) => {
      setIsTyping(data);
    });

    // socket cleanup
    return () => {
      socket.off('connection');
      socket.off('disconnect');
      socket.off('recieve-message');
    };
  }, [socket, roomName, roomId]);

  const typingIndicator = async (isTyping: boolean) => {
    await socket.emit('typing', { roomName, isTyping });
  };

  return (
    <>
      <View className='py-16 px-4'>
        <TouchableOpacity
          className='flex-row items-center bg-secondaryDark justify-center rounded-full w-32 py-2'
          onPress={() => navigation.goBack()}
        >
          <CaretLeft color='#fff' weight='regular' />
          <Text className='text-white'>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', { user: toUser, isFriend: true })
          }
          className='flex-row items-center mt-4'
        >
          <Image
            source={{ uri: userImage }}
            className='w-10 h-10 mr-2 rounded-full'
          />
          <Text className='text-2xl text-primaryWhite font-MontserratBold'>
            {uiName}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        className='flex-1'
        behavior='padding'
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <SafeAreaView className='flex-1 bg-primaryDark px-4'>
          <KeyboardAvoidingView behavior='height' className='flex-1'>
            {messages?.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                data={messages}
                onContentSizeChange={() =>
                  flatListRef.current.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  flatListRef.current.scrollToEnd({ animated: true })
                }
                renderItem={({ item }) => (
                  <ChatItem message={item} user={user} key={item.id} />
                )}
                keyExtractor={(item) => item.id}
              />
            )}
            {isTyping && (
              <View className='flex-row my-2 p-4 bg-secondaryDark w-1/6 justify-center rounded-full'>
                <Text className='text-secondaryWhite leading-3 tracking-[2.5em] font-MontserratBold'>
                  ...
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
          {socket && (
            <View className='flex-row items-center bg-primaryDark'>
              <View className='flex-1 mr-2'>
                <TextInput
                  value={messageData.content}
                  onChangeText={(text) =>
                    setMessageData({ ...messageData, content: text })
                  }
                  onFocus={() => {
                    navigation.setOptions({ tabBarVisible: false });

                    typingIndicator(true);
                  }}
                  onBlur={() => {
                    navigation.setOptions({ tabBarVisible: true });

                    typingIndicator(false);
                  }}
                  className='bg-secondaryDark text-white p-4 rounded-md'
                />
              </View>
              {messageData.content.length > 0 && (
                <Button variant='primary' textSize='xs' onPress={sendMessage}>
                  Send
                </Button>
              )}
            </View>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}
