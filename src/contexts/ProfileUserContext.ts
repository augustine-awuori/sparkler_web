import { createContext } from "react";
import { DefaultGenerics, UserAPIResponse } from "getstream";

type DefaultUT = DefaultGenerics & {
  id: string;
  name: string;
  avatar: string;
};

export interface FeedUser extends UserAPIResponse<DefaultUT> {}

export interface Value {
  profileUser: FeedUser | undefined;
  setProfileUser: (user: FeedUser) => void;
}

export const ProfileUserContext = createContext<Value>({
  profileUser: undefined,
  setProfileUser: () => {},
});

ProfileUserContext.displayName = "Profile User Context";

export default ProfileUserContext;
