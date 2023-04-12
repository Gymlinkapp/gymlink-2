import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useToken from '../hooks/useToken';
import { useUser } from '../hooks/useUser';
import Loading from '../components/Loading';
import { useFriends } from '../hooks/useFriends';
import EmptyScreen from '../components/EmptyScreen';
import { User, UserCircle } from 'phosphor-react-native';
import { truncate } from '../utils/ui';

export default function FriendsScreen({ navigation }) {
  const { height } = Dimensions.get('window');
  const token = useToken();
  const { data: friends, isLoading, error } = useFriends(token);
  if (isLoading) return <Loading />;
  if (friends.length === 0)
    return (
      <EmptyScreen
        icon={<UserCircle weight='fill' color='rgb(204,201,201)' size={48} />}
        text="You don't have any friends right now!"
      />
    );
  return (
    <ScrollView
      className='px-6 flex-1'
      scrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ height: height, paddingBottom: 500 }}
    >
      {friends?.map((friend) => (
        <View
          className='mr-2 my-1 bg-secondaryDark px-2 py-2 rounded-full'
          key={friend.id}
        >
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-4'>
              <Image
                source={{ uri: friend?.images[0] }}
                className='w-[50px] h-[50px] rounded-full'
              />
              <View>
                <Text className='text-white text-md font-MontserratMedium'>
                  {friend.firstName} {friend.lastName}
                </Text>
                <Text className='text-secondaryWhite text-sm leading-4'>
                  {friend.bio?.length > 30
                    ? truncate(friend.bio, 30)
                    : friend.bio}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className='bg-accent h-[50px] w-[50px] justify-center items-center rounded-full'
              onPress={() => {
                navigation.navigate('Profile', {
                  user: friend,
                  isFriend: true,
                });
              }}
            >
              <User color='#fff' />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
