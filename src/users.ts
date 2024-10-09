export type User = {
  _id: string;
  chatToken: string;
  email: string;
  feedToken: string;
  followers: { [userId: string]: string };
  following: { [userId: string]: string };
  name: string;
  profileImage: string;
  username: string;
  verified?: boolean;
};
