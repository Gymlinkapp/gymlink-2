import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import api from '../../utils/axiosStore';

import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  View,
  Button as RNBUtton,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Button from '../../components/button';
import { Camera, X } from 'phosphor-react-native';
import { COLORS } from '../../utils/colors';
import { useMutation } from '@tanstack/react-query';
import useToken from '../../hooks/useToken';
import { useAuth } from '../../utils/context';
import AuthLayout from '../../layouts/AuthLayout';
import { trpc } from '../../utils/trpc';

const getPermissionAsync = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return console.log('Permission to access location was denied');
    }
  }
};

export default function UserImageUpload({ navigation, route }) {
  const [images, setImages] = useState<string[] | []>([]);
  const { token } = useAuth();

  const continueToNextScreen = async () => {
    await api.post('/users/authSteps', { token, authSteps: 4 });
  };

  const addImage = async () => {
    try {
      // handle permission async
      try {
        await getPermissionAsync();
      } catch (error) {
        console.log(error);
      }
      const pickerRes = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (pickerRes.canceled) return;

      let result = pickerRes as ImageManipulator.ImageResult;

      const base64 = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 300 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.PNG, base64: true }
      );

      setImages([...images, base64.uri]);
      try {
        await api.post('/trpc/images.upload', {
          image: base64.base64,
          token: token,
        });
        // await trpc.images.upload
        //   .useMutation({
        //     onSuccess: (data) => {
        //       console.log(data);
        //     },
        //     onError: (error) => {
        //       console.log(error);
        //     },
        //   })
        //   .mutateAsync({
        //     image: base64.base64,
        //     // token: token
        //   });
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(
        'An error occurred uploading your image. Please try again later.',
        err
      );
    }
  };

  return (
    <AuthLayout
      title='Your Pictures'
      description='Pick your favorite physique, portrait or selfie.'
    >
      <View className='flex-row flex-wrap w-full flex-1'>
        {/* if there is only one */}
        {images && images.length === 1 && (
          <View className='w-[45%] h-32 rounded-2xl m-2 overflow-hidden relative'>
            <TouchableOpacity className='absolute top-0 left-0 p-1 z-20'>
              <X color={COLORS.mainWhite} size={32} />
            </TouchableOpacity>
            <Image
              source={{ uri: images[0] }}
              className='w-full h-full object-cover z-10'
            />
          </View>
        )}
        {images &&
          images.length > 1 &&
          images.map((img, i) => (
            <View
              className='w-[45%] h-32 rounded-2xl m-2 overflow-hidden relative'
              key={i}
            >
              <TouchableOpacity
                className='absolute top-0 left-0 p-1 z-20'
                onPress={() => {
                  const newImage = images.filter((img, index) => index !== i);
                  setImages(newImage);
                }}
              >
                <X color={COLORS.mainWhite} size={32} />
              </TouchableOpacity>
              <Image
                source={{ uri: img }}
                className='w-full h-full object-cover'
              />
            </View>
          ))}
        {images && images.length < 4 && (
          <TouchableOpacity
            onPress={addImage}
            className='bg-secondaryDark border-dotted border-2 border-tertiaryDark m-2 w-[45%] h-32 rounded-2xl justify-center items-center relative'
          >
            <Camera color={COLORS.secondaryWhite} size={48} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {images && images.length > 0 && (
          <Button
            variant='primary'
            onPress={async () => await continueToNextScreen()}
          >
            Continue
          </Button>
        )}
      </View>
    </AuthLayout>
  );
}
