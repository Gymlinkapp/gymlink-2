import { View, Text, SafeAreaView, KeyboardAvoidingView } from 'react-native';

export default function AuthLayout({
  children,
  title,
  description,
  isImages,
}: {
  children: any;
  title: string;
  description: string;
  isImages?: boolean;
}) {
  return (
    <SafeAreaView className='flex-1'>
      <View className='py-12 px-6'>
        <Text className='text-2xl font-MontserratBold text-primaryWhite'>
          {title}
        </Text>
        <Text className='text-base font-MontserratRegular text-secondaryWhite'>
          {description}
        </Text>
      </View>
      <KeyboardAvoidingView behavior='padding' className='flex-1 px-6'>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
