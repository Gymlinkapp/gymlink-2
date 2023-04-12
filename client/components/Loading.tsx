import { View } from 'react-native';
import * as Progress from 'react-native-progress';
import { COLORS } from '../utils/colors';

export default function Loading() {
  return (
    <View className='flex-1 h-full w-full justify-center items-center'>
      <Progress.Circle
        size={50}
        indeterminate={true}
        color={COLORS.accent}
        shouldRasterizeIOS
      />
    </View>
  );
}
