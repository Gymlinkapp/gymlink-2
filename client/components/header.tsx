import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Bell, Gear } from 'phosphor-react-native';
import { COLORS } from '../utils/colors';

export default function Header({ route, navigation }) {
  return (
    <SafeAreaView className='bg-primaryDark'>
      <View className='pb-7 w-full flex-row justify-between flex px-8'>
        <Text className='text-white text-center font-[MontserratBold] text-xl'>
          Gymlink
        </Text>
        <View className='flex-row justify-evenly'>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell weight='fill' color={COLORS.mainWhite} />
          </TouchableOpacity>
          {route.name === 'Account' && (
            <TouchableOpacity
              className='ml-6'
              onPress={() => navigation.navigate('Settings')}
            >
              <Gear weight='fill' color='white' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
