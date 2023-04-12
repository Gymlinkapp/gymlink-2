import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useAuth } from '../utils/context';

/* 

 (async () => {
      // getting perimission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(true);
        return;
      }

      // getting location
      let location = await Location.getCurrentPositionAsync({});

      // setting location to state
      setLocation(location);
    })();

    if (error) {
      console.log('error: ', error);
      return null;
    } else if (location) {
      // saving the longitude and latitude to secure store
      SecureStore.setItemAsync('long', location.coords.longitude.toString());
      SecureStore.setItemAsync('lat', location.coords.latitude.toString());
    }
    console.log('location: ', location);
*/

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject>(null);
  const [error, setError] = useState<boolean>(false);
  const { setLat, setLong } = useAuth();

  useEffect(() => {
    (async () => {
      // getting perimission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(true);
        return;
      }

      // getting location
      let location = await Location.getCurrentPositionAsync({});

      // setting location to state
      setLocation(location);
    })();

    if (error) {
      console.log('error: ', error);
      return null;
    } else if (location) {
      // saving the longitude and latitude to secure store
      setItemAsync('long', location.coords.longitude.toString());
      setItemAsync('lat', location.coords.latitude.toString());
      setLong(location.coords.longitude);
      setLat(location.coords.latitude);
    }
    console.log('location: ', location);
  }, []);

  return location;
};
