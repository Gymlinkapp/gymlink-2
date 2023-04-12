import { Text, View } from 'react-native';

interface EmptyScreenProps {
  text: string;
  icon: React.ReactNode;
}

export default function EmptyScreen({ text, icon }: EmptyScreenProps) {
  return (
    <View className='items-center p-10'>
      <Text className='text-secondaryWhite text-center text-2xl'>{text}</Text>
      {icon}
    </View>
  );
}
