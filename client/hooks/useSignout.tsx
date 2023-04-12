import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';

export default function useSignout(token: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      try {
        return await api.post(
          '/auth/signout',
          {
            token: token,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: async () => {
        try {
          queryClient.invalidateQueries('user');
        } catch (error) {
          console.log(error);
        }
      },
    }
  );
}
