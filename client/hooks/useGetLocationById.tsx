import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';
import { Gym } from '../utils/types/gym';
import { Location } from '../utils/types/location';

const fetchLocation = async (locationId: string) => {
  const { data } = await api.get(`/locations/${locationId}`);
  return data;
};

const useGetLocationById = (locationId: string) => {
  return useQuery<Location, Error>(['location', locationId], () =>
    fetchLocation(locationId)
  );
};

export { fetchLocation, useGetLocationById };
