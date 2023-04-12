import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchFriends = async (token: string) => {
  const { data } = await api.get(`/social/getFriends/${token}`);
  return data;
};

const useFriends = (token: string) => {
  return useQuery<User[], Error>(['friends', token], () => fetchFriends(token));
};

export { fetchFriends, useFriends };
