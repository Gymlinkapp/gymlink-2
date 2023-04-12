import axios from 'axios';
import { useQuery } from 'react-query';
import { Chat } from '../screens/Chats';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchChats = async (id: string) => {
  const { data } = await api.get(`/chats/${id}`);
  return data;
};

const useChats = (id: string) => {
  return useQuery<Chat[], Error>(['chats', id], () => fetchChats(id));
};

export { fetchChats, useChats };
