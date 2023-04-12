export type FriendRequest = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fromUserId: string;
  toUserId: string;
  userId: string | null;
};
