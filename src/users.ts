export type User = {
  _id: string;
  bio?: string;
  chatToken: string;
  email: string;
  feedToken: string;
  followers: { [userId: string]: string };
  following: { [userId: string]: string };
  name: string;
  profileImage: string;
  username: string;
  verified?: boolean;
  invalid?: boolean;
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  customLink?: string;
};
