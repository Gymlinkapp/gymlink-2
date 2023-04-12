import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //   SplashScreen.preventAutoHideAsync()

        // Load fonts
        // TODO: Test whether using recommended approach useFonts is better https://docs.expo.dev/versions/latest/sdk/font/
        await Font.loadAsync({
          AveriaSerifLibreBold: require('../assets/fonts/AveriaSerifLibre-Bold.ttf'),
          AveriaSerifLibreRegular: require('../assets/fonts/AveriaSerifLibre-Regular.ttf'),
          MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
          MontserratMedium: require('../assets/fonts/Montserrat-SemiBold.ttf'),
          MontserratRegular: require('../assets/fonts/Montserrat-Medium.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.log(e);
      } finally {
        setLoadingComplete(true);
        //   SplashScreen.hideAsync()
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
