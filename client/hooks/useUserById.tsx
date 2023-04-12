import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchUserById = async (userId: string) => {
  const { data } = await api.get(`/users/findById/${userId}`);
  return data;
};

const useUserById = (userId: string) => {
  return useQuery<User, Error>(['user', userId], () => fetchUserById(userId));
};

export { fetchUserById, useUserById };
