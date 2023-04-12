import { BlurView } from 'expo-blur';
import { CaretLeft } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function BackButton({ navigation }: any) {
  return (
    <BlurView
      className='flex-row items-center justify-center rounded-full py-2 w-12 h-12 mt-10 overflow-hidden'
      intensity={20}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}
      >
        <CaretLeft color='#fff' weight='regular' />
      </TouchableOpacity>
    </BlurView>
  );
}
