import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout({ children, navigation }) {
  return <View>{children}</View>;
}
