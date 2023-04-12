import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';
import { Gym } from '../utils/types/gym';

const fetchGym = async (gymId: string) => {
  const { data } = await api.get(`/gyms/${gymId}`);
  return data;
};

const useGym = (gymId: string) => {
  return useQuery<Gym, Error>(['gym', gymId], () => fetchGym(gymId));
};

export { fetchGym, useGym };
