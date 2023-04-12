import axios from 'axios';
import { useQuery } from 'react-query';
import { Chat } from '../screens/Chats';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchChat = async (id: string) => {
  const { data } = await api.get(`/chats/getById/${id}`);
  return data;
};

const useChat = (id: string) => {
  return useQuery<Chat, Error>(['chat', id], () => fetchChat(id));
};

export { fetchChat, useChat };
