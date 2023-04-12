import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { snapToInterval } from './snapToInterval';

export const getFeedScrollIndex = (
  e: NativeSyntheticEvent<NativeScrollEvent>,
  height: number
) => Math.round(e.nativeEvent.contentOffset.y / snapToInterval(height));
