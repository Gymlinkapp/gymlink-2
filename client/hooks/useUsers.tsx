import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchUsers = async (token: string) => {
  const { data } = await api.get(`/users/getNearByUsers?token=${token}`);
  return data;
};

const useUsers = (token: string) => {
  return useQuery<User[], Error>(['users', token], () => fetchUsers(token));
};

export { fetchUsers, useUsers };
