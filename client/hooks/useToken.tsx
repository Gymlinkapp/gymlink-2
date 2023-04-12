import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';

export default function useToken() {
  const [token, setToken] = useState('');

  useEffect(() => {
    getItemAsync('token').then((t) => setToken(t));
  }, [token]);

  return token;
}
