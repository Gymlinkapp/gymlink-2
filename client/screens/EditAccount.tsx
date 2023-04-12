import { useState } from 'react';
import { useAuth } from '../utils/context';
import { useMutation } from 'react-query';
import api from '../utils/axiosStore';
import { SafeAreaView, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { Text } from 'react-native';
import Button from '../components/button';

export default function EditAccount({ navigation }: any) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [bio, setBio] = useState(user.bio);

  const editAccount = useMutation(
    async () => {
      try {
        return await api.put(`/dashboardEditUser/${user.id}`, {
          firstName,
          lastName,
          bio,
        });
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (data) => {
        console.log(data);
        navigation.navigate('Account');
      },
    }
  );

  return (
    <SafeAreaView>
      <View className='p-4 flex h-full'>
        <View className='pt-4 pb-6'>
          <TouchableOpacity
            className='flex-row items-center bg-secondaryDark w-24 mb-4 justify-center rounded-full py-2'
            onPress={() => navigation.goBack()}
          >
            <CaretLeft color='#fff' weight='regular' />
            <Text className='text-white'>Back</Text>
          </TouchableOpacity>
          <Text className='text-2xl font-MontserratBold text-primaryWhite'>
            Edit yur account
          </Text>
          <Text className='text-base font-MontserratRegular text-secondaryWhite'>
            Change your account details here and save them.
          </Text>
        </View>
        <View className='flex w-full'>
          <View className='flex flex-row  my-1'>
            <View className='flex mr-1 flex-1'>
              <Text className='text-white text-xs'>First Name</Text>
              <TextInput
                className='text-white bg-secondaryDark p-4 rounded-md'
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View className='flex mr-1 flex-1'>
              <Text className='text-white text-xs'>Last Name</Text>
              <TextInput
                className='text-white bg-secondaryDark p-4 rounded-md'
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
          <TextInput
            className='text-white bg-secondaryDark p-4 my-1 rounded-md'
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <Button
          variant='primary'
          className='mt-4'
          onPress={() => {
            editAccount.mutate();
          }}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
}
